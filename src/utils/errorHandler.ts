import { AxiosError } from 'axios';

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

  // 콘솔에 로깅
  console.error('Application Error:', errorInfo);

  // 개발 환경이 아닌 경우, 에러 모니터링 서비스로 전송할 수도 있음
  if (process.env.NODE_ENV === 'production') {
    // 예: Sentry, LogRocket 등의 서비스에 에러 전송
    // sendToErrorMonitoring(errorInfo);
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
