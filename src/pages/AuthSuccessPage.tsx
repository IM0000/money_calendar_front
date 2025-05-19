// src/pages/AuthSuccess.tsx
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function AuthSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash || window.location.hash;
    const [, fragment] = hash.split('#');
    const params = new URLSearchParams(fragment);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('accessToken', token);

      window.history.replaceState(
        null,
        '',
        window.location.pathname + window.location.search,
      );

      navigate('/', { replace: true });
    } else {
      navigate('/login', { replace: true });
    }
  }, [location, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>로그인 중입니다...</p>
    </div>
  );
}
