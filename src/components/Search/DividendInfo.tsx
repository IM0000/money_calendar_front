import { useQuery } from '@tanstack/react-query';
import { getCompanyDividends } from '../../api/services/searchService';
import { DividendEvent } from '@/types/calendar-event';
import { formatSearchDate } from '../../utils/dateUtils';
import DataTableBase from './shared/DataTableBase';

interface DividendInfoProps {
  companyId?: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export default function DividendInfo({
  companyId,
  page,
  limit,
  onPageChange,
}: DividendInfoProps) {
  // 배당 데이터 조회
  const { data: dividendData, isLoading: isDividendDataLoading } = useQuery({
    queryKey: ['companyDividends', companyId, page, limit],
    queryFn: () => getCompanyDividends({ companyId: companyId!, page, limit }),
    enabled: !!companyId,
  });

  // 데이터 추출 헬퍼 함수
  const getItems = (): DividendEvent[] => dividendData?.data?.items || [];
  const getPagination = () =>
    dividendData?.data?.pagination || {
      total: 0,
      totalPages: 0,
      page: 1,
      limit: 5,
    };

  return (
    <DataTableBase
      title="배당 정보"
      isLoading={isDividendDataLoading}
      isEmpty={getItems().length === 0}
      emptyMessage="배당 정보가 없습니다."
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
            배당락일
          </th>
          <th
            scope="col"
            className="min-w-[120px] px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 lg:w-auto"
          >
            배당금
          </th>
          <th
            scope="col"
            className="min-w-[120px] px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 lg:w-auto"
          >
            배당수익률
          </th>
          <th
            scope="col"
            className="min-w-[120px] px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 lg:w-auto"
          >
            배당지급일
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white">
        {getItems().map((dividend) => (
          <tr key={dividend.id} className="hover:bg-gray-50">
            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
              {formatSearchDate(dividend.exDividendDate)}
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
              ${dividend.dividendAmount}
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
              {dividend.dividendYield ? dividend.dividendYield : '-'}
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
              {formatSearchDate(dividend.paymentDate)}
            </td>
          </tr>
        ))}
      </tbody>
    </DataTableBase>
  );
}
