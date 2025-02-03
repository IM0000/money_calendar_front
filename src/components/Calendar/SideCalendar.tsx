import { useState, useEffect, useCallback } from 'react';
import useCalendarStore from '../../zustand/useCalendarDateStore';
import useFilterInfoStore from '../../zustand/useFilterInfoStore';

export default function SideCalendar() {
  const {
    dateList,
    selectedDate,
    selectedDates,
    selectedMonth,
    setSelectedDate,
    setSelectedDates,
    setSelectedMonth,
  } = useCalendarStore((state) => ({
    dateList: state.dateList,
    selectedDate: state.selectedDate,
    selectedDates: state.selectedDates,
    selectedMonth: state.selectedMonth,
    setSelectedDate: state.setSelectedDate,
    setSelectedDates: state.setSelectedDates,
    setSelectedMonth: state.setSelectedMonth,
  }));

  const {
    selectedImportances,
    selectedEventTypes,
    setSelectedImportances,
    setSelectedEventTypes,
  } = useFilterInfoStore((state) => ({
    selectedImportances: state.selectedImportances,
    selectedEventTypes: state.selectedEventTypes,
    setSelectedImportances: state.setSelectedImportances,
    setSelectedEventTypes: state.setSelectedEventTypes,
  }));

  const [showResetButton, setShowResetButton] = useState(false);

  useEffect(() => {
    setShowResetButton(
      selectedImportances.length > 0 || selectedEventTypes.length > 0,
    );
  }, [selectedImportances, selectedEventTypes]);

  const toggleSelection = useCallback(
    (
      selection: string[],
      setSelection: (selection: string[]) => void,
      value: string,
    ) => {
      setSelection(
        selection.includes(value)
          ? selection.filter((item) => item !== value)
          : [...selection, value],
      );
    },
    [],
  );

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setSelectedDates(date);
  };

  const resetFilters = () => {
    setSelectedImportances([]);
    setSelectedEventTypes([]);
  };

  const isSelectedDate = (date: Date) => {
    return selectedDates.some((d) => d.toDateString() === date.toDateString());
  };

  const isInRange = (date: Date) => {
    if (selectedDates.length === 2) {
      const [start, end] = selectedDates;
      return date > start && date < end;
    }
    return false;
  };

  const getDateClass = (date: Date) => {
    if (isSelectedDate(date)) {
      const classes = ['bg-blue-300', 'text-white', 'border-1', 'border-black'];
      if (selectedDates[0] && !selectedDates[1]) classes.push('rounded-full');
      if (selectedDates[1]) {
        if (date.toDateString() === selectedDates[0].toDateString())
          classes.push('rounded-l-md');
        if (date.toDateString() === selectedDates[1].toDateString())
          classes.push('rounded-r-md');
      }
      return classes.join(' ');
    }
    return isInRange(date) ? 'bg-blue-100' : '';
  };

  const getSelectedMonthClass = (date: Date) => {
    if (!selectedDates[0]) {
      return date.getMonth() === selectedMonth.getMonth()
        ? 'text-gray-700'
        : 'text-gray-300';
    }

    const [start, end] = selectedDates;
    const isSelectedDate = date.toDateString() === selectedDate.toDateString();
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
  };

  const handleMonthChange = (offset: number) => {
    const newMonth = new Date(selectedMonth);
    newMonth.setMonth(newMonth.getMonth() + offset);
    setSelectedMonth(newMonth);
  };

  const renderCalendarDays = () => {
    return dateList.map((date) => (
      <td
        key={date.toDateString()}
        onClick={() => handleDateClick(date)}
        className={`${getDateClass(date)} items-center justify-center`}
      >
        <div className="flex items-center justify-center w-full scursor-pointer">
          <div
            className={`flex h-9 w-9 items-center justify-center hover:rounded-full hover:border-2 hover:border-gray-300`}
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
    <div className="w-full max-w-md lg:flex lg:w-auto lg:flex-col lg:items-center lg:justify-start">
      <div className="w-full p-4 bg-white border border-gray-200 rounded-md shadow-md">
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
              {[0, 1, 2, 3, 4].map((div) => (
                <tr key={div}>
                  {renderCalendarDays().slice(div * 7, (div + 1) * 7)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between p-4 text-xl bg-gray-100">
          <div className="p-1">필터</div>
          {showResetButton && (
            <button
              onClick={resetFilters}
              className="px-2 py-1 text-sm font-medium text-blue-500 bg-white rounded-sm hover:bg-gray-200 focus:outline-none"
            >
              초기화
            </button>
          )}
        </div>
        <div className="min-h-full bg-white rounded-b">
          <div className="px-4">
            <div className="mb-6">
              <div className="p-2 my-4 text-sm font-bold text-gray-800">
                이벤트 유형
              </div>
              <div className="flex justify-start pl-2 space-x-4">
                {['경제지표', '실적', '배당'].map((type) => (
                  <button
                    key={type}
                    onClick={() =>
                      toggleSelection(
                        selectedEventTypes,
                        setSelectedEventTypes,
                        type,
                      )
                    }
                    className={`rounded-sm px-4 py-2 text-xs font-semibold focus:outline-none ${
                      selectedEventTypes.includes(type)
                        ? 'bg-blue-400 text-white'
                        : 'bg-gray-200 text-black'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              {selectedEventTypes.includes('경제지표') && (
                <div className="mb-6">
                  <div className="p-2 my-4 text-sm font-bold text-gray-800">
                    경제지표 중요도
                  </div>
                  <div className="flex justify-start pl-2 space-x-4">
                    {['낮음', '중간', '높음'].map((level) => (
                      <button
                        key={level}
                        onClick={() =>
                          toggleSelection(
                            selectedImportances,
                            setSelectedImportances,
                            level,
                          )
                        }
                        className={`rounded-sm px-4 py-2 text-xs font-semibold focus:outline-none ${
                          selectedImportances.includes(level)
                            ? 'bg-blue-400 text-white'
                            : 'bg-gray-200 text-black'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
