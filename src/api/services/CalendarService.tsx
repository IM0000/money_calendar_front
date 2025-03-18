// src/services/CalendarService.ts

import { ApiResponse } from '@/types/ApiResponse';
import apiClient from '../client';

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
export const getCalendarEvents = async (
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
};

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
