export interface Notification {
  id: number;
  contentType: 'EARNINGS' | 'DIVIDEND' | 'ECONOMIC_INDICATOR';
  contentId: number;
  userId: number;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  contentDetails?: {
    id: number;
    name?: string; // 경제지표용
    company?: {
      id: number;
      ticker: string;
      name: string;
      country: string;
      marketValue: string;
    };
    // 실적 관련 필드
    releaseDate?: number;
    actualEPS?: string;
    forecastEPS?: string;
    previousEPS?: string;
    actualRevenue?: string;
    forecastRevenue?: string;
    previousRevenue?: string;
    // 배당 관련 필드
    exDividendDate?: number;
    dividendAmount?: string;
    previousDividendAmount?: string;
    paymentDate?: number;
    dividendYield?: string;
    // 경제지표 관련 필드
    baseName?: string;
    importance?: number;
    actual?: string;
    forecast?: string;
    previous?: string;
    country?: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface NotificationSettings {
  emailEnabled: boolean;
  slackEnabled: boolean;
  slackWebhookUrl?: string;
  allEnabled: boolean;
}

export interface NotificationResponse {
  notifications: Notification[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * 회사 구독 정보
 */
export interface CompanySubscription {
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
}

/**
 * 지표 그룹 구독 정보
 */
export interface IndicatorGroupSubscription {
  id: number;
  baseName: string;
  country?: string;
  subscribedAt: string;
  isActive: boolean;
}

/**
 * 구독 관련 열거형
 */
export enum SubscriptionType {
  COMPANY = 'company',
  INDICATOR_GROUP = 'indicatorGroup',
}
