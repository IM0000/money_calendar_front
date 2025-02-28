import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css'; // 기본 스타일
import {
  HiOutlineSun,
  HiOutlineMoon,
  HiOutlineQuestionMarkCircle,
} from 'react-icons/hi';

interface MarketIconProps {
  releaseTiming?: 'PRE_MARKET' | 'POST_MARKET' | 'UNKNOWN';
}

export default function MarketIcon({ releaseTiming }: MarketIconProps) {
  let content: string;
  let icon: JSX.Element;

  if (releaseTiming === 'PRE_MARKET') {
    content = '개장전';
    icon = <HiOutlineSun size={20} className="text-gray-500" />;
  } else if (releaseTiming === 'POST_MARKET') {
    content = '폐장후';
    icon = <HiOutlineMoon size={20} className="text-gray-500" />;
  } else {
    content = '알 수 없음';
    icon = <HiOutlineQuestionMarkCircle size={20} className="text-gray-500" />;
  }

  return (
    <Tippy content={content} delay={[0, 0]} duration={[0, 0]}>
      <span>{icon}</span>
    </Tippy>
  );
}
