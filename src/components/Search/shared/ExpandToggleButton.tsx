import { FaChevronDown } from 'react-icons/fa';

interface ExpandToggleButtonProps {
  isExpanded: boolean;
  onClick: () => void;
  expandedText?: string;
  collapsedText?: string;
}

export default function ExpandToggleButton({
  isExpanded,
  onClick,
  expandedText = '접기',
  collapsedText = '상세보기',
}: ExpandToggleButtonProps) {
  return (
    <div className="flex justify-center">
      <button
        onClick={onClick}
        className={`flex h-[2rem] items-center gap-2 rounded-md px-2 py-1 text-sm font-medium transition-all duration-200 ${
          isExpanded
            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
        aria-label={isExpanded ? '상세 정보 접기' : '상세 정보 보기'}
      >
        <span className="text-xs">
          {isExpanded ? expandedText : collapsedText}
        </span>
        <FaChevronDown
          className={`h-3 w-3 transition-transform duration-200 ${
            isExpanded ? 'rotate-180 transform' : ''
          }`}
        />
      </button>
    </div>
  );
}
