import apiClient from '../client';
import { withErrorHandling } from '../../utils/errorHandler';
import { ApiResponse } from '../../types/api-response';
import { Notification, UserSubscriptionsResponse } from '@/types/notification';
import { EarningsEvent, EconomicIndicatorEvent } from '@/types/calendar-event';

export const getUserSubscriptions = withErrorHandling(
  async (): Promise<ApiResponse<UserSubscriptionsResponse>> => {
    const response = await apiClient.get(`/api/v1/notification/subscriptions`);
    return response.data;
  },
  undefined,
  'NotificationService.getUserSubscriptions',
);

/**
 * 실적 구독 추가 API
 */
export const addEarningsSubscription = withErrorHandling(
  async (earningsId: number): Promise<ApiResponse<{ success: boolean }>> => {
    const response = await apiClient.post(
      `/api/v1/notification/earnings/${earningsId}`,
    );
    return response.data;
  },
  undefined,
  'NotificationService.addEarningsSubscription',
);

/**
 * 실적 구독 제거 API
 */
export const removeEarningsSubscription = withErrorHandling(
  async (
    subscriptionId: number,
  ): Promise<ApiResponse<{ success: boolean }>> => {
    const response = await apiClient.delete(
      `/api/v1/notification/earnings/subscription/${subscriptionId}`,
    );
    return response.data;
  },
  undefined,
  'NotificationService.removeEarningsSubscription',
);

/**
 * 경제지표 구독 추가 API
 */
export const addIndicatorSubscription = withErrorHandling(
  async (indicatorId: number): Promise<ApiResponse<{ success: boolean }>> => {
    const response = await apiClient.post(
      `/api/v1/notification/economic-indicators/${indicatorId}`,
    );
    return response.data;
  },
  undefined,
  'NotificationService.addIndicatorSubscription',
);

/**
 * 경제지표 구독 제거 API
 */
export const removeIndicatorSubscription = withErrorHandling(
  async (
    subscriptionId: number,
  ): Promise<ApiResponse<{ success: boolean }>> => {
    const response = await apiClient.delete(
      `/api/v1/notification/economic-indicators/subscription/${subscriptionId}`,
    );
    return response.data;
  },
  undefined,
  'NotificationService.removeIndicatorSubscription',
);

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
  }): Promise<
    ApiResponse<{
      emailEnabled: boolean;
      slackEnabled: boolean;
      slackWebhookUrl?: string;
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
 * 알림 설정된 캘린더 정보 조회 API
 */
export const getNotificationCalendar = withErrorHandling(
  async (): Promise<
    ApiResponse<{
      economicIndicators: Array<EconomicIndicatorEvent>;
      earnings: Array<EarningsEvent>;
    }>
  > => {
    const response = await apiClient.get('/api/v1/notification/calendar');
    return response.data;
  },
  undefined,
  'NotificationService.getNotificationCalendar',
);

/**
 * 테스트용 경제지표 실제값 설정 API
 */
export const testIndicatorActual = withErrorHandling(
  async (indicatorId: number): Promise<ApiResponse<{ success: boolean }>> => {
    const response = await apiClient.post(
      `/api/v1/notification/test-indicator/${indicatorId}`,
    );
    return response.data;
  },
  undefined,
  'NotificationService.testIndicatorActual',
);

/**
 * 경제지표 테스트 원상복구 API
 */
export const restoreIndicatorActual = withErrorHandling(
  async (indicatorId: number): Promise<ApiResponse<{ success: boolean }>> => {
    const response = await apiClient.post(
      `/api/v1/notification/restore-indicator/${indicatorId}`,
    );
    return response.data;
  },
  undefined,
  'NotificationService.restoreIndicatorActual',
);

/**
 * 테스트용 실적 실제값 설정 API
 */
export const testEarningsActual = withErrorHandling(
  async (earningsId: number): Promise<ApiResponse<{ success: boolean }>> => {
    const response = await apiClient.post(
      `/api/v1/notification/test-earnings/${earningsId}`,
    );
    return response.data;
  },
  undefined,
  'NotificationService.testEarningsActual',
);

/**
 * 실적 테스트 원상복구 API
 */
export const restoreEarningsActual = withErrorHandling(
  async (earningsId: number): Promise<ApiResponse<{ success: boolean }>> => {
    const response = await apiClient.post(
      `/api/v1/notification/restore-earnings/${earningsId}`,
    );
    return response.data;
  },
  undefined,
  'NotificationService.restoreEarningsActual',
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

/**
 * 특정 기업의 모든 실적 알림 해제 API
 */
export const unsubscribeCompanyEarnings = withErrorHandling(
  async (
    companyId: number,
  ): Promise<ApiResponse<{ message: string; count: number }>> => {
    const response = await apiClient.delete(
      `/api/v1/notification/company/${companyId}/earnings`,
    );
    return response.data;
  },
  undefined,
  'NotificationService.unsubscribeCompanyEarnings',
);

/**
 * 특정 국가의 특정 경제지표 유형 모든 알림 해제 API
 */
export const unsubscribeBaseNameIndicator = withErrorHandling(
  async (
    baseName: string,
    country: string,
  ): Promise<ApiResponse<{ message: string; count: number }>> => {
    const response = await apiClient.delete(
      `/api/v1/notification/base-name-indicator`,
      { data: { baseName, country } },
    );
    return response.data;
  },
  undefined,
  'NotificationService.unsubscribeBaseNameIndicator',
);
