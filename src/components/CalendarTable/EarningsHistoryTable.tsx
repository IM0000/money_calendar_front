import { EarningsEvent } from '@/types/calendar-event';
import MarketIcon from './MarketIcon';
import { formatDate } from '@/utils/dateUtils';
import { getColorClass } from '@/utils/colorUtils';

interface EarningsHistoryTableProps {
  data: EarningsEvent[];
  isLoading: boolean;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
}

export default function EarningsHistoryTable({
  data,
  isLoading,
  pagination,
  onPageChange,
}: EarningsHistoryTableProps) {
  if (isLoading) {
    return <div className="p-4 mt-4 text-center text-gray-500">로딩 중...</div>;
  }

  if (data.length === 0) {
    return (
      <div className="p-4 mt-4 text-center text-gray-500">
        이전 실적 데이터가 없습니다.
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-white border border-gray-200 rounded-md shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
            >
              발표 날짜
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
            >
              시간
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
            >
              EPS / 예측
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase"
            >
              매출 / 예측
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((earning) => (
            <tr key={earning.id}>
              <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                {formatDate(new Date(earning.releaseDate))}
              </td>
              <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                <MarketIcon releaseTiming={earning.releaseTiming} />
              </td>
              <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                <div className="flex items-center space-x-1">
                  <span
                    className={`font-medium ${getColorClass(
                      earning.actualEPS,
                      earning.forecastEPS,
                    )}`}
                  >
                    {earning.actualEPS || '-'}
                  </span>
                  <span className="text-gray-500">
                    / {earning.forecastEPS || '-'}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">
                <div className="flex items-center space-x-1">
                  <span
                    className={`font-medium ${getColorClass(
                      earning.actualRevenue,
                      earning.forecastRevenue,
                    )}`}
                  >
                    {earning.actualRevenue || '-'}
                  </span>
                  <span className="text-gray-500">
                    / {earning.forecastRevenue || '-'}
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 페이지네이션 */}
      <div className="px-4 py-3 bg-white sm:px-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-700">
              전체 <span className="font-medium">{pagination.total}</span> 개 중{' '}
              <span className="font-medium">
                {(pagination.page - 1) * pagination.limit + 1}
              </span>{' '}
              -{' '}
              <span className="font-medium">
                {Math.min(pagination.page * pagination.limit, pagination.total)}
              </span>{' '}
              표시
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className={`relative inline-flex items-center rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
                pagination.page === 1
                  ? 'cursor-not-allowed text-gray-400'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              이전
            </button>
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className={`relative inline-flex items-center rounded border border-gray-300 bg-white px-4 py-2 text-sm font-medium ${
                pagination.page === pagination.totalPages
                  ? 'cursor-not-allowed text-gray-400'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              다음
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
