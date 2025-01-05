// src/pages/AuthError.tsx
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function AuthError() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const message =
      params.get('message') || '인증 과정에서 오류가 발생했습니다.';

    // 사용자에게 에러 메시지를 표시하거나, 상태 관리 라이브러리를 통해 처리할 수 있습니다.
    alert(message);

    // 로그인 페이지로 이동
    navigate('/login');
  }, [location, navigate]);

  return null;
}
