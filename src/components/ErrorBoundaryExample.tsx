import React from 'react';
import { AppErrorBoundary } from '../utils/errorHandler';
import { useQuery } from '@tanstack/react-query';
import { useApiErrorHandler } from '../utils/errorHandler';

// 에러 발생 시 표시할 폴백 UI
const ComponentErrorFallback = () => (
  <div className="rounded-md border border-red-200 bg-red-50 p-4">
    <h3 className="mb-2 font-medium text-red-600">컴포넌트 오류 발생</h3>
    <p className="text-gray-600">이 컴포넌트에서 오류가 발생했습니다.</p>
    <button
      onClick={() => window.location.reload()}
      className="mt-2 rounded bg-red-100 px-3 py-1 text-red-700 hover:bg-red-200"
    >
      새로고침
    </button>
  </div>
);

// 에러를 발생시키는 컴포넌트
const ErrorProneComponent = () => {
  // 의도적으로 오류를 발생시키는 함수
  const triggerError = () => {
    throw new Error('의도적으로 발생시킨 오류');
  };

  return (
    <div className="rounded-md border p-4">
      <h3 className="mb-2 font-medium">오류 발생 가능 컴포넌트</h3>
      <p className="mb-4">아래 버튼을 클릭하면 오류가 발생합니다.</p>
      <button
        onClick={triggerError}
        className="rounded bg-yellow-100 px-3 py-1 text-yellow-700 hover:bg-yellow-200"
      >
        오류 발생시키기
      </button>
    </div>
  );
};

// API 에러 처리 예제 컴포넌트
const ApiErrorHandlingExample = () => {
  const { handleError } = useApiErrorHandler();

  // 실패할 것으로 예상되는 API 호출
  const { data, error, isLoading } = useQuery({
    queryKey: ['invalid-data'],
    queryFn: async () => {
      // 존재하지 않는 API 엔드포인트로 의도적인 404 에러 발생
      const response = await fetch('/api/invalid-endpoint');
      if (!response.ok) {
        throw new Error('API 호출 실패');
      }
      return response.json();
    },
  });

  // 에러가 발생하면 handleError 함수로 처리
  React.useEffect(() => {
    if (error) {
      handleError(error);
    }
  }, [error, handleError]);

  if (isLoading) return <div>로딩 중...</div>;

  return (
    <div className="rounded-md border p-4">
      <h3 className="mb-2 font-medium">API 에러 처리 예제</h3>
      <p>이 컴포넌트는 API 에러를 useApiErrorHandler를 통해 처리합니다.</p>
      {error ? (
        <p className="text-red-500">
          에러가 발생했지만 에러 핸들러로 처리되어 컴포넌트는 계속 렌더링됩니다.
        </p>
      ) : (
        <p>데이터: {JSON.stringify(data)}</p>
      )}
    </div>
  );
};

// 에러 바운더리 사용 예제 컴포넌트
const ErrorBoundaryExample = () => {
  return (
    <div className="mx-auto max-w-3xl p-6">
      <h2 className="mb-6 text-xl font-bold">
        에러 바운더리 및 에러 처리 예제
      </h2>

      <div className="grid gap-6">
        {/* 에러 바운더리로 감싼 컴포넌트 */}
        <div>
          <h3 className="mb-3 text-lg font-semibold">1. 에러 바운더리 예제</h3>
          <p className="mb-4 text-gray-600">
            이 컴포넌트는 에러 바운더리로 보호됩니다. 오류가 발생해도 전체 앱이
            중단되지 않습니다.
          </p>

          <AppErrorBoundary fallback={<ComponentErrorFallback />}>
            <ErrorProneComponent />
          </AppErrorBoundary>
        </div>

        {/* API 에러 처리 예제 */}
        <div>
          <h3 className="mb-3 text-lg font-semibold">2. API 에러 처리 예제</h3>
          <p className="mb-4 text-gray-600">
            이 컴포넌트는 API 에러를 useApiErrorHandler를 통해 처리합니다.
          </p>

          <ApiErrorHandlingExample />
        </div>
      </div>
    </div>
  );
};

export default ErrorBoundaryExample;
