import React, { createRef, useMemo, useState } from 'react';
import EventAddButton from './EventAddButton';
import NotificationButton from './NotificationButton';
import CalendarTableWrapper from './CalendarTableWrapper';

interface DividendData {
  id: number;
  country: string;
  exDividendDate: number; // 배당락일 (밀리초 단위)
  dividendAmount: string; // 배당금
  previousDividendAmount: string; // 바로 직전 배당금
  paymentDate: number; // 배당 지급일 (밀리초 단위)
  company: {
    name: string;
    ticker: string;
  };
  dividendYield?: string; // 배당수익률 (선택적)
}

// 더미 데이터 (실제 환경에서는 DB/API에서 받아옴)
const dummyDividends: DividendData[] = [
  {
    id: 1,
    country: 'USA',
    exDividendDate: new Date('2025-02-10').getTime(),
    dividendAmount: '$0.82',
    previousDividendAmount: '$0.80',
    paymentDate: new Date('2025-03-01').getTime(),
    company: { name: 'Apple', ticker: 'AAPL' },
    dividendYield: '1.5%',
  },
  {
    id: 2,
    country: 'USA',
    exDividendDate: new Date('2025-02-10').getTime(),
    dividendAmount: '$0.56',
    previousDividendAmount: '$0.55',
    paymentDate: new Date('2025-03-05').getTime(),
    company: { name: 'Microsoft', ticker: 'MSFT' },
    dividendYield: '2.0%',
  },
  {
    id: 3,
    country: 'Korea',
    exDividendDate: new Date('2025-02-15').getTime(),
    dividendAmount: '₩300',
    previousDividendAmount: '₩290',
    paymentDate: new Date('2025-03-10').getTime(),
    company: { name: 'Samsung', ticker: '005930.KS' },
    dividendYield: '3.2%',
  },
  {
    id: 4,
    country: 'Korea',
    exDividendDate: new Date('2025-02-15').getTime(),
    dividendAmount: '₩300',
    previousDividendAmount: '₩290',
    paymentDate: new Date('2025-03-10').getTime(),
    company: { name: 'Samsung', ticker: '005930.KS' },
    dividendYield: '3.2%',
  },
  {
    id: 5,
    country: 'Korea',
    exDividendDate: new Date('2025-02-15').getTime(),
    dividendAmount: '₩300',
    previousDividendAmount: '₩290',
    paymentDate: new Date('2025-03-10').getTime(),
    company: { name: 'Samsung', ticker: '005930.KS' },
    dividendYield: '3.2%',
  },
  {
    id: 6,
    country: 'Korea',
    exDividendDate: new Date('2025-02-15').getTime(),
    dividendAmount: '₩300',
    previousDividendAmount: '₩290',
    paymentDate: new Date('2025-03-10').getTime(),
    company: { name: 'Samsung', ticker: '005930.KS' },
    dividendYield: '3.2%',
  },
  {
    id: 7,
    country: 'Korea',
    exDividendDate: new Date('2025-02-15').getTime(),
    dividendAmount: '₩300',
    previousDividendAmount: '₩290',
    paymentDate: new Date('2025-03-10').getTime(),
    company: { name: 'Samsung', ticker: '005930.KS' },
    dividendYield: '3.2%',
  },
  {
    id: 8,
    country: 'Korea',
    exDividendDate: new Date('2025-02-15').getTime(),
    dividendAmount: '₩300',
    previousDividendAmount: '₩290',
    paymentDate: new Date('2025-03-10').getTime(),
    company: { name: 'Samsung', ticker: '005930.KS' },
    dividendYield: '3.2%',
  },
  {
    id: 9,
    country: 'Korea',
    exDividendDate: new Date('2025-02-15').getTime(),
    dividendAmount: '₩300',
    previousDividendAmount: '₩290',
    paymentDate: new Date('2025-03-10').getTime(),
    company: { name: 'Samsung', ticker: '005930.KS' },
    dividendYield: '3.2%',
  },
  {
    id: 10,
    country: 'Korea',
    exDividendDate: new Date('2025-02-15').getTime(),
    dividendAmount: '₩300',
    previousDividendAmount: '₩290',
    paymentDate: new Date('2025-03-10').getTime(),
    company: { name: 'Samsung', ticker: '005930.KS' },
    dividendYield: '3.2%',
  },
  // 추가 데이터가 필요한 경우 계속 추가...
];

