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
    });
    return response.data;
  },
  undefined,
  'CalendarService.getCalendarEvents',
);

/**
 * 실적만 조회
 */
export const getEarningsEvents = withErrorHandling(
  async (
    startDate: string,
    endDate: string,
  ): Promise<ApiResponse<EarningsEvent[]>> => {
    const response = await apiClient.get<ApiResponse<EarningsEvent[]>>(
      '/api/v1/calendar/earnings',
      { params: { startDate, endDate } },
    );
    return response.data;
  },
  undefined,
  'CalendarService.getEarningsEvents',
);

/**
 * 배당만 조회
 */
export const getDividendEvents = withErrorHandling(
  async (
    startDate: string,
    endDate: string,
  ): Promise<ApiResponse<DividendEvent[]>> => {
    const response = await apiClient.get<ApiResponse<DividendEvent[]>>(
      '/api/v1/calendar/dividends',
      { params: { startDate, endDate } },
    );
    return response.data;
  },
  undefined,
  'CalendarService.getDividendEvents',
);

/**
 * 경제지표만 조회
 */
export const getEconomicIndicatorEvents = withErrorHandling(
  async (
    startDate: string,
    endDate: string,
  ): Promise<ApiResponse<EconomicIndicatorEvent[]>> => {
    const response = await apiClient.get<ApiResponse<EconomicIndicatorEvent[]>>(
      '/api/v1/calendar/economic-indicators',
      { params: { startDate, endDate } },
    );
    return response.data;
  },
  undefined,
  'CalendarService.getEconomicIndicatorEvents',
);

/**
 * 관심 일정만 조회
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
    });
    return response.data;
  },
  undefined,
  'CalendarService.getFavoriteCalendarEvents',
);

/**
 * 실적 정보 관심 목록에 추가
 */
export const addFavoriteEarnings = withErrorHandling(
  async (earningsId: number): Promise<ApiResponse<{ success: boolean }>> => {
    const response = await apiClient.post<ApiResponse<{ success: boolean }>>(
      `/api/v1/favorites/earnings/${earningsId}`,
    );
    return response.data;
  },
  undefined,
  'CalendarService.addFavoriteEarnings',
);

/**
 * 실적 정보 관심 목록에서 제거
 */
export const removeFavoriteEarnings = withErrorHandling(
  async (earningsId: number): Promise<ApiResponse<{ success: boolean }>> => {
    const response = await apiClient.delete<ApiResponse<{ success: boolean }>>(
      `/api/v1/favorites/earnings/${earningsId}`,
    );
    return response.data;
  },
  undefined,
  'CalendarService.removeFavoriteEarnings',
);

/**
 * 배당 정보 관심 목록에 추가
 */
export const addFavoriteDividend = withErrorHandling(
  async (dividendId: number): Promise<ApiResponse<{ success: boolean }>> => {
    const response = await apiClient.post<ApiResponse<{ success: boolean }>>(
      `/api/v1/favorites/dividends/${dividendId}`,
    );
    return response.data;
  },
  undefined,
  'CalendarService.addFavoriteDividend',
);

/**
 * 배당 정보 관심 목록에서 제거
 */
export const removeFavoriteDividend = withErrorHandling(
  async (dividendId: number): Promise<ApiResponse<{ success: boolean }>> => {
    const response = await apiClient.delete<ApiResponse<{ success: boolean }>>(
      `/api/v1/favorites/dividends/${dividendId}`,
    );
    return response.data;
  },
  undefined,
  'CalendarService.removeFavoriteDividend',
);

/**
 * 경제지표 관심 목록에 추가
 */
export const addFavoriteEconomicIndicator = withErrorHandling(
  async (indicatorId: number): Promise<ApiResponse<{ success: boolean }>> => {
    const response = await apiClient.post<ApiResponse<{ success: boolean }>>(
      `/api/v1/favorites/economic-indicators/${indicatorId}`,
    );
    return response.data;
  },
  undefined,
  'CalendarService.addFavoriteEconomicIndicator',
);

/**
 * 경제지표 관심 목록에서 제거
 */
export const removeFavoriteEconomicIndicator = withErrorHandling(
  async (indicatorId: number): Promise<ApiResponse<{ success: boolean }>> => {
    const response = await apiClient.delete<ApiResponse<{ success: boolean }>>(
      `/api/v1/favorites/economic-indicators/${indicatorId}`,
    );
    return response.data;
  },
  undefined,
  'CalendarService.removeFavoriteEconomicIndicator',
);

/**
 * 관심 일정 카운트 조회
 */
export const getFavoriteCount = withErrorHandling(
  async (): Promise<
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
    >('/api/v1/favorites/count');
    return response.data;
  },
  undefined,
  'CalendarService.getFavoriteCount',
);

/**
 * 특정 기업의 이전 실적 정보 조회
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
    });
    return response.data;
  },
  undefined,
  'CalendarService.getCompanyEarningsHistory',
);

/**
 * 특정 기업의 이전 배당금 정보 조회
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
    });
    return response.data;
  },
  undefined,
  'CalendarService.getCompanyDividendHistory',
);
