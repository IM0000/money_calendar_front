import { EconomicResultItem, EconomicResult } from './EconomicResultItem';
import { AiOutlinePlusCircle } from 'react-icons/ai';
import Tippy from '@tippyjs/react';

type EconomicResultsProps = {
  results: EconomicResult[];
};

export default function EconomicResults({ results }: EconomicResultsProps) {
  return (
    <div className="max-h-[600px] min-h-[300px] w-1/2 overflow-y-auto rounded-lg border border-gray-300 p-2 shadow-md">
      <h3 className="mb-2 bg-gray-200 p-2 text-lg font-semibold">경제지표</h3>
      {results.map((result, index) => (
        <EconomicResultItem key={index} result={result}>
          <Tippy content={result.isAdded ? '이미 추가됨' : '이벤트 추가'}>
            <button className="p-1">
              <AiOutlinePlusCircle
                size={20}
                className={`${result.isAdded ? 'text-gray-300' : 'text-gray-500 hover:text-black'}`}
              />
            </button>
          </Tippy>
        </EconomicResultItem>
      ))}
    </div>
  );
}
