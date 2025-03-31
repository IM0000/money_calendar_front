import React, { createRef, useMemo, useState } from 'react';
import MarketIcon from './MarketIcon';
import EventAddButton from './EventAddButton';
import NotificationButton from './NotificationButton';
import CalendarTableWrapper from './CalendarTableWrapper';
import { DateRange } from '@/types/CalendarTypes';
import { EarningsEvent } from '@/api/services/CalendarService';
import { formatLocalISOString } from '@/utils/toLocaleISOString';
import { TableGroupSkeleton } from '@/components/UI/Skeleton';
import { renderCountry } from './CountryFlag';

interface EarningsTableProps {
  events: EarningsEvent[];
  dateRange: DateRange;
  isLoading?: boolean;
}

export default function EarningsTable({
  events,
  dateRange,
  isLoading = false,
}: EarningsTableProps) {
  dateRange; // 사용하지 않지만, 필요에 따라 추가적인 로직을 구현할 수 있습니다.

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

  const sortedGroupKeys = Object.keys(groups).sort((a, b) =>
    a === '날짜 없음' ? 1 : b === '날짜 없음' ? -1 : a.localeCompare(b),
  );
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  // 날짜 row에 대한 ref 배열 생성
  const headerRefs = useMemo(
    () => sortedGroupKeys.map(() => createRef<HTMLTableRowElement>()),
    [sortedGroupKeys],
  );

  return (
    <CalendarTableWrapper headerRefs={headerRefs}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="sticky top-0 z-30 calendar-table-header bg-gray-50">
          <tr className="h-[2.80rem]">
            <th className="px-4 py-2 text-sm font-medium text-left text-gray-700">
              시간
            </th>
            <th className="px-4 py-2 text-sm font-medium text-left text-gray-700">
              국가
            </th>
            <th className="px-4 py-2 text-sm font-medium text-left text-gray-700">
              회사명
            </th>
            <th className="px-4 py-2 text-sm font-medium text-left text-gray-700">
              EPS / 예측
            </th>
            <th className="px-4 py-2 text-sm font-medium text-left text-gray-700">
              매출 / 예측
            </th>
            <th className="px-4 py-2 text-sm font-medium text-left text-gray-700">
              직전 발표 정보
            </th>
            <th className="px-4 py-2 text-sm font-medium text-left text-gray-700">
              시가총액
            </th>
            <th className="w-10 px-2 py-2 text-sm font-medium text-left text-gray-700"></th>
            <th className="w-10 px-2 py-2 text-sm font-medium text-left text-gray-700"></th>
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
              const groupEarnings = groups[groupKey];
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
                  {groupEarnings.map((earning) => (
                    <EarningRow key={earning.id} earning={earning} />
                  ))}
                </React.Fragment>
              );
            })
          )}
        </tbody>
      </table>
    </CalendarTableWrapper>
  );
}

function EarningRow({ earning }: { earning: EarningsEvent }) {
  const [showOlderPopup, setShowOlderPopup] = useState(false);
  const [isAlarmSet, setIsAlarmSet] = useState(false);
  const [isEventAdded, setIsEventAdded] = useState(false);

  const toggleOlderPopup = () => setShowOlderPopup((prev) => !prev);
  const toggleAlarm = () => setIsAlarmSet((prev) => !prev);
  const handleAddEvent = () => {
    setIsEventAdded((prev) => !prev);
    console.log(
      `경제지표 정보 ${earning.id} 이벤트 추가 상태: ${!isEventAdded}`,
    );
  };

  const timeDisplay = earning.releaseDate
    ? new Date(earning.releaseDate).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '-';

  const olderPreviousValues = [
    { eps: '2.8', revenue: '74B' },
    { eps: '2.6', revenue: '72B' },
  ];

  return (
    <tr className="relative">
      <td className="px-4 py-2 text-sm text-gray-700">{timeDisplay}</td>
      <td className="px-4 py-2 text-sm text-gray-700">
        {renderCountry(earning.eventCountry)}
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
      <td className="relative px-4 py-2 text-sm text-gray-700">
        <button
          onClick={toggleOlderPopup}
          className="min-w-[10rem] text-blue-500 underline hover:text-blue-700 focus:outline-none"
        >
          EPS {earning.previousEPS} / 매출 {earning.previousRevenue}
        </button>
        {showOlderPopup && (
          <div className="absolute left-0 p-2 mt-1 bg-white rounded shadow-lg">
            <ul className="text-xs text-gray-700">
              {olderPreviousValues.map((item, index) => (
                <li key={index}>
                  EPS {item.eps}, 매출 {item.revenue}
                </li>
              ))}
            </ul>
          </div>
        )}
      </td>
      <td className="min-w-[8rem] px-4 py-2 text-sm text-gray-700">-</td>
      <td className="px-4 py-2 text-sm text-gray-700">
        <MarketIcon releaseTiming={earning.releaseTiming} />
      </td>
      <td className="w-10 px-2 py-2 text-sm text-gray-700">
        <div className="flex items-center space-x-1">
          <EventAddButton isAdded={isEventAdded} onClick={handleAddEvent} />
          <NotificationButton isActive={isAlarmSet} onClick={toggleAlarm} />
        </div>
      </td>
    </tr>
  );
}
