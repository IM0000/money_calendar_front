import React, { useState } from 'react';
import Tippy from '@tippyjs/react';
import { FaDollarSign, FaChartLine } from 'react-icons/fa';
import { AiOutlineMinusCircle, AiOutlinePlus } from 'react-icons/ai';
import { FaCheckCircle } from 'react-icons/fa';
import Layout from '../components/Layout/Layout';
import SearchInput from '../components/Search/SearchInput';

import googleLogo from '../assets/google/google-g-2015-logo-png-transparent.png';
import kakaoLogo from '../assets/kakao/kakao_logo.webp';
import appleLogo from '../assets/apple/apple-logo-bg.png';
import discordLogo from '../assets/discord/discord_logo.png';

import { useAuthStore } from '../zustand/useAuthStore';
import { UserDto } from '../types/UsersTypes';

/* ==============================
  1) 계정관리 관련 컴포넌트
============================== */
type availableSNS = 'google' | 'apple' | 'kakao' | 'discord';

type LinkedAccount = {
  linked: boolean;
  email: string;
};

type LinkedAccounts = {
  [key in availableSNS]: LinkedAccount;
};

function BasicInfo({ user }: { user: UserDto | null }) {
  console.log(user);
  return (
    <div className="w-full p-6 mb-6 bg-white rounded-lg shadow-md">
      <div className="pb-4 mb-4 border-b border-gray-300">
        <label className="block text-sm font-medium text-gray-600">
          이메일
        </label>
        <div className="flex items-center justify-between mt-2">
          <div className="font-semibold text-gray-800">
            {user?.email || '이메일 없음'}
          </div>
        </div>
      </div>
      <div className="pb-4 mb-4 border-b border-gray-300">
        <label className="block text-sm font-medium text-gray-600">
          닉네임
        </label>
        <div className="flex items-center justify-between mt-2">
          <div className="font-semibold text-gray-800">
            {user?.nickname || '닉네임 없음'}
          </div>
          <button className="text-sm font-semibold text-blue-500 transition hover:text-blue-700">
            수정
          </button>
        </div>
      </div>
      <div>
        <button className="w-full px-4 py-3 mt-4 text-sm font-semibold text-center text-white transition bg-blue-500 rounded-md shadow-md hover:bg-blue-600">
          비밀번호 변경하기
        </button>
      </div>
    </div>
  );
}

