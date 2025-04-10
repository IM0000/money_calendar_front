import { ReactElement } from 'react';

export type CompanyResult = {
  ticker: string;
  name: string;
  isDividendAdded: boolean;
  isPerformanceAdded: boolean;
};

type CompanyResultItemProps = {
  result: CompanyResult;
  children: ReactElement;
};

export function CompanyResultItem({
  result,
  children,
}: CompanyResultItemProps) {
  return (
    <div className="mb-2 flex items-center justify-between border-b p-2">
      <div className="flex w-full items-center space-x-2">
        <span className="w-1/6 font-semibold">{result.ticker}</span>
        <span className="w-5/6">{result.name}</span>
      </div>
      {children}
    </div>
  );
}
