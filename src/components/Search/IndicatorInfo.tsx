import { useQuery } from '@tanstack/react-query';
import { getIndicatorGroupHistory } from '../../api/services/calendarService';
import { EconomicIndicatorEvent } from '@/types/calendar-event';
import { formatSearchDate, formatSearchTime } from '../../utils/dateUtils';
import DataTableBase from './shared/DataTableBase';

interface IndicatorInfoProps {
  baseName?: string;
  country?: string;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export default function IndicatorInfo({
  baseName,
  country,
  page,
  limit,
  onPageChange,
}: IndicatorInfoProps) {
  // 지표 히스토리 데이터 조회
  const { data: indicatorData, isLoading: isIndicatorDataLoading } = useQuery({
    queryKey: ['indicatorGroupHistory', baseName, country, page, limit],
    queryFn: () => getIndicatorGroupHistory(baseName!, country, page, limit),
    enabled: !!baseName,
  });

  // 데이터 추출 헬퍼 함수
  const getItems = (): EconomicIndicatorEvent[] =>
    indicatorData?.data?.items || [];
  const getPagination = () =>
    indicatorData?.data?.pagination || {
      total: 0,
      totalPages: 0,
      page: 1,
      limit: 10,
    };

  return (
    <DataTableBase
      title={`${baseName} ${country && `(${country})`} 지표 정보`}
      isLoading={isIndicatorDataLoading}
      isEmpty={getItems().length === 0}
      emptyMessage="경제지표 정보가 없습니다."
      currentPage={getPagination().page}
      totalPages={getPagination().totalPages}
      onPageChange={onPageChange}
      className="mb-8"
    >
      <thead className="bg-gray-50">
        <tr>
          <th
            scope="col"
            className="min-w-[120px] px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 lg:w-auto"
          >
            발표일
          </th>
          <th
            scope="col"
            className="min-w-[80px] px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 lg:w-auto"
          >
            시간
          </th>
          <th
            scope="col"
            className="min-w-[200px] px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 lg:w-auto"
          >
            지표명
          </th>
          <th
            scope="col"
            className="min-w-[100px] px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 lg:w-auto"
          >
            실제값
          </th>
          <th
            scope="col"
            className="min-w-[100px] px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 lg:w-auto"
          >
            예상값
          </th>
          <th
            scope="col"
            className="min-w-[100px] px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 lg:w-auto"
          >
            이전값
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white">
        {getItems().map((indicator) => (
          <tr key={indicator.id} className="hover:bg-gray-50">
            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
              {formatSearchDate(indicator.releaseDate)}
            </td>
            <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
              {formatSearchTime(indicator.releaseDate)}
            </td>
            <td className="px-6 py-4 text-sm text-gray-900 lg:whitespace-nowrap">
              {indicator.name}
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-sm">
              <span className={'font-medium'}>{indicator.actual || '-'}</span>
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
              {indicator.forecast || '-'}
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
              {indicator.previous || '-'}
            </td>
          </tr>
        ))}
      </tbody>
    </DataTableBase>
  );
}
