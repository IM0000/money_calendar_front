import { FaStar } from 'react-icons/fa';
import { CountryFlag } from '../CalendarTable/CountryFlag';
import FavoriteButton from '../CalendarTable/FavoriteButton';
import { useState, useEffect, useMemo } from 'react';
import { EconomicIndicatorEvent } from '@/types/calendar-event';
import NotificationButton from '../CalendarTable/NotificationButton';
import IndicatorInfo from './IndicatorInfo';
import ExpandToggleButton from './shared/ExpandToggleButton';
import EmptySearchResult from './shared/EmptySearchResult';
import PaginationWrapper from './shared/PaginationWrapper';

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
  // 로컬 상태로 지표 목록 관리
  const [localResults, setLocalResults] = useState(results);

  // 확장된 그룹 추적
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [detailPage, setDetailPage] = useState(1);
  const detailLimit = 10;

  // results prop이 변경될 때 로컬 상태 업데이트
  useEffect(() => {
    setLocalResults(results);
  }, [results]);

  const indicatorGroups = useMemo(() => {
    return localResults
      .filter((indicator) => indicator.baseName)
      .map((indicator) => ({
        baseName: indicator.baseName!,
        country: indicator.country,
        importance: indicator.importance,
        isFavorite: indicator.isFavorite || false,
        hasNotification: indicator.hasNotification || false,
      }));
  }, [localResults]);

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

  // 상세보기 토글 핸들러
  const handleToggleDetail = (baseName: string, country: string) => {
    const key = `${baseName}_${country}`;
    if (expandedGroup === key) {
      setExpandedGroup(null);
    } else {
      setExpandedGroup(key);
      setDetailPage(1); // 상세보기를 열 때 첫 페이지로 리셋
    }
  };

  // 상세보기 페이지 변경 핸들러
  const handleDetailPageChange = (page: number) => {
    setDetailPage(page);
  };

  return (
    <div>
      {/* 검색 결과가 있는 경우 */}
      {indicatorGroups.length > 0 ? (
        <div className="overflow-hidden border-gray-200 bg-white">
          {/* 헤더 */}
          <div className="grid grid-cols-[0.8fr,3fr,1fr,1fr] gap-4 border-b border-gray-200 bg-gray-50 px-2 py-3 font-medium text-gray-700">
            <div className="text-center">국가</div>
            <div>지표명</div>
            <div className="text-center">중요도</div>
            <div className="text-center">정보</div>
          </div>

          {/* 결과 목록 */}
          <div className="divide-y divide-gray-200">
            {indicatorGroups.map((group) => {
              const groupKey = `${group.baseName}_${group.country}`;
              const isExpanded = expandedGroup === groupKey;

              return (
                <div key={groupKey} className="group">
                  {/* 지표 그룹 기본 정보 행 */}
                  <div
                    className={`grid grid-cols-[0.8fr,3fr,1fr,1fr] gap-4 px-2 py-4 ${
                      isExpanded ? 'bg-blue-50' : 'hover:bg-gray-50'
                    }`}
                  >
                    {/* 국가 */}
                    <div className="flex items-center justify-center">
                      <CountryFlag countryCode={group.country} />
                    </div>

                    {/* 지표명 + 관심/알림 버튼 */}
                    <div className="flex items-center justify-between">
                      <div
                        className="cursor-pointer font-medium text-gray-800"
                        onClick={() =>
                          handleToggleDetail(group.baseName, group.country)
                        }
                      >
                        {group.baseName}
                      </div>
                      <div className="flex items-center space-x-1">
                        <FavoriteButton
                          eventType="indicatorGroup"
                          isFavorite={group.isFavorite}
                          baseName={group.baseName}
                          country={group.country}
                        />
                        <NotificationButton
                          eventType="indicatorGroup"
                          isActive={group.hasNotification}
                          baseName={group.baseName}
                          country={group.country}
                        />
                      </div>
                    </div>

                    {/* 중요도 */}
                    <div className="flex items-center justify-center">
                      {renderImportanceStars(group.importance)}
                    </div>

                    {/* 상세보기 버튼 */}
                    <ExpandToggleButton
                      isExpanded={isExpanded}
                      onClick={() =>
                        handleToggleDetail(group.baseName, group.country)
                      }
                    />
                  </div>

                  {/* 확장된 상세 정보 패널 */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
                      <IndicatorInfo
                        baseName={group.baseName}
                        country={group.country}
                        page={detailPage}
                        limit={detailLimit}
                        onPageChange={handleDetailPageChange}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* 페이지네이션 */}
          <PaginationWrapper
            totalPages={pagination.totalPages}
            currentPage={pagination.page}
            onPageChange={onPageChange}
          />
        </div>
      ) : (
        <EmptySearchResult />
      )}
    </div>
  );
}
