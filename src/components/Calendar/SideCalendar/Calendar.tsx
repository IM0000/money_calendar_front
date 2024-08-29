import { useMemo, useCallback } from 'react';

type CalendarProps = {
  dateList: Date[];
  selectedDate: Date;
  selectedDates: Date[];
  selectedMonth: Date;
  setSelectedDate: (date: Date) => void;
  setSelectedDates: (date: Date | Date[]) => void;
  setSelectedMonth: (date: Date) => void;
};

export default function Calendar({
  dateList,
  selectedDate,
  selectedDates,
  selectedMonth,
  setSelectedDate,
  setSelectedDates,
  setSelectedMonth,
}: CalendarProps) {
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setSelectedDates(date);
  };

  const handleMonthChange = (offset: number) => {
    const newMonth = new Date(selectedMonth);
    newMonth.setMonth(newMonth.getMonth() + offset);
    setSelectedMonth(newMonth);
  };

  const isSelectedDate = useCallback(
    (date: Date) =>
      selectedDates.some((d) => d.toDateString() === date.toDateString()),
    [selectedDates],
  );

  const isInRange = useCallback(
    (date: Date) => {
      if (selectedDates.length === 2) {
        const [start, end] = selectedDates;
        return date > start && date < end;
      }
      return false;
    },
    [selectedDates],
  );

  const getDateClass = useMemo(
    () => (date: Date) => {
      const classes = ['items-center', 'justify-center'];
      if (isSelectedDate(date) && selectedDates.length === 2) {
        classes.push('bg-blue-300', 'text-white', 'border-1', 'border-black');
        if (date.toDateString() === selectedDates[0].toDateString())
          classes.push('rounded-l-md');
        if (date.toDateString() === selectedDates[1].toDateString())
          classes.push('rounded-r-md');
      } else if (isInRange(date)) {
        classes.push('bg-blue-100');
      }
      return classes.join(' ');
    },
    [isSelectedDate, isInRange, selectedDates],
  );

  const getSingleSelectedClass = useMemo(
    () => (date: Date) => {
      const classes = ['items-center', 'justify-center'];
      if (isSelectedDate(date) && selectedDates.length === 1) {
        classes.push(
          'bg-blue-300',
          'text-white',
          'border-1',
          'border-black',
          'rounded-full',
        );
      }
      return classes.join(' ');
    },
    [isSelectedDate, selectedDates],
  );

  const getSelectedMonthClass = useMemo(
    () => (date: Date) => {
      if (!selectedDates[0]) {
        return date.getMonth() === selectedMonth.getMonth()
          ? 'text-gray-700'
          : 'text-gray-300';
      }

      const [start, end] = selectedDates;
      const isSelectedDate =
        date.toDateString() === selectedDate.toDateString();
      const isSingleDate = start && !end;
      const isInRange = date >= start && date <= end;

      if (isSingleDate) {
        return date.getMonth() === selectedMonth.getMonth() || isSelectedDate
          ? 'text-gray-700'
          : 'text-gray-300';
      }

      if (date.getMonth() === selectedMonth.getMonth()) {
        return 'text-gray-700';
      }

      return isInRange ? 'text-gray-700' : 'text-gray-300';
    },
    [selectedDates, selectedMonth, selectedDate],
  );

  const renderCalendarDays = () => {
    return dateList.map((date) => (
      <td
        key={date.toDateString()}
        onClick={() => handleDateClick(date)}
        className={`${getDateClass(date)} items-center justify-center`}
      >
        <div className="flex w-full cursor-pointer items-center justify-center">
          <div
            className={`${getSingleSelectedClass(date)} flex h-9 w-9 items-center justify-center hover:rounded-full hover:border-2 hover:border-gray-300`}
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
  };

  return (
    <div className="m-3">
      <div className="flex items-center justify-between px-4">
        <span className="text-base font-bold text-gray-800 focus:outline-none">
          {selectedMonth.getFullYear() + '.' + (selectedMonth.getMonth() + 1)}
        </span>
        <div className="flex items-center">
          <button
            aria-label="calendar backward"
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
            aria-label="calendar forward"
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
      <div className="flex items-center justify-between pt-6">
        <table className="w-full">
          <thead>
            <tr>
              {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                <th key={day}>
                  <div className="flex w-full justify-center">
                    <p className="text-center text-base font-medium text-gray-800">
                      {day}
                    </p>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[0, 1, 2, 3, 4].map((div) => (
              <tr key={div}>
                {renderCalendarDays().slice(div * 7, (div + 1) * 7)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
