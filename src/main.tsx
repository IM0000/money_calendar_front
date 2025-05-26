import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './router.tsx';
import 'tippy.js/dist/tippy.css'; // Tippy.js 스타일 임포트
import './index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import toast, { ToastBar, Toaster } from 'react-hot-toast';
import {
  AppErrorBoundary,
  setupGlobalErrorHandlers,
} from './utils/errorHandler.ts';

// 전역 에러 핸들러 설정
setupGlobalErrorHandlers();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 10,
      refetchOnWindowFocus: false,
    },
  },
});

// 에러 발생 시 표시할 폴백 UI 컴포넌트
const ErrorFallback = () => (
  <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
    <h1 className="mb-4 text-2xl font-bold text-red-600">
      오류가 발생했습니다
    </h1>
    <p className="mb-6 text-gray-600">
      죄송합니다. 예상치 못한 오류가 발생했습니다.
    </p>
    <button
      onClick={() => (window.location.href = '/')}
      className="px-4 py-2 text-white transition-colors bg-blue-500 rounded-md hover:bg-blue-600"
    >
      홈으로 돌아가기
    </button>
  </div>
);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#fff',
          color: '#333',
          boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)',
          padding: '16px',
          borderRadius: '8px',
        },
        success: {
          iconTheme: {
            primary: '#10b981',
            secondary: '#fff',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
        },
      }}
    >
      {(t) => {
        return (
          <div className="cursor-pointer" onClick={() => toast.dismiss(t.id)}>
            <ToastBar toast={t} />
          </div>
        );
      }}
    </Toaster>
    <AppErrorBoundary fallback={<ErrorFallback />}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </AppErrorBoundary>
    ,
  </>,
);
