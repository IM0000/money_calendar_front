import apiClient from '../client';
import { UserDto } from '../../types/users-types';
import { ApiResponse } from '../../types/api-response';

// 닉네임 변경
export const updateNickname = async (
  email: string,
  nickname: string,
): Promise<{ user: UserDto; message: string }> => {
  const response = await apiClient.patch('/api/users/nickname', {
    email,
    nickname,
  });
  return response.data;
};

// 비밀번호 변경
export const changePassword = async (
  email: string,
  currentPassword: string,
  newPassword: string,
): Promise<{ message: string }> => {
  const response = await apiClient.patch('/api/users/password', {
    email,
    currentPassword,
    newPassword,
  });
  return response.data;
};

// 계정 삭제
export const deleteAccount = async (
  email: string,
  password: string,
): Promise<{ message: string }> => {
  const response = await apiClient.delete('/api/users', {
    data: {
      email,
      password,
    },
  });
  return response.data;
};

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
    '/api/v1/users/password',
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
    '/api/v1/users',
    { email },
  );
  return response.data;
};
