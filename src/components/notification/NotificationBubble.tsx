interface NewNotificationBubbleProps {
  onClose: () => void;
}

export function NewNotificationBubble({ onClose }: NewNotificationBubbleProps) {
  return (
    <div className="absolute left-1/2 top-full mt-1 flex -translate-x-1/2 transform items-center space-x-2 rounded-lg bg-yellow-100 px-4 py-2 text-sm text-gray-800 shadow-md">
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
