import React, { createRef, useMemo, useState } from 'react';
import EventAddButton from './EventAddButton';
import NotificationButton from './NotificationButton';
import CalendarTableWrapper from './CalendarTableWrapper';
import { DateRange } from '@/types/CalendarTypes';
import {
  DividendEvent,
  addFavoriteDividend,
  removeFavoriteDividend,
} from '@/api/services/CalendarService';
import { formatLocalISOString } from '@/utils/dateUtils';
import { TableGroupSkeleton } from '@/components/UI/Skeleton';
import { renderCountry } from './CountryFlag';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

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
  dateRange; // 사용하지 않지만, 필요에 따라 추가적인 로직을 구현할 수 있습니다.

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

  const sortedGroupKeys = Object.keys(groups).sort();
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
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
              국가
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
              회사
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
              배당락일
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
              배당금
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
              배당지급일
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
              배당수익률
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
              이전
            </th>
            <th className="w-10 px-2 py-2 text-left text-sm font-medium text-gray-700">
              {/* 알림추가 버튼 */}
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
              const groupDividends = groups[groupKey];
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
                      className="border-b px-4 py-2 text-sm font-semibold"
                    >
                      {formattedGroupDate}
                    </td>
                  </tr>
                  {groupDividends.map((dividend) => (
                    <DividendRow
                      key={dividend.id}
                      dividend={dividend}
                      isFavoritePage={isFavoritePage}
                    />
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

interface DividendRowProps {
  dividend: DividendEvent;
  isFavoritePage?: boolean;
}

function DividendRow({ dividend, isFavoritePage = false }: DividendRowProps) {
  const [showOlderPopup, setShowOlderPopup] = useState(false);
  const [isAlarmSet, setIsAlarmSet] = useState(false);
  const [isEventAdded, setIsEventAdded] = useState(
    isFavoritePage ? true : dividend.isFavorite || false,
  );

  const queryClient = useQueryClient();

  // 관심 추가 mutation
  const addFavoriteMutation = useMutation({
    mutationFn: addFavoriteDividend,
    onSuccess: () => {
      setIsEventAdded(true);
      toast.success('관심 일정에 추가되었습니다.');
      // 캐시 업데이트
      queryClient.invalidateQueries({ queryKey: ['favoriteCalendarEvents'] });
    },
    onError: (error) => {
      toast.error(
        `추가 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
      );
    },
  });

  // 관심 제거 mutation
  const removeFavoriteMutation = useMutation({
    mutationFn: removeFavoriteDividend,
    onSuccess: () => {
      setIsEventAdded(false);
      toast.success('관심 일정에서 제거되었습니다.');
      // 캐시 업데이트
      queryClient.invalidateQueries({ queryKey: ['favoriteCalendarEvents'] });
    },
    onError: (error) => {
      toast.error(
        `제거 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
      );
    },
  });

  const toggleOlderPopup = () => setShowOlderPopup((prev) => !prev);
  const toggleAlarm = () => setIsAlarmSet((prev) => !prev);

  const handleAddEvent = () => {
    if (isEventAdded) {
      // 제거 요청
      removeFavoriteMutation.mutate(dividend.id);
    } else {
      // 추가 요청
      addFavoriteMutation.mutate(dividend.id);
    }
  };

  const exDividendDisplay = new Date(
    dividend.exDividendDate,
  ).toLocaleDateString();
  const paymentDateDisplay = new Date(
    dividend.paymentDate,
  ).toLocaleDateString();

  // 더 과거의 이전 배당금값 (더미 예시)
  const olderPreviousValues = [{ dividend: '$0.78' }, { dividend: '$0.76' }];

  // 요청 중인지 여부
  const isLoading =
    addFavoriteMutation.isPending || removeFavoriteMutation.isPending;

  return (
    <tr className="relative">
      {/* 국가 */}
      <td className="px-4 py-2 text-sm text-gray-700">
        {renderCountry(dividend.eventCountry)}
      </td>
      {/* 회사명(티커) */}
      <td className="px-4 py-2 text-sm text-gray-700">
        {dividend.company.name} ({dividend.company.ticker})
      </td>
      {/* 배당락일 */}
      <td className="min-w-[9rem] px-4 py-2 text-sm text-gray-700">
        {exDividendDisplay}
      </td>
      {/* 배당금 */}
      <td className="px-4 py-2 text-sm text-gray-700">
        {dividend.dividendAmount}
      </td>
      {/* 배당지급일 */}
      <td className="min-w-[9rem] px-4 py-2 text-sm text-gray-700">
        {paymentDateDisplay}
      </td>
      {/* 배당수익률 */}
      <td className="px-4 py-2 text-sm text-gray-700">
        {dividend.dividendYield ? dividend.dividendYield : '-'}
      </td>
      {/* 이전 배당금값 (바로 직전 값) + 팝업 */}
      <td className="relative px-4 py-2 text-sm text-gray-700">
        <button
          onClick={toggleOlderPopup}
          className="text-blue-500 underline hover:text-blue-700 focus:outline-none"
        >
          {dividend.previousDividendAmount}
        </button>
        {showOlderPopup && (
          <div className="absolute left-0 mt-1 rounded border bg-white p-2 shadow-lg">
            <ul className="text-xs text-gray-700">
              {olderPreviousValues.map((item, index) => (
                <li key={index}>배당금 {item.dividend}</li>
              ))}
            </ul>
          </div>
        )}
      </td>
      {/* 이벤트 추가 + 알림 버튼 */}
      <td className="w-10 px-2 py-2 text-sm text-gray-700">
        <div className="flex items-center space-x-1">
          <EventAddButton
            isAdded={isEventAdded}
            onClick={handleAddEvent}
            isLoading={isLoading}
          />
          <NotificationButton isActive={isAlarmSet} onClick={toggleAlarm} />
        </div>
      </td>
    </tr>
  );
}
