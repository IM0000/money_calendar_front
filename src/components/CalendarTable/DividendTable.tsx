import React, { createRef, useMemo, useState } from 'react';
import FavoriteButton from './FavoriteButton';
import NotificationButton from './NotificationButton';
import CalendarTableWrapper from './CalendarTableWrapper';
import { DateRange } from '@/types/calendar-date-range';
import { getCompanyDividendHistory } from '@/api/services/calendarService';
import { DividendEvent } from '@/types/calendar-event';
import { formatLocalISOString } from '@/utils/dateUtils';
import { TableGroupSkeleton } from '@/components/UI/Skeleton';
import { CountryFlag } from './CountryFlag';
import DividendHistoryTable from './DividendHistoryTable';
import { useQuery } from '@tanstack/react-query';
import { formatMarketCap } from '@/utils/formatUtils';
import { FiChevronDown, FiChevronUp, FiDollarSign } from 'react-icons/fi';

interface DividendTableProps {
  events: DividendEvent[];
  dateRange: DateRange;
  isLoading?: boolean;
  isFavoritePage?: boolean;
}

export default function DividendTable({
  events,
  dateRange,
  isLoading = false,
  isFavoritePage = false,
}: DividendTableProps) {
  // dateRange를 활용하여 모든 날짜 생성
  const allDates = useMemo(() => {
    const dates: string[] = [];
    const startDate = new Date(dateRange.startDate);
    const endDate = new Date(dateRange.endDate);
    const currentDate = new Date(startDate);

    // startDate부터 endDate까지 모든 날짜를 포함
    while (currentDate <= endDate) {
      dates.push(formatLocalISOString(new Date(currentDate)).slice(0, 10));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  }, [dateRange]);

  // 그룹화: exDividendDate(YYYY-MM-DD) 기준으로 그룹화
  const groups = events.reduce(
    (acc, dividend) => {
      const dateObj = new Date(dividend.exDividendDate);
      const groupKey = formatLocalISOString(dateObj).slice(0, 10);
      if (!acc[groupKey]) acc[groupKey] = [];
      acc[groupKey].push(dividend);
      return acc;
    },
    {} as Record<string, DividendEvent[]>,
  );

  // allDates를 기준으로 정렬된 모든 날짜 키 생성 (빈 날짜 포함)
  const sortedGroupKeys = useMemo(() => {
    return allDates.sort();
  }, [allDates]);

  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  // 날짜 row에 대한 ref 배열 생성
  const headerRefs = useMemo(
    () => sortedGroupKeys.map(() => createRef<HTMLTableRowElement>()),
    [sortedGroupKeys],
  );

  return (
    <CalendarTableWrapper headerRefs={headerRefs}>
      <table className="min-w-full divide-y divide-gray-200">
        {/* 테이블 헤더 */}
        <thead className="calendar-table-header sticky top-0 z-30 bg-gray-50">
          <tr className="h-[2.80rem]">
            <th className="w-[50px] min-w-[50px] px-2 py-2 text-center text-sm font-medium text-gray-700">
              국가
            </th>
            <th className="w-auto min-w-[180px] px-4 py-2 text-left text-sm font-medium text-gray-700">
              회사명
            </th>
            <th className="w-[120px] min-w-[120px] px-3 py-2 text-center text-sm font-medium text-gray-700">
              배당락일
            </th>
            <th className="w-[80px] min-w-[80px] px-3 py-2 text-right text-sm font-medium text-gray-700">
              배당금
            </th>
            <th className="w-[120px] min-w-[120px] px-3 py-2 text-center text-sm font-medium text-gray-700">
              배당지급일
            </th>
            <th className="w-[90px] min-w-[90px] px-3 py-2 text-right text-sm font-medium text-gray-700">
              배당수익률
            </th>
            <th className="w-[100px] min-w-[100px] px-3 py-2 text-right text-sm font-medium text-gray-700">
              시가총액
            </th>
            <th className="w-[90px] min-w-[90px] px-3 py-2 text-center text-sm font-medium text-gray-700">
              이전 발표
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            // 로딩 중일 때 스켈레톤 UI 표시
            <>
              <TableGroupSkeleton columns={8} rows={3} />
              <TableGroupSkeleton columns={8} rows={2} />
              <TableGroupSkeleton columns={8} rows={2} />
            </>
          ) : (
            // 데이터가 있을 때 실제 테이블 내용 표시
            sortedGroupKeys.map((groupKey, index) => {
              const groupDividends = (groups[groupKey] || [])
                .slice()
                .sort((a, b) => {
                  const parseValue = (val?: string) =>
                    val ? parseInt(val.replace(/,/g, ''), 10) : 0;
                  const aVal = parseValue(a.company?.marketValue);
                  const bVal = parseValue(b.company?.marketValue);
                  return bVal - aVal;
                });
              const dateObj = new Date(groupKey);
              const dayOfWeek = dayNames[dateObj.getDay()];
              const [year, month, day] = groupKey.split('-');
              const formattedGroupDate = `${year}년 ${parseInt(month)}월 ${parseInt(day)}일 (${dayOfWeek})`;
              return (
                <React.Fragment key={groupKey}>
                  {/* 그룹 헤더 (Sticky): 배당락일 기준 */}
                  <tr
                    ref={headerRefs[index]}
                    className="bg-gray-100"
                    data-date={groupKey} // data-date를 tr에 직접 부여 (혹은 필요하다면 div로 옮길 수 있음)
                  >
                    <td
                      colSpan={8}
                      className="sticky-separator-td border-b px-4 py-2 text-sm font-semibold"
                    >
                      {formattedGroupDate}
                    </td>
                  </tr>

                  {groupDividends.length > 0 ? (
                    groupDividends.map((dividend: DividendEvent) => (
                      <DividendRow
                        key={dividend.id}
                        dividend={dividend}
                        isFavoritePage={isFavoritePage}
                      />
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-4 py-6 text-center text-gray-500"
                      >
                        예약된 일정이 없습니다.
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })
          )}
        </tbody>
      </table>
    </CalendarTableWrapper>
  );
}

interface DividendRowProps {
  dividend: DividendEvent;
  isFavoritePage?: boolean;
}

function DividendRow({ dividend, isFavoritePage = false }: DividendRowProps) {
  const [showOlderPopup, setShowOlderPopup] = useState(false);
  const [isFavorite] = useState(
    isFavoritePage ? true : dividend.isFavorite || false,
  );
  // 페이지 상태 추가
  const [historyPage, setHistoryPage] = useState(1);
  const [historyLimit] = useState(5);

  // 이전 배당금 데이터 쿼리
  const { data: historyData, isLoading: isHistoryLoading } = useQuery({
    queryKey: [
      'dividendHistory',
      dividend.company?.id,
      historyPage,
      historyLimit,
    ],
    queryFn: () =>
      getCompanyDividendHistory(
        dividend.company?.id ?? -1,
        historyPage,
        historyLimit,
      ),
    enabled: showOlderPopup && !!dividend.company?.id, // 상세보기가 열렸을 때만 쿼리 실행
  });

  const toggleOlderPopup = () => {
    setShowOlderPopup((prev) => !prev);
  };

  const handlePageChange = (page: number) => {
    setHistoryPage(page);
  };

  const exDividendDisplay = new Date(
    dividend.exDividendDate,
  ).toLocaleDateString();
  const paymentDateDisplay = new Date(
    dividend.paymentDate,
  ).toLocaleDateString();

  return (
    <>
      <tr className="relative">
        {/* 국가 */}
        <td className="px-2 py-2 text-center text-sm text-gray-700">
          <CountryFlag countryCode={dividend.country} />
        </td>
        {/* 회사명(티커) + 관심/알림 버튼 */}
        <td className="px-4 py-2 text-sm text-gray-700">
          <div className="flex items-center justify-between">
            <span>
              {dividend.company?.name ?? '정보 없음'} (
              {dividend.company?.ticker ?? '-'})
            </span>
            <div className="ml-2 flex items-center space-x-1">
              <FavoriteButton
                eventType="company"
                isFavorite={isFavorite}
                companyId={dividend.company?.id}
              />
              <NotificationButton
                eventType="company"
                isActive={dividend.hasNotification || false}
                companyId={dividend.company?.id}
              />
            </div>
          </div>
        </td>
        {/* 배당락일 */}
        <td className="whitespace-nowrap px-3 py-2 text-center text-sm text-gray-700">
          {exDividendDisplay}
        </td>
        {/* 배당금 */}
        <td className="px-3 py-2 text-right text-sm text-gray-700">
          ${dividend.dividendAmount}
        </td>
        {/* 배당지급일 */}
        <td className="whitespace-nowrap px-3 py-2 text-center text-sm text-gray-700">
          {paymentDateDisplay}
        </td>
        {/* 배당수익률 */}
        <td className="px-3 py-2 text-right text-sm text-gray-700">
          {dividend.dividendYield ? dividend.dividendYield : '-'}
        </td>
        {/* 회사 시가총액 */}
        <td className="px-3 py-2 text-right text-sm text-gray-700">
          {formatMarketCap(dividend.company?.marketValue)}
        </td>
        {/* 이전 배당금값 (바로 직전 값) + 팝업 */}
        <td className="px-3 py-2 text-center text-sm text-gray-700">
          <button
            onClick={toggleOlderPopup}
            className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 ${
              showOlderPopup
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
            } focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1`}
          >
            <FiDollarSign className="h-3.5 w-3.5" />
            <span>{showOlderPopup ? '접기' : '이전 배당'}</span>
            {showOlderPopup ? (
              <FiChevronUp className="h-3.5 w-3.5" />
            ) : (
              <FiChevronDown className="h-3.5 w-3.5" />
            )}
          </button>
        </td>
      </tr>
      {showOlderPopup && (
        <tr>
          <td colSpan={8} className="bg-gray-50 px-4 py-4">
            <div className="rounded border border-gray-200 bg-white p-4">
              <h3 className="mb-4 text-lg font-medium">
                {dividend.company?.name ?? '정보 없음'} 이전 배당금 정보
              </h3>
              {historyData?.data ? (
                <DividendHistoryTable
                  data={historyData.data.items}
                  isLoading={isHistoryLoading}
                  pagination={historyData.data.pagination}
                  onPageChange={handlePageChange}
                />
              ) : isHistoryLoading ? (
                <div className="text-center">데이터를 불러오는 중...</div>
              ) : (
                <div className="text-center text-gray-500">
                  데이터가 없습니다.
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
