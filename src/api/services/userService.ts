import apiClient from '../client';
import { UserDto, UserProfileResponse } from '../../types/users-types';
import { ApiResponse } from '../../types/api-response';

// 닉네임 변경
export const updateNickname = async (
  nickname: string,
): Promise<ApiResponse<UserDto>> => {
  const response = await apiClient.patch<ApiResponse<UserDto>>(
    '/api/v1/users/profile/nickname',
    {
      nickname,
    },
  );
  return response.data;
};

// 비밀번호 변경
export const changePassword = async (
  email: string,
  currentPassword: string,
  newPassword: string,
): Promise<{ message: string }> => {
  const response = await apiClient.patch('/api/v1/users/profile/password', {
    email,
    currentPassword,
    newPassword,
  });
  return response.data;
};

/**
 * 사용자 프로필 정보를 가져옵니다
 * @returns 사용자 프로필 정보
 */
export const getUserProfile = async (): Promise<
  ApiResponse<UserProfileResponse>
> => {
  const response = await apiClient.get<ApiResponse<UserProfileResponse>>(
    '/api/v1/users/profile',
  );
  return response.data;
};

/**
 * OAuth 계정 연결을 해제합니다
 * @param provider 연결 해제할 OAuth 제공자 (google, apple, discord, kakao)
 * @returns API 응답 객체
 */
export const disconnectOAuthAccount = async (
  provider: string,
): Promise<ApiResponse<void>> => {
  const response = await apiClient.delete<ApiResponse<void>>(
    `/api/v1/users/profile/oauth/${provider}`,
  );
  return response.data;
};

/**
 * 계정 삭제
 */
export const deleteAccount = async (
  email: string,
  password: string,
): Promise<{ message: string }> => {
  const response = await apiClient.post('/api/v1/users/delete', {
    email,
    password,
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

/**
 * 현재 비밀번호가 맞는지 확인
 * @param password 확인할 비밀번호
 * @returns 비밀번호 일치 여부
 */
export const verifyPassword = async (
  password: string,
): Promise<ApiResponse<{ isValid: boolean }>> => {
  const response = await apiClient.post<ApiResponse<{ isValid: boolean }>>(
    '/api/v1/users/verify-password',
    { password },
  );
  return response.data;
};
