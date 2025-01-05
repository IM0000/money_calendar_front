// src/services/UsersService.ts

import { ApiResponse } from '../../types/ApiResponse';
import { UserDto } from '../../types/UsersTypes';
import apiClient from '../client';

/**
 * 사용자의 비밀번호를 설정합니다.
 * @param payload 비밀번호 설정에 필요한 데이터 (예: { email: string, password: string })
 * @returns API 응답 객체
 */
export const updateUserPassword = async (payload: {
  email: string;
  password: string;
}): Promise<ApiResponse<{ message: string }>> => {
  const response = await apiClient.put<ApiResponse<{ message: string }>>(
    '/users/password',
    payload,
  );
  return response.data;
};

/**
 * 이메일을 통해 사용자 정보를 가져옵니다.
 * @param email 이메일
 * @returns 사용자 정보
 */
export const getUserByEmail = async (
  email: string,
): Promise<ApiResponse<{ user: UserDto | null }>> => {
  const response = await apiClient.post<ApiResponse<{ user: UserDto | null }>>(
    '/users',
    { email },
  );
  return response.data;
};
