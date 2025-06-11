import React, { useState, useMemo } from 'react';
import { Button } from '@/components/UI/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card';
import { CountryFlag } from '@/components/CalendarTable/CountryFlag';
import { CompanySubscription } from '@/types/notification';
import { EmptyState } from './EmptyState';
import { Trash2 } from 'lucide-react';
import { Input } from '@/components/UI/input';

interface CompanySubscriptionsProps {
  isLoading: boolean;
  companySubscriptions: CompanySubscription[];
  onUnsubscribeCompany: (companyName: string, companyId: number) => void;
  isUnsubscribing: boolean;
}

const CompanySubscriptions: React.FC<CompanySubscriptionsProps> = ({
  isLoading,
  companySubscriptions = [],
  onUnsubscribeCompany,
  isUnsubscribing,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const sortedCompanies = useMemo(() => {
    return [...companySubscriptions].sort(
      (a, b) =>
        new Date(b.subscribedAt || 0).getTime() -
        new Date(a.subscribedAt || 0).getTime(),
    );
  }, [companySubscriptions]);

  const filteredItems = useMemo(() => {
    if (!searchTerm) return sortedCompanies;
    const lowerSearchTerm = searchTerm.toLowerCase();
    return sortedCompanies.filter(
      (item) =>
        item.company.name.toLowerCase().includes(lowerSearchTerm) ||
        item.company.ticker.toLowerCase().includes(lowerSearchTerm),
    );
  }, [searchTerm, sortedCompanies]);

  const hasSubscriptions = companySubscriptions.length > 0;
  const shouldShowEmptyState = !isLoading && !hasSubscriptions && !searchTerm;

  return (
    <Card className="flex h-[700px] flex-col rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md">
      <CardHeader className="px-6 py-4 border-b border-gray-200">
        <CardTitle className="text-lg font-semibold text-gray-800">
          회사 구독 현황
        </CardTitle>
        <div className="mt-4">
          <Input
            type="text"
            placeholder="회사명 또는 티커로 검색..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.target.value)
            }
            className="w-full px-3 py-2 text-sm border-gray-300 rounded-md shadow-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4 overflow-y-auto md:p-6">
        {isLoading ? (
          <div className="pt-2 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-full h-20 bg-gray-100 rounded-md animate-pulse"
              ></div>
            ))}
          </div>
        ) : shouldShowEmptyState ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <EmptyState message="구독 중인 회사가 없습니다." />
            <p className="mt-2 text-sm text-gray-500">
              새로운 회사 알림을 추가해보세요.
            </p>
          </div>
        ) : filteredItems.length === 0 && searchTerm ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <EmptyState
              message={`'${searchTerm}'에 대한 검색 결과가 없습니다.`}
            />
            <p className="mt-2 text-sm text-gray-500">
              다른 검색어를 입력해보세요.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="shadow-xs flex items-center justify-between rounded-md border border-gray-200 bg-white p-3.5 transition-all duration-150 hover:border-gray-300 hover:shadow-sm"
              >
                <div className="flex items-center flex-grow space-x-3 overflow-hidden">
                  {item.company.country && (
                    <div className="flex items-center justify-center flex-shrink-0 w-5 h-5 overflow-hidden rounded-full">
                      <CountryFlag
                        countryCode={item.company.country}
                        showText={false}
                      />
                    </div>
                  )}
                  <div className="flex flex-col overflow-hidden">
                    <span
                      className="text-sm font-medium text-gray-800 truncate"
                      title={`${item.company.name} (${item.company.ticker})`}
                    >
                      {item.company.name}{' '}
                      <span className="text-gray-500">
                        ({item.company.ticker})
                      </span>
                    </span>
                    <p className="mt-0.5 text-xs text-gray-500">
                      모든 실적/배당 알림 구독 중
                    </p>
                    {item.subscribedAt && (
                      <p className="mt-0.5 text-xs text-gray-500">
                        구독일:{' '}
                        {new Date(item.subscribedAt).toLocaleDateString(
                          'ko-KR',
                        )}
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2 flex-shrink-0 rounded-full p-1.5 text-gray-500 hover:bg-red-100 hover:text-red-600 focus-visible:ring-1 focus-visible:ring-red-500 focus-visible:ring-offset-1"
                  onClick={() =>
                    onUnsubscribeCompany(item.company.name, item.companyId)
                  }
                  disabled={isUnsubscribing}
                  aria-label={`${item.company.name} 구독 해제`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CompanySubscriptions;
