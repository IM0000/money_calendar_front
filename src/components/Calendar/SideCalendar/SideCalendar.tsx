import { useState, useEffect, useCallback } from 'react';
import useCalendarStore from '../../../zustand/useCalendarDateStore';
import useFilterInfoStore from '../../../zustand/useFilterInfoStore';
import Calendar from './Calendar';
import Filter from './Filter';

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

  const resetFilters = () => {
    setSelectedImportances([]);
    setSelectedEventTypes([]);
  };

  return (
    <div className="w-full max-w-md lg:flex lg:w-auto lg:flex-col lg:items-center lg:justify-start">
      <div className="w-full rounded-md border border-gray-200 bg-white shadow-md">
        <Calendar
          dateList={dateList}
          selectedDate={selectedDate}
          selectedDates={selectedDates}
          selectedMonth={selectedMonth}
          setSelectedDate={setSelectedDate}
          setSelectedDates={setSelectedDates}
          setSelectedMonth={setSelectedMonth}
        />
        <Filter
          showResetButton={showResetButton}
          resetFilters={resetFilters}
          selectedEventTypes={selectedEventTypes}
          selectedImportances={selectedImportances}
          toggleSelection={toggleSelection}
          setSelectedEventTypes={setSelectedEventTypes}
          setSelectedImportances={setSelectedImportances}
        />
      </div>
    </div>
  );
}
