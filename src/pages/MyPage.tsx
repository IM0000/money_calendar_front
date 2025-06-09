import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import { useAuthStore } from '../zustand/useAuthStore';

// 분리된 컴포넌트 임포트
import BasicInfo from '../components/MyPageAccount/BasicInfo';
import ChangePassword from '../components/MyPageAccount/ChangePassword';
import AccountLink from '../components/MyPageAccount/AccountLink';
import DeleteAccount from '../components/MyPageAccount/DeleteAccount';
import toast from 'react-hot-toast';

export default function MyPage() {
  const { user, logout, fetchUserProfile } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  // URL에서 성공 또는 오류 메시지 파라미터 확인
  useEffect(() => {
    const hash = location.hash.startsWith('#')
      ? location.hash.slice(1)
      : location.hash;
    const queryParams = new URLSearchParams(hash);

    const message = queryParams.get('message');
    const errorParam = queryParams.get('errorMessage');
    const hasError = queryParams.get('errorCode') !== null;

    if (message) {
      toast.success(decodeURIComponent(message), {
        duration: 5000,
      });
      navigate('/mypage', { replace: true });
    }

    if (hasError && errorParam) {
      toast.error(decodeURIComponent(errorParam), {
        duration: 5000,
      });
      navigate('/mypage', { replace: true });
    }
  }, [location.hash]);

  // 로그아웃 처리
  const handleLogout = () => {
    if (confirm('로그아웃할까요?')) {
      logout();
      navigate('/login');
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const loadProfile = async () => {
      setIsLoading(true);
      try {
        await fetchUserProfile();
      } catch (err) {
        toast.error('프로필 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, [user]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-600">프로필 정보를 불러오는 중...</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6 md:flex-row">
            {/* ============ 왼쪽 사이드 메뉴 (모바일에서는 상단에 표시) ============ */}
            <aside className="mb-6 w-full self-start md:sticky md:top-16 md:mb-0 md:w-64 lg:w-72">
              <div className="rounded-lg bg-white p-6 shadow">
                <h2 className="mb-4 border-b border-gray-200 pb-2 text-xl font-bold text-gray-800">
                  계정 설정
                </h2>
                <nav className="flex flex-col space-y-2">
                  <button className="rounded-md bg-blue-50 p-3 text-left font-medium text-blue-700 transition-colors hover:bg-blue-100">
                    계정관리
                  </button>
                  <button
                    onClick={handleLogout}
                    className="rounded-md p-3 text-left text-gray-700 transition-colors hover:bg-gray-100"
                  >
                    로그아웃
                  </button>
                </nav>
              </div>
            </aside>

            {/* ============ 오른쪽 메인 컨텐츠 ============ */}
            <main className="max-w-3xl flex-1">
              <div className="space-y-6">
                <BasicInfo user={user} />
                <ChangePassword />
                <AccountLink />
                <DeleteAccount />
              </div>
            </main>
          </div>
        )}
      </div>
    </Layout>
  );
}
