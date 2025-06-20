import apiClient from '../client';
import { withErrorHandling } from '../../utils/errorHandler';
import { ApiResponse } from '../../types/api-response';
import {
  Company,
  DividendEvent,
  EarningsEvent,
  EconomicIndicatorEvent,
} from '@/types/calendar-event';

// 검색 결과 인터페이스
interface SearchResult<T> {
  items?: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * 기업 검색 API
 */
export const searchCompanies = withErrorHandling(
  async ({
    query,
    country,
    page = 1,
    limit = 10,
  }: {
    query?: string;
    country?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<SearchResult<Company>>> => {
    const response = await apiClient.get('/api/v1/search/companies', {
      params: { query, country, page, limit },
    });
    return response.data;
  },
  undefined,
  'CalendarService.searchCompanies',
);

/**
 * 경제지표 검색 API
 */
export const searchIndicators = withErrorHandling(
  async ({
    query,
    country,
    page = 1,
    limit = 10,
  }: {
    query?: string;
    country?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<SearchResult<EconomicIndicatorEvent>>> => {
    const response = await apiClient.get('/api/v1/search/indicators', {
      params: { query, country, page, limit },
    });
    return response.data;
  },
  undefined,
  'CalendarService.searchIndicators',
);

/**
 * 기업 상세 정보 조회 API
 */
export const getCompanyById = withErrorHandling(
  async (companyId: number): Promise<ApiResponse<Company>> => {
    const response = await apiClient.get(`/api/v1/companies/${companyId}`);
    return response.data;
  },
  undefined,
  'CalendarService.getCompanyById',
);

/**
 * 기업 실적 정보 조회 API
 */
export const getCompanyEarnings = withErrorHandling(
  async ({
    companyId,
    page = 1,
    limit = 5,
  }: {
    companyId: number;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<SearchResult<EarningsEvent>>> => {
    const response = await apiClient.get(
      `/api/v1/companies/${companyId}/earnings`,
      {
        params: { page, limit },
      },
    );
    return response.data;
  },
  undefined,
  'CalendarService.getCompanyEarnings',
);

/**
 * 기업 배당 정보 조회 API
 */
export const getCompanyDividends = withErrorHandling(
  async ({
    companyId,
    page = 1,
    limit = 5,
  }: {
    companyId: number;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<SearchResult<DividendEvent>>> => {
    const response = await apiClient.get(
      `/api/v1/companies/${companyId}/dividends`,
      {
        params: { page, limit },
      },
    );
    return response.data;
  },
  undefined,
  'CalendarService.getCompanyDividends',
);
