import { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isCodeSent, setIsCodeSent] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleVerificationCodeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setVerificationCode(e.target.value);
  };

  const handleSendCode = () => {
    // 이메일로 코드 전송 로직
    setIsCodeSent(true);
  };

  const handleVerifyCode = () => {
    // 코드 검증 로직(이메일 검증)
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
        <h2 className="text-2xl font-bold">회원가입</h2>
        <p className="mt-2 text-sm">
          경제정보를 한눈에 확인할 수 있는 머니캘린더에 오신 것을 환영합니다.
          <br />
          손쉽게 금융 정보를 관리하세요.
        </p>
        {!isCodeSent ? (
          <>
            <div className="mt-6">
              <input
                type="email"
                placeholder="이메일 주소"
                value={email}
                onChange={handleEmailChange}
                className="w-full rounded border border-gray-300 p-2 text-black"
              />
            </div>
            <button
              onClick={handleSendCode}
              className="mt-4 w-full rounded bg-blue-400 px-4 py-2 text-white hover:bg-blue-500"
            >
              계속하기
            </button>
          </>
        ) : (
          <>
            <p className="mt-6 text-sm">
              {email}로 4자리 코드를 보냈습니다. 코드를 입력하고 이메일을
              인증하세요.
            </p>
            <div className="mt-2">
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                className="w-full rounded border border-gray-300 p-2 text-black"
                disabled
              />
            </div>
            <div className="mt-2">
              <input
                type="text"
                placeholder="인증 코드"
                value={verificationCode}
                onChange={handleVerificationCodeChange}
                className="w-full rounded border border-gray-300 p-2 text-black"
              />
            </div>
            <div className="mt-2 text-right">
              <button
                onClick={handleSendCode}
                className="text-sm text-blue-400 hover:underline"
              >
                코드 재전송하기
              </button>
            </div>
            <button
              onClick={handleVerifyCode}
              className="mt-4 w-full rounded bg-blue-400 px-4 py-2 text-white hover:bg-blue-500"
            >
              계속하기
            </button>
          </>
        )}
        <p className="mt-4 text-sm">
          이미 계정이 있으신가요?{' '}
          <Link to="/login" className="text-blue-400 hover:underline">
            로그인
          </Link>
        </p>
      </div>
      <div className="mt-8 text-center text-xs">
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
