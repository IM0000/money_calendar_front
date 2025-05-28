import { useState, useEffect } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import { CountryFlag } from '../CalendarTable/CountryFlag';
import { formatMarketCap } from '../../utils/formatUtils';
import Pagination from '../UI/Pagination';
import EarningsInfo from './EarningsInfo';
import DividendInfo from './DividendInfo';
import { Company } from '@/types/calendar-event';

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
  // 로컬 상태로 회사 목록 관리
  const [localResults, setLocalResults] = useState(results);

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

  // results prop이 변경될 때 로컬 상태 업데이트
  useEffect(() => {
    setLocalResults(results);
  }, [results]);

  return (
    <div>
      {/* 검색 결과가 있는 경우 */}
      {localResults.length > 0 ? (
        <div className="overflow-hidden bg-white border border-gray-200 rounded-lg">
          {/* 헤더 */}
          <div className="grid grid-cols-[0.8fr,4fr,0.8fr,1fr,0.5fr] gap-4 border-b border-gray-200 bg-gray-100 px-2 py-4 font-medium text-gray-700">
            <div className="text-center">티커</div>
            <div>기업명</div>
            <div className="text-center">국가</div>
            <div className="text-center">시가총액</div>
            <div className="text-center">정보</div>
          </div>

          {/* 결과 목록 */}
          <div className="divide-y divide-gray-200">
            {localResults.map((company) => (
              <div
                key={company.id}
                className="group"
                onClick={() => toggleExpandCompany(company.id)}
              >
                {/* 회사 기본 정보 행 */}
                <div
                  className={`grid grid-cols-[0.8fr,4fr,0.8fr,1fr,0.5fr] gap-4 px-2 py-4 ${
                    expandedCompanyId === company.id
                      ? 'bg-blue-50'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  {/* 티커 */}
                  <div className="font-mono font-medium text-center text-blue-600 cursor-pointer">
                    {company.ticker}
                  </div>

                  {/* 기업명 */}
                  <div className="text-gray-800 cursor-pointer">
                    {company.name}
                  </div>

                  {/* 국가 */}
                  <div className="flex items-center justify-center">
                    <CountryFlag countryCode={company.country} />
                  </div>

                  {/* 시가총액 */}
                  <div className="text-right text-gray-700">
                    {formatMarketCap(company.marketValue)}
                  </div>

                  {/* 작업 버튼들 - 화살표만 남김 */}
                  <div className="flex justify-center">
                    {/* 디테일 확장 화살표 */}
                    <button
                      onClick={() => toggleExpandCompany(company.id)}
                      className="p-1 text-gray-600 rounded hover:bg-gray-200"
                      aria-label={
                        expandedCompanyId === company.id
                          ? '상세 정보 접기'
                          : '상세 정보 보기'
                      }
                    >
                      <FaChevronDown
                        className={`h-4 w-4 transition-transform ${
                          expandedCompanyId === company.id
                            ? 'rotate-180 transform'
                            : ''
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* 확장된 상세 정보 패널 */}
                {expandedCompanyId === company.id && (
                  <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
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
          {pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={onPageChange}
              />
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 text-center bg-white border border-gray-200 rounded-lg">
          <p className="text-gray-500">검색 결과가 없습니다.</p>
        </div>
      )}
    </div>
  );
}
