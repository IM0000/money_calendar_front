import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../zustand/useAuthStore';

export default function AuthSuccess() {
  const navigate = useNavigate();
  const { checkAuth, isAuthenticated } = useAuthStore();

  useEffect(() => {
    (async () => {
      try {
        await checkAuth();
        if (isAuthenticated) {
          navigate('/', { replace: true });
        } else {
          navigate('/login', { replace: true });
        }
      } catch {
        navigate('/login', { replace: true });
      }
    })();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>로그인 처리 중입니다...</p>
    </div>
  );
}
