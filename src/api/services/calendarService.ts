// src/services/calendarService.ts

import { ApiResponse } from '../../types/api-response';
import apiClient from '../client';
import { withErrorHandling } from '../../utils/errorHandler';
import {
  DividendEvent,
  EarningsEvent,
  EconomicIndicatorEvent,
} from '@/types/calendar-event';

/**
 * 모든 이벤트(실적, 배당, 경제지표)를 한 번에 조회
 * GET /api/v1/calendar/events?startDate=yyyy-mm-dd&endDate=yyyy-mm-dd
 */
export const getCalendarEvents = withErrorHandling(
  async (
    startDate: string,
    endDate: string,
  ): Promise<
    ApiResponse<{
      earnings: EarningsEvent[];
      dividends: DividendEvent[];
      economicIndicators: EconomicIndicatorEvent[];
    }>
  > => {
    const response = await apiClient.get<
      ApiResponse<{
        earnings: EarningsEvent[];
        dividends: DividendEvent[];
        economicIndicators: EconomicIndicatorEvent[];
      }>
    >('/api/v1/calendar/events', {
      params: { startDate, endDate },
      withAuth: !!localStorage.getItem('accessToken'), // 토큰이 있는 경우에만 인증 사용
    });
    return response.data;
  },
  // 에러 시 기본값 (빈 데이터 반환)
  {
    statusCode: 500,
    errorCode: 'CALENDAR_001',
    errorMessage: '일정 데이터를 가져오는 중 오류가 발생했습니다.',
    data: {
      earnings: [],
      dividends: [],
      economicIndicators: [],
    },
  },
  'CalendarService.getCalendarEvents',
);

/**
 * 실적만 조회
 * GET /api/v1/calendar/earnings?startDate=yyyy-mm-dd&endDate=yyyy-mm-dd
 */
export const getEarningsEvents = async (
  startDate: string,
  endDate: string,
): Promise<ApiResponse<EarningsEvent[]>> => {
  const response = await apiClient.get<ApiResponse<EarningsEvent[]>>(
    '/api/v1/calendar/earnings',
    {
      params: { startDate, endDate },
      withAuth: !!localStorage.getItem('accessToken'), // 토큰이 있는 경우에만 인증 사용
    },
  );
  return response.data;
};

/**
 * 배당만 조회
 * GET /api/v1/calendar/dividends?startDate=yyyy-mm-dd&endDate=yyyy-mm-dd
 */
export const getDividendEvents = async (
  startDate: string,
  endDate: string,
): Promise<ApiResponse<DividendEvent[]>> => {
  const response = await apiClient.get<ApiResponse<DividendEvent[]>>(
    '/api/v1/calendar/dividends',
    {
      params: { startDate, endDate },
      withAuth: !!localStorage.getItem('accessToken'), // 토큰이 있는 경우에만 인증 사용
    },
  );
  return response.data;
};

/**
 * 경제지표만 조회
 * GET /api/v1/calendar/economic-indicators?startDate=yyyy-mm-dd&endDate=yyyy-mm-dd
 */
export const getEconomicIndicatorEvents = async (
  startDate: string,
  endDate: string,
): Promise<ApiResponse<EconomicIndicatorEvent[]>> => {
  const response = await apiClient.get<ApiResponse<EconomicIndicatorEvent[]>>(
    '/api/v1/calendar/economic-indicators',
    {
      params: { startDate, endDate },
      withAuth: !!localStorage.getItem('accessToken'), // 토큰이 있는 경우에만 인증 사용
    },
  );
  return response.data;
};

/**
 * 관심 일정만 조회
 * GET /api/v1/favorites/calendar?startDate=yyyy-mm-dd&endDate=yyyy-mm-dd
 */
export const getFavoriteCalendarEvents = withErrorHandling(
  async (
    startDate: string,
    endDate: string,
  ): Promise<
    ApiResponse<{
      earnings: EarningsEvent[];
      dividends: DividendEvent[];
      economicIndicators: EconomicIndicatorEvent[];
    }>
  > => {
    const response = await apiClient.get<
      ApiResponse<{
        earnings: EarningsEvent[];
        dividends: DividendEvent[];
        economicIndicators: EconomicIndicatorEvent[];
      }>
    >('/api/v1/favorites/calendar', {
      params: { startDate, endDate },
      withAuth: true, // 인증이 필요한 API
    });
    return response.data;
  },
  // 에러 시 기본값 (빈 데이터 반환)
  {
    statusCode: 500,
    errorCode: 'FAVORITES_001',
    errorMessage: '관심 일정 데이터를 가져오는 중 오류가 발생했습니다.',
    data: {
      earnings: [],
      dividends: [],
      economicIndicators: [],
    },
  },
  'CalendarService.getFavoriteCalendarEvents',
);

