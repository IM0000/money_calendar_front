// src/services/AuthService.ts
import apiClient from '../client';
import { withErrorHandling } from '../../utils/errorHandler';
import { ApiResponse } from '../../types/api-response';
import {
  LoginDto,
  LoginResponse,
  RegisterDto,
  VerifyDto,
} from '../../types/auth-types';
import { UserDto } from '../../types/users-types';

/**
 * 사용자를 등록하고 이메일로 인증 코드를 전송합니다.
 */
export const register = withErrorHandling(
  async (
    registerDto: RegisterDto,
  ): Promise<ApiResponse<{ token: string; message: string }>> => {
    const response = await apiClient.post<
      ApiResponse<{ token: string; message: string }>
    >('/api/v1/auth/register', registerDto);
    return response.data;
  },
  undefined,
  'AuthService.register',
);

/**
 * 인증 코드를 검증하고 사용자의 비밀번호를 설정합니다.
 */
export const verify = withErrorHandling(
  async (verifyDto: VerifyDto): Promise<ApiResponse<UserDto>> => {
    const response = await apiClient.post<ApiResponse<UserDto>>(
      '/api/v1/auth/verify',
      verifyDto,
    );
    return response.data;
  },
  undefined,
  'AuthService.verify',
);

/**
 * 이메일토큰을 제출하고 인증했던 이메일을 받습니다.
 */
export const getEmailFromToken = withErrorHandling(
  async (token: string): Promise<ApiResponse<{ email: string }>> => {
    const response = await apiClient.get(
      `/api/v1/auth/email-verification?token=${encodeURIComponent(token)}`,
    );
    return response.data;
  },
  undefined,
  'AuthService.getEmailFromToken',
);

/**
 * 이메일과 비밀번호를 사용하여 사용자를 로그인합니다.
 */
export const login = withErrorHandling(
  async (loginDto: LoginDto): Promise<ApiResponse<LoginResponse>> => {
    const response = await apiClient.post<ApiResponse<LoginResponse>>(
      '/api/v1/auth/login',
      loginDto,
    );
    return response.data;
  },
  undefined,
  'AuthService.login',
);

/**
 * 로그아웃 처리 (HTTP-Only 쿠키 삭제 요청)
 */
export const logout = withErrorHandling(
  async (): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.post<ApiResponse<{ message: string }>>(
      '/api/v1/auth/logout',
    );
    return response.data;
  },
  undefined,
  'AuthService.logout',
);

/**
 * 로그인 상태 확인
 */
export const status = withErrorHandling(
  async (): Promise<
    ApiResponse<{ isAuthenticated: boolean; user: UserDto }>
  > => {
    const response = await apiClient.get<
      ApiResponse<{ isAuthenticated: boolean; user: UserDto }>
    >('/api/v1/auth/status');
    return response.data;
  },
  undefined,
  'AuthService.status',
);

/**
 * 로그인 상태 확인
 */
export const refresh = withErrorHandling(
  async (): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.post<ApiResponse<{ message: string }>>(
      '/api/v1/auth/refresh',
    );
    return response.data;
  },
  undefined,
  'AuthService.status',
);

/**
 * OAuth 계정 연결을 시작합니다
 */
export const connectOAuthAccount = withErrorHandling(
  async (
    provider: string,
  ): Promise<ApiResponse<{ message: string; redirectUrl: string }>> => {
    const response = await apiClient.post<
      ApiResponse<{ message: string; redirectUrl: string }>
    >('/api/v1/auth/oauth/connect', { provider });
    return response.data;
  },
  undefined,
  'AuthService.connectOAuthAccount',
);

/**
 * 비밀번호 재설정 요청 (이메일로 토큰 발송)
 */
export const requestPasswordReset = withErrorHandling(
  async (email: string): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.post<ApiResponse<{ message: string }>>(
      '/api/v1/auth/password-reset/request',
      { email },
    );
    return response.data;
  },
  undefined,
  'AuthService.requestPasswordReset',
);

/**
 * 비밀번호 재설정 토큰 검증 (토큰이 유효하면 email 반환)
 */
export const verifyPasswordResetToken = withErrorHandling(
  async (token: string): Promise<ApiResponse<{ email: string }>> => {
    const response = await apiClient.get<ApiResponse<{ email: string }>>(
      `/api/v1/auth/password-reset/verify?token=${encodeURIComponent(token)}`,
    );
    return response.data;
  },
  undefined,
  'AuthService.verifyPasswordResetToken',
);

/**
 * 비밀번호 재설정 (토큰 & 새 비밀번호)
 */
export const resetPassword = withErrorHandling(
  async (
    token: string,
    password: string,
  ): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.post<ApiResponse<{ message: string }>>(
      '/api/v1/auth/password-reset',
      { token, password },
    );
    return response.data;
  },
  undefined,
  'AuthService.resetPassword',
);
