export interface Notification {
  id: number;
  contentType: 'EARNINGS' | 'DIVIDEND' | 'ECONOMIC_INDICATOR';
  contentId: number;
  userId: number;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationSettings {
  emailEnabled: boolean;
  slackEnabled: boolean;
}

export interface IndicatorNotification {
  id: number;
  name: string;
  country: string;
  releaseDate: number;
  importance: number;
  notificationId?: number;
}

export interface EarningsNotification {
  id: number;
  companyName: string;
  country: string;
  releaseDate: number;
  ticker: string;
  notificationId?: number;
}

export interface NotificationResponse {
  notifications: Notification[];
  total: number;
}

// src/types/notification.ts

/**
 * 기업 구독 정보 DTO
 */
export interface CompanySubscription {
  id: number;
  type: 'company';
  subscribedAt: string; // ISO 날짜 문자열
  company: {
    id: number;
    name: string;
    ticker: string;
    country: string;
  };
  earnings: {
    id: number;
    country: string;
    releaseDate: number;
    releaseTiming: string;
    actualEPS: string;
    forecastEPS: string;
    previousEPS: string;
    actualRevenue: string;
    forecastRevenue: string;
    previousRevenue: string;
  };
}

/**
 * 개별 실적 구독 정보 DTO
 */
export interface EarningsSubscription {
  id: number;
  type: 'earnings';
  subscribedAt: string; // ISO 날짜 문자열
  company: {
    id: number;
    name: string;
    ticker: string;
    country: string;
  };
  earnings: {
    id: number;
    country: string;
    releaseDate: number;
    releaseTiming: string;
    actualEPS: string;
    forecastEPS: string;
    previousEPS: string;
    actualRevenue: string;
    forecastRevenue: string;
    previousRevenue: string;
  };
}

/**
 * 경제지표 유형 구독 정보 DTO
 */
export interface BaseNameSubscription {
  id: number;
  type: 'baseNameIndicator';
  subscribedAt: string; // ISO 날짜 문자열
  indicator: {
    id: number;
    name: string;
    baseName: string;
    country: string;
    releaseDate: number;
    importance: string;
    actual: string;
    forecast: string;
    previous: string;
  };
}

/**
 * 개별 경제지표 구독 정보 DTO
 */
export interface IndicatorSubscription {
  id: number;
  type: 'indicator';
  subscribedAt: string; // ISO 날짜 문자열
  indicator: {
    id: number;
    name: string;
    baseName: string;
    country: string;
    releaseDate: number;
    importance: string;
    actual: string;
    forecast: string;
    previous: string;
  };
}

/**
 * getUserSubscriptions 메서드의 최종 API 응답 데이터
 */
export interface UserSubscriptionsResponse {
  earnings: {
    companies: CompanySubscription[];
    individual: EarningsSubscription[];
    total: number; // companies.length + individual.length
  };
  indicators: {
    baseNames: BaseNameSubscription[];
    individual: IndicatorSubscription[];
    total: number; // baseNames.length + individual.length
  };
  totalCount: number;
}

export enum SubscriptionType {
  EARNINGS = 'earnings',
  COMPANY = 'company',
  INDICATOR = 'indicator',
  BASE_NAME = 'baseNameIndicator',
}
