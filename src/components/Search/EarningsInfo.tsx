import { useQuery } from '@tanstack/react-query';
import MarketIcon from '../CalendarTable/MarketIcon';
import { getCompanyEarnings } from '../../api/services/searchService';
import { EarningsEvent } from '@/types/calendar-event';
import { formatSearchDate } from '../../utils/dateUtils';
import DataTableBase from './shared/DataTableBase';

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
  // 실적 데이터 조회
  const { data: earningsData, isLoading: isEarningsDataLoading } = useQuery({
    queryKey: ['companyEarnings', companyId, page, limit],
    queryFn: () => getCompanyEarnings({ companyId: companyId!, page, limit }),
    enabled: !!companyId,
  });

  // 실적/예상 비교 색상 클래스 반환
  const getColorClass = (actual: string, forecast: string) => {
    if (!actual || !forecast) return '';

    const actualValue = parseFloat(actual.replace(/[^-0-9.]/g, ''));
    const forecastValue = parseFloat(forecast.replace(/[^-0-9.]/g, ''));

    if (actualValue > forecastValue) return 'text-green-600';
    if (actualValue < forecastValue) return 'text-red-600';
    return '';
  };

  // 데이터 추출 헬퍼 함수
  const getItems = (): EarningsEvent[] => earningsData?.data?.items || [];
  const getPagination = () =>
    earningsData?.data?.pagination || {
      total: 0,
      totalPages: 0,
      page: 1,
      limit: 5,
    };

  return (
    <DataTableBase
      title="실적 정보"
      isLoading={isEarningsDataLoading}
      isEmpty={getItems().length === 0}
      emptyMessage="실적 정보가 없습니다."
      currentPage={page}
      totalPages={getPagination().totalPages}
      onPageChange={onPageChange}
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
            className="min-w-[180px] px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 lg:w-auto"
          >
            EPS (실적/예상)
          </th>
          <th
            scope="col"
            className="min-w-[180px] px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 lg:w-auto"
          >
            매출 (실적/예상)
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white">
        {getItems().map((earnings) => (
          <tr key={earnings.id} className="hover:bg-gray-50">
            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
              {formatSearchDate(earnings.releaseDate)}
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
          </tr>
        ))}
      </tbody>
    </DataTableBase>
  );
}
