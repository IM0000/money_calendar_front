import useCalendarStore from '@/zustand/useCalendarDateStore';
import { useMemo, useCallback } from 'react';

export default function Calendar() {
  const {
    dateList,
    selectedDate,
    selectedMonth,
    subSelectedDates,
    setSelectedDate,
    setSelectedMonth,
  } = useCalendarStore();

  // 날짜 클릭 시 처리 함수
  const handleDateClick = useCallback(
    (date: Date) => {
      setSelectedDate(date);
    },
    [setSelectedDate],
  );

  // 월 변경 처리 함수
  const handleMonthChange = useCallback(
    (offset: number) => {
      setSelectedMonth(
        new Date(selectedMonth.setMonth(selectedMonth.getMonth() + offset)),
      );
    },
    [setSelectedMonth, selectedMonth],
  );

  // 선택된 날짜인지 확인하는 함수
  const isSelectedDate = useCallback(
    (date: Date) => date.toDateString() === selectedDate.toDateString(),
    [selectedDate],
  );

  // subSelectedDates에 포함되는 날짜인지 확인하는 함수
  const isSubSelectedDate = useCallback(
    (date: Date) =>
      subSelectedDates.some((d) => d.toDateString() === date.toDateString()),
    [subSelectedDates],
  );

  // 날짜 셀의 기본 클래스 설정
  const getDateClass = useMemo(
    () => (date: Date) => {
      const classes = ['items-center', 'justify-center'];
      if (isSubSelectedDate(date)) {
        classes.push('bg-blue-100'); // subSelectedDates에 해당하는 날짜는 연한 배경색
      }
      return classes.join(' ');
    },
    [isSubSelectedDate],
  );

  // 선택된 날짜에 대한 클래스 설정
  const getSelectedDateClass = useMemo(
    () => (date: Date) => {
      const classes = ['items-center', 'justify-center'];
      if (isSelectedDate(date)) {
        classes.push(
          'bg-blue-300',
          'text-white',
          'border',
          'border-black',
          'rounded-full',
        ); // 선택된 날짜는 뚜렷한 스타일 적용
      }
      return classes.join(' ');
    },
    [isSelectedDate],
  );

  // 선택된 월에 속하는 날짜인지 확인하여 클래스 설정
  const getSelectedMonthClass = useMemo(
    () => (date: Date) => {
      return date.getMonth() === selectedMonth.getMonth()
        ? 'text-gray-700'
        : 'text-gray-300'; // 선택된 월이 아닌 날짜는 흐린 색상
    },
    [selectedMonth],
  );

  // 달력의 날짜들을 렌더링하는 함수
  const renderCalendarDays = useMemo(() => {
    return dateList.map((date) => (
      <td
        key={date.toDateString()}
        onClick={() => handleDateClick(date)}
        className={`${getDateClass(date)} cursor-pointer`}
      >
        <div className="flex items-center justify-center w-full">
          <div
            className={`${getSelectedDateClass(date)} flex h-9 w-9 items-center justify-center hover:rounded-full hover:border-2 hover:border-gray-300`}
          >
            <p
              className={`${getSelectedMonthClass(date)} text-base font-medium`}
            >
              {date.getDate()}
            </p>
          </div>
        </div>
      </td>
    ));
  }, [
    dateList,
    handleDateClick,
    getDateClass,
    getSelectedDateClass,
    getSelectedMonthClass,
  ]);

  return (
    <div className="m-3">
      {/* 헤더: 월과 네비게이션 버튼 */}
      <div className="flex items-center justify-between px-4">
        <span className="text-base font-bold text-gray-800">
          {selectedMonth.getFullYear()}.{selectedMonth.getMonth() + 1}
        </span>
        <div className="flex items-center">
          <button
            aria-label="이전 월"
            className="text-gray-800 hover:text-gray-400 focus:text-gray-400"
            onClick={() => handleMonthChange(-1)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-chevron-left"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <polyline points="15 6 9 12 15 18" />
            </svg>
          </button>
          <button
            aria-label="다음 월"
            className="ml-3 text-gray-800 hover:text-gray-400 focus:text-gray-400"
            onClick={() => handleMonthChange(1)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-chevron-right"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              fill="none"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <polyline points="9 6 15 12 9 18" />
            </svg>
          </button>
        </div>
      </div>

      {/* 요일 헤더 */}
      <div className="flex items-center justify-between pt-6">
        <table className="w-full">
          <thead>
            <tr>
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                <th key={day}>
                  <div className="flex justify-center w-full">
                    <p className="text-base font-medium text-center text-gray-800">
                      {day}
                    </p>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[0, 1, 2, 3, 4].map((week) => (
              <tr key={week}>
                {renderCalendarDays.slice(week * 7, (week + 1) * 7)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
