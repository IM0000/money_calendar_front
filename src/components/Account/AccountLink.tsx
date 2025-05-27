import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimes } from 'react-icons/fa';
import { disconnectOAuthAccount } from '../../api/services/userService';
import { useAuthStore } from '../../zustand/useAuthStore';
import { OAuthConnection } from '../../types/users-types';

import googleLogo from '../../assets/google/google-g-2015-logo-png-transparent.png';
import kakaoLogo from '../../assets/kakao/kakao_logo.webp';
import appleLogo from '../../assets/apple/apple-logo-bg.png';
import discordLogo from '../../assets/discord/discord_logo.png';
import { connectOAuthAccount } from '@/api/services/authService';

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

const AccountLink: React.FC = () => {
  const { user, userProfile } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccounts>({
    google: { linked: false, email: '' },
    apple: { linked: false, email: '' },
    kakao: { linked: false, email: '' },
    discord: { linked: false, email: '' },
  });
  const [error, setError] = useState('');

  // 컴포넌트 마운트 시 OAuth 연동 상태 userProfile에서 추출
  useEffect(() => {
    if (!userProfile) return;
    if (!user) return;

    const { oauthConnections } = userProfile;
    if (!oauthConnections) return;

    const updatedAccounts = { ...linkedAccounts };
    oauthConnections.forEach((connection: OAuthConnection) => {
      const { provider, connected, oauthEmail } = connection;
      if (provider in updatedAccounts) {
        const key = provider as availableSNS;
        updatedAccounts[key] = {
          linked: connected,
          email: oauthEmail || user.email || '',
        };
      }
    });
    setLinkedAccounts(updatedAccounts);
  }, [userProfile, user]);

  const toggleLink = async (provider: availableSNS) => {
    if (provider === 'apple') {
      alert('준비 중입니다.');
      return;
    }
    // 연동 해제하는 경우
    if (linkedAccounts[provider].linked) {
      if (
        window.confirm(
          `${getProviderName(provider)} 계정 연동을 해제하시겠습니까?`,
        )
      ) {
        try {
          setIsLoading(true);
          await disconnectOAuthAccount(provider);

          // 성공적으로 연동 해제 후 상태 업데이트
          setLinkedAccounts((prevState) => ({
            ...prevState,
            [provider]: {
              linked: false,
              email: '',
            },
          }));
        } catch (error) {
          console.error(`${provider} 연동 해제 실패:`, error);
          setError(
            `${getProviderName(provider)} 계정 연동 해제에 실패했습니다.`,
          );
        } finally {
          setIsLoading(false);
        }
      }
    } else {
      // 연동하는 경우
      try {
        setIsLoading(true);
        const response = await connectOAuthAccount(provider);

        if (response && response.data && response.data.redirectUrl) {
          const { redirectUrl } = response.data;

          // OAuth 인증 페이지로 이동
          window.location.href = redirectUrl;
        } else {
          setError('OAuth 연동 URL을 가져오는 데 실패했습니다.');
        }
      } catch (error) {
        console.error(`${provider} 연동 실패:`, error);
        setError(`${getProviderName(provider)} 계정 연동에 실패했습니다.`);
      } finally {
        setIsLoading(false);
      }
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
        계정 연동
      </h3>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-red-700">
          <p>{error}</p>
        </div>
      )}

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
                  disabled={isLoading}
                >
                  {isLoading ? (
                    '처리 중...'
                  ) : isLinked ? (
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

export default AccountLink;
