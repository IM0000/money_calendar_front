// NotificationButton.tsx
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { IoMdNotificationsOutline, IoMdNotifications } from 'react-icons/io';

interface NotificationButtonProps {
  isActive: boolean;
  onClick: () => void;
}

export default function NotificationButton({
  isActive,
  onClick,
}: NotificationButtonProps) {
  return (
    <Tippy content="알림 설정" delay={[0, 0]} duration={[0, 0]}>
      <button
        onClick={onClick}
        className="flex items-center justify-center w-8 h-8 rounded focus:outline-none"
      >
        {isActive ? (
          <IoMdNotifications size={20} className="text-blue-500" />
        ) : (
          <IoMdNotificationsOutline size={20} className="text-gray-500" />
        )}
      </button>
    </Tippy>
  );
}
