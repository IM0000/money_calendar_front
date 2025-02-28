import { formatDateTime } from '../../utils/formatDateTime';
import DetailButtons from './DetailButtons';

export type EconomicIndicator = {
  type: '경제지표';
  announcementDate: Date;
  name: string;
  importance: number;
  actualValue: number;
  predictedValue: number;
  previousValue: number;
  isMySchedule?: boolean; // 내 일정 여부
};

export function EconomicIndicatorRow({ event }: { event: EconomicIndicator }) {
  return (
    <div className="h-18 grid grid-cols-8 items-center border-b">
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
      <div className="col-span-1 inline-flex justify-center py-3.5 text-sm font-normal text-gray-500">
        <div className="flex items-center justify-center">
          <p className="font-bold">{event.actualValue}</p>
          {event.predictedValue !== undefined && (
            <p>{'/' + event.predictedValue}</p>
          )}
        </div>
      </div>
      <div className="col-span-1 py-3.5 text-center text-sm font-normal text-gray-500">
        {event.previousValue}
      </div>
      <div className="col-span-1 flex items-center justify-center py-3.5 text-center text-sm font-normal text-gray-500">
        <DetailButtons />
      </div>
    </div>
  );
}

export function renderImportance(importance: number) {
  const stars = importance === 3 ? '★★★' : importance === 2 ? '★★' : '★';
  return <span>{stars}</span>;
}
