import FilterButton from './FilterButton';

type FilterProps = {
  showResetButton: boolean;
  resetFilters: () => void;
  selectedEventTypes: string[];
  selectedImportances: string[];
  toggleSelection: (
    selection: string[],
    setSelection: (selection: string[]) => void,
    value: string,
  ) => void;
  setSelectedEventTypes: (selection: string[]) => void;
  setSelectedImportances: (selection: string[]) => void;
};

export default function Filter({
  showResetButton,
  resetFilters,
  selectedEventTypes,
  selectedImportances,
  toggleSelection,
  setSelectedEventTypes,
  setSelectedImportances,
}: FilterProps) {
  return (
    <div>
      <div className="flex justify-between bg-gray-100 p-4 text-xl">
        <div className="p-1">필터</div>
        {showResetButton && (
          <button
            onClick={resetFilters}
            className="rounded-sm bg-white px-2 py-1 text-sm font-medium text-blue-500 hover:bg-gray-200 focus:outline-none"
          >
            초기화
          </button>
        )}
      </div>
      <div className="min-h-full rounded-b bg-white">
        <div className="px-4">
          <div className="mb-6">
            <div className="my-4 p-2 text-sm font-bold text-gray-800">
              이벤트 유형
            </div>
            <div className="flex justify-start space-x-4 pl-2">
              {['경제지표', '실적', '배당'].map((type) => (
                <FilterButton
                  key={type}
                  type={type}
                  selectedList={selectedEventTypes}
                  toggleSelection={toggleSelection}
                  setSelected={setSelectedEventTypes}
                />
              ))}
            </div>
            {selectedEventTypes.includes('경제지표') && (
              <div className="mb-6">
                <div className="my-4 p-2 text-sm font-bold text-gray-800">
                  경제지표 중요도
                </div>
                <div className="flex justify-start space-x-4 pl-2">
                  {['낮음', '중간', '높음'].map((level) => (
                    <FilterButton
                      key={level}
                      type={level}
                      selectedList={selectedImportances}
                      toggleSelection={toggleSelection}
                      setSelected={setSelectedImportances}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
