import React, { useState, FormEvent } from 'react';
import { UserDto } from '../../types/users-types';
import { AxiosError } from 'axios';
import { useAuthStore } from '../../zustand/useAuthStore';
import { updateNickname } from '../../api/services/userService';
import { FaEdit, FaUser } from 'react-icons/fa';

interface EditNicknameProps {
  user: UserDto | null;
  onSave: (nickname: string) => void;
}

interface ApiErrorResponse {
  message: string;
  statusCode: number;
}

const EditNickname: React.FC<EditNicknameProps> = ({ user, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState(user?.nickname || '');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useAuthStore();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!nickname.trim()) {
      setError('닉네임을 입력해주세요.');
      return;
    }

    if (nickname.length < 2 || nickname.length > 20) {
      setError('닉네임은 2자 이상 20자 이하로 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // UserService를 통한 API 호출 - 이메일 파라미터 제거
      const response = await updateNickname(nickname);

      // 응답에서 업데이트된 사용자 정보 추출
      const updatedUser = response.data;

      // 유저 정보 업데이트
      if (user && updatedUser) {
        setUser({
          ...user,
          nickname: updatedUser.nickname || nickname,
        });
      }

      onSave(nickname);
      setIsEditing(false);
    } catch (error) {
      console.error('닉네임 변경 실패:', error);
      const axiosError = error as AxiosError<ApiErrorResponse>;
      if (axiosError.response?.data?.message) {
        setError(axiosError.response.data.message);
      } else {
        setError('닉네임 변경 중 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border-b border-gray-100 pb-4">
      <label className="mb-2 flex items-center text-sm font-medium text-gray-600">
        <FaUser className="mr-2 text-gray-400" />
        닉네임
      </label>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="mt-2">
          <div className="space-y-3">
            <div className="relative">
              <input
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="닉네임을 입력하세요"
                disabled={isLoading}
              />
              {nickname && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 transform text-xs text-gray-500">
                  {nickname.length}/20
                </span>
              )}
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-2 text-sm text-red-500">
                {error}
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setNickname(user?.nickname || '');
                  setError('');
                }}
                className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
                disabled={isLoading}
              >
                취소
              </button>
              <button
                type="submit"
                className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
                disabled={isLoading}
              >
                {isLoading ? '저장 중...' : '저장'}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="group flex items-center justify-between rounded-md bg-gray-50 p-3 transition-colors hover:bg-gray-100">
          <div className="font-medium text-gray-800">
            {user?.nickname || '닉네임 없음'}
          </div>
          <button
            className="flex items-center text-blue-600"
            onClick={() => setIsEditing(true)}
          >
            <FaEdit className="mr-1" />
            <span className="text-sm font-medium">수정</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default EditNickname;