export default function DividendTable() {
  // 그룹화: exDividendDate(YYYY-MM-DD) 기준으로 그룹화
  const groups = dummyDividends.reduce(
    (acc, dividend) => {
      const dateObj = new Date(dividend.exDividendDate);
      const groupKey = dateObj.toISOString().slice(0, 10);
      if (!acc[groupKey]) acc[groupKey] = [];
      acc[groupKey].push(dividend);
      return acc;
    },
    {} as Record<string, DividendData[]>,
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
        <thead className="sticky top-0 z-30 calendar-table-header bg-gray-50">
          <tr className="h-[2.80rem]">
            <th className="px-4 py-2 text-sm font-medium text-left text-gray-700">
              국가
            </th>
            <th className="px-4 py-2 text-sm font-medium text-left text-gray-700">
              회사
            </th>
            <th className="px-4 py-2 text-sm font-medium text-left text-gray-700">
              배당락일
            </th>
            <th className="px-4 py-2 text-sm font-medium text-left text-gray-700">
              배당금
            </th>
            <th className="px-4 py-2 text-sm font-medium text-left text-gray-700">
              배당지급일
            </th>
            <th className="px-4 py-2 text-sm font-medium text-left text-gray-700">
              배당수익률
            </th>
            <th className="px-4 py-2 text-sm font-medium text-left text-gray-700">
              이전
            </th>
            <th className="w-10 px-2 py-2 text-sm font-medium text-left text-gray-700">
              {/* 알림추가 버튼 */}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedGroupKeys.map((groupKey, index) => {
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
                    className="px-4 py-2 text-sm font-semibold border-b"
                  >
                    {formattedGroupDate}
                  </td>
                </tr>
                {groupDividends.map((dividend) => (
                  <DividendRow key={dividend.id} dividend={dividend} />
                ))}
              </React.Fragment>
            );
          })}
          <tr style={{ height: '35rem' }}>
            <td colSpan={8}></td>
          </tr>
        </tbody>
      </table>
    </CalendarTableWrapper>
  );
}

interface DividendRowProps {
  dividend: DividendData;
}

function DividendRow({ dividend }: DividendRowProps) {
  const [showOlderPopup, setShowOlderPopup] = useState(false);
  const [isAlarmSet, setIsAlarmSet] = useState(false);
  const [isEventAdded, setIsEventAdded] = useState(false);

  const toggleOlderPopup = () => setShowOlderPopup((prev) => !prev);
  const toggleAlarm = () => setIsAlarmSet((prev) => !prev);
  const handleAddEvent = () => {
    setIsEventAdded((prev) => !prev);
    // 여기에 사용자의 이벤트 목록에 해당 실적 정보를 추가하는 로직 구현
    console.log(`배당 정보 ${dividend.id}를 이벤트 목록에 추가합니다.`);
  };

  const exDividendDisplay = new Date(
    dividend.exDividendDate,
  ).toLocaleDateString();
  const paymentDateDisplay = new Date(
    dividend.paymentDate,
  ).toLocaleDateString();

  // 더 과거의 이전 배당금값 (더미 예시)
  const olderPreviousValues = [{ dividend: '$0.78' }, { dividend: '$0.76' }];

  return (
    <tr className="relative">
      {/* 국가 */}
      <td className="px-4 py-2 text-sm text-gray-700">{dividend.country}</td>
      {/* 회사명(티커) */}
      <td className="px-4 py-2 text-sm text-gray-700">
        {dividend.company.name} ({dividend.company.ticker})
      </td>
      {/* 배당락일 */}
      <td className="px-4 py-2 text-sm text-gray-700">{exDividendDisplay}</td>
      {/* 배당금 */}
      <td className="px-4 py-2 text-sm text-gray-700">
        {dividend.dividendAmount}
      </td>
      {/* 배당지급일 */}
      <td className="px-4 py-2 text-sm text-gray-700">{paymentDateDisplay}</td>
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
          <div className="absolute left-0 p-2 mt-1 bg-white border rounded shadow-lg">
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
          <EventAddButton isAdded={isEventAdded} onClick={handleAddEvent} />
          <NotificationButton isActive={isAlarmSet} onClick={toggleAlarm} />
        </div>
      </td>
    </tr>
  );
}
