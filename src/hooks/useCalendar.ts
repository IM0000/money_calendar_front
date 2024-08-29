import { useCallback, useState } from 'react';

export default function useCalendar() {
  const [date, setDate] = useState(new Date());
  const [dateList, setDateList] = useState<Date[]>(getMonthDates(new Date()));
  const [selectedDate, setSelectedDate] = useState(new Date());


  const handleChangeDate = useCallback((date: Date) => {
    setDate(date);
    const monthDates = getMonthDates(date);
    setDateList(monthDates);
    setSelectedDate(date);
  }, [date]);

  const handleClickDate = useCallback((date: Date) => {
    setSelectedDate(date);
  }, [selectedDate]);

  return [date, dateList, selectedDate, handleClickDate, handleChangeDate] as const;
}

function getMonthDates(date: Date) {
  const daysInMonth = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();
  const monthDates: Date[] = [];

  // 월의 첫째 날을 가져옵니다.
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);

  // 해당 월의 첫 번째 일요일을 가져옵니다.
  const firstSunday = new Date(firstDayOfMonth);
  firstSunday.setDate(firstDayOfMonth.getDate() - firstDayOfMonth.getDay());

  // 해당 월의 마지막 날짜를 가져옵니다.
  const lastDayOfMonth = new Date(
    date.getFullYear(),
    date.getMonth(),
    daysInMonth
  );

  // 해당 월의 마지막 토요일을 가져옵니다.
  const lastSaturday = new Date(lastDayOfMonth);
  lastSaturday.setDate(
    lastDayOfMonth.getDate() + (6 - lastDayOfMonth.getDay())
  );

  // 첫 번째 일요일부터 마지막 토요일까지의 날짜를 배열에 추가합니다.
  for (let d = firstSunday; d <= lastSaturday; d.setDate(d.getDate() + 1)) {
    monthDates.push(new Date(d));
  }
  
  return monthDates;
}

