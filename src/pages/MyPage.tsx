import React from 'react';
import Layout from '../components/Layout/Layout';
import { useAuthStore } from '../zustand/useAuthStore';

// 분리된 컴포넌트 임포트
import BasicInfo from '../components/Account/BasicInfo';
import ChangePassword from '../components/Account/ChangePassword';
import SNSAccountLink from '../components/Account/SNSAccountLink';
import DeleteAccount from '../components/Account/DeleteAccount';

export default function MyPage() {
  const { user, logout } = useAuthStore();

  // 로그아웃 처리
  const handleLogout = () => {
    if (confirm('로그아웃할까요?')) {
      logout();
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6 md:flex-row">
          {/* ============ 왼쪽 사이드 메뉴 (모바일에서는 상단에 표시) ============ */}
          <aside className="mb-6 w-full self-start md:sticky md:top-6 md:mb-0 md:w-64 lg:w-72">
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
              <SNSAccountLink />
              <DeleteAccount />
            </div>
          </main>
        </div>
      </div>
    </Layout>
  );
}
