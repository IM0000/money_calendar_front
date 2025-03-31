import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { FaPlusSquare, FaRegPlusSquare } from 'react-icons/fa';

interface EventAddButtonProps {
  isAdded: boolean;
  onClick: () => void;
}

export default function EventAddButton({
  isAdded,
  onClick,
}: EventAddButtonProps) {
  return (
    <Tippy
      content={isAdded ? '관심 추가됨' : '관심 추가'}
      delay={[0, 0]}
      duration={[0, 0]}
    >
      <button
        onClick={onClick}
        className="flex items-center justify-center w-8 h-8 rounded focus:outline-none"
      >
        {isAdded ? (
          <FaPlusSquare size={16} className="text-blue-500" />
        ) : (
          <FaRegPlusSquare size={16} className="text-gray-500" />
        )}
      </button>
    </Tippy>
  );
}
