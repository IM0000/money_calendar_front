// src/api/client.ts
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { ApiResponse } from '../types/ApiResponse';
import { extractErrorMessage, logError } from '../utils/errorHandler';

console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL);

// 확장된 axios 요청 설정 타입
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  metadata?: {
    startTime?: number;
  };
  withAuth?: boolean;
}

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 요청 타임아웃 설정 (밀리초 단위)
});

apiClient.interceptors.request.use(
  (config: ExtendedAxiosRequestConfig) => {
    const startTime = new Date().getTime();
    config.metadata = { startTime };

    if (config.withAuth) {
      // withAuth 플래그 확인
      const token = localStorage.getItem('accessToken');
      if (token && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error: AxiosError) => {
    logError(error, { context: 'API Request Interceptor' });
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown>>) => {
    // 요청 처리 시간 기록
    const config = response.config as ExtendedAxiosRequestConfig;
    const endTime = new Date().getTime();
    const requestTime = config.metadata?.startTime
      ? endTime - config.metadata.startTime
      : -1;

    // 응답 시간이 오래 걸린 경우 (예: 3초 이상) 로깅
    if (requestTime > 3000) {
      console.warn(
        `Slow API response: ${config.method?.toUpperCase()} ${config.url} took ${requestTime}ms`,
      );
    }

    return response;
  },
  (error: AxiosError<ApiResponse<unknown>>) => {
    // 에러 로깅 (상세 정보 포함)
    logError(error, {
      context: 'API Response Interceptor',
      request: {
        url: error.config?.url,
        method: error.config?.method,
        data: error.config?.data,
      },
    });

    if (error.response) {
      const { status, data } = error.response;

      // 클라이언트에서 처리할 에러 조건 전달
      if (data?.errorCode) {
        return Promise.reject(error);
      }

      // 기본 에러 처리 (status 별)
      switch (status) {
        case 401:
          localStorage.removeItem('authToken');
          // 현재 페이지 URL을 로컬 스토리지에 저장 (로그인 후 리디렉션용)
          localStorage.setItem('redirectUrl', window.location.pathname);
          window.location.href = '/login';
          break;
        case 403:
          alert('접근 권한이 없습니다.');
          break;
        case 404:
          alert('요청한 리소스를 찾을 수 없습니다.');
          break;
        case 500:
          alert('서버 오류가 발생했습니다. 나중에 다시 시도해주세요.');
          break;
        default:
          alert(extractErrorMessage(error));
      }
    } else if (error.request) {
      alert('서버와의 연결이 끊어졌습니다. 인터넷 연결을 확인해주세요.');
    } else {
      alert(extractErrorMessage(error));
    }

    return Promise.reject(error);
  },
);

export default apiClient;
