import React, { useState } from 'react';
import CalendarPanel from '@/components/FilterPanel/CalendarPanel';
import Layout from '../components/Layout/Layout';
import { useAuthStore } from '../zustand/useAuthStore';
import EconomicIndicatorTable from '@/components/CalendarTable/EconomicIndicatorTable';
import EarningsTable from '@/components/CalendarTable/EarningsTable';
import DividendTable from '@/components/CalendarTable/DividendTable';

export default function MainPage() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  // 초기 선택 메뉴를 '경제지표'로 설정 (원하는 기본값으로 변경 가능)
  const [selectedMenu, setSelectedMenu] = useState('경제지표');

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

  return (
    <Layout>
      <div className="flex flex-col">
        {/* 캘린더 패널 */}
        <div className="px-8">
          <CalendarPanel />
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

        {/* 선택된 메뉴에 따라 테이블 컴포넌트 렌더링 */}
        <div className="mt-4 w-full overflow-x-auto border-gray-300 px-8">
          {selectedMenu === '경제지표' && <EconomicIndicatorTable />}
          {selectedMenu === '실적' && <EarningsTable />}
          {selectedMenu === '배당' && <DividendTable />}
        </div>
      </div>
    </Layout>
  );
}
