import { Badge } from '@/components/UI/badge';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import EarningsSubscriptions from './MySubscriptionList/EarningsSubscriptions';
import IndicatorSubscriptions from './MySubscriptionList/IndicatorSubscriptions';

/**
 * 사용자의 모든 구독 목록을 표시하는 메인 컴포넌트
 */
export default function MySubscriptionList() {
  const {
    subscriptions,
    isLoading,
    removeIndicator,
    removeEarnings,
    unsubscribeCompany,
    unsubscribeBaseNameIndicator,
  } = useSubscriptions();

  // 기업 구독 해제 핸들러
  const handleUnsubscribeCompany = (companyName: string, companyId: number) => {
    if (window.confirm(`${companyName}의 모든 실적 알림을 해제하시겠습니까?`)) {
      unsubscribeCompany(companyId);
    }
  };

  // 경제지표 유형 구독 해제 핸들러
  const handleUnsubscribeBaseNameIndicator = (
    baseName: string,
    country: string,
  ) => {
    if (
      window.confirm(
        `${country} 국가의 ${baseName} 유형 모든 알림을 해제하시겠습니까?`,
      )
    ) {
      unsubscribeBaseNameIndicator({ baseName, country });
    }
  };

  return (
    <div className="min-h-screen space-y-10 bg-slate-50 p-4 md:p-6">
      <div className="mb-8 flex flex-col items-start justify-between sm:flex-row sm:items-center">
        <h1 className="mb-2 text-2xl font-bold text-gray-800 sm:mb-0">
          내 알림구독 관리
        </h1>
        <Badge variant="secondary" className="px-4 py-2 text-sm">
          총 {subscriptions?.totalCount || 0}개 알림 구독 중
        </Badge>
      </div>

      <div className="flex flex-row space-x-8">
        <div className="w-1/2">
          <EarningsSubscriptions
            isLoading={isLoading}
            companies={subscriptions?.earnings?.companies}
            earnings={subscriptions?.earnings?.individual}
            onUnsubscribeCompany={handleUnsubscribeCompany}
            onRemoveEarnings={removeEarnings}
          />
        </div>
        <div className="w-1/2">
          <IndicatorSubscriptions
            isLoading={isLoading}
            baseNameIndicators={subscriptions?.indicators?.baseNames}
            indicators={subscriptions?.indicators?.individual}
            onUnsubscribeBaseNameIndicator={handleUnsubscribeBaseNameIndicator}
            onRemoveIndicator={removeIndicator}
          />
        </div>
      </div>
    </div>
  );
}
