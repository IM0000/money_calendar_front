// src/services/AuthService.ts

import { ApiResponse } from '../../types/api-response';
import {
  LoginDto,
  LoginResponse,
  RegisterDto,
  VerifyDto,
} from '../../types/auth-types';
import { UserDto } from '../../types/users-types';
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
