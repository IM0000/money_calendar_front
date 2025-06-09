import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import MarketIcon from '../CalendarTable/MarketIcon';
import EventAddButton from '../CalendarTable/EventAddButton';
import NotificationButton from '../CalendarTable/NotificationButton';
import Pagination from '../UI/Pagination';
import { getCompanyEarnings } from '../../api/services/searchService';
import {
  addFavoriteCompany,
  removeFavoriteCompany,
} from '../../api/services/favoriteService';
import { getColorClass } from '@/utils/colorUtils';

// 실적 정보 인터페이스
interface Earnings {
  id: number;
  releaseDate: number;
  releaseTiming: 'PRE_MARKET' | 'POST_MARKET' | 'UNKNOWN';
  actualEPS: string;
  forecastEPS: string;
  previousEPS: string;
  actualRevenue: string;
  forecastRevenue: string;
  previousRevenue: string;
  isFavorite?: boolean;
  hasNotification?: boolean;
}

// API 응답 인터페이스
interface ApiResponseData {
  items: Earnings[];
  pagination: {
    total: number;
    totalPages: number;
    page: number;
    limit: number;
  };
}

interface EarningsResponse {
  statusCode: number;
  data: ApiResponseData;
}

interface EarningsInfoProps {
  companyId?: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export default function EarningsInfo({
  companyId,
  page,
  limit,
  onPageChange,
}: EarningsInfoProps) {
  const queryClient = useQueryClient();

  // 날짜 포맷팅 함수
  const formatDate = (timestamp: number) => {
    if (!timestamp) return '-';
    const date = new Date(timestamp);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // 실적 데이터 쿼리
  const { data: earningsData, isLoading: isEarningsDataLoading } = useQuery({
    queryKey: ['companyEarnings', companyId, page, limit],
    queryFn: async () => {
      if (!companyId) {
        return {
          statusCode: 200,
          data: {
            items: [] as Earnings[],
            pagination: { total: 0, totalPages: 0, page: 1, limit: 5 },
          },
        } as EarningsResponse;
      }
      const response = await getCompanyEarnings({
        companyId,
        page,
        limit,
      });
      return response;
    },
    enabled: !!companyId,
  });

  // 관심 추가 mutation (회사 단위)
  const addFavoriteMutation = useMutation({
    mutationFn: () => {
      if (!companyId) {
        throw new Error('회사 ID가 필요합니다.');
      }
      return addFavoriteCompany(companyId);
    },
    onSuccess: () => {
      toast.success('관심 일정에 추가되었습니다.');
      // 캐시 업데이트
      queryClient.invalidateQueries({
        queryKey: ['companyEarnings', companyId],
      });
      queryClient.invalidateQueries({ queryKey: ['favoriteCalendarEvents'] });
      queryClient.invalidateQueries({ queryKey: ['favoriteCount'] });
    },
    onError: (error) => {
      toast.error(
        `추가 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
      );
    },
  });

  // 관심 제거 mutation (회사 단위)
  const removeFavoriteMutation = useMutation({
    mutationFn: () => {
      if (!companyId) {
        throw new Error('회사 ID가 필요합니다.');
      }
      return removeFavoriteCompany(companyId);
    },
    onSuccess: () => {
      toast.success('관심 일정에서 제거되었습니다.');
      // 캐시 업데이트
      queryClient.invalidateQueries({
        queryKey: ['companyEarnings', companyId],
      });
      queryClient.invalidateQueries({ queryKey: ['favoriteCalendarEvents'] });
      queryClient.invalidateQueries({ queryKey: ['favoriteCount'] });
    },
    onError: (error) => {
      toast.error(
        `제거 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
      );
    },
  });

  // 관심 등록/해제 핸들러 (회사 단위)
  const handleFavoriteToggle = (isCurrentlyAdded: boolean) => {
    if (!companyId) {
      toast.error('회사 정보가 부족합니다.');
      return;
    }

    if (isCurrentlyAdded) {
      removeFavoriteMutation.mutate();
    } else {
      addFavoriteMutation.mutate();
    }
  };

  // 데이터 추출 헬퍼 함수
  const getItems = (): Earnings[] => earningsData?.data?.items || [];
  const getPagination = () =>
    earningsData?.data?.pagination || {
      total: 0,
      totalPages: 0,
      page: 1,
      limit: 5,
    };

  return (
    <div className="mb-8">
      <h3 className="mb-3 text-lg font-semibold text-gray-800">실적 정보</h3>

      {isEarningsDataLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
        </div>
      ) : getItems().length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-6 text-center text-gray-500">
          실적 정보가 없습니다.
        </div>
      ) : (
        <div>
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    발표일
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    시간
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    EPS (실적/예상)
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    매출 (실적/예상)
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-3 text-center text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {getItems().map((earnings) => (
                  <tr key={earnings.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {formatDate(earnings.releaseDate)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <MarketIcon releaseTiming={earnings.releaseTiming} />
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      <div className="flex flex-col">
                        <span
                          className={`font-medium text-gray-900 ${getColorClass(
                            earnings.actualEPS,
                            earnings.forecastEPS,
                          )}`}
                        >
                          {earnings.actualEPS || '-'}
                        </span>
                        <span className="text-xs text-gray-500">
                          예상: {earnings.forecastEPS || '-'}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      <div className="flex flex-col">
                        <span
                          className={`font-medium text-gray-900 ${getColorClass(
                            earnings.actualRevenue,
                            earnings.forecastRevenue,
                          )}`}
                        >
                          {earnings.actualRevenue || '-'}
                        </span>
                        <span className="text-xs text-gray-500">
                          예상: {earnings.forecastRevenue || '-'}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-center text-sm text-gray-500">
                      <div className="flex justify-center space-x-2">
                        <EventAddButton
                          isAdded={!!earnings.isFavorite}
                          onClick={() =>
                            handleFavoriteToggle(!!earnings.isFavorite)
                          }
                          isLoading={
                            addFavoriteMutation.isPending ||
                            removeFavoriteMutation.isPending
                          }
                        />
                        <NotificationButton
                          eventType="company"
                          isActive={!!earnings.hasNotification}
                          companyId={companyId}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 실적 페이지네이션 */}
          {getPagination().totalPages > 1 && (
            <div className="flex justify-center p-4">
              <Pagination
                currentPage={page}
                totalPages={getPagination().totalPages}
                onPageChange={onPageChange}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
