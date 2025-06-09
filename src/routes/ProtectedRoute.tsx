import React, { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../zustand/useAuthStore';
import { AppErrorBoundary } from '../utils/errorHandler';

// 인증된 경로를 위한 에러 폴백 UI
const AuthErrorFallback = () => (
  <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
    <h1 className="mb-4 text-2xl font-bold text-red-600">보호된 페이지 오류</h1>
    <p className="mb-6 text-gray-600">
      인증된 페이지 로드 중 오류가 발생했습니다.
    </p>
    <button
      onClick={() => (window.location.href = '/')}
      className="rounded-md bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
    >
      홈으로 돌아가기
    </button>
  </div>
);

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, checkAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);

  // OAuth 연동 성공 여부 확인을 위한 로직
  const queryParams = new URLSearchParams(location.search);
  const successMessage = queryParams.get('message');
  const isOAuthSuccess =
    successMessage?.includes('계정이 성공적으로 연결되었습니다');

  // 성공 메시지가 있으면 로컬 스토리지에 임시 상태 저장
  useEffect(() => {
    if (isOAuthSuccess) {
      localStorage.setItem('oauthSuccess', 'true');
      navigate('/mypage', { replace: true });
    }
  }, [isOAuthSuccess, navigate]);

  // 인증 상태 확인
  useEffect(() => {
    const checkAuthStatus = async () => {
      setIsLoading(true);
      await checkAuth();
      setIsLoading(false);
    };

    checkAuthStatus();
  }, [checkAuth]);

  // 로딩 중이면 로딩 UI 표시
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex items-center justify-center p-8">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  // OAuth 연동 성공 후 마이페이지로 이동한 경우
  const oauthSuccess = localStorage.getItem('oauthSuccess') === 'true';
  if (oauthSuccess && location.pathname === '/mypage') {
    // 플래그 초기화
    localStorage.removeItem('oauthSuccess');

    // 인증 상태와 상관없이 마이페이지 표시 (인증 체크가 끝난 후)
    return (
      <AppErrorBoundary fallback={<AuthErrorFallback />}>
        {children}
      </AppErrorBoundary>
    );
  }

  // 일반적인 인증 상태 체크
  if (!isAuthenticated) {
    // OAuth 성공 메시지가 있는 경우 마이페이지로 강제 이동
    if (location.pathname === '/mypage' && isOAuthSuccess) {
      return children;
    }

    // 아니면 일반 로그인 확인 메시지
    const userConfirmed = window.confirm(
      '로그인이 필요합니다. 로그인 페이지로 이동할까요?',
    );

    return userConfirmed ? (
      <Navigate to="/login" replace state={{ from: location.pathname }} />
    ) : (
      <Navigate to="/" replace />
    );
  }

  // 인증된 사용자에게 컴포넌트 표시
  return (
    <AppErrorBoundary fallback={<AuthErrorFallback />}>
      {children}
    </AppErrorBoundary>
  );
}
