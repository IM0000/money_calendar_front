import React, { useState } from 'react';
import CalendarPanel from '@/components/FilterPanel/CalendarPanel';
import Layout from '../components/Layout/Layout';
import EconomicIndicatorTable from '@/components/CalendarTable/EconomicIndicatorTable';
import EarningsTable from '@/components/CalendarTable/EarningsTable';
import DividendTable from '@/components/CalendarTable/DividendTable';
import { formatDate } from '@/utils/dateUtils';
import useCalendarStore from '@/zustand/useCalendarDateStore';
import { DateRange } from '@/types/calendar-date-range';
import { getCalendarEvents } from '@/api/services/calendarService';
import { useQuery } from '@tanstack/react-query';
// import TestErrorButton from '@/components/TestErrorButton';

export default function MainPage() {
  // 초기 선택 메뉴를 '경제지표'로 설정 (원하는 기본값으로 변경 가능)
  const [selectedMenu, setSelectedMenu] = useState('경제지표');

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

  // 한 번의 API 호출로 전체 이벤트 데이터를 가져옴
  const { data, isLoading, error } = useQuery({
    queryKey: ['calendarEvents', dateRange.startDate, dateRange.endDate],
    queryFn: () => getCalendarEvents(dateRange.startDate, dateRange.endDate),
    enabled: !!dateRange.startDate && !!dateRange.endDate,
    staleTime: isPastData ? Infinity : 1000 * 60 * 1, // 과거 데이터는 무한 캐시, 아니면 1분 유지
    gcTime: isPastData ? Infinity : 1000 * 60 * 5, // 과거 데이터는 무한, 아니면 5분 후 삭제
    refetchOnWindowFocus: isPastData ? false : true, // 창이 포커스될 때마다 refetch 실행
  });

  const earnings = data?.data?.earnings ?? [];
  const dividends = data?.data?.dividends ?? [];
  const economicIndicators = data?.data?.economicIndicators ?? [];

  // 버튼 클릭 시 상태 변경
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

  // 에러가 있을 때의 처리 (전체 페이지에 메시지 표시)
  if (error) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center p-8 text-red-500">
          <p>데이터를 불러오는 중 오류가 발생했습니다.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="flex flex-col">
        {/* 캘린더 패널 */}
        <div className="px-8">
          <CalendarPanel dateRange={dateRange} setDateRange={setDateRange} />
        </div>

        {/* 개발 환경에서만 테스트 에러 버튼 표시 */}
        {/* {import.meta.env.DEV && <TestErrorButton />} */}

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

        {/* 선택된 메뉴에 따라 테이블 컴포넌트 렌더링 */}
        <div className="mt-4 w-full overflow-x-auto border-gray-300 px-8">
          {selectedMenu === '경제지표' && (
            <EconomicIndicatorTable
              events={economicIndicators}
              dateRange={dateRange}
              isLoading={isLoading}
            />
          )}
          {selectedMenu === '실적' && (
            <EarningsTable
              events={earnings}
              dateRange={dateRange}
              isLoading={isLoading}
            />
          )}
          {selectedMenu === '배당' && (
            <DividendTable
              events={dividends}
              dateRange={dateRange}
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </Layout>
  );
}
