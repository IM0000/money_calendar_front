import { EventData, renderEventRow } from './EventRowRenderer';

export function DateSection({
  date,
  events,
}: {
  date: string;
  events: EventData[];
}) {
  const dateObj = new Date(date);
  const dayOfWeek = dateObj.getDay();
  const days = [
    '일요일',
    '월요일',
    '화요일',
    '수요일',
    '목요일',
    '금요일',
    '토요일',
  ];
  const dayLabel = days[dayOfWeek];

  return (
    <div>
      <div className="flex h-12 items-center justify-between bg-gray-200 font-bold">
        <div className="flex-1 pl-6 text-sm text-gray-700">{date}</div>
        <div className="pr-6 text-sm text-gray-700">{dayLabel}</div>
      </div>
      {events.map((event, index) => (
        <div key={`${event.type}-${index}`}>{renderEventRow(event)}</div>
      ))}
    </div>
  );
}
