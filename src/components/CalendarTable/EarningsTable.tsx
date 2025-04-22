import React, { createRef, useMemo, useState } from 'react';
import FavoriteButton from './FavoriteButton';
import NotificationButton from './NotificationButton';
import CalendarTableWrapper from './CalendarTableWrapper';
import { DateRange } from '@/types/calendar-date-range';
import { getCompanyEarningsHistory } from '@/api/services/calendarService';
import { formatLocalISOString } from '@/utils/dateUtils';
import { TableGroupSkeleton } from '@/components/UI/Skeleton';
import { CountryFlag } from './CountryFlag';
import EarningsHistoryTable from './EarningsHistoryTable';
import { formatMarketCap } from '@/utils/formatUtils';
import { EarningsEvent } from '@/types/calendar-event';
import MarketIcon from './MarketIcon';
import { useQuery } from '@tanstack/react-query';

interface EarningsTableProps {
  events: EarningsEvent[];
  dateRange: DateRange;
  isLoading?: boolean;
  isFavoritePage?: boolean;
}

export default function EarningsTable({
  events,
  dateRange,
  isLoading = false,
  isFavoritePage = false,
}: EarningsTableProps) {
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

  // 날짜별로 그룹화
  const groups = events.reduce(
    (acc, earning) => {
      const groupKey = earning.releaseDate
        ? formatLocalISOString(new Date(earning.releaseDate)).slice(0, 10)
        : '날짜 없음';
      acc[groupKey] = acc[groupKey] || [];
      acc[groupKey].push(earning);
      return acc;
    },
    {} as Record<string, EarningsEvent[]>,
  );

  // allDates를 기준으로 정렬된 모든 날짜 키 생성 (빈 날짜 포함)
  const sortedGroupKeys = useMemo(() => {
    // '날짜 없음' 데이터가 있으면 마지막에 추가
    const sortedDates = [...allDates].sort();
    if (groups['날짜 없음'] && groups['날짜 없음'].length > 0) {
      sortedDates.push('날짜 없음');
    }
    return sortedDates;
  }, [allDates, groups]);

  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  // 날짜 row에 대한 ref 배열 생성
  const headerRefs = useMemo(
    () => sortedGroupKeys.map(() => createRef<HTMLTableRowElement>()),
    [sortedGroupKeys],
  );

  return (
    <CalendarTableWrapper headerRefs={headerRefs}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="calendar-table-header sticky top-0 z-30 bg-gray-50">
          <tr className="h-[2.80rem]">
            <th className="min-w-[3.75rem] px-4 py-2 text-left text-sm font-medium text-gray-700">
              시간
            </th>
            <th className="min-w-[3.75rem] px-4 py-2 text-left text-sm font-medium text-gray-700">
              국가
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
              회사명
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
              EPS / 예측
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
              매출 / 예측
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
              시가총액
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
              이전 발표
            </th>
            <th className="w-10 px-2 py-2 text-left text-sm font-medium text-gray-700"></th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            // 로딩 중일 때 스켈레톤 UI 표시
            <>
              <TableGroupSkeleton columns={9} rows={3} />
              <TableGroupSkeleton columns={9} rows={4} />
              <TableGroupSkeleton columns={9} rows={2} />
            </>
          ) : (
            // 데이터가 있을 때 실제 테이블 내용 표시
            sortedGroupKeys.map((groupKey, index) => {
              const groupEarnings = groups[groupKey] || [];
              const formattedGroupDate =
                groupKey !== '날짜 없음'
                  ? (() => {
                      const dateObj = new Date(groupKey);
                      const dayOfWeek = dayNames[dateObj.getDay()];
                      const [year, month, day] = groupKey.split('-');
                      return `${year}년 ${parseInt(month)}월 ${parseInt(day)}일 (${dayOfWeek})`;
                    })()
                  : groupKey;

              return (
                <React.Fragment key={groupKey}>
                  {/* sticky 클래스 제거 */}
                  <tr
                    ref={headerRefs[index]}
                    className="bg-gray-100"
                    data-date={groupKey} // data-date를 tr에 직접 부여 (혹은 필요하다면 div로 옮길 수 있음)
                  >
                    <td colSpan={9} className="px-4 py-2 text-sm font-semibold">
                      {formattedGroupDate}
                    </td>
                  </tr>
                  {groupEarnings.length > 0 ? (
                    groupEarnings
                      .filter(
                        (
                          e,
                        ): e is EarningsEvent & {
                          company: NonNullable<EarningsEvent['company']>;
                        } => e.company != null,
                      )
                      .map((earning) => (
                        <EarningRow
                          key={earning.id}
                          earning={earning}
                          isFavoritePage={isFavoritePage}
                        />
                      ))
                  ) : (
                    <tr>
                      <td
                        colSpan={9}
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

function EarningRow({
  earning,
  isFavoritePage = false,
}: {
  earning: EarningsEvent & { company: NonNullable<EarningsEvent['company']> };
  isFavoritePage?: boolean;
}) {
  const [showOlderPopup, setShowOlderPopup] = useState(false);
  const [isFavorite] = useState(
    isFavoritePage ? true : earning.isFavorite || false,
  );
  // 페이지 상태 추가
  const [historyPage, setHistoryPage] = useState(1);
  const [historyLimit] = useState(5);

  // 이전 실적 데이터 쿼리
  const { data: historyData, isLoading: isHistoryLoading } = useQuery({
    queryKey: [
      'earningsHistory',
      earning.company.id,
      historyPage,
      historyLimit,
    ],
    queryFn: () =>
      getCompanyEarningsHistory(earning.company.id, historyPage, historyLimit),
    enabled: showOlderPopup, // 상세보기가 열렸을 때만 쿼리 실행
  });

  const toggleOlderPopup = () => {
    setShowOlderPopup((prev) => !prev);
  };

  const handlePageChange = (page: number) => {
    setHistoryPage(page);
  };

  return (
    <>
      <tr className="relative">
        <td className="px-4 py-2 text-sm text-gray-700">
          <MarketIcon releaseTiming={earning.releaseTiming} />
        </td>
        <td className="px-4 py-2 text-sm text-gray-700">
          <CountryFlag countryCode={earning.country} />
        </td>
        <td className="px-4 py-2 text-sm text-gray-700">
          {earning.company.name} ({earning.company.ticker})
        </td>
        <td className="min-w-[10rem] px-4 py-2 text-sm text-gray-700">
          {earning.actualEPS} / {earning.forecastEPS}
        </td>
        <td className="min-w-[10rem] px-4 py-2 text-sm text-gray-700">
          {earning.actualRevenue} / {earning.forecastRevenue}
        </td>
        <td className="min-w-[8rem] px-4 py-2 text-sm text-gray-700">
          {formatMarketCap(earning.company.marketValue)}
        </td>
        <td className="px-4 py-2 text-sm text-gray-700 ">
          <button
            onClick={toggleOlderPopup}
            className="min-w-[4rem] text-blue-500 underline hover:text-blue-700 focus:outline-none"
          >
            {showOlderPopup ? '접기' : '상세보기'}
          </button>
        </td>
        <td className="w-10 px-2 py-2 text-sm text-gray-700">
          <div className="flex items-center space-x-1">
            <FavoriteButton
              id={earning.id}
              eventType="earnings"
              isFavorite={isFavorite}
            />
            <NotificationButton
              id={earning.id}
              eventType="earnings"
              isActive={earning.hasNotification || false}
            />
          </div>
        </td>
      </tr>
      {showOlderPopup && (
        <tr>
          <td colSpan={9} className="bg-gray-50 px-4 py-4">
            <div className="rounded border border-gray-200 bg-white p-4">
              <h3 className="mb-4 text-lg font-medium">
                {earning.company.name} 이전 실적 정보
              </h3>
              {historyData?.data ? (
                <EarningsHistoryTable
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
