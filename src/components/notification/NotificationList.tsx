import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card';
import { Button } from '@/components/UI/button';
import { Badge } from '@/components/UI/badge';
import { Trash2, AlertCircle } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  deleteNotification,
  deleteAllNotifications,
} from '@/api/services/notificationService';
import { Notification, NotificationResponse } from '@/types/notification';
import { useState } from 'react';

const EmptyState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center space-y-2 py-8 text-center">
    <AlertCircle className="h-8 w-8 text-muted-foreground" />
    <p className="text-sm text-muted-foreground">{message}</p>
  </div>
);

export default function NotificationList() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['notifications', page, limit],
    queryFn: () => getNotifications(page, limit),
  });

  const markAsReadMutation = useMutation({
    mutationFn: (id: number) => markNotificationAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotificationsCount'] });
    },
    onError: (error) => {
      toast.error(
        `알림 읽음 처리 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
      );
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: () => markAllNotificationsAsRead(),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotificationsCount'] });
      toast.success(
        `${response.data?.count || 0}개의 알림을 읽음으로 표시했습니다.`,
      );
    },
    onError: (error) => {
      toast.error(
        `알림 전체 읽음 처리 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
      );
    },
  });

  // 전체 삭제 뮤테이션
  const deleteAllMutation = useMutation({
    mutationFn: () => deleteAllNotifications(),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotificationsCount'] });
      toast.success(`${response.data?.count || 0}개의 알림을 삭제했습니다.`);
    },
    onError: (error) => {
      toast.error(
        `알림 전체 삭제 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
      );
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: (id: number) => deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadNotificationsCount'] });
      toast.success('알림이 삭제되었습니다.');
    },
    onError: (error) => {
      toast.error(
        `알림 삭제 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
      );
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  const responseData = data?.data as unknown as NotificationResponse;

  const notifications = responseData?.notifications || [];
  const totalCount = responseData?.pagination?.total || 0;
  const totalPages = Math.ceil(totalCount / limit);

  if (notifications.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-6">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">알림 현황</h1>
        <EmptyState message="알림이 없습니다." />
      </div>
    );
  }

  // 알림 제목 생성 함수
  const getNotificationTitle = (notification: Notification): string => {
    const { contentType, contentDetails } = notification;

    if (!contentDetails) return '알림';

    switch (contentType) {
      case 'EARNINGS':
        return `${contentDetails.company?.name || '회사'} 실적 발표`;
      case 'DIVIDEND':
        return `${contentDetails.company?.name || '회사'} 배당 정보`;
      case 'ECONOMIC_INDICATOR':
        return contentDetails.name || '경제지표 발표';
      default:
        return '알림';
    }
  };

  // 발표 시간 가져오기 함수
  const getReleaseDate = (notification: Notification): number | null => {
    const { contentType, contentDetails } = notification;

    if (!contentDetails) return null;

    switch (contentType) {
      case 'EARNINGS':
        return contentDetails.releaseDate || null;
      case 'DIVIDEND':
        return contentDetails.exDividendDate || null;
      case 'ECONOMIC_INDICATOR':
        return contentDetails.releaseDate || null;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 md:p-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-800">알림 현황</h1>
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          총 {totalCount}개의 알림이 있습니다.
        </p>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAllAsReadMutation.mutate()}
            disabled={
              markAllAsReadMutation.isPending || notifications.length === 0
            }
          >
            전체 읽음 처리
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              if (confirm('정말 모든 알림을 삭제하시겠습니까?')) {
                deleteAllMutation.mutate();
              }
            }}
            disabled={deleteAllMutation.isPending || notifications.length === 0}
          >
            전체 삭제
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {notifications.map((n) => {
          const title = getNotificationTitle(n);
          const releaseDate = getReleaseDate(n);

          return (
            <Card
              key={n.id}
              onClick={() => markAsReadMutation.mutate(n.id)}
              className={`rounded-lg border border-gray-200 bg-white p-4 shadow-sm transition-shadow duration-300 hover:shadow-md ${
                n.isRead ? '' : 'ring-2 ring-blue-300'
              }`}
            >
              <CardHeader className="flex items-start justify-between p-0 pb-2">
                <div className="flex w-full items-start justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold">
                      {title}
                    </CardTitle>
                    <p className="text-xs text-gray-500">
                      발표시간:{' '}
                      {releaseDate
                        ? new Date(releaseDate).toLocaleString()
                        : '-'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={n.isRead ? 'secondary' : 'default'}>
                      {n.isRead ? '읽음' : '새 알림'}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotificationMutation.mutate(n.id);
                      }}
                      disabled={deleteNotificationMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="grid grid-cols-2 gap-4 p-0 pt-2 text-sm">
                {n.contentType === 'EARNINGS' && n.contentDetails && (
                  <>
                    <div>
                      <p className="font-medium">실제 EPS</p>
                      <p>{n.contentDetails.actualEPS ?? '-'}</p>
                    </div>
                    <div>
                      <p className="font-medium">예측 EPS</p>
                      <p>{n.contentDetails.forecastEPS ?? '-'}</p>
                    </div>
                    <div>
                      <p className="font-medium">실제 매출</p>
                      <p>{n.contentDetails.actualRevenue ?? '-'}</p>
                    </div>
                    <div>
                      <p className="font-medium">예측 매출</p>
                      <p>{n.contentDetails.forecastRevenue ?? '-'}</p>
                    </div>
                  </>
                )}

                {n.contentType === 'DIVIDEND' && n.contentDetails && (
                  <>
                    <div>
                      <p className="font-medium">배당금</p>
                      <p>{n.contentDetails.dividendAmount ?? '-'}</p>
                    </div>
                    <div>
                      <p className="font-medium">이전 배당금</p>
                      <p>{n.contentDetails.previousDividendAmount ?? '-'}</p>
                    </div>
                    <div>
                      <p className="font-medium">배당 수익률</p>
                      <p>{n.contentDetails.dividendYield ?? '-'}</p>
                    </div>
                    <div>
                      <p className="font-medium">지급일</p>
                      <p>
                        {n.contentDetails.paymentDate
                          ? new Date(
                              n.contentDetails.paymentDate,
                            ).toLocaleDateString()
                          : '-'}
                      </p>
                    </div>
                  </>
                )}

                {n.contentType === 'ECONOMIC_INDICATOR' && n.contentDetails && (
                  <>
                    <div>
                      <p className="font-medium">실제</p>
                      <p>
                        {n.contentDetails.actual === ''
                          ? '-'
                          : n.contentDetails.actual}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">예측</p>
                      <p>
                        {n.contentDetails.forecast === ''
                          ? '-'
                          : n.contentDetails.forecast}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">이전</p>
                      <p>
                        {n.contentDetails.previous === ''
                          ? '-'
                          : n.contentDetails.previous}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">중요도</p>
                      <p>{n.contentDetails.importance ?? '-'}</p>
                    </div>
                  </>
                )}

                <div className="col-span-2 text-xs text-gray-500">
                  알림시간: {new Date(n.createdAt).toLocaleString()}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              size="sm"
              variant={page === i + 1 ? 'default' : 'outline'}
              onClick={() => setPage(i + 1)}
              disabled={isFetching}
            >
              {i + 1}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
