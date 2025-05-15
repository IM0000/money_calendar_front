// src/pages/SignupPage.tsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import OAuthLoginButton from '../components/OAuthLoginButton';
import googleLogo from '../assets/google/google-g-2015-logo-png-transparent.png';
import kakaoLogo from '../assets/kakao/kakao_logo.webp';
import discordLogo from '../assets/discord/discord_logo.png';
import {
  handleDiscordLogin,
  handleGoogleLogin,
  handleKakaoLogin,
} from './LoginPage';
import { ApiResponse } from '../types/api-response';
import { register } from '../api/services/authService';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [error, setError] = useState<string | null>(null); // 오류 메시지
  const navigate = useNavigate();

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSendCode = async () => {
    // 이메일 형식 유효성 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('유효한 이메일 주소를 입력해주세요.');
      return;
    }

    setLoading(true); // 로딩 시작
    setError(null); // 기존 오류 메시지 초기화

    // 이메일로 코드 전송 로직
    try {
      const res: ApiResponse<{ token: string; message: string }> =
        await register({ email }); // RegisterDto 사용

      // 인증 코드 전송 성공 시 EmailVerifyPage로 이동
      const emailToken: string = res.data?.token || '';
      localStorage.setItem('moneyCalendarEmailToken', emailToken);
      navigate('/email-verify');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || '인증 코드 전송에 실패했습니다.');
      } else {
        setError('인증 코드 전송에 실패했습니다.');
      }
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-white">
      <Logo height="55px" divClassName="mb-6 text-black" />
      <div className="w-full max-w-md mb-8">
        <h2 className="text-2xl font-bold">회원가입</h2>
        <p className="mt-2 text-sm">
          경제정보를 한눈에 확인할 수 있는 머니캘린더에 오신 것을 환영합니다.
          <br />
          손쉽게 금융 정보를 받으세요.
        </p>
        <div className="mt-6">
          <input
            type="email"
            placeholder="이메일 주소"
            value={email}
            onChange={handleEmailChange}
            className="w-full p-2 text-black border border-gray-300 rounded"
          />
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-500">{error}</p> // 오류 메시지 표시
        )}
        <button
          onClick={handleSendCode}
          className="w-full px-4 py-2 mt-4 text-white bg-blue-400 rounded hover:bg-blue-500"
        >
          {loading ? '전송 중...' : '계속하기'}{' '}
          {/* 로딩 상태에 따른 버튼 텍스트 변경 */}
        </button>
        <p className="mt-4 text-sm">
          이미 계정이 있으신가요?{' '}
          <Link to="/login" className="text-blue-400 hover:underline">
            로그인
          </Link>
        </p>
      </div>
      <div className="flex items-center w-64 my-4">
        <hr className="flex-grow border-gray-300" />
        <span className="mx-2 text-gray-500">OR</span>
        <hr className="flex-grow border-gray-300" />
      </div>
      <div className="flex justify-around w-64 mb-8">
        {/* <OAuthLoginButton
          provider="애플"
          logo={appleLogo}
          onClick={handleAppleLogin}
        /> */}
        <OAuthLoginButton
          provider="구글"
          logo={googleLogo}
          onClick={handleGoogleLogin}
        />
        <OAuthLoginButton
          provider="카카오"
          logo={kakaoLogo}
          onClick={handleKakaoLogin}
        />
        <OAuthLoginButton
          provider="디스코드"
          logo={discordLogo}
          onClick={handleDiscordLogin}
        />
      </div>

      <div className="mt-8 text-xs text-center">
        <Link to="/terms" className="mr-2 text-gray-400 hover:underline">
          이용약관
        </Link>
        <Link to="/privacy" className="text-gray-400 hover:underline">
          개인정보처리방침
        </Link>
      </div>
    </div>
  );
}
