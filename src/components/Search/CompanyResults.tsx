import { CompanyResultItem, CompanyResult } from './CompanyResultItem';
import Tippy from '@tippyjs/react';
import { FaDollarSign, FaChartLine } from 'react-icons/fa';

type CompanyResultsProps = {
  results: CompanyResult[];
};

export function CompanyResults({ results }: CompanyResultsProps) {
  return (
    <div className="max-h-[600px] min-h-[300px] w-1/2 overflow-y-auto rounded-lg border border-gray-300 p-2 shadow-md">
      <h3 className="mb-2 bg-gray-200 p-2 text-lg font-semibold">기업</h3>
      {results.map((result, index) => (
        <CompanyResultItem key={index} result={result}>
          <div className="flex space-x-2">
            <Tippy
              content={result.isDividendAdded ? '이미 추가됨' : '배당일정 추가'}
            >
              <button className="p-1">
                <FaDollarSign
                  size={20}
                  className={`${result.isDividendAdded ? 'text-gray-300' : 'text-gray-500 hover:text-black'}`}
                />
              </button>
            </Tippy>
            <Tippy
              content={
                result.isPerformanceAdded ? '이미 추가됨' : '실적일정 추가'
              }
            >
              <button className="p-1">
                <FaChartLine
                  size={20}
                  className={`${result.isPerformanceAdded ? 'text-gray-300' : 'text-gray-500 hover:text-black'}`}
                />
              </button>
            </Tippy>
          </div>
        </CompanyResultItem>
      ))}
    </div>
  );
}
