import { AxiosError } from 'axios';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

/**
 * 에러 객체에서 사용자 친화적인 메시지를 추출
 */
export const extractErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    const status = error.response?.status;
    const backendMsg = error.response?.data?.errorMessage;

    if (backendMsg) {
      return backendMsg;
    }

    if (status) {
      switch (status) {
        case 400:
          return '잘못된 요청입니다.';
        case 401:
          return '인증이 필요합니다.';
        case 403:
          return '접근 권한이 없습니다.';
        case 404:
          return '요청한 리소스를 찾을 수 없습니다.';
        case 500:
          return '서버 오류가 발생했습니다.';
        default:
          return `서버 오류 (${status})`;
      }
    }

    if (error.code === 'ECONNABORTED') {
      return '요청 시간이 초과되었습니다.';
    }

    if (error.message.includes('Network Error')) {
      return '네트워크 연결 오류가 발생했습니다.';
    }

    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return '알 수 없는 오류가 발생했습니다.';
};

/**
 * 에러 로깅
 */
export const logError = (
  error: unknown,
  context?: Record<string, unknown>,
): void => {
  const timestamp = new Date().toISOString();
  const info: Record<string, unknown> = {
    timestamp,
    message: error instanceof Error ? error.message : String(error),
    context,
  };

  if (error instanceof AxiosError) {
    Object.assign(info, {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      responseData: error.response?.data,
    });
  }

  if (error instanceof Error) {
    info.stack = error.stack;
  }

  if (process.env.NODE_ENV === 'production') {
    // send to monitoring service
    // sendToErrorMonitoring(info);
  } else {
    console.error('Application Error:', info);
  }
};

/**
 * API 함수용 에러 핸들러 래퍼
 */
export const withErrorHandling = <T, A extends unknown[]>(
  fn: (...args: A) => Promise<T>,
  fallback?: T,
  context?: string,
): ((...args: A) => Promise<T>) => {
  return async (...args: A): Promise<T> => {
    try {
      return await fn(...args);
    } catch (error) {
      logError(error, { function: fn.name || 'anonymous', context, args });
      if (fallback !== undefined) {
        return fallback;
      }
      throw error;
    }
  };
};

/**
 * 전역 에러 핸들러 설정
 */
export function setupGlobalErrorHandlers() {
  let errorCount = 0;
  const MAX_ERROR = 3;
  const RESET_INTERVAL = 5000;

  window.addEventListener('unhandledrejection', (event) => {
    const err = event.reason as Error;
    if (err.name === 'NotFoundError' && err.message.includes('insertBefore')) {
      return;
    }
    errorCount++;
    setTimeout(
      () => (errorCount = Math.max(0, errorCount - 1)),
      RESET_INTERVAL,
    );

    if (errorCount > MAX_ERROR) {
      console.error('Too many errors, pausing global handler');
      return;
    }

    logError(err);
    if (isCriticalError(err) && window.location.pathname !== '/error') {
      window.location.href = '/error';
    }
  });

  window.addEventListener('error', (event) => {
    const err = event.error || new Error(event.message);
    if (err.name === 'NotFoundError' && err.message.includes('insertBefore')) {
      return;
    }
    logError(err, { context: 'GlobalErrorEvent' });
    if (isCriticalError(err) && window.location.pathname !== '/error') {
      saveErrorToStorage(err);
      window.location.href = '/error';
    }
  });
}

/**
 * 심각 시스템 오류 여부 체크
 */
function isCriticalError(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false;
  if (error instanceof AxiosError) return false;
  const err = error as Error;
  const criticalNames = [
    'RangeError',
    'ReferenceError',
    'TypeError',
    'SyntaxError',
    'InternalError',
    'URIError',
    'SecurityError',
    'QuotaExceededError',
    'OutOfMemoryError',
  ];
  if (err.name && criticalNames.includes(err.name)) {
    return true;
  }
  const msg = err.message?.toLowerCase() || '';
  return [
    'memory',
    'quota',
    'script error',
    'timeout',
    'undefined is not a function',
    'null is not an object',
    'maximum call stack size exceeded',
    'fatal',
    'access denied',
  ].some((pat) => msg.includes(pat));
}

/**
 * 에러를 세션에 저장
 */
function saveErrorToStorage(error: unknown) {
  try {
    const err = error as Error;
    const info = {
      message: err.message,
      stack: err.stack,
      timestamp: new Date().toISOString(),
    };
    sessionStorage.setItem('errorInfo', JSON.stringify(info));
  } catch (e) {
    console.warn('Failed to save error to sessionStorage:', e);
  }
}

/**
 * React Error Boundary 컴포넌트
 */
export class AppErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    logError(error, { info, component: 'AppErrorBoundary' });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

/**
 * React Query 등에서 사용할 에러 핸들러 훅
 */
export function useApiErrorHandler() {
  const navigate = useNavigate();
  const handleError = useCallback(
    (error: unknown) => {
      const msg = extractErrorMessage(error);
      if (error instanceof AxiosError && error.response?.status === 401) {
        const path = window.location.pathname;
        if (path !== '/login') {
          localStorage.setItem('redirectUrl', path);
          toast.error(msg);
          navigate('/login');
        }
        return;
      }
      toast.error(msg);
      if (!(error instanceof AxiosError)) {
        logError(error, { context: 'useApiErrorHandler' });
      }
    },
    [navigate],
  );

  return { handleError };
}
