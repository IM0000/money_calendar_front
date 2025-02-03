import React, { useEffect, useState } from 'react';
import { FaSearch, FaPlus } from 'react-icons/fa';
import useCalendarStore from '../../zustand/useCalendarDateStore';
import { dummyDataList } from './dummyDataList';
import useFilterInfoStore from '../../zustand/useFilterInfoStore';

type EconomicIndicator = {
  type: '경제지표';
  announcementDate: Date;
  name: string;
  importance: string;
  actualValue: number;
  predictedValue: number;
  previousValue: number;
};

type Performance = {
  type: '실적';
  announcementDate: Date;
  companyName: string;
  EPS: {
    actual: number;
    predicted: number;
    previous: number;
  };
  revenue: {
    actual: number;
    predicted: number;
    previous: number;
  };
};

type Dividend = {
  type: '배당';
  exDividendDate: Date;
  companyName: string;
  dividend: {
    actual: number;
    previous: number;
  };
  paymentDate: Date;
};

type EventData = EconomicIndicator | Performance | Dividend;

export function CalendarTable() {
  const { selectedDate, subSelectedDate } = useCalendarStore((state) => ({
    selectedDate: state.selectedDate,
    subSelectedDate: state.subSelectedDate,
  }));
  const { selectedImportances, selectedEventTypes } = useFilterInfoStore(
    (state) => ({
      selectedImportances: state.selectedImportances,
      selectedEventTypes: state.selectedEventTypes,
    }),
  );

  const [filteredDataList, setFilteredDataList] = useState<EventData[]>([]);
  const [groupedData, setGroupedData] = useState<Record<string, EventData[]>>(
    {},
  );

  useEffect(() => {
    const filteredData = filterData(
      dummyDataList,
      selectedImportances,
      selectedEventTypes,
    );
    setFilteredDataList(filteredData);
    setGroupedData(groupEventsByDate(filteredData));
  }, [selectedImportances, selectedEventTypes]);

  useEffect(() => {
    console.log(`selectedDate : ${selectedDate}`);
  }, [selectedDate]);

  return (
    <div className="container mx-auto">
      <div className="flex flex-col border border-gray-200 rounded-md shadow-lg">
        <div className="inline-block min-w-full align-middle">
          <div className="min-w-full border-gray-200 shadow-sm dark:border-gray-700">
            <div className="divide-y divide-gray-300">
              <div className="grid min-w-[768px] grid-cols-9 bg-gray-50">
                {renderTableHeaders()}
              </div>
              <div className="min-w-[768px] divide-y divide-gray-200 bg-white">
                {Object.entries(groupedData).map(([date, events]) => (
                  <DateSection key={date} date={date} events={events} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function filterData(
  data: EventData[],
  importances: string[],
  eventTypes: string[],
): EventData[] {
  if (importances.length === 0 && eventTypes.length === 0) {
    return data;
  }

  return data.filter((item) => {
    const isEventTypeSelected =
      eventTypes.length === 0 || eventTypes.includes(item.type);
    const isImportanceSelected =
      item.type === '경제지표'
        ? importances.length === 0 || importances.includes(item.importance)
        : true;

    return isEventTypeSelected && isImportanceSelected;
  });
}

function groupEventsByDate(data: EventData[]): Record<string, EventData[]> {
  return data.reduce(
    (acc, event) => {
      const dateKey =
        event.type === '배당'
          ? event.exDividendDate.toISOString().split('T')[0]
          : event.announcementDate.toISOString().split('T')[0];

      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(event);
      console.log('##acc');
      console.log(acc);
      return acc;
    },
    {} as Record<string, EventData[]>,
  );
}

function DateSection({ date, events }: { date: string; events: EventData[] }) {
  return (
    <div>
      <div className="flex h-10 py-4 bg-gray-200">
        <div className="flex-1 pl-4 text-sm text-gray-500">{date}</div>
      </div>
      {events.map(renderEventRow)}
    </div>
  );
}

function renderTableHeaders() {
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
      label: '실제',
      className:
        'col-span-1 py-3.5 text-center text-sm font-normal text-gray-500',
    },
    {
      label: '예측',
      className:
        'col-span-1 py-3.5 text-center text-sm font-normal text-gray-500',
    },
    {
      label: '이전',
      className:
        'col-span-1 py-3.5 text-center text-sm font-normal text-gray-500',
    },
    {
      label: '+',
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

function renderEventRow(event: EventData) {
  switch (event.type) {
    case '경제지표':
      return (
        <EconomicIndicatorRow
          key={event.announcementDate.toISOString()}
          event={event}
        />
      );
    case '실적':
      return (
        <PerformanceRow
          key={event.announcementDate.toISOString()}
          event={event}
        />
      );
    case '배당':
      return (
        <DividendRow key={event.exDividendDate.toISOString()} event={event} />
      );
    default:
      return null;
  }
}

function EconomicIndicatorRow({ event }: { event: EconomicIndicator }) {
  return (
    <div className="grid items-center h-16 grid-cols-9">
      <div className="col-span-1 py-3.5 text-center text-sm font-normal text-gray-500">
        <div className="text-center">
          <span>
            {formatDateTime(event.announcementDate).split(' ')[0]}
            <br />
            {formatDateTime(event.announcementDate).split(' ')[1]}
          </span>
        </div>
      </div>
      <div className="col-span-1 py-3.5 text-center text-sm font-normal text-gray-500">
        <div>{event.type}</div>
      </div>
      <div className="col-span-2 py-3.5 pl-2 text-left text-sm font-normal text-gray-500">
        <span>{event.name}</span>
      </div>
      <div className="col-span-1 py-3.5 text-center text-sm font-normal text-gray-500">
        {renderImportance(event.importance)}
      </div>
      <div className="col-span-1 py-3.5 text-center text-sm font-normal text-gray-500">
        {event.actualValue}
      </div>
      <div className="col-span-1 py-3.5 text-center text-sm font-normal text-gray-500">
        {event.predictedValue}
      </div>
      <div className="col-span-1 py-3.5 text-center text-sm font-normal text-gray-500">
        {event.previousValue}
      </div>
      <div className="col-span-1 flex items-center justify-center py-3.5 text-center text-sm font-normal text-gray-500">
        {renderButtons()}
      </div>
    </div>
  );
}

function PerformanceRow({ event }: { event: Performance }) {
  return (
    <div className="grid items-center h-16 grid-cols-9">
      <div className="col-span-1 py-3.5 text-center text-sm font-normal text-gray-500">
        <div className="text-center">
          <span>{formatDate(event.announcementDate)}</span>
        </div>
      </div>
      <div className="col-span-1 py-3.5 text-center text-sm font-normal text-gray-500">
        <div>{event.type}</div>
      </div>
      <div className="col-span-2 py-3.5 pl-2 text-left text-sm font-normal text-gray-500">
        <span>{event.companyName}</span>
      </div>
      <div className="col-span-1 py-3.5 text-center text-sm font-normal text-gray-500">
        <div>EPS</div>
        <div>Sales</div>
      </div>
      <div className="col-span-1 py-3.5 text-center text-sm font-normal text-gray-500">
        <div>{event.EPS.actual}</div>
        <div>{event.revenue.actual}</div>
      </div>
      <div className="col-span-1 py-3.5 text-center text-sm font-normal text-gray-500">
        <div>{event.EPS.predicted}</div>
        <div>{event.revenue.predicted}</div>
      </div>
      <div className="col-span-1 py-3.5 text-center text-sm font-normal text-gray-500">
        <div>{event.EPS.previous}</div>
        <div>{event.revenue.previous}</div>
      </div>
      <div className="col-span-1 flex items-center justify-center py-3.5 text-center text-sm font-normal text-gray-500">
        {renderButtons()}
      </div>
    </div>
  );
}

function DividendRow({ event }: { event: Dividend }) {
  return (
    <div className="grid items-center h-16 grid-cols-9">
      <div className="col-span-1 py-3.5 text-center text-sm font-normal text-gray-500">
        <div className="text-center">
          <span>{formatDate(event.exDividendDate)}</span>
        </div>
      </div>
      <div className="col-span-1 py-3.5 text-center text-sm font-normal text-gray-500">
        <div>{event.type}</div>
      </div>
      <div className="col-span-2 py-3.5 pl-2 text-left text-sm font-normal text-gray-500">
        <span>{event.companyName}</span>
      </div>
      <div className="col-span-1 py-3.5 text-center text-sm font-normal text-gray-500">
        <div>배당금</div>
        <div>배당지급일</div>
      </div>
      <div className="col-span-1 py-3.5 text-center text-sm font-normal text-gray-500">
        <div>{event.dividend.actual}</div>
        <div>{formatDate(event.paymentDate, '.')}</div>
      </div>
      <div className="col-span-1 py-3.5 text-center text-sm font-normal text-gray-500">
        {/* Empty for alignment */}
      </div>
      <div className="col-span-1 py-3.5 text-center text-sm font-normal text-gray-500">
        <div>{event.dividend.previous}</div>
        <div>{formatDate(event.paymentDate, '.')}</div>
      </div>
      <div className="col-span-1 flex items-center justify-center py-3.5 text-center text-sm font-normal text-gray-500">
        {renderButtons()}
      </div>
    </div>
  );
}

function renderImportance(importance: string) {
  const stars =
    importance === '높음' ? '★★★' : importance === '중간' ? '★★' : '★';
  return <span>{stars}</span>;
}

function renderButtons() {
  return (
    <div className="flex space-x-2">
      <button className="rounded bg-gray-700 p-1.5 text-white">
        <FaSearch />
      </button>
      <button className="rounded bg-gray-500 p-1.5 text-white">
        <FaPlus />
      </button>
    </div>
  );
}

function formatDate(date: Date, delimiter: string = '-') {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}${delimiter}${month}${delimiter}${day}`;
}

function formatDateTime(date: Date) {
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${formatDate(date)} ${hours}:${minutes}`;
}