function SNSAccountLink() {
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccounts>({
    google: { linked: true, email: 'imsang0000@gmail.com' },
    apple: { linked: false, email: '' },
    kakao: { linked: false, email: '' },
    discord: { linked: false, email: '' },
  });

  const toggleLink = (provider: availableSNS) => {
    setLinkedAccounts((prevState: LinkedAccounts) => ({
      ...prevState,
      [provider]: {
        linked: !prevState[provider].linked,
        email: prevState[provider].linked ? '' : 'imsang0000@gmail.com',
      },
    }));
  };

  return (
    <div className="w-full p-4 mb-4 bg-white rounded-lg shadow">
      <h3 className="mb-4 text-xl font-semibold">SNS 계정 연동하기</h3>
      <div className="space-y-4">
        {Object.keys(linkedAccounts).map((provider) => (
          <div
            key={provider}
            className="flex items-center justify-between p-4 rounded-lg shadow-sm bg-gray-50"
          >
            <div className="flex items-center">
              <img
                src={
                  provider === 'google'
                    ? googleLogo
                    : provider === 'apple'
                      ? appleLogo
                      : provider === 'kakao'
                        ? kakaoLogo
                        : discordLogo
                }
                alt={provider}
                className="w-6 h-6"
              />
              <span className="ml-3">
                {provider.charAt(0).toUpperCase() + provider.slice(1)}
              </span>
            </div>
            <div className="flex flex-col items-end">
              {linkedAccounts[provider as availableSNS].linked ? (
                <>
                  <div className="flex items-center">
                    <FaCheckCircle className="mr-2 text-green-500" />
                    <span className="text-gray-700">로그인되었습니다.</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    {linkedAccounts[provider as availableSNS].email}
                  </span>
                </>
              ) : (
                <button
                  className="text-blue-500 hover:text-blue-700"
                  onClick={() => toggleLink(provider as availableSNS)}
                >
                  <AiOutlinePlus size={20} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DeleteAccount() {
  return (
    <div className="w-full p-4 mb-4 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">계정 삭제하기</h3>
        <button className="px-2 py-1 text-sm font-semibold border border-gray-200 rounded text-gray hover:bg-gray-200">
          회원 탈퇴
        </button>
      </div>
    </div>
  );
}

/* ==============================
  2) 알림(알림 히스토리) 컴포넌트
============================== */
function NotificationHistory() {
  // 실제 알림 목록을 받아와서 렌더링하는 로직을 구현하시면 됩니다.
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="mb-2 text-xl font-semibold">알림 히스토리</h3>
      <p className="text-gray-600">알림 기록이 여기에 표시됩니다.</p>
    </div>
  );
}

/* ==============================
  3) 내 이벤트 컴포넌트
============================== */
export type EconomicResult = {
  country: string;
  importance: number;
  eventName: string;
  isAdded: boolean;
};

export type CompanyResult = {
  ticker: string;
  name: string;
  isDividendAdded: boolean;
  isPerformanceAdded: boolean;
};

function EconomicResultItem({
  result,
  children,
}: {
  result: EconomicResult;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between px-2 py-1 mb-1 bg-white border rounded">
      <div>
        <span className="mr-2 text-sm text-gray-600">{result.country}</span>
        <span className="mr-2 text-sm text-gray-600">
          중요도: {result.importance}
        </span>
        <span className="text-sm font-medium">{result.eventName}</span>
      </div>
      {children}
    </div>
  );
}

function CompanyResultItem({
  result,
  children,
}: {
  result: CompanyResult;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between px-2 py-1 mb-1 bg-white border rounded">
      <div>
        <span className="mr-2 text-sm font-semibold">{result.ticker}</span>
        <span className="text-sm text-gray-700">{result.name}</span>
      </div>
      {children}
    </div>
  );
}

function MyEvents() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [economicResults, setEconomicResults] = useState<EconomicResult[]>([
    {
      country: '영국',
      importance: 3,
      eventName: '월간 영국 국내총생산(GDP)',
      isAdded: true,
    },
    {
      country: '호주',
      importance: 2,
      eventName: '호주 국내총생산(GDP) <전분기 대비>',
      isAdded: true,
    },
  ]);

  const [companyResults, setCompanyResults] = useState<CompanyResult[]>([
    {
      ticker: 'AAPL',
      name: 'Apple Inc.',
      isDividendAdded: true,
      isPerformanceAdded: false,
    },
    {
      ticker: 'MSFT',
      name: 'Microsoft Corp.',
      isDividendAdded: false,
      isPerformanceAdded: true,
    },
  ]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // 검색 기능 추가
  };

  const handleDeleteEconomicResult = (index: number) => {
    setEconomicResults((prevResults) =>
      prevResults.filter((_, i) => i !== index),
    );
  };

  const handleDeleteCompanyResult = (index: number) => {
    setCompanyResults((prevResults) =>
      prevResults.filter((_, i) => i !== index),
    );
  };

  return (
    <div>
      <h3 className="mb-4 text-2xl font-bold">내 이벤트</h3>
      <form onSubmit={handleSearchSubmit} className="w-full max-w-4xl mb-4">
        <SearchInput
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onSearchSubmit={handleSearchSubmit}
        />
      </form>

      <div className="flex flex-col w-full max-w-4xl space-y-4">
        {/* 경제지표 */}
        <div className="w-full p-4 overflow-y-auto border border-gray-300 rounded-lg shadow-md">
          <h3 className="p-2 mb-2 text-lg font-semibold bg-gray-200 rounded">
            경제지표
          </h3>
          {economicResults.map((result, index) => (
            <EconomicResultItem key={index} result={result}>
              <button
                className="p-1"
                onClick={() => handleDeleteEconomicResult(index)}
              >
                <AiOutlineMinusCircle
                  size={20}
                  className="text-gray-500 hover:text-black"
                />
              </button>
            </EconomicResultItem>
          ))}
        </div>

        {/* 기업 */}
        <div className="w-full p-4 overflow-y-auto border border-gray-300 rounded-lg shadow-md">
          <h3 className="p-2 mb-2 text-lg font-semibold bg-gray-200 rounded">
            기업
          </h3>
          {companyResults.map((result, index) => (
            <CompanyResultItem key={index} result={result}>
              <div className="flex space-x-2">
                <Tippy
                  content={
                    result.isDividendAdded ? '이미 추가됨' : '배당일정 추가'
                  }
                >
                  <button className="p-1">
                    <FaDollarSign
                      size={20}
                      className={`${
                        result.isDividendAdded
                          ? 'text-gray-300'
                          : 'text-gray-500 hover:text-black'
                      }`}
                    />
                  </button>
                </Tippy>
                <Tippy
                  content={
                    result.isPerformanceAdded ? '이미 추가됨' : '실적일정 추가'
                  }
                >
                  <button className="p-1">
                    <FaChartLine
                      size={20}
                      className={`${
                        result.isPerformanceAdded
                          ? 'text-gray-300'
                          : 'text-gray-500 hover:text-black'
                      }`}
                    />
                  </button>
                </Tippy>
                {/* 삭제 버튼 */}
                <button
                  className="p-1"
                  onClick={() => handleDeleteCompanyResult(index)}
                >
                  <AiOutlineMinusCircle
                    size={20}
                    className="text-gray-500 hover:text-black"
                  />
                </button>
              </div>
            </CompanyResultItem>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ==============================
  최종 MyPage 컴포넌트
============================== */
export default function MyPage() {
  const { user, logout } = useAuthStore();

  // 'account' | 'notifications' | 'myEvents' 중 하나
  const [selectedMenu, setSelectedMenu] = useState<
    'account' | 'notifications' | 'myEvents'
  >('account');

  // 로그아웃 처리
  const handleLogout = () => {
    if (confirm('로그아웃할까요?')) {
      logout();
    }
    // 라우터가 있다면 다음처럼 처리할 수도 있음:
    // router.push('/login');
  };

  return (
    <Layout>
      <div className="container flex p-8 mx-auto">
        {/* ============ 왼쪽 사이드 메뉴 ============ */}
        <aside className="w-64 mr-8">
          <nav className="flex flex-col space-y-2">
            <button
              onClick={() => setSelectedMenu('account')}
              className={`rounded p-2 text-left ${
                selectedMenu === 'account'
                  ? 'bg-gray-200 font-bold'
                  : 'hover:bg-gray-100'
              }`}
            >
              계정관리
            </button>
            <button
              onClick={() => setSelectedMenu('notifications')}
              className={`rounded p-2 text-left ${
                selectedMenu === 'notifications'
                  ? 'bg-gray-200 font-bold'
                  : 'hover:bg-gray-100'
              }`}
            >
              알림 히스토리
            </button>
            <button
              onClick={() => setSelectedMenu('myEvents')}
              className={`rounded p-2 text-left ${
                selectedMenu === 'myEvents'
                  ? 'bg-gray-200 font-bold'
                  : 'hover:bg-gray-100'
              }`}
            >
              내 이벤트
            </button>
            <button
              onClick={handleLogout}
              className="p-2 text-left rounded hover:bg-gray-100"
            >
              로그아웃
            </button>
          </nav>
        </aside>

        {/* ============ 오른쪽 메인 컨텐츠 ============ */}
        <main className="flex-1">
          {selectedMenu === 'account' && (
            <>
              <BasicInfo user={user} />
              <SNSAccountLink />
              <DeleteAccount />
            </>
          )}

          {selectedMenu === 'notifications' && <NotificationHistory />}

          {selectedMenu === 'myEvents' && <MyEvents />}
        </main>
      </div>
    </Layout>
  );
}
