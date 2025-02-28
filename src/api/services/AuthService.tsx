// src/services/AuthService.ts

import { ApiResponse } from '../../types/ApiResponse';
import {
  LoginDto,
  LoginResponse,
  RegisterDto,
  VerifyDto,
} from '../../types/AuthTypes';
import { UserDto } from '../../types/UsersTypes';
import apiClient from '../client';

/**
 * 사용자를 등록하고 이메일로 인증 코드를 전송합니다.
 * @param registerDto 사용자의 이메일 주소를 포함한 등록 데이터
 * @returns API 응답 객체
 */
export const register = async (
  registerDto: RegisterDto,
): Promise<ApiResponse<{ token: string; message: string }>> => {
  const response = await apiClient.post<
    ApiResponse<{ token: string; message: string }>
  >('/api/v1/auth/register', registerDto);
  return response.data;
};

/**
 * 인증 코드를 검증하고 사용자의 비밀번호를 설정합니다.
 * @param verifyDto 이메일, 인증 코드, 비밀번호를 포함한 검증 데이터
 * @returns API 응답 객체
 */
export const verify = async (
  verifyDto: VerifyDto,
): Promise<ApiResponse<UserDto>> => {
  const response = await apiClient.post<ApiResponse<UserDto>>(
    '/api/v1/auth/verify',
    verifyDto,
  );

  return response.data;
};

/**
 * 이메일토큰을 제출하고 인증했던 이메일을 받습니다.
 * @param token 이메일토큰
 * @returns API 응답 객체
 */
export const getEmailFromToken = async (
  token: string,
): Promise<ApiResponse<{ email: string }>> => {
  const response = await apiClient.get(
    `/api/v1/auth/email-verification?token=${encodeURIComponent(token)}`,
  );
  return response.data;
};

/**
 * 이메일과 비밀번호를 사용하여 사용자를 로그인합니다.
 * @param loginDto 이메일과 비밀번호를 포함한 로그인 데이터
 * @returns API 응답 객체
 */
export const login = async (
  loginDto: LoginDto,
): Promise<ApiResponse<LoginResponse>> => {
  const response = await apiClient.post<ApiResponse<LoginResponse>>(
    '/api/v1/auth/login',
    loginDto,
  );
  return response.data;
};

/**
 * OAuth 로그인을 시작하여 제공자의 인증 페이지로 리디렉션합니다.
 * @param provider OAuth 제공자 이름 (예: 'google', 'facebook')
 */
export const oauthLogin = (provider: string): void => {
  window.location.href = `${apiClient.defaults.baseURL}/api/v1/auth/oauth/${provider}`;
};

/**
 * 사용자를 로그아웃하여 토큰을 제거하고 로그인 페이지로 리디렉션합니다.
 */
export const logout = (): void => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('refreshToken');
  // 필요에 따라 백엔드에 로그아웃을 알릴 수 있습니다
  // 예: apiClient.post('/auth/logout');
  window.location.href = '/login'; // 로그인 페이지로 리디렉션
};
