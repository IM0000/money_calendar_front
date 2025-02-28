// src/pages/AuthSuccess.tsx
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function AuthSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // URL에서 토큰 추출
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      // 토큰 저장
      localStorage.setItem('accessToken', token);
      // 필요한 경우 사용자 상태 업데이트 (예: Context API, Redux 등)
      // 예: setUserAuthenticated(true);
      // 메인 페이지로 이동
      navigate('/');
    } else {
      // 토큰이 없으면 로그인 페이지로 이동
      navigate('/login');
    }
  }, [location, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>로그인 중입니다...</p>
    </div>
  );
}
