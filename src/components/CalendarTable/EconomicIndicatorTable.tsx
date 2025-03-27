import React, { createRef, useMemo, useState } from 'react';
import EventAddButton from './EventAddButton';
import NotificationButton from './NotificationButton';
import CalendarTableWrapper from './CalendarTableWrapper';
import { DateRange } from '@/types/CalendarTypes';
import { EconomicIndicatorEvent } from '@/api/services/CalendarService';
import { formatLocalISOString } from '@/utils/toLocaleISOString';
import { TableGroupSkeleton } from '@/components/UI/Skeleton';
import { FaStar } from 'react-icons/fa';

interface EconomicIndicatorTableProps {
  events: EconomicIndicatorEvent[];
  dateRange: DateRange;
  isLoading?: boolean;
}

export default function EconomicIndicatorTable({
  events,
  dateRange,
  isLoading = false,
}: EconomicIndicatorTableProps) {
  dateRange; // 사용하지 않지만, 필요에 따라 추가적인 로직을 구현할 수 있습니다.

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

  // 그룹키(날짜)를 오름차순 정렬
  const sortedGroupKeys = Object.keys(groups).sort();

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
              <TableGroupSkeleton columns={7} rows={3} />
              <TableGroupSkeleton columns={7} rows={2} />
              <TableGroupSkeleton columns={7} rows={4} />
            </>
          ) : (
            // 데이터가 있을 때 실제 테이블 내용 표시
            sortedGroupKeys.map((groupKey, index) => {
              const groupIndicators = groups[groupKey];
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
                      colSpan={7}
                      className="border-b px-4 py-2 text-sm font-semibold"
                    >
                      {formattedGroupDate}
                    </td>
                  </tr>
                  {groupIndicators.map((indicator) => (
                    <EconomicIndicatorRow
                      key={indicator.id}
                      indicator={indicator}
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

interface EconomicIndicatorRowProps {
  indicator: EconomicIndicatorEvent;
}

function EconomicIndicatorRow({ indicator }: EconomicIndicatorRowProps) {
  const [showPrevPopup, setShowPrevPopup] = useState(false);
  const [isAlarmSet, setIsAlarmSet] = useState(false);
  const [isEventAdded, setIsEventAdded] = useState(false);

  const togglePrevPopup = () => setShowPrevPopup((prev) => !prev);
  const toggleAlarm = () => setIsAlarmSet((prev) => !prev);
  const handleAddEvent = () => {
    setIsEventAdded((prev) => !prev);
    // 여기에 사용자의 이벤트 목록에 해당 실적 정보를 추가하는 로직 구현
    console.log(`경제지표 정보 ${indicator.id}를 이벤트 목록에 추가합니다.`);
  };

  // 중요도에 따라 별 표시를 렌더링하는 함수
  const renderImportanceStars = (importance: number | string) => {
    const maxImportance = 3; // 최대 중요도 (필요에 따라 조정)
    let importanceValue = 0;

    // 중요도가 숫자 또는 숫자 문자열인 경우에만 변환
    if (importance !== undefined && importance !== null) {
      const parsed = Number(importance);
      if (!isNaN(parsed)) {
        importanceValue = Math.min(Math.max(0, parsed), maxImportance);
      }
    }

    // 중요도에 따른 설명 텍스트
    const importanceText = {
      0: '낮음',
      1: '낮음',
      2: '중간',
      3: '높음',
    }[importanceValue];

    return (
      <div
        className="flex items-center"
        title={`중요도: ${importanceText} (${importanceValue})`}
      >
        {Array.from({ length: maxImportance }).map((_, index) => (
          <FaStar
            key={index}
            className={
              index < importanceValue
                ? 'text-blue-400' // 채워진 별 (파란색으로 변경하여 테마에 맞춤)
                : 'text-gray-200' // 빈 별 (더 연한 회색으로 변경)
            }
            size={14}
          />
        ))}
      </div>
    );
  };

  return (
    <tr className="relative">
      <td className="px-4 py-2 text-sm text-gray-700">
        {indicator.eventCountry}
      </td>
      <td className="px-4 py-2 text-sm text-gray-700">{indicator.name}</td>
      <td className="px-4 py-2 text-sm text-gray-700">
        {renderImportanceStars(indicator.importance)}
      </td>
      <td className="px-4 py-2 text-sm text-gray-700">{indicator.actual}</td>
      <td className="px-4 py-2 text-sm text-gray-700">{indicator.forecast}</td>
      <td className="relative px-4 py-2 text-sm text-gray-700">
        <button
          onClick={togglePrevPopup}
          className="text-blue-500 underline hover:text-blue-700 focus:outline-none"
        >
          {indicator.previous}
        </button>
        {showPrevPopup && (
          <div className="absolute left-0 mt-1 rounded border bg-white p-2 shadow-lg">
            <p className="text-xs text-gray-700">
              이전값 상세정보: {indicator.previous}
            </p>
          </div>
        )}
      </td>
      {/* 이벤트 추가 + 알림 버튼 */}
      <td className="w-10 px-2 py-2 text-sm text-gray-700">
        <div className="flex items-center space-x-1">
          <EventAddButton isAdded={isEventAdded} onClick={handleAddEvent} />
          <NotificationButton isActive={isAlarmSet} onClick={toggleAlarm} />
        </div>
      </td>
    </tr>
  );
}
