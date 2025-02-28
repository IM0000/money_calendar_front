import React, { createRef, useMemo, useState } from 'react';
import EventAddButton from './EventAddButton';
import NotificationButton from './NotificationButton';
import CalendarTableWrapper from './CalendarTableWrapper';

interface EconomicIndicator {
  id: number;
  country: string;
  releaseDate: number; // 밀리초 단위 정수 값
  name: string;
  importance: number;
  actual: string;
  forecast: string;
  previous: string;
}

// 더미 데이터 (실제 환경에서는 DB/API에서 받아옴)
const dummyEconomicIndicators: EconomicIndicator[] = [
  {
    id: 1,
    country: 'Korea',
    releaseDate: new Date('2025-02-03T09:00:00').getTime(),
    name: 'GDP 성장률',
    importance: 5,
    actual: '2.5',
    forecast: '2.3',
    previous: '2.1',
  },
  {
    id: 2,
    country: 'USA',
    releaseDate: new Date('2025-02-03T10:00:00').getTime(),
    name: '소매판매',
    importance: 3,
    actual: '1.8',
    forecast: '1.9',
    previous: '1.7',
  },
  {
    id: 3,
    country: 'Germany',
    releaseDate: new Date('2025-02-04T11:00:00').getTime(),
    name: '수출입 지표',
    importance: 2,
    actual: '3.2',
    forecast: '3.0',
    previous: '2.9',
  },
  {
    id: 4,
    country: 'USA',
    releaseDate: new Date('2025-02-04T12:00:00').getTime(),
    name: '실업률',
    importance: 4,
    actual: '3.5',
    forecast: '3.6',
    previous: '3.4',
  },
  {
    id: 5,
    country: 'Korea',
    releaseDate: new Date('2025-02-05T09:30:00').getTime(),
    name: '소비자물가지수',
    importance: 5,
    actual: '105.2',
    forecast: '105.0',
    previous: '104.8',
  },
  {
    id: 11,
    country: 'Korea',
    releaseDate: new Date('2025-02-03T09:00:00').getTime(),
    name: 'GDP 성장률',
    importance: 5,
    actual: '2.5',
    forecast: '2.3',
    previous: '2.1',
  },
  {
    id: 21,
    country: 'USA',
    releaseDate: new Date('2025-02-03T10:00:00').getTime(),
    name: '소매판매',
    importance: 3,
    actual: '1.8',
    forecast: '1.9',
    previous: '1.7',
  },
  {
    id: 31,
    country: 'Germany',
    releaseDate: new Date('2025-02-04T11:00:00').getTime(),
    name: '수출입 지표',
    importance: 2,
    actual: '3.2',
    forecast: '3.0',
    previous: '2.9',
  },
  {
    id: 41,
    country: 'USA',
    releaseDate: new Date('2025-02-04T12:00:00').getTime(),
    name: '실업률',
    importance: 4,
    actual: '3.5',
    forecast: '3.6',
    previous: '3.4',
  },
  {
    id: 51,
    country: 'Korea',
    releaseDate: new Date('2025-02-05T09:30:00').getTime(),
    name: '소비자물가지수',
    importance: 5,
    actual: '105.2',
    forecast: '105.0',
    previous: '104.8',
  },
  // (추가 더미 데이터 생략)
];

export default function EconomicIndicatorTable() {
  // releaseDate를 기준으로 "YYYY-MM-DD" 문자열 그룹으로 묶기
  const groups = dummyEconomicIndicators.reduce(
    (acc, indicator) => {
      const dateObj = new Date(indicator.releaseDate);
      const groupKey = dateObj.toISOString().slice(0, 10);
      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      acc[groupKey].push(indicator);
      return acc;
    },
    {} as Record<string, EconomicIndicator[]>,
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
        <thead className="sticky top-0 z-30 calendar-table-header bg-gray-50">
          <tr className="h-[2.80rem]">
            <th className="px-4 py-2 text-sm font-medium text-left text-gray-700">
              국가
            </th>
            <th className="px-4 py-2 text-sm font-medium text-left text-gray-700">
              이벤트
            </th>
            <th className="px-4 py-2 text-sm font-medium text-left text-gray-700">
              중요도
            </th>
            <th className="px-4 py-2 text-sm font-medium text-left text-gray-700">
              실제
            </th>
            <th className="px-4 py-2 text-sm font-medium text-left text-gray-700">
              예측
            </th>
            <th className="px-4 py-2 text-sm font-medium text-left text-gray-700">
              이전
            </th>
            {/* 알림추가 버튼은 열 너비를 최소화 */}
            <th className="w-10 px-2 py-2 text-sm font-medium text-left text-gray-700"></th>
          </tr>
        </thead>
        <tbody>
          {sortedGroupKeys.map((groupKey, index) => {
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
                    className="px-4 py-2 text-sm font-semibold border-b"
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
          })}
          <tr style={{ height: '35rem' }}>
            <td colSpan={7}></td>
          </tr>
        </tbody>
      </table>
    </CalendarTableWrapper>
  );
}

interface EconomicIndicatorRowProps {
  indicator: EconomicIndicator;
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

  return (
    <tr className="relative">
      <td className="px-4 py-2 text-sm text-gray-700">{indicator.country}</td>
      <td className="px-4 py-2 text-sm text-gray-700">{indicator.name}</td>
      <td className="px-4 py-2 text-sm text-gray-700">
        {indicator.importance}
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
          <div className="absolute left-0 p-2 mt-1 bg-white border rounded shadow-lg">
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
