interface NewNotificationBubbleProps {
  onClose: () => void;
}

export function NewNotificationBubble({ onClose }: NewNotificationBubbleProps) {
  return (
    <div className="absolute flex items-center px-4 py-2 mt-1 space-x-2 text-sm text-gray-800 transform -translate-x-1/2 bg-yellow-100 rounded-lg shadow-md left-1/2 top-full">
      <span>새 알림이 도착했습니다</span>
      <button
        onClick={onClose}
        aria-label="닫기"
        className="text-gray-600 hover:text-gray-800 focus:outline-none"
      >
        ×
      </button>
    </div>
  );
}
