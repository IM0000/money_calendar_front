import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { FaPlusSquare, FaRegPlusSquare, FaSpinner } from 'react-icons/fa';
import { useAuthStore } from '@/zustand/useAuthStore';
import { useNavigate } from 'react-router-dom';

interface EventAddButtonProps {
  isAdded: boolean;
  onClick: () => void;
  isLoading?: boolean;
}

export default function EventAddButton({
  isAdded,
  onClick,
  isLoading = false,
}: EventAddButtonProps) {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleClick = () => {
    if (!isAuthenticated) {
      // 로그인이 필요하다는 알림을 표시하고 로그인 페이지로 이동
      if (
        confirm(
          '관심 일정 추가는 로그인이 필요합니다. 로그인 페이지로 이동할까요?',
        )
      ) {
        navigate('/login');
      }
      return;
    }

    onClick();
  };

  const getTipContent = () => {
    if (!isAuthenticated) return '로그인 필요';
    return isAdded ? '관심 추가됨' : '관심 추가';
  };

  return (
    <Tippy content={getTipContent()} delay={[0, 0]} duration={[0, 0]}>
      <button
        onClick={handleClick}
        className="flex items-center justify-center w-8 h-8 rounded focus:outline-none"
        disabled={isLoading}
      >
        {isLoading ? (
          <FaSpinner className="text-gray-500 animate-spin" size={16} />
        ) : isAdded ? (
          <FaPlusSquare size={16} className="text-blue-500" />
        ) : (
          <FaRegPlusSquare size={16} className="text-gray-500" />
        )}
      </button>
    </Tippy>
  );
}
