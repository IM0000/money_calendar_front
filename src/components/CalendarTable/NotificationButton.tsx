// NotificationButton.tsx
import { useState } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { FaBell, FaBellSlash, FaSpinner } from 'react-icons/fa';
import { useAuthStore } from '@/zustand/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  addIndicatorSubscription,
  addEarningsSubscription,
  removeEarningsSubscription,
  removeIndicatorSubscription,
} from '@/api/services/notificationService';

export type EventType = 'earnings' | 'economicIndicator';

interface NotificationButtonProps {
  id: number;
  eventType: EventType;
  isActive: boolean;
}

export default function NotificationButton({
  id,
  eventType,
  isActive: initialIsActive,
}: NotificationButtonProps) {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isActive, setIsActive] = useState(initialIsActive);

  // 구독 추가 API 호출 함수 선택
  const getAddSubscriptionFunction = (eventType: EventType) => {
    switch (eventType) {
      case 'earnings':
        return addEarningsSubscription;
      case 'economicIndicator':
        return addIndicatorSubscription;
    }
  };

  // 구독 해제 API 호출 함수 선택
  const getRemoveSubscriptionFunction = (eventType: EventType) => {
    switch (eventType) {
      case 'earnings':
        return removeEarningsSubscription;
      case 'economicIndicator':
        return removeIndicatorSubscription;
    }
  };

  // 구독 추가 mutation
  const addSubscriptionMutation = useMutation({
    mutationFn: () => getAddSubscriptionFunction(eventType)(id),
    onSuccess: () => {
      setIsActive(true);
      toast.success('구독이 설정되었습니다.');
      // 캐시 업데이트 - calendarEvents도 무효화
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['calendarEvents'] });
      queryClient.invalidateQueries({ queryKey: ['notificationCalendar'] });
    },
    onError: (error) => {
      toast.error(
        `알림 설정 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
      );
    },
  });

  // 구독 제거 mutation
  const removeSubscriptionMutation = useMutation({
    mutationFn: () => getRemoveSubscriptionFunction(eventType)(id),
    onSuccess: () => {
      setIsActive(false);
      toast.success('알림이 해제되었습니다.');
      // 캐시 업데이트 - calendarEvents도 무효화
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['calendarEvents'] });
      queryClient.invalidateQueries({ queryKey: ['notificationCalendar'] });
    },
    onError: (error) => {
      toast.error(
        `알림 해제 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
      );
    },
  });

  const handleClick = () => {
    if (!isAuthenticated) {
      // 로그인이 필요하다는 알림을 표시하고 로그인 페이지로 이동
      if (
        confirm('알림 설정은 로그인이 필요합니다. 로그인 페이지로 이동할까요?')
      ) {
        navigate('/login');
      }
      return;
    }

    if (isActive) {
      // 제거 요청
      removeSubscriptionMutation.mutate();
    } else {
      // 추가 요청
      addSubscriptionMutation.mutate();
    }
  };

  const getTipContent = () => {
    if (!isAuthenticated) return '로그인 필요';
    return isActive ? '알림 설정됨' : '알림 설정';
  };

  // 요청 중인지 여부
  const isLoading =
    addSubscriptionMutation.isPending || removeSubscriptionMutation.isPending;

  return (
    <Tippy content={getTipContent()} delay={[0, 0]} duration={[0, 0]}>
      <button
        onClick={handleClick}
        className="flex h-8 w-8 items-center justify-center rounded focus:outline-none"
        disabled={isLoading}
      >
        {isLoading ? (
          <FaSpinner className="animate-spin text-gray-500" size={16} />
        ) : isActive ? (
          <FaBell size={16} className="text-green-500" />
        ) : (
          <FaBellSlash size={16} className="text-gray-500" />
        )}
      </button>
    </Tippy>
  );
}
