import React, { createRef, useMemo, useState } from 'react';
import EventAddButton from './EventAddButton';
import NotificationButton from './NotificationButton';
import CalendarTableWrapper from './CalendarTableWrapper';
import { DateRange } from '@/types/CalendarTypes';
import {
  addFavoriteEconomicIndicator,
  removeFavoriteEconomicIndicator,
} from '@/api/services/calendarService';
import { EconomicIndicatorEvent } from '@/types/calendarEvent';
import { formatLocalISOString } from '@/utils/dateUtils';
import { TableGroupSkeleton } from '@/components/UI/Skeleton';
import { FaStar } from 'react-icons/fa';
import { CountryFlag } from './CountryFlag';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

interface EconomicIndicatorTableProps {
  events: EconomicIndicatorEvent[];
  dateRange: DateRange;
  isLoading?: boolean;
  isFavoritePage?: boolean;
}

export default function EconomicIndicatorTable({
  events,
  dateRange,
  isLoading = false,
  isFavoritePage = false,
}: EconomicIndicatorTableProps) {
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

  // releaseDate를 기준으로 "YYYY-MM-DD" 문자열 그룹으로 묶기
  const groups = events.reduce(
    (acc, indicator) => {
      const dateObj = new Date(indicator.releaseDate);
      const groupKey = formatLocalISOString(dateObj).slice(0, 10);
      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(indicator);
      return acc;
    },
    {} as Record<string, EconomicIndicatorEvent[]>,
  );

  // allDates를 기준으로 정렬된 모든 날짜 키 생성 (빈 날짜 포함)
  const sortedGroupKeys = useMemo(() => {
    return allDates.sort();
  }, [allDates]);

  // 요일명을 위한 배열 (0: 일요일, 1: 월요일, …)
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];

  // 날짜 row에 대한 ref 배열 생성
  const headerRefs = useMemo(
    () => sortedGroupKeys.map(() => createRef<HTMLTableRowElement>()),
    [sortedGroupKeys],
  );

  return (
    <CalendarTableWrapper headerRefs={headerRefs}>
      <table className="min-w-full divide-y divide-gray-200">
        {/* 메인 헤더: 스크롤 시 상단에 고정 (헤더 높이 약 2.80rem) */}
        <thead className="calendar-table-header sticky top-0 z-30 bg-gray-50">
          <tr className="h-[2.80rem]">
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
              시간
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
              국가
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
              이벤트
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
              중요도
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
              실제
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
              예측
            </th>
            <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
              이전
            </th>
            {/* 알림추가 버튼은 열 너비를 최소화 */}
            <th className="w-10 px-2 py-2 text-left text-sm font-medium text-gray-700"></th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            // 로딩 중일 때 스켈레톤 UI 표시
            <>
              <TableGroupSkeleton columns={8} rows={3} />
              <TableGroupSkeleton columns={8} rows={2} />
              <TableGroupSkeleton columns={8} rows={4} />
            </>
          ) : (
            // 데이터가 있을 때 실제 테이블 내용 표시
            sortedGroupKeys.map((groupKey, index) => {
              const groupIndicators = groups[groupKey] || [];
              // 그룹키 "YYYY-MM-DD" → Date 객체로 변환하여 요일 계산
              const dateObj = new Date(groupKey);
              const dayOfWeek = dayNames[dateObj.getDay()];
              const [year, month, day] = groupKey.split('-');
              const formattedGroupDate = `${year}년 ${parseInt(month)}월 ${parseInt(
                day,
              )}일 (${dayOfWeek})`;

              return (
                <React.Fragment key={groupKey}>
                  {/* 그룹 헤더: 메인 헤더 바로 아래에 딱 붙도록 sticky top 값을 헤더 높이와 동일하게 설정 */}
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
                  {groupIndicators.length > 0 ? (
                    groupIndicators.map((indicator: EconomicIndicatorEvent) => (
                      <EconomicIndicatorRow
                        key={indicator.id}
                        indicator={indicator}
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

interface EconomicIndicatorRowProps {
  indicator: EconomicIndicatorEvent;
  isFavoritePage?: boolean;
}

function EconomicIndicatorRow({
  indicator,
  isFavoritePage = false,
}: EconomicIndicatorRowProps) {
  const [isAlarmSet, setIsAlarmSet] = useState(false);
  const [isEventAdded, setIsEventAdded] = useState(
    isFavoritePage ? true : indicator.isFavorite || false,
  );

  const queryClient = useQueryClient();

  // 관심 추가 mutation
  const addFavoriteMutation = useMutation({
    mutationFn: addFavoriteEconomicIndicator,
    onSuccess: () => {
      setIsEventAdded(true);
      toast.success('관심 일정에 추가되었습니다.');
      // 캐시 업데이트
      queryClient.invalidateQueries({ queryKey: ['favoriteCalendarEvents'] });
      queryClient.invalidateQueries({ queryKey: ['favoriteCount'] });
    },
    onError: (error) => {
      console.error('API error:', error);
      toast.error(
        `추가 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
      );
    },
  });

  // 관심 제거 mutation
  const removeFavoriteMutation = useMutation({
    mutationFn: removeFavoriteEconomicIndicator,
    onSuccess: () => {
      setIsEventAdded(false);
      toast.success('관심 일정에서 제거되었습니다.');
      // 캐시 업데이트
      queryClient.invalidateQueries({ queryKey: ['favoriteCalendarEvents'] });
      queryClient.invalidateQueries({ queryKey: ['favoriteCount'] });
    },
    onError: (error) => {
      console.error('API error:', error);
      toast.error(
        `제거 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
      );
    },
  });

  const toggleAlarm = () => setIsAlarmSet((prev) => !prev);

  const handleAddEvent = () => {
    if (isEventAdded) {
      // 제거 요청
      removeFavoriteMutation.mutate(indicator.id);
    } else {
      // 추가 요청
      addFavoriteMutation.mutate(indicator.id);
    }
  };

  // 시간 형식화
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 중요도 별표 렌더링
  const renderImportanceStars = (importance: number) => {
    const stars = [];
    for (let i = 0; i < 3; i++) {
      stars.push(
        <FaStar
          key={i}
          className={i < importance ? 'text-yellow-500' : 'text-gray-300'}
        />,
      );
    }
    return <div className="flex">{stars}</div>;
  };

  // 요청 중인지 여부
  const isLoading =
    addFavoriteMutation.isPending || removeFavoriteMutation.isPending;

  return (
    <tr className="relative">
      <td className="px-4 py-2 text-sm text-gray-700">
        {formatTime(indicator.releaseDate)}
      </td>
      <td className="px-4 py-2 text-sm text-gray-700">
        <CountryFlag countryCode={indicator.country} />
      </td>
      <td className="px-4 py-2 text-sm text-gray-700">{indicator.name}</td>
      <td className="px-4 py-2 text-sm text-gray-700">
        {renderImportanceStars(indicator.importance)}
      </td>
      <td className="px-4 py-2 text-sm text-gray-700">{indicator.actual}</td>
      <td className="px-4 py-2 text-sm text-gray-700">{indicator.forecast}</td>
      <td className="relative px-4 py-2 text-sm text-gray-700">
        {indicator.previous}
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
