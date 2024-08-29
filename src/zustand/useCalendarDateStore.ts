import create from 'zustand';

export interface CalendarState {
  date: Date;
  dateList: Date[];
  selectedDate: Date;
  selectedDates: Date[];
  selectedMonth: Date;
  setDate: (date: Date) => void;
  setDateList: (dateList: Date[]) => void;
  setSelectedDate: (date: Date) => void;
  setSelectedDates: (date: Date | Date[]) => void;
  setSelectedMonth: (date: Date) => void;
}

const useCalendarStore = create<CalendarState>((set) => {
  const today = new Date();
  const monthDates = getMonthDates(today.getFullYear(), today.getMonth());
  const selectedMonth = new Date(today);
  selectedMonth.setDate(1);
  return {
    date: today,
    dateList: monthDates,
    selectedDate: today,
    selectedDates: [today],
    selectedMonth: selectedMonth,
    setDate: (date: Date) =>
      set(() => {
        const monthDates = getMonthDates(date.getFullYear(), date.getMonth());
        const selectedMonth = new Date(date);
        selectedMonth.setDate(1);
        return {
          date,
          dateList: monthDates,
          selectedDate: date,
          selectedMonth: selectedMonth,
        };
      }),
    setDateList: (dateList: Date[]) => set({ dateList }),
    setSelectedDate: (selectedDate: Date) => set({ selectedDate }),
    setSelectedDates: (date) =>
      set((state) => {
        if (Array.isArray(date)) {
          return { selectedDates: date };
        }
        const newSelectedDates =
          state.selectedDates.length === 1
            ? [...state.selectedDates, date]
            : [date];
        newSelectedDates.sort((a, b) => a.getTime() - b.getTime());
        return { selectedDates: newSelectedDates };
      }),
    setSelectedMonth: (date) =>
      set(() => {
        const monthDates = getMonthDates(date.getFullYear(), date.getMonth());
        return {
          dateList: monthDates,
          selectedMonth: date,
        };
      }),
  };
});

function getMonthDates(year: number, month: number) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthDates: Date[] = [];
  const firstDayOfMonth = new Date(year, month, 1);
  const firstSunday = new Date(firstDayOfMonth);
  firstSunday.setDate(firstDayOfMonth.getDate() - firstDayOfMonth.getDay());
  const lastDayOfMonth = new Date(year, month, daysInMonth);
  const lastSaturday = new Date(lastDayOfMonth);
  lastSaturday.setDate(
    lastDayOfMonth.getDate() + (6 - lastDayOfMonth.getDay()),
  );

  for (let d = firstSunday; d <= lastSaturday; d.setDate(d.getDate() + 1)) {
    monthDates.push(new Date(d));
  }

  return monthDates;
}

// 테스트 예시
const dates = getMonthDates(2024, 5); // 2024년 6월의 5주치 날짜를 가져옴
console.log(dates);

export default useCalendarStore;
