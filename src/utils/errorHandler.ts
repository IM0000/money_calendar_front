import { AxiosError } from 'axios';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

/**
 * 에러 객체에서 사용자 친화적인 메시지를 추출
 */
export const extractErrorMessage = (error: unknown): string => {
  // Axios 에러인 경우
  if (error instanceof AxiosError) {
    // 백엔드에서 반환한 에러 메시지가 있는 경우
    if (error.response?.data?.errorMessage) {
      return error.response.data.errorMessage;
    }

    // HTTP 상태 코드에 따른 메시지
    if (error.response) {
      switch (error.response.status) {
        case 400:
          return '잘못된 요청입니다';
        case 401:
          return '인증이 필요합니다';
        case 403:
          return '접근 권한이 없습니다';
        case 404:
          return '요청한 리소스를 찾을 수 없습니다';
        case 500:
          return '서버 오류가 발생했습니다';
        default:
          return `서버 오류 (${error.response.status})`;
      }
    }

    // 네트워크 오류
    if (error.code === 'ECONNABORTED') {
      return '요청 시간이 초과되었습니다';
    }
    if (error.message.includes('Network Error')) {
      return '네트워크 연결 오류가 발생했습니다';
    }

    return error.message;
  }

  // 일반 Error 객체인 경우
  if (error instanceof Error) {
    return error.message;
  }

  // 그 외의 경우
  return '알 수 없는 오류가 발생했습니다';
};

/**
 * 에러 로깅
 */
export const logError = (
  error: unknown,
  context?: Record<string, unknown>,
): void => {
  const timestamp = new Date().toISOString();
  const errorInfo: Record<string, unknown> = {
    timestamp,
    message: error instanceof Error ? error.message : String(error),
    context,
  };

  // Axios 에러 상세 정보 추가
  if (error instanceof AxiosError) {
    errorInfo.url = error.config?.url;
    errorInfo.method = error.config?.method;
    errorInfo.status = error.response?.status;
    errorInfo.statusText = error.response?.statusText;
    errorInfo.responseData = error.response?.data;
  }

  // Error 객체의 스택 트레이스 추가
  if (error instanceof Error) {
    errorInfo.stack = error.stack;
  }

  // 개발 환경이 아닌 경우, 에러 모니터링 서비스로 전송할 수도 있음
  if (process.env.NODE_ENV === 'production') {
    // 예: Sentry, LogRocket 등의 서비스에 에러 전송
    // sendToErrorMonitoring(errorInfo);
  } else {
    console.error('Application Error:', errorInfo);
  }
};

/**
 * API 함수용 에러 핸들러 래퍼
 */
export const withErrorHandling = <T, A extends unknown[]>(
  fn: (...args: A) => Promise<T>,
  errorFallback?: T,
  context?: string,
): ((...args: A) => Promise<T>) => {
  return async (...args: A): Promise<T> => {
    try {
      return await fn(...args);
    } catch (error) {
      // 에러 로깅
      logError(error, {
        function: fn.name || 'anonymous function',
        context,
        arguments: args.map((arg) =>
          typeof arg === 'object' ? '(object)' : String(arg),
        ),
      });

      // 에러 전파 (fallback이 없는 경우)
      if (errorFallback === undefined) {
        throw error;
      }

      // fallback 반환
      return errorFallback;
    }
  };
};

/**
 * 처리되지 않은 에러를 캡처하여 에러 페이지로 리다이렉트합니다.
 */
export function setupGlobalErrorHandlers() {
  let errorCount = 0;
  const MAX_ERROR_COUNT = 3;
  const ERROR_RESET_INTERVAL = 5000; // 5초

  window.addEventListener('unhandledrejection', (event) => {
    errorCount++;

    // 에러 카운트 리셋 타이머
    setTimeout(
      () => (errorCount = Math.max(0, errorCount - 1)),
      ERROR_RESET_INTERVAL,
    );

    if (errorCount > MAX_ERROR_COUNT) {
      console.error('다수의 에러 발생. 에러 처리 일시 중단');
      return;
    }

    logError(event.reason);

    if (isUncaughtSystemError(event.reason)) {
      // 이미 에러 페이지면 리디렉션 방지
      if (window.location.pathname !== '/error') {
        window.location.href = '/error';
      }
    }
  });

  // 일반 런타임 에러 캐처
  window.addEventListener('error', (event) => {
    // 에러 로깅
    logError(event.error || new Error(event.message), {
      context: 'Uncaught Error',
    });

    // 중요한 시스템 오류의 경우만 리다이렉트
    if (isUncaughtSystemError(event.error)) {
      saveErrorToStorage(event.error || new Error(event.message));
      window.location.href = '/error';
    }
  });
}

/**
 * Error Boundary나 API 핸들러가 처리할 수 없는 시스템 오류인지 확인
 */
