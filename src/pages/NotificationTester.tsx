// src/pages/NotificationTester.tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/UI/card';
import { Button } from '@/components/UI/button';
import { Badge } from '@/components/UI/badge';
import { toast } from 'react-hot-toast';
import { CountryFlag } from '@/components/CalendarTable/CountryFlag';
import {
  getNotificationCalendar,
  restoreEarningsActual,
  restoreIndicatorActual,
  testEarningsActual,
  testIndicatorActual,
} from '@/api/services/notificationService';

export default function NotificationTester() {
  const queryClient = useQueryClient();

  // 알림 설정된 캘린더 데이터 조회
  const { data, isLoading } = useQuery({
    queryKey: ['notificationCalendar'],
    queryFn: getNotificationCalendar,
  });

  // 경제지표 테스트용 mutation (object syntax)
  const testIndicatorMutation = useMutation({
    mutationFn: testIndicatorActual,
    onSuccess: () => {
      toast.success('테스트 값 설정 완료');
      queryClient.invalidateQueries({ queryKey: ['notificationCalendar'] });
    },
    onError: () => toast.error('테스트 설정 실패'),
  });

  // 경제지표 원상복구용 mutation
  const restoreIndicatorMutation = useMutation({
    mutationFn: restoreIndicatorActual,
    onSuccess: () => {
      toast.success('원상복구 완료');
      queryClient.invalidateQueries({ queryKey: ['notificationCalendar'] });
    },
    onError: () => toast.error('원상복구 실패'),
  });

  // 실적 테스트용 mutation
  const testEarningsMutation = useMutation({
    mutationFn: testEarningsActual,
    onSuccess: () => {
      toast.success('테스트 값 설정 완료');
      queryClient.invalidateQueries({ queryKey: ['notificationCalendar'] });
    },
    onError: () => toast.error('테스트 설정 실패'),
  });

  // 실적 원상복구용 mutation
  const restoreEarningsMutation = useMutation({
    mutationFn: restoreEarningsActual,
    onSuccess: () => {
      toast.success('원상복구 완료');
      queryClient.invalidateQueries({ queryKey: ['notificationCalendar'] });
    },
    onError: () => toast.error('원상복구 실패'),
  });

  if (isLoading) {
    return <p className="py-8 text-center">로딩 중...</p>;
  }

  const indicators = data?.data ? data?.data.economicIndicators : [];
  const earnings = data?.data ? data?.data.earnings : [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">🔔 Notification Tester</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {/* 경제지표 테스트 패널 */}
        <Card>
          <CardHeader>
            <CardTitle>경제지표 테스트</CardTitle>
          </CardHeader>
          <CardContent>
            {indicators.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                알림 추가된 경제지표가 없습니다.
              </p>
            ) : (
              <ul className="space-y-4">
                {indicators.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline">
                        <CountryFlag countryCode={item.country} showText />
                      </Badge>
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(item.releaseDate).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => testIndicatorMutation.mutate(item.id)}
                      >
                        테스트
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => restoreIndicatorMutation.mutate(item.id)}
                      >
                        원상복구
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* 실적 테스트 패널 */}
        <Card>
          <CardHeader>
            <CardTitle>실적 테스트</CardTitle>
          </CardHeader>
          <CardContent>
            {earnings.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                알림 추가된 실적이 없습니다.
              </p>
            ) : (
              <ul className="space-y-4">
                {earnings.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline">
                        <CountryFlag countryCode={item.country} showText />
                      </Badge>
                      <div>
                        <p className="font-medium">{item.company?.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(item.releaseDate).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={() => testEarningsMutation.mutate(item.id)}
                      >
                        테스트
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => restoreEarningsMutation.mutate(item.id)}
                      >
                        원상복구
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
