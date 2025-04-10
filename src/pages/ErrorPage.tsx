import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

interface ErrorInfo {
  message?: string;
  stack?: string;
  timestamp?: string;
  prevPath?: string;
}

/**
 * 애플리케이션 에러 페이지 컴포넌트
 *
 * 세션 스토리지에서 에러 정보를 가져와 표시합니다.
 * 사용자에게 에러에 대한 정보와 복구 옵션을 제공합니다.
 */
const ErrorPage: React.FC = () => {
  const [errorInfo, setErrorInfo] = useState<ErrorInfo>({
    message: '알 수 없는 오류가 발생했습니다.',
  });
  const [showDetails, setShowDetails] = useState(false);
  const isDevelopment = process.env.NODE_ENV === 'development';

  useEffect(() => {
    // 세션 스토리지에서 에러 정보 가져오기
    const storedErrorInfo = sessionStorage.getItem('errorInfo');

    if (storedErrorInfo) {
      try {
        const parsedError = JSON.parse(storedErrorInfo) as ErrorInfo;
        setErrorInfo(parsedError);
      } catch (e) {
        console.error('에러 정보 파싱 중 오류:', e);
      }
    }

    // 컴포넌트 언마운트 시 세션 스토리지에서 에러 정보 제거
    return () => {
      sessionStorage.removeItem('errorInfo');
    };
  }, []);

  const handleRefresh = () => {
    if (errorInfo.prevPath) {
      window.location.href = errorInfo.prevPath;
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-lg overflow-hidden rounded-xl bg-white p-8 shadow-xl">
        <div className="text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-red-100 p-4">
              <svg
                className="h-16 w-16 text-red-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>
          <h1 className="mb-4 text-2xl font-extrabold text-gray-900">
            오류가 발생했습니다
          </h1>
          <p className="mb-8 text-lg text-gray-600">{errorInfo.message}</p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              홈으로 돌아가기
            </Link>

            <button
              onClick={handleRefresh}
              className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              페이지 새로고침
            </button>
          </div>

          {isDevelopment && errorInfo.stack && (
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="mt-6 text-sm font-medium text-gray-500 underline hover:text-gray-700"
            >
              {showDetails ? '상세 정보 숨기기' : '상세 정보 보기'}
            </button>
          )}
        </div>

        {isDevelopment && showDetails && errorInfo.stack && (
          <div className="mt-6 overflow-auto rounded-lg bg-gray-800 p-4 text-left">
            <p className="whitespace-pre-wrap font-mono text-xs text-gray-200">
              {errorInfo.stack}
            </p>
            {errorInfo.timestamp && (
              <p className="mt-2 text-xs text-gray-400">
                발생 시간: {new Date(errorInfo.timestamp).toLocaleString()}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorPage;
