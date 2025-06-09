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
 * 관심 일정만 조회 (즐겨찾기 기반)
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
    >('/api/v1/calendar/favorites', {
      params: { startDate, endDate },
    });
    return response.data;
  },
  undefined,
  'CalendarService.getFavoriteCalendarEvents',
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

/**
 * 특정 지표 그룹의 경제지표 히스토리 조회
 */
export const getIndicatorGroupHistory = withErrorHandling(
  async (
    baseName: string,
    country?: string,
    page: number = 1,
    limit: number = 10,
  ): Promise<
    ApiResponse<{
      items: EconomicIndicatorEvent[];
      pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      };
    }>
  > => {
    const params: {
      baseName: string;
      page: number;
      limit: number;
      country?: string;
    } = { baseName, page, limit };
    if (country) {
      params.country = country;
    }

    const response = await apiClient.get<
      ApiResponse<{
        items: EconomicIndicatorEvent[];
        pagination: {
          total: number;
          page: number;
          limit: number;
          totalPages: number;
        };
      }>
    >('/api/v1/calendar/indicators/history', {
      params,
    });
    return response.data;
  },
  undefined,
  'CalendarService.getIndicatorGroupHistory',
);
