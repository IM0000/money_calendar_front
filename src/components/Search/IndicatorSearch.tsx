import { FaStar } from 'react-icons/fa';
import { CountryFlag } from '../CalendarTable/CountryFlag';
import { getCountryName } from '../../utils/formatUtils';
import Pagination from '../UI/Pagination';
import { toast } from 'react-hot-toast';
import {
  addFavoriteEconomicIndicator,
  removeFavoriteEconomicIndicator,
} from '../../api/services/calendarService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import EventAddButton from '../CalendarTable/EventAddButton';
import { useState, useEffect } from 'react';
import { EconomicIndicatorEvent } from '@/types/calendar-event';
import NotificationButton from '../CalendarTable/NotificationButton';

interface IndicatorSearchProps {
  results: Array<EconomicIndicatorEvent>;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
}

export default function IndicatorSearch({
  results,
  pagination,
  onPageChange,
}: IndicatorSearchProps) {
  // 로컬 상태로 관심 지표 관리
  const [localResults, setLocalResults] = useState(results);

  // results prop이 변경될 때 로컬 상태 업데이트
  useEffect(() => {
    setLocalResults(results);
  }, [results]);

  // QueryClient 가져오기
  const queryClient = useQueryClient();

  // 관심 등록 mutation
  const addFavoriteMutation = useMutation({
    mutationFn: addFavoriteEconomicIndicator,
    onMutate: async (indicatorId) => {
      // 즉시 UI 업데이트 (낙관적 업데이트)
      setLocalResults((prev) =>
        prev.map((indicator) =>
          indicator.id === indicatorId
            ? { ...indicator, isFavorite: true }
            : indicator,
        ),
      );
    },
    onSuccess: () => {
      toast.success('관심 지표에 추가되었습니다.');
      // 캐시 업데이트
      queryClient.invalidateQueries({ queryKey: ['favoriteCalendarEvents'] });
      queryClient.invalidateQueries({ queryKey: ['favoriteCount'] });
    },
    onError: (error, indicatorId) => {
      // 에러 메시지에 "이미 즐겨찾기에 추가되어 있습니다" 포함되어 있으면 추가된 것으로 간주
      const errorMessage =
        error instanceof Error ? error.message : '알 수 없는 오류';

      if (errorMessage.includes('이미 즐겨찾기에 추가')) {
        // 이미 추가된 경우 UI 업데이트만 하고 에러 메시지 표시하지 않음
        setLocalResults((prev) =>
          prev.map((indicator) =>
            indicator.id === indicatorId
              ? { ...indicator, isFavorite: true }
              : indicator,
          ),
        );
      } else {
        // 실제 오류인 경우 원래 상태로 되돌리고 오류 메시지 표시
        toast.error(`추가 실패: ${errorMessage}`);
        setLocalResults((prev) =>
          prev.map((indicator) =>
            indicator.id === indicatorId
              ? { ...indicator, isFavorite: false }
              : indicator,
          ),
        );
      }
    },
  });

  // 관심 제거 mutation
  const removeFavoriteMutation = useMutation({
    mutationFn: removeFavoriteEconomicIndicator,
    onMutate: async (indicatorId) => {
      // 즉시 UI 업데이트 (낙관적 업데이트)
      setLocalResults((prev) =>
        prev.map((indicator) =>
          indicator.id === indicatorId
            ? { ...indicator, isFavorite: false }
            : indicator,
        ),
      );
    },
    onSuccess: () => {
      toast.success('관심 지표에서 제거되었습니다.');
      // 캐시 업데이트
      queryClient.invalidateQueries({ queryKey: ['favoriteCalendarEvents'] });
      queryClient.invalidateQueries({ queryKey: ['favoriteCount'] });
    },
    onError: (error, indicatorId) => {
      // 에러 발생 시 UI 되돌리기
      toast.error(
        `제거 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
      );
      setLocalResults((prev) =>
        prev.map((indicator) =>
          indicator.id === indicatorId
            ? { ...indicator, isFavorite: true }
            : indicator,
        ),
      );
    },
  });

  // 관심 등록/해제 핸들러
  const handleToggleFavorite = (indicatorId: number, isFavorite: boolean) => {
    if (isFavorite) {
      removeFavoriteMutation.mutate(indicatorId);
    } else {
      addFavoriteMutation.mutate(indicatorId);
    }
  };

  // 날짜 포맷팅
  const formatDate = (timestamp: number) => {
    if (!timestamp) return '-';
    const date = new Date(timestamp);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // 현재 진행 중인 mutation이 있는지 확인
  const isLoading = (indicatorId: number) => {
    return (
      (addFavoriteMutation.isPending || removeFavoriteMutation.isPending) &&
      (addFavoriteMutation.variables === indicatorId ||
        removeFavoriteMutation.variables === indicatorId)
    );
  };

  const renderImportanceStars = (importance: number) => {
    const stars = [];
    for (let i = 0; i < 3; i++) {
      stars.push(
        <FaStar
          key={i}
          className={i < importance ? 'text-yellow-500' : 'text-gray-300'}
        />,
      );
    }
    return <div className="flex">{stars}</div>;
  };

  return (
    <div className="rounded-lg bg-white">
      <div className="grid grid-cols-[1fr,5fr,1fr,1.5fr,1fr] gap-4 border-b bg-gray-50 px-4 py-3 font-medium text-gray-700">
        <div>국가</div>
        <div>지표명</div>
        <div>중요도</div>
        <div>발표일</div>
        <div>작업</div>
      </div>

      {localResults.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center text-gray-500">
          <svg
            className="h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <p className="mt-4 text-lg">검색 결과가 없습니다.</p>
          <p className="mt-2 text-sm text-gray-400">
            다른 검색어로 시도해보세요.
          </p>
        </div>
      ) : (
        <div>
          {localResults.map((indicator) => (
            <div
              key={indicator.id}
              className="grid grid-cols-[1fr,5fr,1fr,1.5fr,1fr] gap-4 border-b px-4 py-3 transition-colors hover:bg-gray-50"
            >
              <div className="flex items-center">
                <CountryFlag countryCode={indicator.country} />
                <span className="ml-2 text-gray-700">
                  {getCountryName(indicator.country)}
                </span>
              </div>
              <div className="font-medium text-gray-800">{indicator.name}</div>
              <div className="flex">
                {renderImportanceStars(indicator.importance)}
              </div>
              <div className="text-gray-700">
                {formatDate(indicator.releaseDate)}
              </div>
              <div className="flex">
                <EventAddButton
                  isAdded={!!indicator.isFavorite}
                  onClick={() =>
                    handleToggleFavorite(indicator.id, !!indicator.isFavorite)
                  }
                  isLoading={isLoading(indicator.id)}
                />
                <NotificationButton
                  id={indicator.id}
                  eventType="economicIndicator"
                  isActive={indicator.hasNotification || false}
                />
              </div>
            </div>
          ))}

          {/* 페이지네이션 */}
          {pagination.totalPages > 1 && (
            <div className="flex justify-center p-6">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={onPageChange}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
