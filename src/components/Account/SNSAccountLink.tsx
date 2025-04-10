import React, { useState } from 'react';
import { FaCheckCircle, FaTimes } from 'react-icons/fa';

import googleLogo from '../../assets/google/google-g-2015-logo-png-transparent.png';
import kakaoLogo from '../../assets/kakao/kakao_logo.webp';
import appleLogo from '../../assets/apple/apple-logo-bg.png';
import discordLogo from '../../assets/discord/discord_logo.png';

type availableSNS = 'google' | 'apple' | 'kakao' | 'discord';

type LinkedAccount = {
  linked: boolean;
  email: string;
};

type LinkedAccounts = {
  [key in availableSNS]: LinkedAccount;
};

// SNS 연동 버튼의 스타일 설정
const providerLogos = {
  google: googleLogo,
  apple: appleLogo,
  kakao: kakaoLogo,
  discord: discordLogo,
};

const SNSAccountLink: React.FC = () => {
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccounts>({
    google: { linked: true, email: 'imsang0000@gmail.com' },
    apple: { linked: false, email: '' },
    kakao: { linked: false, email: '' },
    discord: { linked: false, email: '' },
  });

  const toggleLink = (provider: availableSNS) => {
    // 연동 해제하는 경우
    if (linkedAccounts[provider].linked) {
      if (window.confirm(`${provider} 계정 연동을 해제하시겠습니까?`)) {
        // SNS 연동 해제 API 호출 로직
        setLinkedAccounts((prevState: LinkedAccounts) => ({
          ...prevState,
          [provider]: {
            linked: false,
            email: '',
          },
        }));
      }
    }
    // 연동하는 경우
    else {
      // SNS 연동 API 호출 로직 (OAuth)
      // 실제로는 OAuth 리다이렉트 등의 과정이 필요합니다

      // 임시로 연동 성공하는 것으로 처리
      setLinkedAccounts((prevState: LinkedAccounts) => ({
        ...prevState,
        [provider]: {
          linked: true,
          email: 'imsang0000@gmail.com',
        },
      }));
    }
  };

  const getProviderName = (provider: string): string => {
    switch (provider) {
      case 'google':
        return 'Google';
      case 'apple':
        return 'Apple';
      case 'kakao':
        return 'Kakao';
      case 'discord':
        return 'Discord';
      default:
        return provider;
    }
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h3 className="mb-6 border-b border-gray-200 pb-2 text-xl font-bold text-gray-800">
        SNS 계정 연동
      </h3>

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
        {Object.keys(linkedAccounts).map((provider) => {
          const providerKey = provider as availableSNS;
          const isLinked = linkedAccounts[providerKey].linked;

          return (
            <div
              key={provider}
              className="flex flex-col overflow-hidden rounded-lg border border-gray-200 transition-all hover:shadow-md"
            >
              <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-3">
                <div className="flex items-center space-x-3">
                  <img
                    src={providerLogos[providerKey]}
                    alt={provider}
                    className="h-5 w-5 object-contain"
                  />
                  <span className="font-medium text-gray-700">
                    {getProviderName(provider)}
                  </span>
                </div>

                {isLinked && (
                  <div className="flex items-center text-green-500">
                    <FaCheckCircle className="mr-1" size={14} />
                    <span className="text-xs font-medium">연결됨</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-start justify-between px-4 py-4 sm:flex-row sm:items-center">
                {isLinked ? (
                  <div className="mb-2 text-sm text-gray-500 sm:mb-0">
                    {linkedAccounts[providerKey].email}
                  </div>
                ) : (
                  <div className="mb-2 text-sm text-gray-500 sm:mb-0">
                    연결되지 않음
                  </div>
                )}

                <button
                  onClick={() => toggleLink(providerKey)}
                  className={`rounded-md px-3 py-2 text-xs font-medium transition-colors ${
                    isLinked
                      ? 'border border-red-200 bg-red-50 text-red-600 hover:bg-red-100'
                      : 'border border-blue-200 bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isLinked ? (
                    <span className="flex items-center">
                      <FaTimes className="mr-1" />
                      연동 해제
                    </span>
                  ) : (
                    '연동하기'
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SNSAccountLink;
