import React, { useState, FormEvent } from 'react';
import { AxiosError } from 'axios';
import { changePassword } from '../../api/services/userService';
import { useAuthStore } from '../../zustand/useAuthStore';
import { FaKey, FaLock, FaShieldAlt } from 'react-icons/fa';

interface ApiErrorResponse {
  message: string;
  statusCode: number;
}

const ChangePassword: React.FC = () => {
  const [isChanging, setIsChanging] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthStore();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // 기본적인 유효성 검사
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('모든 필드를 입력해주세요.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('새 비밀번호와 확인 비밀번호가 일치하지 않습니다.');
      return;
    }

    if (newPassword.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.');
      return;
    }

    if (!user?.email) {
      setError('사용자 정보를 불러올 수 없습니다.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // UserService를 통한 API 호출
      await changePassword(user.email, currentPassword, newPassword);

      setSuccess('비밀번호가 성공적으로 변경되었습니다.');

      // 폼 초기화
      setTimeout(() => {
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setIsChanging(false);
        setSuccess('');
      }, 2000);
    } catch (error) {
      console.error('비밀번호 변경 실패:', error);
      const axiosError = error as AxiosError<ApiErrorResponse>;
      if (axiosError.response?.data?.message) {
        setError(axiosError.response.data.message);
      } else {
        setError('비밀번호 변경 중 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h3 className="mb-6 flex items-center border-b border-gray-200 pb-2 text-xl font-bold text-gray-800">
        <FaShieldAlt className="mr-2 text-blue-500" />
        비밀번호 관리
      </h3>

      {!isChanging ? (
        <div className="flex flex-col items-center justify-between rounded-lg bg-gray-50 p-4 sm:flex-row">
          <div className="mb-4 text-center sm:mb-0 sm:text-left">
            <p className="font-medium text-gray-700">비밀번호 변경</p>
            <p className="text-sm text-gray-500">
              계정 보안을 위해 주기적으로 비밀번호를 변경하세요.
            </p>
          </div>
          <button
            className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
            onClick={() => setIsChanging(true)}
          >
            변경하기
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="flex items-start rounded-md bg-red-50 p-4 text-red-700">
              <div className="mt-0.5 flex-shrink-0">
                <FaKey className="text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  오류가 발생했습니다
                </h3>
                <div className="mt-1 text-sm text-red-700">{error}</div>
              </div>
            </div>
          )}

          {success && (
            <div className="flex items-start rounded-md bg-green-50 p-4 text-green-700">
              <div className="mt-0.5 flex-shrink-0">
                <FaCheckCircle className="text-green-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">성공</h3>
                <div className="mt-1 text-sm text-green-700">{success}</div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="mb-1 flex items-center text-sm font-medium text-gray-700">
                <FaKey className="mr-2 text-gray-400" />
                현재 비밀번호
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="현재 비밀번호 입력"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="mb-1 flex items-center text-sm font-medium text-gray-700">
                <FaLock className="mr-2 text-gray-400" />새 비밀번호
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="8자 이상 입력"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="mb-1 flex items-center text-sm font-medium text-gray-700">
                <FaLock className="mr-2 text-gray-400" />새 비밀번호 확인
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="새 비밀번호 재입력"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex flex-col justify-end gap-2 pt-2 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                setIsChanging(false);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setError('');
              }}
              className="order-2 w-full rounded-md border border-gray-300 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50 sm:order-1 sm:w-auto"
              disabled={isLoading}
            >
              취소
            </button>
            <button
              type="submit"
              className="order-1 w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300 sm:order-2 sm:w-auto"
              disabled={isLoading}
            >
              {isLoading ? '처리 중...' : '변경 완료'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

const FaCheckCircle = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
    width="18"
    height="18"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
      clipRule="evenodd"
    />
  </svg>
);

export default ChangePassword;
