import DetailButtons from './DetailButtons';
import { formatDate } from '../../../utils/formatDate';

export type Dividend = {
  type: '배당';
  exDividendDate: Date;
  companyName: string;
  dividend: {
    actual: number;
    previous: number;
  };
  paymentDate: Date;
  isMySchedule?: boolean; // 내 일정 여부
};

export function DividendRow({ event }: { event: Dividend }) {
  return (
    <div className="grid h-16 grid-cols-8 items-center border-b">
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
        <div>{event.dividend.previous}</div>
        <div>{formatDate(event.paymentDate, '.')}</div>
      </div>
      <div className="col-span-1 flex items-center justify-center py-3.5 text-center text-sm font-normal text-gray-500">
        <DetailButtons />
      </div>
    </div>
  );
}
