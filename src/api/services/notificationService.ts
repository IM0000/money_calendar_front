import apiClient from '../client';
import { withErrorHandling } from '../../utils/errorHandler';
import { ApiResponse } from '../../types/api-response';
import { Notification } from '@/types/notification';
import { EarningsEvent, EconomicIndicatorEvent } from '@/types/calendar-event';

/**
 * 알림 추가 API
 * POST /api/v1/notifications/earnings/:id
 * @param earningsId 실적 ID
 * @returns ApiResponse<{success: boolean}>
 */
export const addEarningsNotification = withErrorHandling(
  async (earningsId: number): Promise<ApiResponse<{ success: boolean }>> => {
    const response = await apiClient.post(
      `/api/v1/notifications/earnings/${earningsId}`,
      {},
      { withAuth: true },
    );
    return response.data;
  },
);

/**
 * 알림 제거 API
 * DELETE /api/v1/notifications/earnings/:id
 * @param earningsId 실적 ID
 * @returns ApiResponse<{success: boolean}>
 */
export const removeEarningsNotification = withErrorHandling(
  async (earningsId: number): Promise<ApiResponse<{ success: boolean }>> => {
    const response = await apiClient.delete(
      `/api/v1/notifications/earnings/${earningsId}`,
      { withAuth: true },
    );
    return response.data;
  },
);

/**
 * 배당 알림 추가 API
 * POST /api/v1/notifications/dividends/:id
 * @param dividendId 배당 ID
 * @returns ApiResponse<{success: boolean}>
 */
export const addDividendNotification = withErrorHandling(
  async (dividendId: number): Promise<ApiResponse<{ success: boolean }>> => {
    const response = await apiClient.post(
      `/api/v1/notifications/dividends/${dividendId}`,
      {},
      { withAuth: true },
    );
    return response.data;
  },
);

/**
 * 배당 알림 제거 API
 * DELETE /api/v1/notifications/dividends/:id
 * @param dividendId 배당 ID
 * @returns ApiResponse<{success: boolean}>
 */
export const removeDividendNotification = withErrorHandling(
  async (dividendId: number): Promise<ApiResponse<{ success: boolean }>> => {
    const response = await apiClient.delete(
      `/api/v1/notifications/dividends/${dividendId}`,
      { withAuth: true },
    );
    return response.data;
  },
);

/**
 * 경제지표 알림 추가 API
 * POST /api/v1/notifications/economic-indicators/:id
 * @param indicatorId 경제지표 ID
 * @returns ApiResponse<{success: boolean}>
 */
export const addIndicatorNotification = withErrorHandling(
  async (indicatorId: number): Promise<ApiResponse<{ success: boolean }>> => {
    const response = await apiClient.post(
      `/api/v1/notifications/economic-indicators/${indicatorId}`,
      {},
      { withAuth: true },
    );
    return response.data;
  },
);

/**
 * 경제지표 알림 제거 API
 * DELETE /api/v1/notifications/economic-indicators/:id
 * @param indicatorId 경제지표 ID
 * @returns ApiResponse<{success: boolean}>
 */
export const removeIndicatorNotification = withErrorHandling(
  async (indicatorId: number): Promise<ApiResponse<{ success: boolean }>> => {
    const response = await apiClient.delete(
      `/api/v1/notifications/economic-indicators/${indicatorId}`,
      { withAuth: true },
    );
    return response.data;
  },
);

/**
 * 알림 목록 조회 API
 * GET /api/v1/notifications?page=1&limit=10
 * @param page 페이지 번호
 * @param limit 페이지당 항목 수
 * @returns ApiResponse<{notifications: Notification[], total: number}>
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
      withAuth: true,
    });
    return response.data;
  },
);

/**
 * 읽지 않은 알림 개수 조회 API
 * GET /api/v1/notifications/unread/count
 * @returns ApiResponse<{count: number}>
 */
export const getUnreadNotificationsCount = withErrorHandling(
  async (): Promise<ApiResponse<{ count: number }>> => {
    const response = await apiClient.get('/api/v1/notifications/unread/count', {
      withAuth: true,
    });
    return response.data;
  },
);

/**
 * 알림 읽음 표시 API
 * PUT /api/v1/notifications/:id/read
 * @param notificationId 알림 ID
 * @returns ApiResponse<{message: string}>
 */
export const markNotificationAsRead = withErrorHandling(
  async (notificationId: number): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.put(
      `/api/v1/notifications/${notificationId}/read`,
      {},
      { withAuth: true },
    );
    return response.data;
  },
);

/**
 * 모든 알림 읽음 표시 API
 * PUT /api/v1/notifications/read/all
 * @returns ApiResponse<{message: string, count: number}>
 */
export const markAllNotificationsAsRead = withErrorHandling(
  async (): Promise<ApiResponse<{ message: string; count: number }>> => {
    const response = await apiClient.put(
      '/api/v1/notifications/read/all',
      {},
      { withAuth: true },
    );
    return response.data;
  },
);

/**
 * 알림 삭제 API
 * DELETE /api/v1/notifications/:id
 * @param notificationId 알림 ID
 * @returns ApiResponse<{message: string}>
 */
export const deleteNotification = withErrorHandling(
  async (notificationId: number): Promise<ApiResponse<{ message: string }>> => {
    const response = await apiClient.delete(
      `/api/v1/notifications/${notificationId}`,
      { withAuth: true },
    );
    return response.data;
  },
);

/**
 * 알림 설정 조회 API
 * GET /api/v1/notifications/settings
 * @returns ApiResponse<UserNotificationSettings>
 */
export const getNotificationSettings = withErrorHandling(
  async (): Promise<
    ApiResponse<{
      emailEnabled: boolean;
      pushEnabled: boolean;
      preferredMethod: 'EMAIL' | 'PUSH' | 'BOTH';
    }>
  > => {
    const response = await apiClient.get('/api/v1/notifications/settings', {
      withAuth: true,
    });
    return response.data;
  },
);

/**
 * 알림 설정 업데이트 API
 * PUT /api/v1/notifications/settings
 * @param settings 업데이트할 설정
 * @returns ApiResponse<UserNotificationSettings>
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
      { withAuth: true },
    );
    return response.data;
  },
);

/**
 * 알림 설정된 캘린더 정보 조회 API
 * GET /api/v1/notifications/calendar
 * @returns ApiResponse<{
 *   economicIndicators: Array<EconomicIndicatorEvent>;
 *   earnings: Array<EarningsEvent>;
 * }>
 */
export const getNotificationCalendar = withErrorHandling(
  async (): Promise<
    ApiResponse<{
      economicIndicators: Array<EconomicIndicatorEvent>;
      earnings: Array<EarningsEvent>;
    }>
  > => {
    const response = await apiClient.get('/api/v1/notifications/calendar', {
      withAuth: true,
    });
    return response.data;
  },
);
