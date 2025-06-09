import { useState, useMemo, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '../components/Layout/Layout';
import CompanySearch from '../components/Search/CompanySearch';
import IndicatorSearch from '../components/Search/IndicatorSearch';
import {
  searchCompanies,
  searchIndicators,
} from '../api/services/searchService';
import { Company, EconomicIndicatorEvent } from '@/types/calendar-event';

// 검색 타입 정의
type SearchType = 'company' | 'indicator';

// 국가 필터 옵션
const COUNTRY_OPTIONS = [
  { value: '', label: '모든 국가' },
  { value: 'USA', label: '미국' },
];

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function SearchPage() {
  // 검색 상태
  const [searchType, setSearchType] = useState<SearchType>('company');
  const [searchQuery, setSearchQuery] = useState('');
  const [countryFilter, setCountryFilter] = useState('');

  // 페이지네이션 상태
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // 디바운스된 검색어 (500ms 지연)
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  const debouncedCountryFilter = useDebounce(countryFilter, 300);

  // 검색 쿼리 실행 조건 (빈 검색어라도 검색을 수행)
  const shouldSearch = true;

  // 회사 검색 쿼리
  const { data: companyData, isLoading: isCompanyLoading } = useQuery({
    queryKey: [
      'searchCompanies',
      debouncedSearchQuery,
      debouncedCountryFilter,
      page,
      limit,
    ],
    queryFn: () =>
      searchCompanies({
        query: debouncedSearchQuery,
        country: debouncedCountryFilter,
        page,
        limit,
      }),
    enabled: shouldSearch && searchType === 'company',
    staleTime: 1000 * 60 * 5, // 5분 동안 fresh 상태 유지
  });

  // 지표 검색 쿼리
  const { data: indicatorData, isLoading: isIndicatorLoading } = useQuery({
    queryKey: [
      'searchIndicators',
      debouncedSearchQuery,
      debouncedCountryFilter,
      page,
      limit,
    ],
    queryFn: () =>
      searchIndicators({
        query: debouncedSearchQuery,
        country: debouncedCountryFilter,
        page,
        limit,
      }),
    enabled: shouldSearch && searchType === 'indicator',
    staleTime: 1000 * 60 * 5, // 5분 동안 fresh 상태 유지
  });

  // 검색 결과 및 로딩 상태 계산
  const { results, pagination, isLoading } = useMemo(() => {
    if (searchType === 'company') {
      return {
        results: companyData?.data?.items || [],
        pagination: companyData?.data?.pagination || {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
        isLoading: isCompanyLoading,
      };
    } else {
      return {
        results: indicatorData?.data?.items || [],
        pagination: indicatorData?.data?.pagination || {
          total: 0,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
        isLoading: isIndicatorLoading,
      };
    }
  }, [
    searchType,
    companyData,
    indicatorData,
    isCompanyLoading,
    isIndicatorLoading,
  ]);

  // 입력 중인지 여부 (디바운스가 적용되지 않은 상태)
  const isTyping =
    searchQuery !== debouncedSearchQuery ||
    countryFilter !== debouncedCountryFilter;

  // 페이지 변경 핸들러
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // 검색 타입 변경 핸들러
  const handleTypeChange = (type: SearchType) => {
    setSearchType(type);
    setPage(1);
  };

  return (
    <Layout>
      <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        <h1 className="mb-6 text-2xl font-bold text-gray-800">검색</h1>

        {/* 검색 필터 - 디자인 개선 */}
        <div className="mb-8 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-md">
          {/* 필터 컨텐츠 */}
          <div className="flex flex-col gap-5 p-6 md:flex-row md:items-end">
            {/* 검색 타입 선택 - 디자인 개선 */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                검색 유형
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => handleTypeChange('company')}
                  className={`flex items-center justify-center rounded-md px-4 py-2 transition-all ${
                    searchType === 'company'
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  기업
                </button>
                <button
                  onClick={() => handleTypeChange('indicator')}
                  className={`flex items-center justify-center rounded-md px-4 py-2 transition-all ${
                    searchType === 'indicator'
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  경제지표
                </button>
              </div>
            </div>

            {/* 검색어 입력 - 디자인 개선 */}
            <div className="flex-grow">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {searchType === 'company' ? '기업명 또는 티커' : '경제지표명'}
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder={
                    searchType === 'company'
                      ? '기업명 또는 티커를 입력하세요...'
                      : '경제 지표명을 입력하세요...'
                  }
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                {isTyping && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-500"></div>
                  </div>
                )}
              </div>
            </div>

            {/* 국가 필터 - 디자인 개선 */}
            <div className="w-full md:w-48">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                국가
              </label>
              <select
                value={countryFilter}
                onChange={(e) => {
                  setCountryFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {COUNTRY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* 로딩 상태 - 개선된 스피너 */}
        {isLoading && (
          <div className="my-12 flex justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500"></div>
          </div>
        )}

        {/* 검색 결과 - 결과 디자인 개선 */}
        {!isLoading && (
          <div className="rounded-xl border border-gray-200 bg-white shadow-md">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
              <h2 className="flex items-center text-lg font-medium text-gray-800">
                <span>검색 결과</span>
                {!isLoading && (
                  <span className="ml-2 rounded-full bg-blue-100 px-2.5 py-0.5 text-sm font-medium text-blue-800">
                    {pagination.total}건
                  </span>
                )}
              </h2>
            </div>

            <div className="p-1">
              {searchType === 'company' ? (
                <CompanySearch
                  results={results as Company[]}
                  pagination={pagination}
                  onPageChange={handlePageChange}
                />
              ) : (
                <IndicatorSearch
                  results={results as EconomicIndicatorEvent[]}
                  pagination={pagination}
                  onPageChange={handlePageChange}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
