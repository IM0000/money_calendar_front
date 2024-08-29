import { formatDate } from '../../../utils/formatDate';
import DetailButtons from './DetailButtons';

export type Performance = {
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
  isMySchedule?: boolean; // 내 일정 여부
};

export function PerformanceRow({ event }: { event: Performance }) {
  return (
    <div className="grid h-16 grid-cols-8 items-center border-b">
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
        <div>주당순이익</div>
        <div>매출</div>
      </div>
      <div className="col-span-1 py-3.5 text-center text-sm font-normal text-gray-500">
        <div className="flex items-center justify-center">
          <p className="font-bold">{event.EPS.actual}</p>
          {event.EPS.predicted !== undefined && (
            <p>{'/' + event.EPS.predicted}</p>
          )}
        </div>
        <div className="flex items-center justify-center">
          <p className="font-bold">{event.revenue.actual}</p>
          {event.revenue.predicted !== undefined && (
            <p className="text-gray-500">{'/' + event.revenue.predicted}</p>
          )}
        </div>
      </div>
      <div className="col-span-1 py-3.5 text-center text-sm font-normal text-gray-500">
        <div>{event.EPS.previous}</div>
        <div>{event.revenue.previous}</div>
      </div>
      <div className="col-span-1 flex items-center justify-center py-3.5 text-center text-sm font-normal text-gray-500">
        <DetailButtons />
      </div>
    </div>
  );
}
