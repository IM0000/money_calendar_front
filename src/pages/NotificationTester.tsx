// src/pages/NotificationTester.tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/UI/card';
import { Button } from '@/components/UI/button';
import { Badge } from '@/components/UI/badge';
import { toast } from 'react-hot-toast';
import { CountryFlag } from '@/components/CalendarTable/CountryFlag';
import { useState } from 'react';
import apiClient from '@/api/client';
import { withErrorHandling } from '@/utils/errorHandler';
import {
  getCompanySubscriptions,
  getIndicatorGroupSubscriptions,
} from '@/api/services/subscriptionService';

// 테스트용 API 함수들
const testIndicatorActual = withErrorHandling(
  async (id: number) => {
    const response = await apiClient.post(
      `/api/v1/notifications/test-indicator/${id}`,
    );
    return response.data;
  },
  undefined,
  'testIndicatorActual',
);

const restoreIndicatorActual = withErrorHandling(
  async (id: number) => {
    const response = await apiClient.post(
      `/api/v1/notifications/restore-indicator/${id}`,
    );
    return response.data;
  },
  undefined,
  'restoreIndicatorActual',
);

const testEarningsActual = withErrorHandling(
  async (id: number) => {
    const response = await apiClient.post(
      `/api/v1/notifications/test-earnings/${id}`,
    );
    return response.data;
  },
  undefined,
  'testEarningsActual',
);

const restoreEarningsActual = withErrorHandling(
  async (id: number) => {
    const response = await apiClient.post(
      `/api/v1/notifications/restore-earnings/${id}`,
    );
    return response.data;
  },
  undefined,
  'restoreEarningsActual',
);

// 배당 데이터 변경 테스트용 API 함수들
const testDividendData = withErrorHandling(
  async (id: number) => {
    const response = await apiClient.post(
      `/api/v1/notifications/test-dividend/${id}`,
    );
    return response.data;
  },
  undefined,
  'testDividendData',
);

const restoreDividendData = withErrorHandling(
  async (id: number) => {
    const response = await apiClient.post(
      `/api/v1/notifications/restore-dividend/${id}`,
    );
    return response.data;
  },
  undefined,
  'restoreDividendData',
);

// 배당 지급일 알림 테스트
const testDividendPayment = withErrorHandling(
  async () => {
    const response = await apiClient.post(
      '/api/v1/notifications/test-dividend-payment',
    );
    return response.data;
  },
  undefined,
  'testDividendPayment',
);

// 구독된 회사들의 실적/배당 이벤트 조회
const getSubscribedCompanyEvents = withErrorHandling(
  async () => {
    const subscriptions = await getCompanySubscriptions();
    const companyIds = subscriptions.data?.map((sub) => sub.companyId) || [];

    if (companyIds.length === 0) {
      return { data: { earnings: [], dividends: [] } };
    }

    // 현재 날짜 기준으로 앞뒤 30일 범위 설정
    const now = new Date();
    const startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    const [earningsResponse, dividendsResponse] = await Promise.all([
      apiClient.get('/api/v1/calendar/earnings', {
        params: {
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
        },
      }),
      apiClient.get('/api/v1/calendar/dividends', {
        params: {
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
        },
      }),
    ]);

    // 구독된 회사의 이벤트만 필터링
    const allEarnings = earningsResponse.data?.data || [];
    const allDividends = dividendsResponse.data?.data || [];

    const filteredEarnings = allEarnings.filter(
      (earning: { company?: { id: number } }) =>
        earning.company?.id && companyIds.includes(earning.company.id),
    );

    const filteredDividends = allDividends.filter(
      (dividend: { company?: { id: number } }) =>
        dividend.company?.id && companyIds.includes(dividend.company.id),
    );

    return {
      data: {
        earnings: filteredEarnings,
        dividends: filteredDividends,
      },
    };
  },
  undefined,
  'getSubscribedCompanyEvents',
);

// 구독된 지표 그룹들의 경제지표 이벤트 조회
const getSubscribedIndicatorEvents = withErrorHandling(
  async () => {
    const subscriptions = await getIndicatorGroupSubscriptions();
    const indicatorGroups = subscriptions.data || [];

    if (indicatorGroups.length === 0) {
      return { data: { economicIndicators: [] } };
    }

    // 현재 날짜 기준으로 앞뒤 30일 범위 설정
    const now = new Date();
    const startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const formatDate = (date: Date) => date.toISOString().split('T')[0];

    // 전체 경제지표를 조회한 후 구독된 그룹만 필터링
    const response = await apiClient.get(
      '/api/v1/calendar/economic-indicators',
      {
        params: {
          startDate: formatDate(startDate),
          endDate: formatDate(endDate),
        },
      },
    );

    const allIndicators = response.data?.data || [];

    // 구독된 지표 그룹에 해당하는 지표들만 필터링
    const filteredIndicators = allIndicators.filter(
      (indicator: { baseName: string; country: string }) =>
        indicatorGroups.some(
          (group) =>
            group.baseName === indicator.baseName &&
            group.country === indicator.country,
        ),
    );

    return {
      data: {
        economicIndicators: filteredIndicators,
      },
    };
  },
  undefined,
  'getSubscribedIndicatorEvents',
);

