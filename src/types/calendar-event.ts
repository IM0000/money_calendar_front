export interface EarningsEvent {
  id: number;
  releaseDate: number; // 밀리초 단위 타임스탬프
  releaseTiming: 'UNKNOWN' | 'PRE_MARKET' | 'POST_MARKET';
  country: string; // 실적 이벤트에 정의된 국가 (Earnings 모델의 country)
  actualEPS: string;
  forecastEPS: string;
  previousEPS: string;
  actualRevenue: string;
  forecastRevenue: string;
  previousRevenue: string;
  company?: {
    id: number;
    ticker: string;
    name: string;
    companyCountry: string; // 회사 모델의 country
    marketValue: string;
  };
  createdAt: string;
  updatedAt: string;
  isFavorite?: boolean; // 회사 단위 관심 등록 여부 (백엔드에서 계산됨)
  hasNotification?: boolean; // 회사 단위 구독 여부 (백엔드에서 계산됨)
}

export interface DividendEvent {
  id: number;
  exDividendDate: number; // 밀리초 단위
  dividendAmount: string;
  previousDividendAmount: string;
  paymentDate: number; // 밀리초 단위
  country: string; // 배당 이벤트의 나라 (Dividend 모델의 country)
  dividendYield: string; // 배당수익률
  company?: {
    id: number;
    ticker: string;
    name: string;
    companyCountry: string; // 회사의 나라 (Company 모델의 country)
    marketValue: string;
  };
  createdAt: string; // 생성일자 (ISO 문자열)
  updatedAt: string; // 수정일자 (ISO 문자열)
  isFavorite?: boolean; // 회사 단위 관심 등록 여부 (백엔드에서 계산됨)
  hasNotification?: boolean; // 회사 단위 구독 여부 (백엔드에서 계산됨)
}

export interface EconomicIndicatorEvent {
  id: number;
  releaseDate: number; // 밀리초 단위
  country: string; // 경제지표 이벤트의 나라 (EconomicIndicator 모델의 country)
  name: string;
  baseName?: string;
  importance: number;
  actual: string;
  forecast: string;
  previous: string;
  createdAt: string;
  updatedAt: string;
  isFavorite?: boolean; // 지표 그룹(baseName + country) 단위 관심 등록 여부 (백엔드에서 계산됨)
  hasNotification?: boolean; // 지표 그룹(baseName + country) 단위 구독 여부 (백엔드에서 계산됨)
}

export interface Company {
  id: number;
  ticker: string;
  name: string;
  country: string;
  marketValue: string;
  isFavorite?: boolean; // 회사 단위 관심 등록 여부 (실적과 배당 통합)
  hasSubscription?: boolean; // 회사 단위 구독 여부 (실적과 배당 통합)
}
