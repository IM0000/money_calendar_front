import { useState } from 'react';
import Logo from '../components/Logo';
import { requestPasswordReset } from '../api/services/authService';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await requestPasswordReset(email);
      setMessage('이메일이 발송되었습니다.');
    } catch {
      setError('이메일 전송 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-6">
      <Logo height="55px" divClassName="mb-8 text-black" />
      <form
        onSubmit={handleSubmit}
        className="mb-8 flex w-80 flex-col items-center space-y-4"
      >
        <h2 className="text-xl font-bold">비밀번호 재설정 안내</h2>
        <p className="w-full text-center text-sm text-gray-600">
          계정과 연결된 이메일을 입력하시면 비밀번호 재설정을 위한 링크를
          보내드립니다.
        </p>
        <input
          type="email"
          placeholder="가입한 이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded border border-gray-300 p-2"
          required
        />
        {error && <div className="w-full text-sm text-red-600">{error}</div>}
        {message && (
          <div className="w-full text-sm text-green-600">{message}</div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full rounded bg-blue-400 px-4 py-2 text-white hover:bg-blue-500 disabled:opacity-50"
        >
          {loading ? '전송 중...' : '이메일 전송'}
        </button>
      </form>
    </div>
  );
}
