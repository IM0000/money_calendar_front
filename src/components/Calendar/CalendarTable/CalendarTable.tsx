import React, { useEffect, useState } from 'react';
import useCalendarStore from '../../../zustand/useCalendarDateStore';
import { EventData, dummyDataList } from '../dummyDataList';
import useFilterInfoStore from '../../../zustand/useFilterInfoStore';
import { filterData } from '../../../utils/filterData';
import { groupEventsByDate } from '../../../utils/groupEventsByDate';
import { DateSection } from './DataSection';

export function CalendarTable() {
  const { selectedDate } = useCalendarStore(({ selectedDate }) => ({
    selectedDate,
  }));
  const { selectedImportances, selectedEventTypes } = useFilterInfoStore(
    (state) => ({
      selectedImportances: state.selectedImportances,
      selectedEventTypes: state.selectedEventTypes,
    }),
  );

  /* eslint-disable */
  const [filteredDataList, setFilteredDataList] = useState<EventData[]>([]);
  const [groupedData, setGroupedData] = useState<Record<string, EventData[]>>(
    {},
  );
  const [showMySchedule, setShowMySchedule] = useState<boolean>(false);
  const [loadMoreVisible, setLoadMoreVisible] = useState<boolean>(true);

  useEffect(() => {
    let filteredData = filterData(
      dummyDataList,
      selectedImportances,
      selectedEventTypes,
    );

    if (showMySchedule) {
      filteredData = filteredData.filter((event) => event.isMySchedule);
    }

    setFilteredDataList(filteredData);
    setGroupedData(groupEventsByDate(filteredData));
  }, [selectedImportances, selectedEventTypes, showMySchedule]);

  useEffect(() => {
    console.log(`selectedDate : ${selectedDate}`);
  }, [selectedDate]);

  const handleScheduleSwitchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setShowMySchedule(event.target.checked);
  };

  const handleLoadMore = () => {
    // setCurrentPage((prevPage) => prevPage + 1);
    // loadEvents(currentPage + 1);
  };

  return (
    <div className="container mx-auto">
      <div className="flex flex-col rounded-md border border-gray-200 shadow-lg">
        <div className="inline-block min-w-full align-middle">
          <div className="min-w-full border-gray-200 shadow-sm dark:border-gray-700">
            <div className="divide-y divide-gray-300">
              <div className="grid min-w-[768px] grid-cols-8 bg-gray-50">
                {renderTableHeaders(handleScheduleSwitchChange, showMySchedule)}
              </div>
              <div className="min-w-[768px] divide-y divide-gray-200 bg-white">
                {Object.entries(groupedData).map(([date, events], index) => (
                  <DateSection
                    key={`${date}-${index}`}
                    date={date}
                    events={events}
                  />
                ))}
                {loadMoreVisible && (
                  <div className="flex justify-center py-4">
                    <span
                      onClick={handleLoadMore}
                      className="text-blue-500 hover:underline"
                    >
                      더보기
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function renderTableHeaders(
  handleScheduleSwitchChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void,
  showMySchedule: boolean,
) {
  const headers = [
    {
      label: '시간',
      className:
        'col-span-1 py-3.5 text-center text-sm font-normal text-gray-500',
    },
    {
      label: '유형',
      className:
        'col-span-1 py-3.5 text-center text-sm font-normal text-gray-500',
    },
    {
      label: '이벤트',
      className:
        'col-span-2 py-3.5 pl-2 text-left text-sm font-normal text-gray-500',
    },
    {
      label: '타입',
      className:
        'col-span-1 py-3.5 text-center text-sm font-normal text-gray-500',
    },
    {
      label: '실제(/예측)',
      className:
        'col-span-1 py-3.5 text-center text-sm font-normal text-gray-500',
    },
    {
      label: '이전',
      className:
        'col-span-1 py-3.5 text-center text-sm font-normal text-gray-500',
    },
    {
      label: (
        <div className="flex items-center justify-center">
          <span className="mr-2 text-sm font-normal text-gray-500">
            내 일정
          </span>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              className="peer sr-only"
              checked={showMySchedule}
              onChange={handleScheduleSwitchChange}
            />
            <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:bg-gray-700 dark:peer-focus:ring-blue-800"></div>
          </label>
        </div>
      ),
      className:
        'col-span-1 py-3.5 text-center text-sm font-normal text-gray-500',
    },
  ];

  return headers.map((header, index) => (
    <div key={index} className={header.className}>
      {header.label}
    </div>
  ));
}
