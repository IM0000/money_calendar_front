import apiClient from '../client';
import { withErrorHandling } from '../../utils/errorHandler';
import { UserDto, UserProfileResponse } from '../../types/users-types';
import { ApiResponse } from '../../types/api-response';

// 닉네임 변경
export const updateNickname = withErrorHandling(
  async (nickname: string): Promise<ApiResponse<UserDto>> => {
    const response = await apiClient.patch<ApiResponse<UserDto>>(
      '/api/v1/users/profile/nickname',
      { nickname },
    );
    return response.data;
  },
  undefined,
  'UserService.updateNickname',
);

// 비밀번호 변경
export const changePassword = withErrorHandling(
  async (
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
  },
  undefined,
  'UserService.changePassword',
);

/**
 * 사용자 프로필 정보를 가져옵니다
 */
export const getUserProfile = withErrorHandling(
  async (): Promise<ApiResponse<UserProfileResponse>> => {
    const response = await apiClient.get<ApiResponse<UserProfileResponse>>(
      '/api/v1/users/profile',
    );
    return response.data;
  },
  undefined,
  'UserService.getUserProfile',
);

/**
 * OAuth 계정 연결을 해제합니다
 */
export const disconnectOAuthAccount = withErrorHandling(
  async (provider: string): Promise<ApiResponse<void>> => {
    const response = await apiClient.delete<ApiResponse<void>>(
      `/api/v1/users/profile/oauth/${provider}`,
    );
    return response.data;
  },
  undefined,
  'UserService.disconnectOAuthAccount',
);

/**
 * 계정 삭제
 */
export const deleteAccount = withErrorHandling(
  async (email: string, password: string): Promise<{ message: string }> => {
    const response = await apiClient.post('/api/v1/users/delete', {
      email,
      password,
    });
    return response.data;
  },
  undefined,
  'UserService.deleteAccount',
);

/**
 * 사용자의 비밀번호를 설정합니다.
 */
export const updateUserPassword = withErrorHandling(
  async (payload: {
    email: string;
    password: string;
  }): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.put<ApiResponse<{ message: string }>>(
      '/api/v1/users/password',
      payload,
    );
    return response.data;
  },
  undefined,
  'UserService.updateUserPassword',
);

/**
 * 이메일을 통해 사용자 정보를 가져옵니다.
 */
export const getUserByEmail = withErrorHandling(
  async (email: string): Promise<ApiResponse<{ user: UserDto | null }>> => {
    const response = await apiClient.post<
      ApiResponse<{ user: UserDto | null }>
    >('/api/v1/users', { email });
    return response.data;
  },
  undefined,
  'UserService.getUserByEmail',
);

/**
 * 현재 비밀번호가 맞는지 확인
 */
export const verifyPassword = withErrorHandling(
  async (password: string): Promise<ApiResponse<{ isValid: boolean }>> => {
    const response = await apiClient.post<ApiResponse<{ isValid: boolean }>>(
      '/api/v1/users/verify-password',
      { password },
    );
    return response.data;
  },
  undefined,
  'UserService.verifyPassword',
);
