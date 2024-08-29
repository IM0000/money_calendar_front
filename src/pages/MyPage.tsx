import React, { useState } from 'react';
import Tippy from '@tippyjs/react';
import { FaDollarSign, FaChartLine } from 'react-icons/fa';
import { AiOutlineMinusCircle, AiOutlinePlus } from 'react-icons/ai';
import { FaCheckCircle } from 'react-icons/fa';
import Layout from '../components/Layout/Layout';
import SearchInput from '../components/Search/SearchInput';
import {
  EconomicResult,
  EconomicResultItem,
} from '../components/Search/EconomicResultItem';
import {
  CompanyResult,
  CompanyResultItem,
} from '../components/Search/CompanyResultItem';
import googleLogo from '../assets/google/google-g-2015-logo-png-transparent.png';
import kakaoLogo from '../assets/kakao/kakao_logo.webp';
import appleLogo from '../assets/apple/apple-logo-bg.png';
import discordLogo from '../assets/discord/discord_logo.png';

type availableSNS = 'google' | 'apple' | 'kakao' | 'discord';

type LinkedAccount = {
  linked: boolean;
  email: string;
};

type LinkedAccounts = {
  [key in availableSNS]: LinkedAccount;
};

const BasicInfo = () => (
  <div className="mb-4 w-full rounded-lg bg-white p-4 shadow">
    <h3 className="mb-4 text-xl font-semibold">기본정보</h3>
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">이메일</label>
      <div className="mt-1 flex items-center justify-between rounded-md border-gray-300 p-2 shadow-sm">
        <div>example@example.com</div>
        <button className="ml-2 text-blue-500 hover:text-blue-700">수정</button>
      </div>
    </div>
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700">
        비밀번호
      </label>
      <div className="mt-1 flex items-center justify-between rounded-md border-gray-300 p-2 shadow-sm">
        <div>********</div>
        <button className="ml-2 text-blue-500 hover:text-blue-700">수정</button>
      </div>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">닉네임</label>
      <div className="mt-1 flex items-center justify-between rounded-md border-gray-300 p-2 shadow-sm">
        <div>닉네임</div>
        <button className="ml-2 text-blue-500 hover:text-blue-700">수정</button>
      </div>
    </div>
  </div>
);
const SNSAccountLink = () => {
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
    <div className="mb-4 w-full rounded-lg bg-white p-4 shadow">
      <h3 className="mb-4 text-xl font-semibold">SNS 계정 연동하기</h3>
      <div className="space-y-4">
        {Object.keys(linkedAccounts).map((provider) => (
          <div
            key={provider}
            className="flex items-center justify-between rounded-lg bg-gray-50 p-4 shadow-sm"
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
                className="h-6 w-6"
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
};

const DeleteAccount = () => (
  <div className="mb-4 w-full rounded-lg bg-white p-4 shadow">
    <div className="flex items-center justify-between">
      <h3 className="text-xl font-semibold">계정 삭제하기</h3>
      <button className="text-gray rounded border border-gray-200 px-2 py-1 text-sm font-semibold hover:bg-gray-200">
        회원 탈퇴
      </button>
    </div>
  </div>
);

export default function MyPage() {
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
    <Layout>
      <div className="container mx-auto flex flex-wrap items-start p-8">
        <div className="w-full pr-8 lg:w-1/3">
          <h2 className="mb-4 text-2xl font-bold">내 계정</h2>
          <BasicInfo />
          <SNSAccountLink />
          <DeleteAccount />
        </div>

        <div className="w-full border-gray-300 pl-8 lg:w-2/3 lg:border-l">
          <div className="w-full">
            <h3 className="mb-4 text-2xl font-bold">내 이벤트</h3>
            <div className="mb-4 w-full max-w-4xl">
              <SearchInput
                searchQuery={searchQuery}
                onSearchChange={handleSearchChange}
                onSearchSubmit={handleSearchSubmit}
              />
            </div>
            <div className="flex w-full max-w-4xl flex-col space-y-4">
              <div className="w-full overflow-y-auto rounded-lg border border-gray-300 p-4 shadow-md">
                <h3 className="mb-2 rounded bg-gray-200 p-2 text-lg font-semibold">
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
              <div className="w-full overflow-y-auto rounded-lg border border-gray-300 p-4 shadow-md">
                <h3 className="mb-2 rounded bg-gray-200 p-2 text-lg font-semibold">
                  기업
                </h3>
                {companyResults.map((result, index) => (
                  <CompanyResultItem key={index} result={result}>
                    <div className="flex space-x-2">
                      <Tippy
                        content={
                          result.isDividendAdded
                            ? '이미 추가됨'
                            : '배당일정 추가'
                        }
                      >
                        <button className="p-1">
                          <FaDollarSign
                            size={20}
                            className={`${result.isDividendAdded ? 'text-gray-300' : 'text-gray-500 hover:text-black'}`}
                          />
                        </button>
                      </Tippy>
                      <Tippy
                        content={
                          result.isPerformanceAdded
                            ? '이미 추가됨'
                            : '실적일정 추가'
                        }
                      >
                        <button className="p-1">
                          <FaChartLine
                            size={20}
                            className={`${result.isPerformanceAdded ? 'text-gray-300' : 'text-gray-500 hover:text-black'}`}
                          />
                        </button>
                      </Tippy>
                    </div>
                  </CompanyResultItem>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