export default function NotificationTester() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<
    'earnings' | 'dividends' | 'indicators' | 'dividend'
  >('earnings');

  // 구독된 회사 이벤트 조회
  const { data: companyEventsData, isLoading: isCompanyLoading } = useQuery({
    queryKey: ['subscribedCompanyEvents'],
    queryFn: getSubscribedCompanyEvents,
  });

  // 구독된 지표 이벤트 조회
  const { data: indicatorEventsData, isLoading: isIndicatorLoading } = useQuery(
    {
      queryKey: ['subscribedIndicatorEvents'],
      queryFn: getSubscribedIndicatorEvents,
    },
  );

  // 경제지표 테스트용 mutation
  const testIndicatorMutation = useMutation({
    mutationFn: testIndicatorActual,
    onSuccess: () => {
      toast.success('경제지표 테스트 값 설정 완료');
      queryClient.invalidateQueries({
        queryKey: ['subscribedIndicatorEvents'],
      });
    },
    onError: (error) => {
      toast.error(
        `테스트 설정 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
      );
    },
  });

  // 경제지표 원상복구용 mutation
  const restoreIndicatorMutation = useMutation({
    mutationFn: restoreIndicatorActual,
    onSuccess: () => {
      toast.success('경제지표 원상복구 완료');
      queryClient.invalidateQueries({
        queryKey: ['subscribedIndicatorEvents'],
      });
    },
    onError: (error) => {
      toast.error(
        `원상복구 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
      );
    },
  });

  // 실적 테스트용 mutation
  const testEarningsMutation = useMutation({
    mutationFn: testEarningsActual,
    onSuccess: () => {
      toast.success('실적 테스트 값 설정 완료');
      queryClient.invalidateQueries({ queryKey: ['subscribedCompanyEvents'] });
    },
    onError: (error) => {
      toast.error(
        `테스트 설정 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
      );
    },
  });

  // 실적 원상복구용 mutation
  const restoreEarningsMutation = useMutation({
    mutationFn: restoreEarningsActual,
    onSuccess: () => {
      toast.success('실적 원상복구 완료');
      queryClient.invalidateQueries({ queryKey: ['subscribedCompanyEvents'] });
    },
    onError: (error) => {
      toast.error(
        `원상복구 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
      );
    },
  });

  // 배당 데이터 변경 테스트용 mutation
  const testDividendDataMutation = useMutation({
    mutationFn: testDividendData,
    onSuccess: () => {
      toast.success('배당 데이터 테스트 값 설정 완료');
      queryClient.invalidateQueries({ queryKey: ['subscribedCompanyEvents'] });
    },
    onError: (error) => {
      toast.error(
        `테스트 설정 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
      );
    },
  });

  // 배당 데이터 원상복구용 mutation
  const restoreDividendDataMutation = useMutation({
    mutationFn: restoreDividendData,
    onSuccess: () => {
      toast.success('배당 데이터 원상복구 완료');
      queryClient.invalidateQueries({ queryKey: ['subscribedCompanyEvents'] });
    },
    onError: (error) => {
      toast.error(
        `원상복구 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
      );
    },
  });

  // 배당 지급일 알림 테스트용 mutation
  const testDividendPaymentMutation = useMutation({
    mutationFn: testDividendPayment,
    onSuccess: () => {
      toast.success('배당 지급일 알림 테스트 실행 완료');
    },
    onError: (error) => {
      toast.error(
        `배당 알림 테스트 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
      );
    },
  });

  const isLoading = isCompanyLoading || isIndicatorLoading;

  if (isLoading) {
    return <p className="py-8 text-center">로딩 중...</p>;
  }

  const earnings = companyEventsData?.data?.earnings || [];
  const dividends = companyEventsData?.data?.dividends || [];
  const indicators = indicatorEventsData?.data?.economicIndicators || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">🔔 알림 테스터</h1>
        <div className="text-sm text-muted-foreground">
          구독 중인 이벤트들만 표시됩니다
        </div>
      </div>

      {/* 탭 버튼 */}
      <div className="flex space-x-2">
        <Button
          variant={activeTab === 'earnings' ? 'default' : 'outline'}
          onClick={() => setActiveTab('earnings')}
        >
          실적 테스트 ({earnings.length})
        </Button>
        <Button
          variant={activeTab === 'dividends' ? 'default' : 'outline'}
          onClick={() => setActiveTab('dividends')}
        >
          배당 테스트 ({dividends.length})
        </Button>
        <Button
          variant={activeTab === 'indicators' ? 'default' : 'outline'}
          onClick={() => setActiveTab('indicators')}
        >
          경제지표 테스트 ({indicators.length})
        </Button>
        <Button
          variant={activeTab === 'dividend' ? 'default' : 'outline'}
          onClick={() => setActiveTab('dividend')}
        >
          배당 지급일 알림 테스트
        </Button>
      </div>

      {/* 실적/배당 테스트 패널 */}
      {activeTab === 'earnings' && (
        <Card>
          <CardHeader>
            <CardTitle>실적 알림 테스트</CardTitle>
            <p className="text-sm text-muted-foreground">
              구독 중인 회사의 실적 이벤트들입니다. 테스트 버튼을 클릭하면 실제
              값이 변경되어 알림이 발송됩니다.
            </p>
          </CardHeader>
          <CardContent>
            {earnings.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">
                  구독 중인 실적이 없습니다.
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  구독 관리에서 회사를 구독하고 알림 설정을 해주세요.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {earnings.map(
                  (item: {
                    id: number;
                    country: string;
                    company?: { name: string };
                    releaseDate?: string;
                    actualEPS?: string;
                    actualRevenue?: string;
                  }) => {
                    const eventDate = item.releaseDate;

                    return (
                      <div
                        key={`earnings-${item.id}`}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline">
                            <CountryFlag countryCode={item.country} showText />
                          </Badge>
                          <Badge variant="default">실적</Badge>
                          <div>
                            <p className="font-medium">{item.company?.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {eventDate
                                ? new Date(Number(eventDate)).toLocaleString()
                                : 'N/A'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              EPS: {item.actualEPS} | 매출: {item.actualRevenue}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => testEarningsMutation.mutate(item.id)}
                            disabled={testEarningsMutation.isPending}
                          >
                            테스트
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              restoreEarningsMutation.mutate(item.id)
                            }
                            disabled={restoreEarningsMutation.isPending}
                          >
                            원상복구
                          </Button>
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 배당 테스트 패널 */}
      {activeTab === 'dividends' && (
        <Card>
          <CardHeader>
            <CardTitle>배당 알림 테스트</CardTitle>
            <p className="text-sm text-muted-foreground">
              구독 중인 회사의 배당 이벤트들입니다. 테스트 버튼을 클릭하면 실제
              값이 변경되어 알림이 발송됩니다.
            </p>
          </CardHeader>
          <CardContent>
            {dividends.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">
                  구독 중인 배당이 없습니다.
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  구독 관리에서 회사를 구독하고 알림 설정을 해주세요.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {dividends.map(
                  (item: {
                    id: number;
                    country: string;
                    company?: { name: string };
                    exDividendDate?: string;
                    dividendAmount?: string;
                    dividendYield?: string;
                  }) => {
                    const eventDate = item.exDividendDate;

                    return (
                      <div
                        key={`dividend-${item.id}`}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline">
                            <CountryFlag countryCode={item.country} showText />
                          </Badge>
                          <Badge variant="secondary">배당</Badge>
                          <div>
                            <p className="font-medium">{item.company?.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {eventDate
                                ? new Date(Number(eventDate)).toLocaleString()
                                : 'N/A'}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              배당금: {item.dividendAmount} | 수익률:{' '}
                              {item.dividendYield}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() =>
                              testDividendDataMutation.mutate(item.id)
                            }
                            disabled={testDividendDataMutation.isPending}
                          >
                            테스트
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              restoreDividendDataMutation.mutate(item.id)
                            }
                            disabled={restoreDividendDataMutation.isPending}
                          >
                            원상복구
                          </Button>
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 경제지표 테스트 패널 */}
      {activeTab === 'indicators' && (
        <Card>
          <CardHeader>
            <CardTitle>경제지표 알림 테스트</CardTitle>
            <p className="text-sm text-muted-foreground">
              구독 중인 지표 그룹의 경제지표들입니다. 테스트 버튼을 클릭하면
              실제 값이 변경되어 알림이 발송됩니다.
            </p>
          </CardHeader>
          <CardContent>
            {indicators.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">
                  구독 중인 경제지표가 없습니다.
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  구독 관리에서 지표 그룹을 구독하고 알림 설정을 해주세요.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {indicators.map(
                  (item: {
                    id: number;
                    country: string;
                    name: string;
                    baseName: string;
                    releaseDate: string;
                    actual: string;
                    forecast: string;
                    previous: string;
                  }) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline">
                          <CountryFlag countryCode={item.country} showText />
                        </Badge>
                        <Badge variant="secondary">{item.baseName}</Badge>
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(
                              Number(item.releaseDate),
                            ).toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            실제: {item.actual} | 예측: {item.forecast} | 이전:{' '}
                            {item.previous}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          onClick={() => testIndicatorMutation.mutate(item.id)}
                          disabled={testIndicatorMutation.isPending}
                        >
                          테스트
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            restoreIndicatorMutation.mutate(item.id)
                          }
                          disabled={restoreIndicatorMutation.isPending}
                        >
                          원상복구
                        </Button>
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 배당 지급일 알림 테스트 패널 */}
      {activeTab === 'dividend' && (
        <Card>
          <CardHeader>
            <CardTitle>배당 지급일 알림 테스트</CardTitle>
            <p className="text-sm text-muted-foreground">
              오늘 배당 지급일인 회사들을 찾아서 구독자들에게 알림을 발송하는
              스케줄러를 수동으로 실행합니다.
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                <h4 className="mb-2 font-medium text-yellow-800">
                  ⚠️ 주의사항
                </h4>
                <ul className="space-y-1 text-sm text-yellow-700">
                  <li>
                    • 이 테스트는 오늘 날짜 기준으로 배당 지급일인 회사들을
                    찾습니다
                  </li>
                  <li>• 실제 알림이 발송되므로 테스트 환경에서만 사용하세요</li>
                  <li>• 해당 회사를 구독한 사용자들에게만 알림이 발송됩니다</li>
                  <li>• 전체 알림 허용이 꺼진 사용자는 알림을 받지 않습니다</li>
                </ul>
              </div>

              <div className="flex flex-col space-y-3">
                <div className="rounded-lg border p-4">
                  <h4 className="mb-2 font-medium">
                    배당 지급일 알림 스케줄러
                  </h4>
                  <p className="mb-4 text-sm text-muted-foreground">
                    매일 오전 9시에 자동으로 실행되는 스케줄러를 수동으로
                    실행합니다. 오늘({new Date().toLocaleDateString()}) 배당
                    지급일인 회사들을 찾아서 알림을 발송합니다.
                  </p>
                  <Button
                    onClick={() => testDividendPaymentMutation.mutate()}
                    disabled={testDividendPaymentMutation.isPending}
                    className="w-full"
                  >
                    {testDividendPaymentMutation.isPending
                      ? '실행 중...'
                      : '배당 지급일 알림 테스트 실행'}
                  </Button>
                </div>

                <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <h4 className="mb-2 font-medium text-blue-800">
                    💡 테스트 방법
                  </h4>
                  <ol className="space-y-1 text-sm text-blue-700">
                    <li>1. 구독 관리에서 배당이 있는 회사를 구독</li>
                    <li>2. 알림 설정에서 이메일/슬랙 알림 활성화</li>
                    <li>3. 위 버튼을 클릭하여 테스트 실행</li>
                    <li>4. 알림 현황에서 발송된 알림 확인</li>
                    <li>5. 이메일/슬랙으로 실제 알림 수신 확인</li>
                  </ol>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 사용법 안내 */}
      <Card>
        <CardHeader>
          <CardTitle>📋 테스트 방법</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="mb-2 font-medium">1. 준비 단계</h4>
            <ul className="ml-4 space-y-1 text-sm text-muted-foreground">
              <li>• 구독 관리에서 회사나 지표 그룹을 구독</li>
              <li>• 알림 설정에서 이메일/슬랙 알림 활성화</li>
              <li>• 전체 알림 허용이 켜져있는지 확인</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-2 font-medium">2. 테스트 실행</h4>
            <ul className="ml-4 space-y-1 text-sm text-muted-foreground">
              <li>• "테스트" 버튼 클릭 → 실제 값이 변경되어 알림 발송</li>
              <li>• 이메일/슬랙으로 알림 수신 확인</li>
              <li>• "원상복구" 버튼으로 원래 값으로 되돌리기</li>
              <li>
                • 배당 데이터 변경 알림과 배당 지급일 알림 2가지 테스트 가능
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-2 font-medium">3. 주의사항</h4>
            <ul className="ml-4 space-y-1 text-sm text-muted-foreground">
              <li>• 실적/배당/경제지표 테스트 후 반드시 원상복구 실행</li>
              <li>• 전체 알림 허용이 꺼져있으면 알림이 발송되지 않음</li>
              <li>• 슬랙 알림은 올바른 웹훅 URL이 설정되어야 함</li>
              <li>• 구독하지 않은 이벤트는 표시되지 않음</li>
              <li>• 배당 지급일 알림은 오늘 날짜 기준으로 실행됨</li>
              <li>
                • 배당 데이터 변경 시와 배당 지급일 시 각각 다른 알림 발송
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
