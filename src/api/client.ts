// src/api/client.ts
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { ApiResponse } from '../types/ApiResponse';

console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL); // 추가

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 요청 타임아웃 설정 (밀리초 단위)
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (config.withAuth) {
      // withAuth 플래그 확인
      const token = localStorage.getItem('authToken'); // 예시: 로컬 스토리지에서 토큰 가져오기
      if (token && config.headers) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);

apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown>>) => response,
  (error: AxiosError<ApiResponse<unknown>>) => {
    console.log('error', error);

    if (error.response) {
      const { status, data } = error.response;
      console.log('🚀 ~ file: client.ts:43 ~ data:', data);

      // 클라이언트에서 처리할 에러 조건 전달
      if (data?.errorCode) {
        return Promise.reject(error);
      }

      // 기본 에러 처리 (status 별)
      switch (status) {
        case 401:
          localStorage.removeItem('authToken');
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
          alert(`에러 ${status}: ${error.message}`);
      }
    } else if (error.request) {
      alert('서버와의 연결이 끊어졌습니다. 인터넷 연결을 확인해주세요.');
    } else {
      alert(`에러: ${error.message}`);
    }

    return Promise.reject(error);
  },
);

export default apiClient;
