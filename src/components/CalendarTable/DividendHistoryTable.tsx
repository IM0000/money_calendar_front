import { DividendEvent } from '@/api/services/calendarService';
import { formatDate } from '@/utils/dateUtils';

interface DividendHistoryTableProps {
  data: DividendEvent[];
  isLoading: boolean;
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
}

export default function DividendHistoryTable({
  data,
  isLoading,
  pagination,
  onPageChange,
}: DividendHistoryTableProps) {
  if (isLoading) {
    return <div className="mt-4 p-4 text-center text-gray-500">로딩 중...</div>;
  }

  if (data.length === 0) {
    return (
      <div className="mt-4 p-4 text-center text-gray-500">
        이전 배당금 데이터가 없습니다.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              배당락일
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              배당금
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              배당수익률
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              배당지급일
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {data.map((dividend) => (
            <tr key={dividend.id}>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                {formatDate(new Date(dividend.exDividendDate))}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                {dividend.dividendAmount || '-'}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                {dividend.dividendYield || '-'}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                {formatDate(new Date(dividend.paymentDate))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 페이지네이션 */}
      <div className="bg-white px-4 py-3 sm:px-6">
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
