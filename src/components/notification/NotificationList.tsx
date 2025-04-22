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
} from '@/api/services/notificationService';
import { Notification } from '@/types/notification';
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
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
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
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
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

  const deleteNotificationMutation = useMutation({
    mutationFn: (id: number) => deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
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
    return <p className="py-8 text-center">로딩 중...</p>;
  }

  const notifications = data?.data?.notifications as Array<
    Notification & {
      eventName: string;
      actual?: string;
      forecast?: string;
      actualEPS?: string;
      forecastEPS?: string;
      actualRevenue?: string;
      forecastRevenue?: string;
      releaseDate?: number;
    }
  >;

  const totalCount = data?.data?.total || 0;
  const totalPages = Math.ceil(totalCount / limit);

  if (notifications.length === 0) {
    return <EmptyState message="알림이 없습니다." />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">알림 목록</h2>
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
      </div>

      <div className="grid gap-4">
        {notifications.map((n) => (
          <Card
            key={n.id}
            onClick={() => markAsReadMutation.mutate(n.id)}
            className={`rounded-lg border border-gray-200 p-4 shadow-sm transition-shadow hover:shadow-lg ${
              n.read ? '' : 'ring-2 ring-blue-300'
            }`}
          >
            <CardHeader className="flex items-start justify-between pb-2">
              <div>
                <CardTitle className="text-lg font-semibold">
                  {n.eventName}
                </CardTitle>
                <p className="text-xs text-gray-500">
                  발표시간:{' '}
                  {n.releaseDate
                    ? new Date(n.releaseDate).toLocaleString()
                    : '-'}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={n.read ? 'secondary' : 'default'}>
                  {n.read ? '읽음' : '새 알림'}
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
            </CardHeader>

            <CardContent className="grid grid-cols-2 gap-4 text-sm">
              {n.contentType === 'EARNINGS' ? (
                <>
                  <div>
                    <p className="font-medium">실제 EPS</p>
                    <p>{n.actualEPS ?? '-'}</p>
                  </div>
                  <div>
                    <p className="font-medium">예측 EPS</p>
                    <p>{n.forecastEPS ?? '-'}</p>
                  </div>
                  <div>
                    <p className="font-medium">실제 매출</p>
                    <p>{n.actualRevenue ?? '-'}</p>
                  </div>
                  <div>
                    <p className="font-medium">예측 매출</p>
                    <p>{n.forecastRevenue ?? '-'}</p>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <p className="font-medium">실제</p>
                    <p>{n.actual === '' ? '-' : n.actual}</p>
                  </div>
                  <div>
                    <p className="font-medium">예측</p>
                    <p>{n.forecast === '' ? '-' : n.forecast}</p>
                  </div>
                </>
              )}
              <div className="col-span-2 text-xs text-gray-500">
                알림시간: {new Date(n.createdAt).toLocaleString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
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
    </div>
  );
}
