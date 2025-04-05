import apiClient from '../client';
import { withErrorHandling } from '../../utils/errorHandler';
import { ApiResponse } from '../../types/api-response';

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
 * POST /api/v1/notifications/indicators/:id
 * @param indicatorId 경제지표 ID
 * @returns ApiResponse<{success: boolean}>
 */
export const addIndicatorNotification = withErrorHandling(
  async (indicatorId: number): Promise<ApiResponse<{ success: boolean }>> => {
    const response = await apiClient.post(
      `/api/v1/notifications/indicators/${indicatorId}`,
      {},
      { withAuth: true },
    );
    return response.data;
  },
);

/**
 * 경제지표 알림 제거 API
 * DELETE /api/v1/notifications/indicators/:id
 * @param indicatorId 경제지표 ID
 * @returns ApiResponse<{success: boolean}>
 */
export const removeIndicatorNotification = withErrorHandling(
  async (indicatorId: number): Promise<ApiResponse<{ success: boolean }>> => {
    const response = await apiClient.delete(
      `/api/v1/notifications/indicators/${indicatorId}`,
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
 * @returns ApiResponse<{items: Notification[], pagination: {...}}>
 */
export const getNotifications = withErrorHandling(
  async (
    page: number = 1,
    limit: number = 10,
  ): Promise<
    ApiResponse<{
      items: Array<{
        id: number;
        type: 'EARNINGS' | 'DIVIDEND' | 'ECONOMIC_INDICATOR';
        contentId: number;
        isRead: boolean;
        createdAt: string;
        content: {
          title: string;
          message: string;
        };
      }>;
      pagination: {
        total: number;
        totalPages: number;
        page: number;
        limit: number;
      };
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
 * 알림 읽음 표시 API
 * PATCH /api/v1/notifications/:id/read
 * @param notificationId 알림 ID
 * @returns ApiResponse<{success: boolean}>
 */
export const markNotificationAsRead = withErrorHandling(
  async (
    notificationId: number,
  ): Promise<ApiResponse<{ success: boolean }>> => {
    const response = await apiClient.patch(
      `/api/v1/notifications/${notificationId}/read`,
      {},
      { withAuth: true },
    );
    return response.data;
  },
);

/**
 * 모든 알림 읽음 표시 API
 * PATCH /api/v1/notifications/read-all
 * @returns ApiResponse<{success: boolean, count: number}>
 */
export const markAllNotificationsAsRead = withErrorHandling(
  async (): Promise<ApiResponse<{ success: boolean; count: number }>> => {
    const response = await apiClient.patch(
      '/api/v1/notifications/read-all',
      {},
      { withAuth: true },
    );
    return response.data;
  },
);

/**
 * 알림 설정 조회 API
 * GET /api/v1/notifications/settings
 * @returns ApiResponse<{settings: NotificationSettings}>
 */
export const getNotificationSettings = withErrorHandling(
  async (): Promise<
    ApiResponse<{
      settings: {
        email: boolean;
        push: boolean;
        earnings: boolean;
        dividends: boolean;
        economicIndicators: boolean;
      };
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
 * PATCH /api/v1/notifications/settings
 * @param settings 업데이트할 설정
 * @returns ApiResponse<{success: boolean}>
 */
export const updateNotificationSettings = withErrorHandling(
  async (settings: {
    email?: boolean;
    push?: boolean;
    earnings?: boolean;
    dividends?: boolean;
    economicIndicators?: boolean;
  }): Promise<ApiResponse<{ success: boolean }>> => {
    const response = await apiClient.patch(
      '/api/v1/notifications/settings',
      settings,
      { withAuth: true },
    );
    return response.data;
  },
);
