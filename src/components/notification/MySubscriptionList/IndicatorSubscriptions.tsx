import React, { useState, useMemo } from 'react';
import { Button } from '@/components/UI/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card';
import { Badge } from '@/components/UI/badge';
import {
  IndicatorSubscription,
  BaseNameSubscription,
  SubscriptionType,
} from '@/types/notification';
import { EmptyState } from './EmptyState';
import { Input } from '@/components/UI/input';
import { Trash2 } from 'lucide-react';
import { formatKoreanDateWithWeekday } from '@/utils/dateUtils';
import { CountryFlag } from '@/components/CalendarTable/CountryFlag';

interface IndicatorSubscriptionsProps {
  isLoading: boolean;
  baseNameIndicators?: BaseNameSubscription[];
  indicators?: IndicatorSubscription[];
  onUnsubscribeBaseNameIndicator: (
    baseName: string,
    country: string,
    indicatorId: number, // Assuming indicatorId is needed for specific baseName unsubscription
  ) => void;
  onRemoveIndicator: (id: number) => void;
}

const IndicatorSubscriptions: React.FC<IndicatorSubscriptionsProps> = ({
  isLoading,
  baseNameIndicators = [],
  indicators = [],
  onUnsubscribeBaseNameIndicator,
  onRemoveIndicator,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const unifiedAndSortedIndicators = useMemo(() => {
    const mappedBaseNameIndicators: BaseNameSubscription[] =
      baseNameIndicators.map((sub) => ({
        ...sub,
        type: SubscriptionType.BASE_NAME,
        indicator: {
          ...sub.indicator,
          releaseDate:
            typeof sub.indicator.releaseDate === 'string'
              ? parseInt(sub.indicator.releaseDate, 10)
              : sub.indicator.releaseDate,
        },
      }));

    const mappedIndicators: IndicatorSubscription[] = indicators.map((sub) => ({
      ...sub,
      type: SubscriptionType.INDICATOR,
      indicator: {
        ...sub.indicator,
        releaseDate:
          typeof sub.indicator.releaseDate === 'string'
            ? parseInt(sub.indicator.releaseDate, 10)
            : sub.indicator.releaseDate,
      },
    }));

    return [...mappedBaseNameIndicators, ...mappedIndicators].sort((a, b) => {
      const dateA = new Date(a.subscribedAt).getTime();
      const dateB = new Date(b.subscribedAt).getTime();
      return dateB - dateA;
    });
  }, [baseNameIndicators, indicators]);

  const filteredItems = useMemo(() => {
    if (!searchTerm) return unifiedAndSortedIndicators;
    const lowerSearchTerm = searchTerm.toLowerCase();
    return unifiedAndSortedIndicators.filter(
      (item) =>
        item.indicator.name.toLowerCase().includes(lowerSearchTerm) ||
        item.indicator.country.toLowerCase().includes(lowerSearchTerm) ||
        (item.indicator.baseName &&
          item.indicator.baseName.toLowerCase().includes(lowerSearchTerm)),
    );
  }, [searchTerm, unifiedAndSortedIndicators]);

  const hasRealSubscriptions =
    baseNameIndicators.length > 0 || indicators.length > 0;

  const shouldShowEmptyState =
    !isLoading && !hasRealSubscriptions && !searchTerm;

  return (
    <Card className="flex h-[700px] flex-col rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md">
      <CardHeader className="border-b border-gray-200 px-6 py-4">
        <CardTitle className="text-lg font-semibold text-gray-800">
          경제지표 구독 현황
        </CardTitle>
        <p className="mt-1 text-sm text-gray-600">
          구독 중인 경제지표 유형 및 개별 경제지표 알림을 관리합니다.
        </p>
        <div className="mt-4">
          <Input
            type="text"
            placeholder="지표명, 국가명, 베이스 이름 검색..."
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
              새로운 알림을 추가해보세요.
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
                  <Badge
                    variant={
                      item.type === SubscriptionType.BASE_NAME
                        ? 'secondary'
                        : 'outline'
                    }
                    className={`min-w-[40px] flex-shrink-0 justify-center whitespace-nowrap rounded-md px-2.5 py-0.5 text-xs font-semibold ${
                      item.type === SubscriptionType.BASE_NAME
                        ? 'border-green-300 bg-green-100 text-green-700 hover:bg-green-200'
                        : 'border-sky-300 bg-sky-50 text-sky-700 hover:bg-sky-100'
                    }`}
                  >
                    {item.type === SubscriptionType.BASE_NAME ? (
                      <>
                        전체
                        <br />
                        구독
                      </>
                    ) : (
                      <>
                        단일
                        <br />
                        구독
                      </>
                    )}
                  </Badge>

                  {item.indicator.country && (
                    <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center overflow-hidden rounded-full">
                      <CountryFlag
                        countryCode={item.indicator.country}
                        showText={false}
                      />
                    </div>
                  )}
                  <div className="flex flex-col overflow-hidden">
                    <span
                      className="truncate text-sm font-medium text-gray-800"
                      title={`${item.indicator.name}${item.indicator.baseName ? ` (${item.indicator.baseName})` : ''} - ${item.indicator.country}`}
                    >
                      {item.indicator.name}
                      {item.indicator.baseName && (
                        <span className="text-gray-500">
                          {' '}
                          ({item.indicator.baseName})
                        </span>
                      )}
                    </span>
                    {item.type === SubscriptionType.INDICATOR &&
                    typeof item.indicator.releaseDate === 'number' &&
                    item.indicator.releaseDate > 0 ? (
                      <p className="mt-0.5 text-xs text-gray-500">
                        발표일:{' '}
                        {formatKoreanDateWithWeekday(
                          item.indicator.releaseDate,
                        )}
                      </p>
                    ) : item.type === SubscriptionType.BASE_NAME ? (
                      <p className="mt-0.5 text-xs text-gray-500">
                        모든 발표 알림
                      </p>
                    ) : null}
                    <p className="mt-0.5 text-xs text-gray-500">
                      구독일:{' '}
                      {new Date(item.subscribedAt).toLocaleDateString('ko-KR')}
                    </p>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-2 flex-shrink-0 rounded-full p-1.5 text-gray-500 hover:bg-red-100 hover:text-red-600 focus-visible:ring-1 focus-visible:ring-red-500 focus-visible:ring-offset-1"
                  onClick={() => {
                    if (item.type === SubscriptionType.BASE_NAME) {
                      onUnsubscribeBaseNameIndicator(
                        item.indicator.baseName,
                        item.indicator.country,
                        item.indicator.id,
                      );
                    } else {
                      onRemoveIndicator(item.id);
                    }
                  }}
                  aria-label={
                    item.type === SubscriptionType.BASE_NAME
                      ? `${item.indicator.name} (${item.indicator.baseName}) 전체 구독 해제`
                      : `${item.indicator.name} 개별 알림 해제`
                  }
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
