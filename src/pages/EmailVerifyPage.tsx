// src/pages/EmailVerifyPage.tsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import {
  getEmailFromToken,
  register,
  verify,
} from '../api/services/AuthService';
import { AxiosError } from 'axios';

export default function EmailVerifyPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('moneyCalendarEmailToken');
    const fetchEmail = async () => {
      if (token) {
        try {
          const response = await getEmailFromToken(token);
          if (response.data) {
            setEmail(response.data.email);
          }
        } catch (err: unknown) {
          alert('이메일을 가져오는 데 실패했습니다.');
          navigate('/sign-up');
        }
      } else {
        alert('유효한 토큰이 없습니다.');
        navigate('/sign-up');
      }
    };

    fetchEmail();
  }, [navigate]);

  const handleVerificationCodeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setVerificationCode(e.target.value);
  };

  const handleVerifyCode = async () => {
    // 코드 검증 로직(이메일 검증)
    try {
      const response = await verify({ email, code: verificationCode });
      console.log(response);
      if (response.data?.verified) {
        // 인증 완료된 경우
        alert(
          '인증 성공!\r\n회원가입이 완료되었습니다. 비밀번호를 설정해주세요.',
        );
        navigate('/users/password', {
          state: { email: response.data?.email },
        });
      } else {
        setError(response.errorMessage);
        // alert(response.errorMessage);
        // navigate('/sign-up');
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response?.data) {
        const { errorCode, errorMessage, data } = error.response.data;
        console.log(errorCode && errorMessage);
        if (errorCode && errorMessage) {
          console.error('Error Code:', errorCode);
          console.error('Error Message:', errorMessage);
          setError(errorMessage);

          if (errorCode === 'CONFLICT_001') {
            if (data.password === null) {
              alert('이미 등록된 이메일입니다. 비밀번호를 설정해주세요.');
              navigate('/users/password', {
                state: { email: data?.email },
              });
            } else {
              alert('이미 등록된 이메일입니다. 로그인해주세요.');
              navigate('/login');
            }
          }
        }
      } else {
        console.error('기타 에러:', error);
      }
    }
    // 검증 성공 시 회원가입 완료 페이지로 이동하거나 다른 로직 수행
    console.log(`Verifying code ${verificationCode} for email ${email}`);
    // 예시: navigate('/signup-complete');
  };

  const handleResendCode = async () => {
    // 코드 재전송 로직
    setLoading(true);
    setError(null);
    try {
      // 처음 이메일 등록하는거랑 재전송하는거랑 코드 동일함
      await register({ email });
      alert('인증 코드가 재전송되었습니다.');
    } catch (err: unknown) {
      setError('인증 코드 재전송에 실패했습니다.');
    } finally {
      setLoading(false);
    }
    console.log(`Resending code to email ${email}`);
    // 예: API 호출 후 성공 시
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-white">
      <Logo
        width="44px"
        height="44px"
        divClassName="mb-6 text-black"
        spanClassName="text-4xl font-jua font-bold pt-2"
      />
      <div className="w-full max-w-md mb-8">
        <h2 className="text-2xl font-bold">이메일 인증</h2>
        <p className="mt-2 text-sm">
          {email}로 4자리 코드를 보냈습니다. 코드를 입력하고 이메일을
          인증하세요.
        </p>
        <div className="mt-6">
          <input
            type="email"
            value={email}
            onChange={() => {}}
            className="w-full p-2 text-black border border-gray-300 rounded"
            disabled
          />
        </div>
        <div className="mt-2">
          <input
            type="text"
            placeholder="인증 코드"
            value={verificationCode}
            onChange={handleVerificationCodeChange}
            className="w-full p-2 text-black border border-gray-300 rounded"
          />
        </div>
        <div className="flex items-center justify-between mt-2">
          {error && <p className="text-red-500">{error}</p>}
          <button
            onClick={handleResendCode}
            className="text-sm text-blue-400 hover:underline"
          >
            코드 재전송하기
          </button>
        </div>
        <button
          onClick={handleVerifyCode}
          className="w-full px-4 py-2 mt-4 text-white bg-blue-400 rounded hover:bg-blue-500"
        >
          {loading ? '인증 중...' : '계속하기'}
        </button>
        <p className="mt-4 text-sm">
          이미 계정이 있으신가요?{' '}
          <Link to="/login" className="text-blue-400 hover:underline">
            로그인
          </Link>
        </p>
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