function isUncaughtSystemError(error: unknown): boolean {
  // 에러가 없거나 객체가 아닌 경우
  if (!error || typeof error !== 'object') {
    return false;
  }

  const err = error as { name?: string; message?: string };

  // React 에러는 Error Boundary가 처리할 수 있으므로 제외
  if (
    err.name &&
    (err.name.includes('React') || err.name.includes('Invariant'))
  ) {
    return false;
  }

  // API 관련 오류는 API 핸들러가 이미 처리할 수 있으므로 제외
  if (error instanceof AxiosError) {
    return false;
  }

  // 다음과 같은 심각한 시스템 오류만 리다이렉트
  const criticalErrors = [
    'RangeError', // 배열 길이, 숫자 범위 등의 오류
    'ReferenceError', // 유효하지 않은 참조 에러
    'TypeError', // 타입 오류
    'SyntaxError', // 구문 오류
    'InternalError', // 내부 자바스크립트 엔진 오류
    'URIError', // URI 관련 오류
    'SecurityError', // 보안 위반 오류
    'QuotaExceededError', // 스토리지 용량 초과 오류
    'OutOfMemoryError', // 메모리 부족 오류
  ];

  // 알려진 중요 시스템 오류면 전역에서 처리
  if (err.name && criticalErrors.includes(err.name)) {
    return true;
  }

  // 시스템적인 에러 메시지 패턴이면 전역에서 처리
  if (typeof err.message === 'string' && err.message.length > 0) {
    const criticalPatterns = [
      'memory', // 메모리 관련 오류
      'quota', // 할당량 관련 오류
      'script error', // 외부 스크립트 오류
      'timeout', // 시스템 타임아웃
      'undefined is not a function', // 흔한 타입 오류
      'null is not an object', // 흔한 타입 오류
      'Maximum call stack size exceeded', // 스택 오버플로우
      'FATAL', // 치명적 오류 표시
      'access denied', // 접근 권한 오류
    ];

    return criticalPatterns.some((pattern) =>
      err.message!.toLowerCase().includes(pattern.toLowerCase()),
    );
  }

  // 기본적으로는 전역에서 처리하지 않음
  return false;
}

/**
 * 오류 정보를 세션 스토리지에 저장
 */
function saveErrorToStorage(error: unknown) {
  try {
    const errorInfo = {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    };
    sessionStorage.setItem('errorInfo', JSON.stringify(errorInfo));
  } catch (e) {
    // 저장 실패 시 무시
  }
}

/**
 * React 애플리케이션 전체에서 사용할 에러 바운더리 클래스입니다.
 * 컴포넌트 트리 하위에서 발생하는 에러를 잡아 처리합니다.
 *
 * @example
 * <AppErrorBoundary fallback={<ErrorFallback />}>
 *   <App />
 * </AppErrorBoundary>
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
    // 다음 렌더링에서 폴백 UI가 보이도록 상태를 업데이트합니다.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // 에러 로깅
    logError(error, { errorInfo, component: 'AppErrorBoundary' });
  }

  render() {
    if (this.state.hasError) {
      // 에러 발생 시 폴백 UI를 렌더링합니다.
      return this.props.fallback;
    }

    return this.props.children;
  }
}

/**
 * React Query 또는 다른 데이터 페칭 라이브러리와 함께 사용할 에러 핸들러 훅입니다.
 * API 에러를 적절히 처리합니다.
 *
 * @returns 에러 발생 시 처리할 콜백 함수들
 * @example
 * const { handleError } = useApiErrorHandler();
 *
 * useQuery({
 *   queryKey: ['data'],
 *   queryFn: fetchData,
 *   onError: handleError,
 * });
 */
export function useApiErrorHandler() {
  const navigate = useNavigate();

  // API 에러 처리 핸들러
  const handleError = useCallback(
    (error: unknown) => {
      if (error instanceof AxiosError) {
        const status = error.response?.status || 0;

        // 인증 에러 (401) 처리
        if (status === 401) {
          // 로컬 스토리지의 인증 토큰 제거
          localStorage.removeItem('accessToken');

          // 현재 페이지 저장 (로그인 후 리디렉션용)
          localStorage.setItem('redirectUrl', window.location.pathname);

          // 사용자에게 알림
          toast.error('로그인이 필요합니다. 로그인 페이지로 이동합니다.');

          // 로그인 페이지로 이동
          navigate('/login');
          return;
        }

        // 권한 에러 (403) 처리
        if (status === 403) {
          toast.error('이 작업을 수행할 권한이 없습니다.');
          return;
        }

        // 다른 클라이언트 에러 (400대) 처리
        if (status >= 400 && status < 500) {
          const message = extractErrorMessage(error);
          toast.error(message);
          return;
        }

        // 서버 에러 (500대) 처리
        if (status >= 500) {
          toast.error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
          logError(error, { context: 'Server Error', severity: 'high' });
          return;
        }
      }

      // 네트워크 에러 처리
      if (error instanceof Error && error.message.includes('network')) {
        toast.error('네트워크 연결을 확인해주세요.');
        return;
      }

      // 기타 예상하지 못한 에러
      toast.error('예상치 못한 오류가 발생했습니다.');
      logError(error, { context: 'Unexpected Error' });
    },
    [navigate],
  );

  return { handleError };
}
