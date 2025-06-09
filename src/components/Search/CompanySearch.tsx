import { useState } from 'react';
import { CountryFlag } from '../CalendarTable/CountryFlag';
import { formatMarketCap } from '../../utils/formatUtils';
import EarningsInfo from './EarningsInfo';
import DividendInfo from './DividendInfo';
import FavoriteButton from '../CalendarTable/FavoriteButton';
import NotificationButton from '../CalendarTable/NotificationButton';
import { Company } from '@/types/calendar-event';
import ExpandToggleButton from './shared/ExpandToggleButton';
import EmptySearchResult from './shared/EmptySearchResult';
import PaginationWrapper from './shared/PaginationWrapper';

interface CompanySearchProps {
  results: Array<Company>;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
}

export default function CompanySearch({
  results,
  pagination,
  onPageChange,
}: CompanySearchProps) {
  // 확장된 회사 패널 추적
  const [expandedCompanyId, setExpandedCompanyId] = useState<number | null>(
    null,
  );

  // 실적/배당 페이지네이션 상태
  const [earningsPage, setEarningsPage] = useState(1);
  const [dividendsPage, setDividendsPage] = useState(1);
  const [earningsLimit] = useState(5);
  const [dividendsLimit] = useState(5);

  // 확장 패널 토글 함수
  const toggleExpandCompany = (companyId: number) => {
    if (expandedCompanyId === companyId) {
      setExpandedCompanyId(null);
      // 패널 닫을 때 페이지 상태 초기화
      setEarningsPage(1);
      setDividendsPage(1);
    } else {
      setExpandedCompanyId(companyId);
      // 새 패널 열 때 페이지 상태 초기화
      setEarningsPage(1);
      setDividendsPage(1);
    }
  };

  return (
    <div>
      {/* 검색 결과가 있는 경우 */}
      {results.length > 0 ? (
        <div className="overflow-hidden border-gray-200 bg-white">
          {/* 헤더 */}
          <div className="grid grid-cols-[0.8fr,4fr,0.8fr,0.8fr,1fr] gap-4 border-b border-gray-200 bg-gray-50 px-2 py-3 font-medium text-gray-700">
            <div className="text-center">티커</div>
            <div>기업명</div>
            <div className="text-center">국가</div>
            <div className="text-right">시가총액</div>
            <div className="text-center">정보</div>
          </div>

          {/* 결과 목록 */}
          <div className="divide-y divide-gray-200">
            {results.map((company) => (
              <div key={company.id} className="group">
                {/* 회사 기본 정보 행 */}
                <div
                  className={`grid grid-cols-[0.8fr,4fr,0.8fr,0.8fr,1fr] gap-4 px-2 py-4 ${
                    expandedCompanyId === company.id
                      ? 'bg-blue-50'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {/* 티커 */}
                  <div
                    className="cursor-pointer text-center font-mono font-medium text-blue-600"
                    onClick={() => toggleExpandCompany(company.id)}
                  >
                    {company.ticker}
                  </div>

                  {/* 기업명 + 관심/알림 버튼 */}
                  <div className="flex items-center justify-between">
                    <div
                      className="cursor-pointer text-gray-800"
                      onClick={() => toggleExpandCompany(company.id)}
                    >
                      {company.name}
                    </div>
                    <div className="flex items-center space-x-1">
                      <FavoriteButton
                        eventType="company"
                        isFavorite={company.isFavorite || false}
                        companyId={company.id}
                      />
                      <NotificationButton
                        eventType="company"
                        isActive={company.hasSubscription || false}
                        companyId={company.id}
                      />
                    </div>
                  </div>

                  {/* 국가 */}
                  <div className="flex items-center justify-center">
                    <CountryFlag countryCode={company.country} />
                  </div>

                  {/* 시가총액 */}
                  <div className="text-right text-gray-700">
                    {formatMarketCap(company.marketValue)}
                  </div>

                  {/* 상세보기 버튼 */}
                  <ExpandToggleButton
                    isExpanded={expandedCompanyId === company.id}
                    onClick={() => toggleExpandCompany(company.id)}
                  />
                </div>

                {/* 확장된 상세 정보 패널 */}
                {expandedCompanyId === company.id && (
                  <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
                    {/* 실적 정보 */}
                    <EarningsInfo
                      companyId={expandedCompanyId}
                      page={earningsPage}
                      limit={earningsLimit}
                      onPageChange={setEarningsPage}
                    />

                    {/* 배당 정보 */}
                    <DividendInfo
                      companyId={expandedCompanyId}
                      page={dividendsPage}
                      limit={dividendsLimit}
                      onPageChange={setDividendsPage}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 페이지네이션 */}
          <PaginationWrapper
            totalPages={pagination.totalPages}
            currentPage={pagination.page}
            onPageChange={onPageChange}
          />
        </div>
      ) : (
        <EmptySearchResult />
      )}
    </div>
  );
}
