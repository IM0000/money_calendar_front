// src/pages/SetPasswordPage.tsx
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { updateUserPassword } from '../api/services/UsersService';
import { login } from '../api/services/AuthService';

export default function SetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setConfirmPassword(e.target.value);
  };

  const handleSetPassword = async () => {
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log(email);
      // 비밀번호 설정 API 호출
      const pwRes = await updateUserPassword({ email, password });
      if (pwRes.data?.message === 'success') {
        alert('비밀번호가 설정되었습니다.');
      } else {
        throw Error();
      }

      const response = await login({ email, password });
      if (response.data?.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        navigate('/');
      } else {
        navigate('/login');
      }
    } catch (err: unknown) {
      alert('비밀번호 설정에 실패했습니다.');
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-6">
      <Logo
        width="44px"
        height="44px"
        divClassName="mb-6 text-black"
        spanClassName="text-4xl font-jua font-bold pt-2"
      />
      <div className="mb-8 w-full max-w-md">
        <h2 className="text-2xl font-bold">비밀번호 설정</h2>
        <p className="mt-2 text-sm">새로운 비밀번호를 설정하세요.</p>
        {error && <p className="mt-2 text-red-500">{error}</p>}
        <div className="mt-6">
          <input
            type="password"
            placeholder="새 비밀번호"
            value={password}
            onChange={handlePasswordChange}
            className="w-full rounded border border-gray-300 p-2 text-black"
          />
        </div>
        <div className="mt-2">
          <input
            type="password"
            placeholder="비밀번호 확인"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            className="w-full rounded border border-gray-300 p-2 text-black"
          />
        </div>
        {password !== confirmPassword && confirmPassword && (
          <p className="mt-1 text-sm text-red-500">
            비밀번호가 일치하지 않습니다.
          </p>
        )}
        <button
          onClick={handleSetPassword}
          className="mt-4 w-full rounded bg-blue-400 px-4 py-2 text-white hover:bg-blue-500"
        >
          {loading ? '설정 중...' : '비밀번호 설정'}
        </button>
      </div>

      <div className="mt-8 text-center text-xs">
        <span className="mr-2 cursor-pointer text-gray-400 hover:underline">
          이용약관
        </span>
        <span className="cursor-pointer text-gray-400 hover:underline">
          개인정보처리방침
        </span>
      </div>
    </div>
  );
}
