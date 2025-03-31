// src/services/CalendarService.ts

import { ApiResponse } from '@/types/ApiResponse';
import apiClient from '../client';
import { withErrorHandling } from '@/utils/errorHandler';

export interface EarningsEvent {
  id: number;
  releaseDate: number; // 밀리초 단위 타임스탬프
  releaseTiming: 'UNKNOWN' | 'PRE_MARKET' | 'POST_MARKET';
  eventCountry: string; // 실적 이벤트에 정의된 국가 (Earnings 모델의 country)
  actualEPS: string;
  forecastEPS: string;
  previousEPS: string;
  actualRevenue: string;
  forecastRevenue: string;
  previousRevenue: string;
  company: {
    id: number;
    ticker: string;
    name: string;
    companyCountry: string; // 회사 모델의 country
  };
  createdAt: string;
  updatedAt: string;
}

export interface DividendEvent {
  id: number;
  exDividendDate: number; // 밀리초 단위
  dividendAmount: string;
  previousDividendAmount: string;
  paymentDate: number; // 밀리초 단위
  eventCountry: string; // 배당 이벤트의 나라 (Dividend 모델의 country)
  dividendYield: string; // 배당수익률
  company: {
    id: number;
    ticker: string;
    name: string;
    companyCountry: string; // 회사의 나라 (Company 모델의 country)
  };
  createdAt: string; // 생성일자 (ISO 문자열)
  updatedAt: string; // 수정일자 (ISO 문자열)
}

export interface EconomicIndicatorEvent {
  id: number;
  releaseDate: number; // 밀리초 단위
  eventCountry: string; // 경제지표 이벤트의 나라 (EconomicIndicator 모델의 country)
  name: string;
  importance: number;
  actual: string;
  forecast: string;
  previous: string;
  createdAt: string;
  updatedAt: string;
}

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
    console.log('getCalendarEvents', startDate, endDate);
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
