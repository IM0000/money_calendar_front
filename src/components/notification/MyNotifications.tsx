import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card';
import { Button } from '@/components/UI/button';
import { Trash2 } from 'lucide-react';
import { Badge } from '@/components/UI/badge';
import { AlertCircle } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  removeIndicatorNotification,
  removeEarningsNotification,
  getNotificationCalendar,
} from '@/api/services/notificationService';
import { useState, useEffect } from 'react';
import { EarningsEvent, EconomicIndicatorEvent } from '@/types/calendar-event';
import { FaStar } from 'react-icons/fa';
import { CountryFlag } from '../CalendarTable/CountryFlag';

const EmptyState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center space-y-2 py-8 text-center">
    <AlertCircle className="h-8 w-8 text-muted-foreground" />
    <p className="text-sm text-muted-foreground">{message}</p>
  </div>
);

export default function MyNotifications() {
  const queryClient = useQueryClient();
  const [indicatorNotifications, setIndicatorNotifications] = useState<
    EconomicIndicatorEvent[]
  >([]);
  const [earningsNotifications, setEarningsNotifications] = useState<
    EarningsEvent[]
  >([]);

  // 알림 설정된 캘린더 데이터 가져오기
  const { data, isLoading } = useQuery({
    queryKey: ['notificationCalendar'],
    queryFn: () => getNotificationCalendar(),
  });

  // 데이터가 변경될 때마다 알림이 설정된 항목 필터링
  useEffect(() => {
    if (data?.data) {
      const indicators = data.data.economicIndicators.map((item) => ({
        ...item,
        actual: item.actual || '',
        forecast: item.forecast || '',
        previous: item.previous || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

      const earnings = data.data.earnings.map((item) => ({
        ...item,
        actualEPS: item.actualEPS || '',
        forecastEPS: item.forecastEPS || '',
        previousEPS: item.previousEPS || '',
        actualRevenue: item.actualRevenue || '',
        forecastRevenue: item.forecastRevenue || '',
        previousRevenue: item.previousRevenue || '',
        releaseTiming: item.releaseTiming as
          | 'UNKNOWN'
          | 'PRE_MARKET'
          | 'POST_MARKET',
        company: {
          id: item?.company?.id || 0,
          ticker: item?.company?.ticker || '',
          name: item?.company?.name || '',
          companyCountry: item.country,
          marketValue: '',
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }));

      setIndicatorNotifications(indicators);
      setEarningsNotifications(earnings);
    }
  }, [data]);

  // 경제지표 알림 제거 mutation
  const removeIndicatorMutation = useMutation({
    mutationFn: (id: number) => removeIndicatorNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificationCalendar'] });
      queryClient.invalidateQueries({ queryKey: ['calendarEvents'] });
      toast.success('경제지표 알림이 제거되었습니다.');
    },
    onError: (error) => {
      toast.error(
        `경제지표 알림 제거 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
      );
    },
  });

  // 실적 알림 제거 mutation
  const removeEarningsMutation = useMutation({
    mutationFn: (id: number) => removeEarningsNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificationCalendar'] });
      queryClient.invalidateQueries({ queryKey: ['calendarEvents'] });
      toast.success('실적 알림이 제거되었습니다.');
    },
    onError: (error) => {
      toast.error(
        `실적 알림 제거 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
      );
    },
  });

  const handleRemoveIndicator = (id: number) => {
    removeIndicatorMutation.mutate(id);
  };

  const handleRemoveEarnings = (id: number) => {
    removeEarningsMutation.mutate(id);
  };

  const hasIndicators = indicatorNotifications.length > 0;
  const hasEarnings = earningsNotifications.length > 0;

  const renderImportanceStars = (importance: number) => {
    const stars = [];
    for (let i = 0; i < 3; i++) {
      stars.push(
        <FaStar
          key={i}
          className={i < importance ? 'text-yellow-500' : 'text-gray-300'}
        />,
      );
    }
    return <div className="flex">{stars}</div>;
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">경제지표</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-8 text-center">
                <p className="text-sm text-muted-foreground">로딩 중...</p>
              </div>
            ) : hasIndicators ? (
              <div className="space-y-4">
                {indicatorNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-blue-600">
                        {new Date(notification.releaseDate).toLocaleString()}
                      </p>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">
                          <CountryFlag
                            countryCode={notification.country}
                            showText={true}
                          />
                        </Badge>
                        <h3 className="font-medium">{notification.name}</h3>
                        {renderImportanceStars(notification.importance)}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveIndicator(notification.id)}
                      disabled={removeIndicatorMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState message="추가한 경제지표 알림이 없습니다." />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">실적</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-8 text-center">
                <p className="text-sm text-muted-foreground">로딩 중...</p>
              </div>
            ) : hasEarnings ? (
              <div className="space-y-4">
                {earningsNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-center justify-between rounded-lg border p-4 hover:bg-gray-50"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-gray-700">
                        {new Date(
                          notification.releaseDate,
                        ).toLocaleDateString()}
                      </p>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">
                          <CountryFlag
                            countryCode={notification.country}
                            showText={true}
                          />
                        </Badge>
                        <h3 className="font-medium">
                          {notification.company?.name}
                        </h3>
                        <Badge variant="outline">
                          {notification.company?.ticker}
                        </Badge>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveEarnings(notification.id)}
                      disabled={removeEarningsMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState message="추가한 실적 알림이 없습니다." />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
