import { useState } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { FaStar, FaRegStar, FaSpinner } from 'react-icons/fa';
import { useAuthStore } from '@/zustand/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  addFavoriteCompany,
  removeFavoriteCompany,
  addFavoriteIndicatorGroup,
  removeFavoriteIndicatorGroup,
} from '@/api/services/favoriteService';
import { EventType } from '@/types/event-type';

interface FavoriteButtonProps {
  eventType: EventType;
  isFavorite: boolean;
  companyId?: number;
  baseName?: string;
  country?: string;
}

export default function FavoriteButton({
  eventType,
  isFavorite: initialIsFavorite,
  companyId,
  baseName,
  country,
}: FavoriteButtonProps) {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isAdded, setIsAdded] = useState(initialIsFavorite);

  // 관심 추가 mutation
  const addFavoriteMutation = useMutation({
    mutationFn: async () => {
      if (eventType === 'indicatorGroup') {
        if (!baseName) {
          throw new Error('경제지표의 baseName이 필요합니다.');
        }
        return addFavoriteIndicatorGroup(baseName, country);
      } else {
        // company (earnings 또는 dividend)
        if (!companyId) {
          throw new Error('회사 ID가 필요합니다.');
        }
        return addFavoriteCompany(companyId);
      }
    },
    onSuccess: () => {
      setIsAdded(true);
      toast.success('관심 일정에 추가되었습니다.');
      // 캐시 업데이트
      queryClient.invalidateQueries({ queryKey: ['favoriteCalendarEvents'] });
      queryClient.invalidateQueries({ queryKey: ['favoriteCount'] });
      queryClient.invalidateQueries({ queryKey: ['calendarEvents'] });
    },
    onError: (error) => {
      toast.error(
        `추가 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
      );
    },
  });

  // 관심 제거 mutation
  const removeFavoriteMutation = useMutation({
    mutationFn: async () => {
      if (eventType === 'indicatorGroup') {
        if (!baseName) {
          throw new Error('경제지표의 baseName이 필요합니다.');
        }
        return removeFavoriteIndicatorGroup(baseName, country);
      } else {
        // company (earnings 또는 dividend)
        if (!companyId) {
          throw new Error('회사 ID가 필요합니다.');
        }
        return removeFavoriteCompany(companyId);
      }
    },
    onSuccess: () => {
      setIsAdded(false);
      toast.success('관심 일정에서 제거되었습니다.');
      // 캐시 업데이트
      queryClient.invalidateQueries({ queryKey: ['favoriteCalendarEvents'] });
      queryClient.invalidateQueries({ queryKey: ['favoriteCount'] });
      queryClient.invalidateQueries({ queryKey: ['calendarEvents'] });
    },
    onError: (error) => {
      toast.error(
        `제거 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
      );
    },
  });

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

    // 필수 파라미터 검증
    if (eventType === 'indicatorGroup' && !baseName) {
      toast.error('경제지표 정보가 부족합니다.');
      return;
    }

    if (eventType === 'company' && !companyId) {
      toast.error('회사 정보가 부족합니다.');
      return;
    }

    if (isAdded) {
      // 제거 요청
      removeFavoriteMutation.mutate();
    } else {
      // 추가 요청
      addFavoriteMutation.mutate();
    }
  };

  const getTipContent = () => {
    if (!isAuthenticated) return '로그인 필요';
    return isAdded ? '관심 추가됨' : '관심 추가';
  };

  // 요청 중인지 여부
  const isLoading =
    addFavoriteMutation.isPending || removeFavoriteMutation.isPending;

  return (
    <Tippy content={getTipContent()} delay={[0, 0]} duration={[0, 0]}>
      <button
        onClick={handleClick}
        className="flex h-8 w-8 items-center justify-center rounded focus:outline-none"
        disabled={isLoading}
      >
        {isLoading ? (
          <FaSpinner className="animate-spin text-gray-500" size={16} />
        ) : isAdded ? (
          <FaStar size={16} className="text-yellow-500" />
        ) : (
          <FaRegStar size={16} className="text-gray-400" />
        )}
      </button>
    </Tippy>
  );
}
