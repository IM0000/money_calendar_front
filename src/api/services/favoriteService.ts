import apiClient from '../client';
import { withErrorHandling } from '../../utils/errorHandler';
import { ApiResponse } from '../../types/api-response';
import {
  DividendEvent,
  EarningsEvent,
  EconomicIndicatorEvent,
} from '@/types/calendar-event';

/**
 * 모든 관심 목록 조회
 */
export const getAllFavorites = withErrorHandling(
  async (
    startDate?: string,
    endDate?: string,
  ): Promise<
    ApiResponse<{
      earnings: EarningsEvent[];
      dividends: DividendEvent[];
      economicIndicators: EconomicIndicatorEvent[];
    }>
  > => {
    const params = startDate && endDate ? { startDate, endDate } : {};
    const response = await apiClient.get<
      ApiResponse<{
        earnings: EarningsEvent[];
        dividends: DividendEvent[];
        economicIndicators: EconomicIndicatorEvent[];
      }>
    >('/api/v1/favorites', { params });
    return response.data;
  },
  undefined,
  'FavoriteService.getAllFavorites',
);

/**
 * 회사 관심 목록에 추가
 */
export const addFavoriteCompany = withErrorHandling(
  async (companyId: number): Promise<ApiResponse<{ success: boolean }>> => {
    const response = await apiClient.post<ApiResponse<{ success: boolean }>>(
      `/api/v1/favorites/companies/${companyId}`,
      { companyId },
    );
    return response.data;
  },
  undefined,
  'FavoriteService.addFavoriteCompany',
);

/**
 * 회사 관심 목록에서 제거
 */
export const removeFavoriteCompany = withErrorHandling(
  async (companyId: number): Promise<ApiResponse<{ success: boolean }>> => {
    const response = await apiClient.delete<ApiResponse<{ success: boolean }>>(
      `/api/v1/favorites/companies/${companyId}`,
      { data: { companyId } },
    );
    return response.data;
  },
  undefined,
  'FavoriteService.removeFavoriteCompany',
);

/**
 * 지표 그룹 관심 목록에 추가
 */
export const addFavoriteIndicatorGroup = withErrorHandling(
  async (
    baseName: string,
    country?: string,
  ): Promise<ApiResponse<{ success: boolean }>> => {
    const response = await apiClient.post<ApiResponse<{ success: boolean }>>(
      '/api/v1/favorites/indicator-groups',
      { baseName, country },
    );
    return response.data;
  },
  undefined,
  'FavoriteService.addFavoriteIndicatorGroup',
);

/**
 * 지표 그룹 관심 목록에서 제거
 */
export const removeFavoriteIndicatorGroup = withErrorHandling(
  async (
    baseName: string,
    country?: string,
  ): Promise<ApiResponse<{ success: boolean }>> => {
    const response = await apiClient.delete<ApiResponse<{ success: boolean }>>(
      '/api/v1/favorites/indicator-groups',
      { data: { baseName, country } },
    );
    return response.data;
  },
  undefined,
  'FavoriteService.removeFavoriteIndicatorGroup',
);

/**
 * 관심 일정 카운트 조회
 */
export const getFavoriteCount = withErrorHandling(
  async (): Promise<
    ApiResponse<{
      companies: number;
      indicatorGroups: number;
    }>
  > => {
    const response = await apiClient.get<
      ApiResponse<{
        companies: number;
        indicatorGroups: number;
      }>
    >('/api/v1/favorites/count');
    return response.data;
  },
  undefined,
  'FavoriteService.getFavoriteCount',
);
