import apiClient from '../client';
import { withErrorHandling } from '../../utils/errorHandler';
import { ApiResponse } from '../../types/api-response';
import { Notification } from '@/types/notification';

/**
 * 알림 목록 조회 API
 */
export const getNotifications = withErrorHandling(
  async (
    page: number = 1,
    limit: number = 100,
  ): Promise<
    ApiResponse<{
      notifications: Array<Notification>;
      total: number;
    }>
  > => {
    const response = await apiClient.get('/api/v1/notification', {
      params: { page, limit },
    });
    return response.data;
  },
  undefined,
  'NotificationService.getNotifications',
);

/**
 * 알림 제거 API
 */
export const removeNotification = withErrorHandling(
  async (
    notificationId: number,
  ): Promise<ApiResponse<{ success: boolean }>> => {
    const response = await apiClient.delete(
      `/api/v1/notification/${notificationId}`,
    );
    return response.data;
  },
  undefined,
  'NotificationService.removeNotification',
);

/**
 * 읽지 않은 알림 개수 조회 API
 */
export const getUnreadNotificationsCount = withErrorHandling(
  async (): Promise<ApiResponse<{ count: number }>> => {
    const response = await apiClient.get('/api/v1/notification/unread/count');
    return response.data;
  },
  undefined,
  'NotificationService.getUnreadNotificationsCount',
);

/**
 * 알림 읽음 표시 API
 */
export const markNotificationAsRead = withErrorHandling(
  async (notificationId: number): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.put(
      `/api/v1/notification/${notificationId}/read`,
    );
    return response.data;
  },
  undefined,
  'NotificationService.markNotificationAsRead',
);

/**
 * 모든 알림 읽음 표시 API
 */
export const markAllNotificationsAsRead = withErrorHandling(
  async (): Promise<ApiResponse<{ message: string; count: number }>> => {
    const response = await apiClient.put('/api/v1/notification/read/all');
    return response.data;
  },
  undefined,
  'NotificationService.markAllNotificationsAsRead',
);

/**
 * 알림 삭제 API
 */
export const deleteNotification = withErrorHandling(
  async (notificationId: number): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.delete(
      `/api/v1/notification/${notificationId}`,
    );
    return response.data;
  },
  undefined,
  'NotificationService.deleteNotification',
);

/**
 * 알림 설정 조회 API
 */
export const getNotificationSettings = withErrorHandling(
  async (): Promise<
    ApiResponse<{
      emailEnabled: boolean;
      slackEnabled: boolean;
      slackWebhookUrl?: string;
      allEnabled: boolean;
    }>
  > => {
    const response = await apiClient.get('/api/v1/notification/settings');
    return response.data;
  },
  undefined,
  'NotificationService.getNotificationSettings',
);

/**
 * 알림 설정 업데이트 API
 */
export const updateNotificationSettings = withErrorHandling(
  async (settings: {
    emailEnabled?: boolean;
    slackEnabled?: boolean;
    slackWebhookUrl?: string;
    allEnabled?: boolean;
  }): Promise<
    ApiResponse<{
      emailEnabled: boolean;
      slackEnabled: boolean;
      slackWebhookUrl?: string;
      allEnabled: boolean;
    }>
  > => {
    const response = await apiClient.put(
      '/api/v1/notification/settings',
      settings,
    );
    return response.data;
  },
  undefined,
  'NotificationService.updateNotificationSettings',
);

/**
 * 모든 알림 삭제 API
 */
export const deleteAllNotifications = withErrorHandling(
  async (): Promise<ApiResponse<{ count: number }>> => {
    const response = await apiClient.delete('/api/v1/notification/all');
    return response.data;
  },
  undefined,
  'NotificationService.deleteAllNotifications',
);
