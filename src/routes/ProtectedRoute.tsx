import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
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
  const { isAuthenticated, checkAuth } = useAuthStore();

  // 인증 상태를 확인
  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      checkAuth();
    }
    return () => {
      isMounted = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isAuthenticated) {
    // 사용자에게 로그인이 필요하다는 확인 창 표시
    const userConfirmed = window.confirm(
      '로그인이 필요합니다. 로그인 페이지로 이동할까요?',
    );

    // 사용자가 확인을 누른 경우 로그인 페이지로, 취소를 누른 경우 메인 페이지로 이동
    return userConfirmed ? (
      <Navigate to="/login" replace state={{ from: location.pathname }} />
    ) : (
      <Navigate to="/" replace />
    );
  }

  // 인증된 사용자에게 컴포넌트를 보여주되, 에러 바운더리로 감싸서 안전하게 보호
  return (
    <AppErrorBoundary fallback={<AuthErrorFallback />}>
      {children}
    </AppErrorBoundary>
  );
}
