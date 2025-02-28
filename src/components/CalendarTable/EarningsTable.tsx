import React, { createRef, useMemo, useState } from 'react';
import MarketIcon from './MarketIcon';
import EventAddButton from './EventAddButton';
import NotificationButton from './NotificationButton';
import CalendarTableWrapper from './CalendarTableWrapper';

interface EarningsData {
  id: number;
  country: string;
  releaseDate: number | null; // 밀리초 단위 정수 값, 없으면 null
  releaseTiming: 'UNKNOWN' | 'PRE_MARKET' | 'POST_MARKET';
  actualEPS: string;
  forecastEPS: string;
  previousEPS: string;
  actualRevenue: string;
  forecastRevenue: string;
  previousRevenue: string;
  company: {
    name: string;
    ticker: string;
  };
}

const dummyEarnings: EarningsData[] = [
  {
    id: 1,
    country: 'USA',
    releaseDate: new Date('2025-02-03T08:30:00').getTime(),
    releaseTiming: 'PRE_MARKET',
    actualEPS: '3.2',
    forecastEPS: '3.0',
    previousEPS: '2.9',
    actualRevenue: '80B',
    forecastRevenue: '78B',
    previousRevenue: '75B',
    company: { name: 'Apple', ticker: 'AAPL' },
  },
  {
    id: 2,
    country: 'USA',
    releaseDate: new Date('2025-02-03T15:30:00').getTime(),
    releaseTiming: 'POST_MARKET',
    actualEPS: '2.1',
    forecastEPS: '2.0',
    previousEPS: '1.9',
    actualRevenue: '50B',
    forecastRevenue: '48B',
    previousRevenue: '46B',
    company: { name: 'Microsoft', ticker: 'MSFT' },
  },
  {
    id: 3,
    country: 'Germany',
    releaseDate: new Date('2025-02-04T08:45:00').getTime(),
    releaseTiming: 'PRE_MARKET',
    actualEPS: '1.5',
    forecastEPS: '1.4',
    previousEPS: '1.3',
    actualRevenue: '30B',
    forecastRevenue: '29B',
    previousRevenue: '28B',
    company: { name: 'SAP', ticker: 'SAP' },
  },
  {
    id: 4,
    country: 'Japan',
    releaseDate: new Date('2025-02-04T16:00:00').getTime(),
    releaseTiming: 'POST_MARKET',
    actualEPS: '2.8',
    forecastEPS: '2.7',
    previousEPS: '2.6',
    actualRevenue: '40B',
    forecastRevenue: '39B',
    previousRevenue: '38B',
    company: { name: 'Toyota', ticker: 'TM' },
  },
  {
    id: 5,
    country: 'Korea',
    releaseDate: new Date('2025-02-05T09:00:00').getTime(),
    releaseTiming: 'PRE_MARKET',
    actualEPS: '1.9',
    forecastEPS: '1.8',
    previousEPS: '1.7',
    actualRevenue: '60B',
    forecastRevenue: '58B',
    previousRevenue: '55B',
    company: { name: 'Samsung', ticker: '005930.KS' },
  },
  {
    id: 6,
    country: 'Korea',
    releaseDate: null,
    releaseTiming: 'UNKNOWN',
    actualEPS: '1.9',
    forecastEPS: '1.8',
    previousEPS: '1.7',
    actualRevenue: '60B',
    forecastRevenue: '58B',
    previousRevenue: '55B',
    company: { name: 'Samsung', ticker: '005930.KS' },
  },
];

export default function EarningsTable() {
  // const { selectedDate } = useCalendarStore();

  // 날짜별로 그룹화
  const groups = dummyEarnings.reduce(
    (acc, earning) => {
      const groupKey = earning.releaseDate
        ? new Date(earning.releaseDate).toISOString().slice(0, 10)
        : '날짜 없음';
      acc[groupKey] = acc[groupKey] || [];
      acc[groupKey].push(earning);
      return acc;
    },
    {} as Record<string, EarningsData[]>,
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

  // EarningsTable 스크롤 컨테이너 ref
  // (이 컨테이너는 observer 훅이나 다른 스크롤 동작에서 사용됩니다.)
  // const tableContainerRef = useRef<HTMLDivElement>(null);

  // // 기존 useFixedDateObserver 훅 호출
  // useFixedDateObserver({
  //   headerRefs,
  //   containerSelector: '.calendar-table-container',
  // });

  // // 선택한 날짜의 row가 테이블 헤더 바로 밑에 위치하도록 스크롤
  // useEffect(() => {
  //   if (!selectedDate || !tableContainerRef.current) return;
  //   const dateStr = selectedDate.toISOString().slice(0, 10);
  //   const targetHeaderRef = headerRefs.find(
  //     (ref) => ref.current?.getAttribute('data-date') === dateStr,
  //   );
  //   if (targetHeaderRef && targetHeaderRef.current) {
  //     const tableHeader = document.querySelector('.calendar-table-header');
  //     const headerHeight = tableHeader
  //       ? tableHeader.getBoundingClientRect().height
  //       : 0; // target row의 offsetTop을 이용하여 스크롤 위치 결정 (header 바로 밑에 오도록)
  //     const tolerance = 0.3;

  //     const targetScrollTop =
  //       targetHeaderRef.current.offsetTop - headerHeight + tolerance;
  //     console.log('🚀 ~ useEffect ~ targetScrollTop:', targetScrollTop);
  //     tableContainerRef.current.scrollTo({
  //       top: targetScrollTop,
  //       behavior: 'smooth',
  //     });
  //     console.log('Scrolled to header date:', dateStr);
  //   }
  // }, [selectedDate]);

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
          {sortedGroupKeys.map((groupKey, index) => {
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
          })}
          <tr style={{ height: '35rem' }}>
            <td colSpan={9}></td>
          </tr>
        </tbody>
      </table>
    </CalendarTableWrapper>
  );
}

function EarningRow({ earning }: { earning: EarningsData }) {
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
      <td className="px-4 py-2 text-sm text-gray-700">{earning.country}</td>
      <td className="px-4 py-2 text-sm text-gray-700">
        {earning.company.name} ({earning.company.ticker})
      </td>
      <td className="px-4 py-2 text-sm text-gray-700">
        {earning.actualEPS} / {earning.forecastEPS}
      </td>
      <td className="px-4 py-2 text-sm text-gray-700">
        {earning.actualRevenue} / {earning.forecastRevenue}
      </td>
      <td className="relative px-4 py-2 text-sm text-gray-700">
        <button
          onClick={toggleOlderPopup}
          className="text-blue-500 underline hover:text-blue-700 focus:outline-none"
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
      <td className="px-4 py-2 text-sm text-gray-700">-</td>
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
