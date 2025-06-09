import React, { useState, useMemo } from 'react';
import { Button } from '@/components/UI/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card';
import { IndicatorGroupSubscription } from '@/types/notification';
import { EmptyState } from './EmptyState';
import { Input } from '@/components/UI/input';
import { Trash2 } from 'lucide-react';
import { CountryFlag } from '@/components/CalendarTable/CountryFlag';

interface IndicatorSubscriptionsProps {
  isLoading: boolean;
  indicatorGroupSubscriptions: IndicatorGroupSubscription[];
  onUnsubscribeIndicatorGroup: (baseName: string, country?: string) => void;
  isUnsubscribing: boolean;
}

const IndicatorSubscriptions: React.FC<IndicatorSubscriptionsProps> = ({
  isLoading,
  indicatorGroupSubscriptions = [],
  onUnsubscribeIndicatorGroup,
  isUnsubscribing,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const sortedIndicatorGroups = useMemo(() => {
    return [...indicatorGroupSubscriptions].sort((a, b) => {
      const dateA = new Date(a.subscribedAt || 0).getTime();
      const dateB = new Date(b.subscribedAt || 0).getTime();
      return dateB - dateA;
    });
  }, [indicatorGroupSubscriptions]);

  const filteredItems = useMemo(() => {
    if (!searchTerm) return sortedIndicatorGroups;
    const lowerSearchTerm = searchTerm.toLowerCase();
    return sortedIndicatorGroups.filter(
      (item) =>
        item.baseName.toLowerCase().includes(lowerSearchTerm) ||
        (item.country && item.country.toLowerCase().includes(lowerSearchTerm)),
    );
  }, [searchTerm, sortedIndicatorGroups]);

  const hasSubscriptions = indicatorGroupSubscriptions.length > 0;
  const shouldShowEmptyState = !isLoading && !hasSubscriptions && !searchTerm;

  return (
    <Card className="flex h-[700px] flex-col rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md">
      <CardHeader className="border-b border-gray-200 px-6 py-4">
        <CardTitle className="text-lg font-semibold text-gray-800">
          경제지표 구독 현황
        </CardTitle>
        <div className="mt-4">
          <Input
            type="text"
            placeholder="지표명으로 검색..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.target.value)
            }
            className="w-full rounded-md border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto p-4 md:p-6">
        {isLoading ? (
          <div className="space-y-4 pt-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-20 w-full animate-pulse rounded-md bg-gray-100"
              ></div>
            ))}
          </div>
        ) : shouldShowEmptyState ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <EmptyState message="구독 중인 경제지표 알림이 없습니다." />
            <p className="mt-2 text-sm text-gray-500">
              새로운 지표 알림을 추가해보세요.
            </p>
          </div>
        ) : filteredItems.length === 0 && searchTerm ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
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
                <div className="flex flex-grow items-center space-x-3 overflow-hidden">
                  {item.country && (
                    <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center overflow-hidden rounded-full">
                      <CountryFlag
                        countryCode={item.country}
                        showText={false}
                      />
                    </div>
                  )}
                  <div className="flex flex-col overflow-hidden">
                    <span
                      className="truncate text-sm font-medium text-gray-800"
                      title={`${item.baseName}${item.country ? ` - ${item.country}` : ''}`}
                    >
                      {item.baseName}
                    </span>
                    <p className="mt-0.5 text-xs text-gray-500">
                      모든 {item.baseName} 알림 구독 중
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
                    onUnsubscribeIndicatorGroup(item.baseName, item.country)
                  }
                  disabled={isUnsubscribing}
                  aria-label={`${item.baseName} 경제지표 구독 해제`}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default IndicatorSubscriptions;
