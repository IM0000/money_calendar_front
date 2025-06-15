import { useEffect, useState } from 'react';
import CalendarPanel from '@/components/FilterPanel/CalendarPanel';
import Layout from '../components/Layout/Layout';
import EconomicIndicatorTable from '@/components/CalendarTable/EconomicIndicatorTable';
import EarningsTable from '@/components/CalendarTable/EarningsTable';
import DividendTable from '@/components/CalendarTable/DividendTable';
import { formatDate } from '@/utils/dateUtils';
import useCalendarStore from '@/zustand/useCalendarDateStore';
import { DateRange } from '@/types/calendar-date-range';
import { getFavoriteCalendarEvents } from '@/api/services/calendarService';
import { useQuery } from '@tanstack/react-query';
import { useApiErrorHandler } from '@/utils/errorHandler';
import { useAuthStore } from '@/zustand/useAuthStore';
import toast from 'react-hot-toast';

export default function FavoriteCalendarPage() {
  // 초기 선택 메뉴를 '경제지표'로 설정
  const [selectedMenu, setSelectedMenu] = useState('경제지표');
  const { isAuthenticated } = useAuthStore();
  const { handleError } = useApiErrorHandler();

  const { subSelectedDates } = useCalendarStore();
  const initialDateRange: DateRange = {
    startDate: formatDate(subSelectedDates[0]),
    endDate: formatDate(subSelectedDates[subSelectedDates.length - 1]),
  };

  const [dateRange, setDateRange] = useState<DateRange>(initialDateRange);

  // 오늘 날짜와 비교하여 dateRange가 과거 데이터인지 판단
  const today = new Date();
  const endDateObj = new Date(dateRange.endDate);
  const isPastData = endDateObj < today;

  const { data, isLoading, error } = useQuery({
    queryKey: [
      'favoriteCalendarEvents',
      dateRange.startDate,
      dateRange.endDate,
    ],
    queryFn: () =>
      getFavoriteCalendarEvents(dateRange.startDate, dateRange.endDate),
    enabled: !!dateRange.startDate && !!dateRange.endDate && isAuthenticated,
    staleTime: isPastData ? Infinity : 1000 * 60 * 1, // 과거 데이터는 무한 캐시, 아니면 1분 유지
    gcTime: isPastData ? Infinity : 1000 * 60 * 5, // 과거 데이터는 무한, 아니면 5분 후 삭제
    refetchOnWindowFocus: isPastData ? false : true, // 창이 포커스될 때마다 refetch 실행
    retry: 1, // 실패 시 한 번만 재시도
    retryDelay: 1000, // 재시도 간격 1초
  });

  useEffect(() => {
    if (error) {
      handleError(error);
    }
  }, [error, handleError]);

  const earnings = data?.data?.earnings ?? [];
  const dividends = data?.data?.dividends ?? [];
  const economicIndicators = data?.data?.economicIndicators ?? [];

  const handleMenuClick = (menu: string) => {
    setSelectedMenu(menu);
  };

  // 버튼 스타일 (선택된 버튼은 파란 배경, 선택되지 않은 버튼은 흰 배경)
  const getButtonClass = (menu: string) => {
    const baseClass = 'px-4 py-2 border rounded transition-colors';
    return selectedMenu === menu
      ? `${baseClass} bg-blue-400 text-white border-blue-400`
      : `${baseClass} bg-white text-gray-700 border-gray-300 hover:bg-gray-100`;
  };

  if (error) {
    toast.error('데이터를 불러오는 중 오류가 발생했습니다.');
  }

  // 데이터가 없을 때 표시할 메시지
  const getEmptyMessage = () => {
    if (
      !isLoading &&
      earnings.length === 0 &&
      dividends.length === 0 &&
      economicIndicators.length === 0
    ) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-gray-500">
          <p>관심 일정이 없습니다. 캘린더에서 관심 일정을 추가해주세요.</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Layout>
      <div className="flex flex-col">
        {/* 페이지 헤더 */}
        <div className="mb-4 px-8">
          <h1 className="flex items-center gap-2 text-2xl font-bold">
            관심 일정 보기
          </h1>
          <p className="text-sm text-gray-500">
            즐겨찾기한 일정만 모아볼 수 있습니다.
          </p>
        </div>

        {/* 캘린더 패널 */}
        <div className="px-8">
          <CalendarPanel
            dateRange={dateRange}
            setDateRange={setDateRange}
            isFavoritePage={true}
          />
        </div>

        {/* 메뉴 버튼 영역 */}
        <div className="mt-4 flex space-x-4 px-8 text-sm">
          <button
            className={getButtonClass('경제지표')}
            onClick={() => handleMenuClick('경제지표')}
          >
            경제지표
          </button>
          <button
            className={getButtonClass('실적')}
            onClick={() => handleMenuClick('실적')}
          >
            실적
          </button>
          <button
            className={getButtonClass('배당')}
            onClick={() => handleMenuClick('배당')}
          >
            배당
          </button>
        </div>

        {/* 빈 데이터 메시지 */}
        {getEmptyMessage()}

        {/* 선택된 메뉴에 따라 테이블 컴포넌트 렌더링 */}
        <div className="mt-4 w-full overflow-x-auto border-gray-300 px-8">
          {selectedMenu === '경제지표' && (
            <EconomicIndicatorTable
              events={economicIndicators}
              dateRange={dateRange}
              isLoading={isLoading}
              isFavoritePage={true}
            />
          )}
          {selectedMenu === '실적' && (
            <EarningsTable
              events={earnings}
              dateRange={dateRange}
              isLoading={isLoading}
              isFavoritePage={true}
            />
          )}
          {selectedMenu === '배당' && (
            <DividendTable
              events={dividends}
              dateRange={dateRange}
              isLoading={isLoading}
              isFavoritePage={true}
            />
          )}
        </div>
      </div>
    </Layout>
  );
}
