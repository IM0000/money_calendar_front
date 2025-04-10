import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card';
import { Button } from '@/components/UI/button';
import { Badge } from '@/components/UI/badge';
import { Trash2 } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  deleteNotification,
} from '@/api/services/notificationService';
import { Notification } from '@/types/notification';
import { AlertCircle } from 'lucide-react';

const getContentTypeLabel = (type: string) => {
  switch (type) {
    case 'EARNINGS':
      return '실적 알림';
    case 'DIVIDEND':
      return '배당 알림';
    case 'ECONOMIC_INDICATOR':
      return '경제지표 알림';
    default:
      return '알림';
  }
};

const EmptyState = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center space-y-2 py-8 text-center">
    <AlertCircle className="h-8 w-8 text-muted-foreground" />
    <p className="text-sm text-muted-foreground">{message}</p>
  </div>
);

export default function NotificationList() {
  const queryClient = useQueryClient();
  const page = 1;
  const limit = 10;

  // 알림 목록 조회
  const { data, isLoading } = useQuery({
    queryKey: ['notifications', page, limit],
    queryFn: () => getNotifications(page, limit),
  });

  // 알림 읽음 처리 mutation
  const markAsReadMutation = useMutation({
    mutationFn: (id: number) => markNotificationAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
    },
    onError: (error) => {
      toast.error(
        `알림 읽음 처리 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
      );
    },
  });

  // 알림 전체 읽음 처리 mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: () => markAllNotificationsAsRead(),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
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

  // 알림 삭제 mutation
  const deleteNotificationMutation = useMutation({
    mutationFn: (id: number) => deleteNotification(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unreadCount'] });
      toast.success('알림이 삭제되었습니다.');
    },
    onError: (error) => {
      toast.error(
        `알림 삭제 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
      );
    },
  });

  // 알림 읽음 처리 핸들러
  const handleMarkAsRead = (notification: Notification) => {
    if (!notification.read) {
      markAsReadMutation.mutate(notification.id);
    }
  };

  // 알림 전체 읽음 처리 핸들러
  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  // 알림 삭제 핸들러
  const handleDeleteNotification = (id: number) => {
    deleteNotificationMutation.mutate(id);
  };

  // 알림 목록
  const notifications = data?.data?.notifications || [];
  const hasNotifications = notifications.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">알림 목록</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleMarkAllAsRead}
          disabled={markAllAsReadMutation.isPending || !hasNotifications}
        >
          전체 읽음 처리
        </Button>
      </div>
      <div className="space-y-4">
        {isLoading ? (
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">로딩 중...</p>
          </div>
        ) : hasNotifications ? (
          notifications.map((notification) => (
            <Card
              key={notification.id}
              onClick={() => handleMarkAsRead(notification)}
              className={
                notification.read
                  ? ''
                  : 'border-blue-300 shadow-sm hover:shadow-md'
              }
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {getContentTypeLabel(notification.contentType)}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Badge variant={notification.read ? 'secondary' : 'default'}>
                    {notification.read ? '읽음' : '새 알림'}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteNotification(notification.id);
                    }}
                    disabled={deleteNotificationMutation.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mt-2 text-xs text-muted-foreground">
                  {new Date(notification.createdAt).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
          <EmptyState message="알림이 없습니다." />
        )}
      </div>
    </div>
  );
}
