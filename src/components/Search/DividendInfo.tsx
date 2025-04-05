import { useQuery } from '@tanstack/react-query';
import { FaBell, FaBellSlash } from 'react-icons/fa';
import EventAddButton from '../CalendarTable/EventAddButton';
import Pagination from '../UI/Pagination';
import { getCompanyDividends } from '../../api/services/searchService';

// 배당 정보 인터페이스
interface Dividend {
  id: number;
  exDividendDate: number;
  dividendAmount: string;
  previousDividendAmount: string;
  paymentDate: number;
  dividendYield: string;
  isFavorite?: boolean;
  hasNotification?: boolean;
}

// API 응답 인터페이스
interface ApiResponseData<T> {
  items: T[];
  pagination: {
    total: number;
    totalPages: number;
    page: number;
    limit: number;
  };
}

interface ApiResponse<T> {
  statusCode: number;
  data: ApiResponseData<T>;
}

interface DividendInfoProps {
  companyId: number | null;
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

  // 배당 데이터 쿼리
  const { data: dividendsData, isLoading: isDividendsDataLoading } = useQuery({
    queryKey: ['companyDividends', companyId, page, limit],
    queryFn: async () => {
      if (!companyId) {
        return {
          statusCode: 200,
          data: {
            items: [] as Dividend[],
            pagination: { total: 0, totalPages: 0, page: 1, limit: 5 },
          },
        } as ApiResponse<Dividend>;
      }
      const response = await getCompanyDividends({
        companyId,
        page,
        limit,
      });
      return response;
    },
    enabled: !!companyId,
  });

  // 데이터 추출 헬퍼 함수
  const getItems = (): Dividend[] => dividendsData?.data?.items || [];
  const getPagination = () =>
    dividendsData?.data?.pagination || {
      total: 0,
      totalPages: 0,
      page: 1,
      limit: 5,
    };

  return (
    <div className="mt-8">
      <h3 className="mb-3 text-lg font-semibold text-gray-800">배당 정보</h3>

      {isDividendsDataLoading ? (
        <div className="flex items-center justify-center p-8">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-green-500 border-t-transparent"></div>
        </div>
      ) : getItems().length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-6 text-center text-gray-500">
          배당 정보가 없습니다.
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
                    배당락일
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    지급일
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    배당액
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                  >
                    배당수익률
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
                {getItems().map((dividend) => (
                  <tr key={dividend.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                      {formatDate(dividend.exDividendDate)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {formatDate(dividend.paymentDate) || '미정'}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">
                          {dividend.dividendAmount || '-'}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {dividend.dividendYield || '-'}
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-center text-sm text-gray-500">
                      <div className="flex justify-center space-x-2">
                        <EventAddButton
                          isAdded={!!dividend.isFavorite}
                          onClick={() => {
                            // 구현 필요
                          }}
                          isLoading={false}
                        />
                        <button
                          onClick={() => {
                            // 구현 필요
                          }}
                          className={`rounded p-1 ${
                            dividend.hasNotification
                              ? 'text-green-500 hover:text-green-700'
                              : 'text-gray-400 hover:text-gray-600'
                          }`}
                          title={
                            dividend.hasNotification ? '알림 해제' : '알림 등록'
                          }
                        >
                          {dividend.hasNotification ? (
                            <FaBell size={16} />
                          ) : (
                            <FaBellSlash size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 배당 페이지네이션 */}
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
