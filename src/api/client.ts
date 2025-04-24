// src/api/client.ts
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { ApiResponse } from '../types/api-response';
import { logError } from '../utils/errorHandler';

// 확장된 axios 요청 설정 타입
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  metadata?: {
    startTime?: number;
  };
  withAuth?: boolean;
}

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 요청 타임아웃 설정 (밀리초 단위)
});

// 요청 인터셉터 - 모든 요청에 토큰 추가
apiClient.interceptors.request.use(
  (config: ExtendedAxiosRequestConfig) => {
    const startTime = new Date().getTime();
    config.metadata = { startTime };

    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
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

    // 401 에러(인증 실패) 처리
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('accessToken');

      // 로그인 페이지로 리다이렉트
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    // 인터셉터가 에러를 처리하는 대신 에러를 그대로 전파
    // 컴포넌트 레벨에서 Error Boundary와 useApiErrorHandler로 처리
    return Promise.reject(error);
  },
);

export default apiClient;
