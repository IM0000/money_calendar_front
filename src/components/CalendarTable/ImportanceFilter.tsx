import { FaStar } from 'react-icons/fa';
import { HiArrowPath } from 'react-icons/hi2';

interface ImportanceFilterProps {
  selectedImportance: number[];
  onImportanceChange: (importance: number[]) => void;
}

export default function ImportanceFilter({
  selectedImportance,
  onImportanceChange,
}: ImportanceFilterProps) {
  const handleImportanceToggle = (importance: number) => {
    if (selectedImportance.includes(importance)) {
      // 이미 선택된 중요도면 제거
      onImportanceChange(selectedImportance.filter((i) => i !== importance));
    } else {
      // 선택되지 않은 중요도면 추가
      onImportanceChange([...selectedImportance, importance]);
    }
  };

  const renderStars = (count: number) => {
    const stars = [];
    for (let i = 0; i < count; i++) {
      stars.push(<FaStar key={i} className="text-yellow-500" size={14} />);
    }
    return (
      <div className="flex items-center space-x-1">
        <div className="flex">{stars}</div>
      </div>
    );
  };

  return (
    <div className="flex items-center space-x-4">
      {selectedImportance.length > 0 && (
        <button
          onClick={() => onImportanceChange([])}
          className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 transition-all duration-200 hover:bg-red-100 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
        >
          <HiArrowPath className="h-3.5 w-3.5" />
          <span>초기화</span>
        </button>
      )}
      <div className="flex space-x-2">
        {[1, 2, 3].map((importance) => (
          <button
            key={importance}
            onClick={() => handleImportanceToggle(importance)}
            className={`flex items-center rounded-md border px-3 py-1 transition-colors ${
              selectedImportance.includes(importance)
                ? 'border-blue-300 bg-blue-100 text-blue-700'
                : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {renderStars(importance)}
          </button>
        ))}
      </div>
    </div>
  );
}