/**
 * 실적 정보 관심 목록에 추가
 * POST /api/v1/favorites/earnings/:id
 */
export const addFavoriteEarnings = async (
  earningsId: number,
): Promise<ApiResponse<{ success: boolean }>> => {
  const response = await apiClient.post<ApiResponse<{ success: boolean }>>(
    `/api/v1/favorites/earnings/${earningsId}`,
    {},
    { withAuth: true },
  );
  return response.data;
};

/**
 * 실적 정보 관심 목록에서 제거
 * DELETE /api/v1/favorites/earnings/:id
 */
export const removeFavoriteEarnings = async (
  earningsId: number,
): Promise<ApiResponse<{ success: boolean }>> => {
  const response = await apiClient.delete<ApiResponse<{ success: boolean }>>(
    `/api/v1/favorites/earnings/${earningsId}`,
    { withAuth: true },
  );
  return response.data;
};

/**
 * 배당 정보 관심 목록에 추가
 * POST /api/v1/favorites/dividends/:id
 */
export const addFavoriteDividend = async (
  dividendId: number,
): Promise<ApiResponse<{ success: boolean }>> => {
  const response = await apiClient.post<ApiResponse<{ success: boolean }>>(
    `/api/v1/favorites/dividends/${dividendId}`,
    {},
    { withAuth: true },
  );
  return response.data;
};

/**
 * 배당 정보 관심 목록에서 제거
 * DELETE /api/v1/favorites/dividends/:id
 */
export const removeFavoriteDividend = async (
  dividendId: number,
): Promise<ApiResponse<{ success: boolean }>> => {
  const response = await apiClient.delete<ApiResponse<{ success: boolean }>>(
    `/api/v1/favorites/dividends/${dividendId}`,
    { withAuth: true },
  );
  return response.data;
};

/**
 * 경제지표 관심 목록에 추가
 * POST /api/v1/favorites/economic-indicators/:id
 */
export const addFavoriteEconomicIndicator = async (
  indicatorId: number,
): Promise<ApiResponse<{ success: boolean }>> => {
  const response = await apiClient.post<ApiResponse<{ success: boolean }>>(
    `/api/v1/favorites/economic-indicators/${indicatorId}`,
    {},
    { withAuth: true },
  );
  return response.data;
};

/**
 * 경제지표 관심 목록에서 제거
 * DELETE /api/v1/favorites/economic-indicators/:id
 */
export const removeFavoriteEconomicIndicator = async (
  indicatorId: number,
): Promise<ApiResponse<{ success: boolean }>> => {
  const response = await apiClient.delete<ApiResponse<{ success: boolean }>>(
    `/api/v1/favorites/economic-indicators/${indicatorId}`,
    { withAuth: true },
  );
  return response.data;
};

/**
 * 관심 일정 카운트 조회
 * GET /api/v1/favorites/count
 */
export const getFavoriteCount = async (): Promise<
  ApiResponse<{
    earnings: number;
    dividends: number;
    economicIndicators: number;
  }>
> => {
  const response = await apiClient.get<
    ApiResponse<{
      earnings: number;
      dividends: number;
      economicIndicators: number;
    }>
  >('/api/v1/favorites/count', { withAuth: true });
  return response.data;
};

/**
 * 특정 기업의 이전 실적 정보 조회
 * GET /api/v1/calendar/earnings/history/:companyId?page=1&limit=5
 */
export const getCompanyEarningsHistory = withErrorHandling(
  async (
    companyId: number,
    page: number = 1,
    limit: number = 5,
  ): Promise<
    ApiResponse<{
      items: EarningsEvent[];
      pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    }>
  > => {
    const response = await apiClient.get<
      ApiResponse<{
        items: EarningsEvent[];
        pagination: {
          total: number;
          page: number;
          limit: number;
          totalPages: number;
        };
      }>
    >(`/api/v1/calendar/earnings/history/${companyId}`, {
      params: { page, limit },
      withAuth: true,
    });
    return response.data;
  },
);

/**
 * 특정 기업의 이전 배당금 정보 조회
 * GET /api/v1/calendar/dividends/history/:companyId?page=1&limit=5
 */
export const getCompanyDividendHistory = withErrorHandling(
  async (
    companyId: number,
    page: number = 1,
    limit: number = 5,
  ): Promise<
    ApiResponse<{
      items: DividendEvent[];
      pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    }>
  > => {
    const response = await apiClient.get<
      ApiResponse<{
        items: DividendEvent[];
        pagination: {
          total: number;
          page: number;
          limit: number;
          totalPages: number;
        };
      }>
    >(`/api/v1/calendar/dividends/history/${companyId}`, {
      params: { page, limit },
      withAuth: true,
    });
    return response.data;
  },
);
