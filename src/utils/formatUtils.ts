/**
 * 시가총액을 포맷팅하는 함수
 * 예: 1000000 -> "$1M", 1200000000 -> "$1.2B"
 */
export function formatMarketCap(
  marketValue: string | number | undefined,
): string {
  if (!marketValue) return '-';

  const value =
    typeof marketValue === 'string'
      ? parseFloat(marketValue.replace(/[^0-9.]/g, ''))
      : marketValue;

  if (isNaN(value)) return '-';

  if (value >= 1_000_000_000_000) {
    return `$${(value / 1_000_000_000_000).toFixed(1)}T`;
  } else if (value >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(1)}B`;
  } else if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  } else if (value >= 1_000) {
    return `$${(value / 1_000).toFixed(1)}K`;
  }

  return `$${value.toFixed(0)}`;
}

/**
 * 국가 코드를 국가 이름으로 변환하는 함수
 */
export function getCountryName(countryCode: string): string {
  if (!countryCode) return '-';

  // ISO 3166-1 alpha-2 국가 코드 (2글자)
  const iso2CountryMap: Record<string, string> = {
    US: '미국',
    KR: '한국',
  };

  // ISO 3166-1 alpha-3 국가 코드 (3글자)
  const iso3CountryMap: Record<string, string> = {
    USA: '미국',
    KOR: '한국',
  };

  // 코드 길이에 따라 적절한 맵 선택
  if (countryCode.length === 2) {
    return iso2CountryMap[countryCode] || countryCode;
  } else {
    return iso3CountryMap[countryCode] || countryCode;
  }
}

/**
 * 숫자를 금액 형식으로 포맷팅하는 함수
 */
export function formatCurrency(amount: string | number | undefined): string {
  if (!amount) return '-';

  const value =
    typeof amount === 'string'
      ? parseFloat(amount.replace(/[^0-9.]/g, ''))
      : amount;

  if (isNaN(value)) return '-';

  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/**
 * 백분율 포맷팅 함수
 */
export function formatPercentage(value: string | number | undefined): string {
  if (!value) return '-';

  const numValue =
    typeof value === 'string'
      ? parseFloat(value.replace(/[^0-9.%-]/g, ''))
      : value;

  if (isNaN(numValue)) return '-';

  return `${numValue.toFixed(2)}%`;
}
