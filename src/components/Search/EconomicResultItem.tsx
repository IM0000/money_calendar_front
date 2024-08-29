import { ReactElement } from 'react';

export type EconomicResult = {
  country: string;
  importance: number;
  eventName: string;
  isAdded: boolean;
};

type EconomicResultItemProps = {
  result: EconomicResult;
  children: ReactElement;
};

export function EconomicResultItem({
  result,
  children,
}: EconomicResultItemProps) {
  return (
    <div className="mb-2 flex items-center justify-between border-b p-2">
      <div className="flex w-full items-center space-x-2">
        <span className="w-1/6">{result.country}</span>
        <span className="w-1/6">{'★'.repeat(result.importance)}</span>
        <span className="w-4/6">{result.eventName}</span>
      </div>
      {children}
    </div>
  );
}
