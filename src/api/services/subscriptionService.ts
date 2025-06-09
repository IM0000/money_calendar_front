import apiClient from '../client';
import { withErrorHandling } from '../../utils/errorHandler';
import { ApiResponse } from '../../types/api-response';

/**
 * 회사 구독 추가 API
 */
export const subscribeCompany = withErrorHandling(
  async (companyId: number): Promise<void> => {
    await apiClient.put(`/api/v1/subscription/companies/${companyId}`, {
      companyId,
    });
  },
  undefined,
  'SubscriptionService.subscribeCompany',
);

/**
 * 회사 구독 해제 API
 */
export const unsubscribeCompany = withErrorHandling(
  async (companyId: number): Promise<void> => {
    await apiClient.delete(`/api/v1/subscription/companies/${companyId}`, {
      data: { companyId },
    });
  },
  undefined,
  'SubscriptionService.unsubscribeCompany',
);

/**
 * 지표 그룹 구독 추가 API
 */
export const subscribeIndicatorGroup = withErrorHandling(
  async (baseName: string, country?: string): Promise<void> => {
    await apiClient.put('/api/v1/subscription/indicator-groups', {
      baseName,
      country,
    });
  },
  undefined,
  'SubscriptionService.subscribeIndicatorGroup',
);

/**
 * 지표 그룹 구독 해제 API
 */
export const unsubscribeIndicatorGroup = withErrorHandling(
  async (baseName: string, country?: string): Promise<void> => {
    await apiClient.delete('/api/v1/subscription/indicator-groups', {
      data: { baseName, country },
    });
  },
  undefined,
  'SubscriptionService.unsubscribeIndicatorGroup',
);

/**
 * 회사 구독 목록 조회 API
 */
export const getCompanySubscriptions = withErrorHandling(
  async (): Promise<
    ApiResponse<
      Array<{
        id: number;
        companyId: number;
        subscribedAt: string;
        isActive: boolean;
        company: {
          id: number;
          name: string;
          ticker: string;
          country: string;
        };
      }>
    >
  > => {
    const response = await apiClient.get('/api/v1/subscription/companies');
    return response.data;
  },
  undefined,
  'SubscriptionService.getCompanySubscriptions',
);

/**
 * 지표 그룹 구독 목록 조회 API
 */
export const getIndicatorGroupSubscriptions = withErrorHandling(
  async (): Promise<
    ApiResponse<
      Array<{
        id: number;
        baseName: string;
        country?: string;
        subscribedAt: string;
        isActive: boolean;
      }>
    >
  > => {
    const response = await apiClient.get(
      '/api/v1/subscription/indicator-groups',
    );
    return response.data;
  },
  undefined,
  'SubscriptionService.getIndicatorGroupSubscriptions',
);

/**
 * 회사 구독 여부 확인 API
 */
export const isCompanySubscribed = withErrorHandling(
  async (companyId: number): Promise<ApiResponse<boolean>> => {
    const response = await apiClient.get(
      `/api/v1/subscription/companies/${companyId}/subscribed`,
      { data: { companyId } },
    );
    return response.data;
  },
  undefined,
  'SubscriptionService.isCompanySubscribed',
);

/**
 * 지표 그룹 구독 여부 확인 API
 */
export const isIndicatorGroupSubscribed = withErrorHandling(
  async (baseName: string, country?: string): Promise<ApiResponse<boolean>> => {
    const response = await apiClient.get(
      '/api/v1/subscription/indicator-groups/subscribed',
      { params: { baseName, country } },
    );
    return response.data;
  },
  undefined,
  'SubscriptionService.isIndicatorGroupSubscribed',
);
