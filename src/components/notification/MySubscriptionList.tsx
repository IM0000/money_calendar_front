import { Badge } from '@/components/UI/badge';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import CompanySubscriptions from './MySubscriptionList/CompanySubscriptions';
import IndicatorSubscriptions from './MySubscriptionList/IndicatorSubscriptions';

/**
 * 사용자의 모든 구독 목록을 표시하는 메인 컴포넌트
 */
export default function MySubscriptionList() {
  const {
    companySubscriptions,
    indicatorGroupSubscriptions,
    isLoading,
    unsubscribeCompany,
    unsubscribeIndicatorGroup,
    isUnsubscribingCompany,
    isUnsubscribingIndicatorGroup,
  } = useSubscriptions();

  // 기업 구독 해제 핸들러
  const handleUnsubscribeCompany = (companyName: string, companyId: number) => {
    if (
      window.confirm(`${companyName}의 모든 실적/배당 알림을 해제하시겠습니까?`)
    ) {
      unsubscribeCompany(companyId);
    }
  };

  // 지표 그룹 구독 해제 핸들러
  const handleUnsubscribeIndicatorGroup = (
    baseName: string,
    country?: string,
  ) => {
    const countryText = country ? `${country} 국가의 ` : '';
    if (
      window.confirm(
        `${countryText}${baseName} 지표 그룹의 모든 알림을 해제하시겠습니까?`,
      )
    ) {
      unsubscribeIndicatorGroup({ baseName, country });
    }
  };

  const totalCount =
    companySubscriptions.length + indicatorGroupSubscriptions.length;

  return (
    <div className="min-h-screen p-4 space-y-10 bg-slate-50 md:p-6">
      <div className="flex flex-col items-start justify-between mb-8 sm:flex-row sm:items-center">
        <h1 className="mb-2 text-2xl font-bold text-gray-800 sm:mb-0">
          내 알림구독 관리
        </h1>
        <Badge variant="secondary" className="px-4 py-2 text-sm">
          총 {totalCount}개 알림 구독 중
        </Badge>
      </div>

      <div className="flex flex-row space-x-8">
        <div className="w-1/2">
          <CompanySubscriptions
            isLoading={isLoading}
            companySubscriptions={companySubscriptions}
            onUnsubscribeCompany={handleUnsubscribeCompany}
            isUnsubscribing={isUnsubscribingCompany}
          />
        </div>
        <div className="w-1/2">
          <IndicatorSubscriptions
            isLoading={isLoading}
            indicatorGroupSubscriptions={indicatorGroupSubscriptions}
            onUnsubscribeIndicatorGroup={handleUnsubscribeIndicatorGroup}
            isUnsubscribing={isUnsubscribingIndicatorGroup}
          />
        </div>
      </div>
    </div>
  );
}
