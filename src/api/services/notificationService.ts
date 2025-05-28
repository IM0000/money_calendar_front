import apiClient from '../client';
import { withErrorHandling } from '../../utils/errorHandler';
import { ApiResponse } from '../../types/api-response';
import { Notification } from '@/types/notification';
import { EarningsEvent, EconomicIndicatorEvent } from '@/types/calendar-event';

/**
 * 알림 추가 API
 */
export const addEarningsNotification = withErrorHandling(
  async (earningsId: number): Promise<ApiResponse<{ success: boolean }>> => {
    const response = await apiClient.post(
      `/api/v1/notifications/earnings/${earningsId}`,
    );
    return response.data;
  },
  undefined,
  'NotificationService.addEarningsNotification',
);

/**
 * 알림 제거 API
 */
export const removeEarningsNotification = withErrorHandling(
  async (earningsId: number): Promise<ApiResponse<{ success: boolean }>> => {
    const response = await apiClient.delete(
      `/api/v1/notifications/earnings/${earningsId}`,
    );
    return response.data;
  },
  undefined,
  'NotificationService.removeEarningsNotification',
);

/**
 * 배당 알림 추가 API
 */
export const addDividendNotification = withErrorHandling(
  async (dividendId: number): Promise<ApiResponse<{ success: boolean }>> => {
    const response = await apiClient.post(
      `/api/v1/notifications/dividends/${dividendId}`,
    );
    return response.data;
  },
  undefined,
  'NotificationService.addDividendNotification',
);

/**
 * 배당 알림 제거 API
 */
export const removeDividendNotification = withErrorHandling(
  async (dividendId: number): Promise<ApiResponse<{ success: boolean }>> => {
    const response = await apiClient.delete(
      `/api/v1/notifications/dividends/${dividendId}`,
    );
    return response.data;
  },
  undefined,
  'NotificationService.removeDividendNotification',
);

/**
 * 경제지표 알림 추가 API
 */
export const addIndicatorNotification = withErrorHandling(
  async (indicatorId: number): Promise<ApiResponse<{ success: boolean }>> => {
    const response = await apiClient.post(
      `/api/v1/notifications/economic-indicators/${indicatorId}`,
    );
    return response.data;
  },
  undefined,
  'NotificationService.addIndicatorNotification',
);

/**
 * 경제지표 알림 제거 API
 */
export const removeIndicatorNotification = withErrorHandling(
  async (indicatorId: number): Promise<ApiResponse<{ success: boolean }>> => {
    const response = await apiClient.delete(
      `/api/v1/notifications/economic-indicators/${indicatorId}`,
    );
    return response.data;
  },
  undefined,
  'NotificationService.removeIndicatorNotification',
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
    const response = await apiClient.get('/api/v1/notifications', {
      params: { page, limit },
    });
    return response.data;
  },
  undefined,
  'NotificationService.getNotifications',
);

/**
 * 읽지 않은 알림 개수 조회 API
 */
export const getUnreadNotificationsCount = withErrorHandling(
  async (): Promise<ApiResponse<{ count: number }>> => {
    const response = await apiClient.get('/api/v1/notifications/unread/count');
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
      `/api/v1/notifications/${notificationId}/read`,
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
    const response = await apiClient.put('/api/v1/notifications/read/all');
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
      `/api/v1/notifications/${notificationId}`,
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
      pushEnabled: boolean;
      preferredMethod: 'EMAIL' | 'PUSH' | 'BOTH';
    }>
  > => {
    const response = await apiClient.get('/api/v1/notifications/settings');
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
    pushEnabled?: boolean;
    preferredMethod?: 'EMAIL' | 'PUSH' | 'BOTH';
  }): Promise<
    ApiResponse<{
      emailEnabled: boolean;
      pushEnabled: boolean;
      preferredMethod: 'EMAIL' | 'PUSH' | 'BOTH';
    }>
  > => {
    const response = await apiClient.put(
      '/api/v1/notifications/settings',
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
    const response = await apiClient.get('/api/v1/notifications/calendar');
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
      `/api/v1/notifications/test-indicator/${indicatorId}`,
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
      `/api/v1/notifications/restore-indicator/${indicatorId}`,
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
      `/api/v1/notifications/test-earnings/${earningsId}`,
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
      `/api/v1/notifications/restore-earnings/${earningsId}`,
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
    const response = await apiClient.delete('/api/v1/notifications/all');
    return response.data;
  },
  undefined,
  'NotificationService.deleteAllNotifications',
);
