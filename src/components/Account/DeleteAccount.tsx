import React, { useState, FormEvent } from 'react';
import { AxiosError } from 'axios';
import { deleteAccount, verifyPassword } from '../../api/services/userService';
import { useAuthStore } from '../../zustand/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { FaExclamationTriangle, FaUserMinus, FaLock } from 'react-icons/fa';

interface ApiErrorResponse {
  message: string;
  statusCode: number;
}

const DeleteAccount: React.FC = () => {
  const [isConfirming, setIsConfirming] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const { user, logout, userProfile } = useAuthStore();
  const navigate = useNavigate();

  // userProfile에서 hasPassword 추출
  const hasPassword = userProfile?.hasPassword ?? true;

  // 비밀번호 확인 함수
  const checkPassword = async (): Promise<boolean> => {
    if (!hasPassword) return true; // 비밀번호가 없는 계정은 확인 필요 없음
    if (!password) {
      setError('비밀번호를 입력해주세요.');
      return false;
    }

    try {
      setIsVerifying(true);
      const response = await verifyPassword(password);

      if (response?.data?.isValid) {
        return true;
      } else {
        setError('현재 비밀번호가 일치하지 않습니다.');
        return false;
      }
    } catch (error) {
      console.error('비밀번호 확인 실패:', error);
      const axiosError = error as AxiosError<ApiErrorResponse>;
      if (axiosError.response?.data?.message) {
        setError(axiosError.response.data.message);
      } else {
        setError('비밀번호 확인 중 오류가 발생했습니다.');
      }
      return false;
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!user?.email) {
      setError('사용자 정보를 불러올 수 없습니다.');
      return;
    }

    // 먼저 비밀번호 확인
    const isPasswordValid = await checkPassword();
    if (!isPasswordValid) return;

    // 비밀번호 확인 성공 시 계정 삭제 진행
    setIsLoading(true);
    setError('');

    try {
      // OAuth 계정(비밀번호 없음)인 경우 빈 문자열 전달
      await deleteAccount(user.email, hasPassword ? password : '');
      logout();
      navigate('/login');
    } catch (error) {
      console.error('계정 삭제 실패:', error);
      const axiosError = error as AxiosError<ApiErrorResponse>;
      if (axiosError.response?.data?.message) {
        setError(axiosError.response.data.message);
      } else {
        setError('계정 삭제 중 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h3 className="mb-6 flex items-center border-b border-gray-200 pb-2 text-xl font-bold text-gray-800">
        <FaUserMinus className="mr-2 text-red-500" />
        계정 삭제
      </h3>

      {!isConfirming ? (
        <div className="rounded-lg bg-gray-50 p-5">
          <div className="mb-4 flex items-start">
            <div className="mt-0.5 flex-shrink-0">
              <FaExclamationTriangle className="h-5 w-5 text-amber-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-gray-800">
                계정 삭제 전 주의사항
              </h3>
              <div className="mt-2 space-y-1 text-sm text-gray-600">
                <p>
                  • 계정을 삭제하면 모든 개인 데이터가 영구적으로 제거됩니다.
                </p>
                <p>• 삭제된 계정은 복구할 수 없습니다.</p>
                <p>• 연결된 SNS 계정 정보도 함께 삭제됩니다.</p>
              </div>
            </div>
          </div>

          <button
            className="mt-2 w-full rounded-md bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:w-auto"
            onClick={() => setIsConfirming(true)}
          >
            계정 삭제 진행
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-center">
              <FaExclamationTriangle className="mr-3 text-red-500" />
              <p className="font-medium text-red-800">
                이 작업은 되돌릴 수 없습니다
              </p>
            </div>
            <p className="mt-2 text-sm text-red-700">
              계정과 모든 관련 데이터가 영구적으로 삭제됩니다. 계속하시려면
              {hasPassword && ' 비밀번호를 입력하세요.'}
              {!hasPassword && ' 아래 버튼을 클릭하세요.'}
            </p>
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-4 text-red-700">
              <p>{error}</p>
            </div>
          )}

          {/* 비밀번호가 있는 계정일 경우에만 비밀번호 입력 필드 표시 */}
          {hasPassword && (
            <div>
              <label className="mb-1 flex items-center text-sm font-medium text-gray-700">
                <FaLock className="mr-2 text-gray-400" />
                비밀번호
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="계정 삭제를 확인하려면 비밀번호를 입력하세요"
                disabled={isLoading || isVerifying}
              />
            </div>
          )}

          <div className="flex flex-col justify-end gap-2 pt-2 sm:flex-row">
            <button
              type="button"
              onClick={() => {
                setIsConfirming(false);
                setPassword('');
                setError('');
              }}
              className="order-2 w-full rounded-md border border-gray-300 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50 sm:order-1 sm:w-auto"
              disabled={isLoading || isVerifying}
            >
              취소
            </button>
            <button
              type="submit"
              className="order-1 w-full rounded-md bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300 sm:order-2 sm:w-auto"
              disabled={isLoading || isVerifying}
            >
              {isLoading || isVerifying ? '처리 중...' : '계정 영구 삭제'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default DeleteAccount;
