// src/types/axios.d.ts
import 'axios';

declare module 'axios' {
  export interface AxiosRequestConfig {
    withAuth?: boolean; // 인증이 필요한지 여부를 나타내는 플래그
  }
}
