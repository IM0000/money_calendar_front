import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  getUserSubscriptions,
  unsubscribeCompanyEarnings,
  unsubscribeBaseNameIndicator,
  removeEarningsSubscription,
  removeIndicatorSubscription,
} from '@/api/services/notificationService';

/**
 * 구독 관련 데이터 조회 및 변경을 위한 커스텀 훅
 * 구독 목록 조회, 알림 해제, 구독 해제 등의 기능을 제공합니다.
 */
export function useSubscriptions() {
  const queryClient = useQueryClient();

  // 사용자 구독 정보 조회
  const { data, isLoading, error } = useQuery({
    queryKey: ['userSubscriptions'],
    queryFn: () => getUserSubscriptions(),
    refetchOnWindowFocus: false,
  });

  // 경제지표 알림 해제 뮤테이션
  const removeIndicatorMutation = useMutation({
    mutationFn: (id: number) => removeIndicatorSubscription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSubscriptions'] });
      toast.success('경제지표 알림이 해제되었습니다.');
    },
    onError: (error) => {
      toast.error(
        `경제지표 알림 해제 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
      );
    },
  });

  // 실적 알림 해제 뮤테이션
  const removeEarningsMutation = useMutation({
    mutationFn: (id: number) => removeEarningsSubscription(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSubscriptions'] });
      toast.success('실적 알림이 해제되었습니다.');
    },
    onError: (error) => {
      toast.error(
        `실적 알림 해제 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
      );
    },
  });

  // 특정 기업의 모든 실적 알림 해제 뮤테이션
  const unsubscribeCompanyEarningsMutation = useMutation({
    mutationFn: (companyId: number) => unsubscribeCompanyEarnings(companyId),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['userSubscriptions'] });
      if (data?.data) {
        toast.success(`${data.data.message} (${data.data.count}개)`);
      } else {
        toast.success('기업의 모든 실적 알림이 해제되었습니다.');
      }
    },
    onError: (error) => {
      toast.error(
        `기업 실적 알림 해제 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
      );
    },
  });

  // 특정 국가의 특정 경제지표 유형 모든 알림 해제 뮤테이션
  const unsubscribeBaseNameIndicatorMutation = useMutation({
    mutationFn: ({
      baseName,
      country,
    }: {
      baseName: string;
      country: string;
    }) => unsubscribeBaseNameIndicator(baseName, country),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['userSubscriptions'] });
      if (data?.data) {
        toast.success(`${data.data.message} (${data.data.count}개)`);
      } else {
        toast.success('경제지표 유형의 모든 알림이 해제되었습니다.');
      }
    },
    onError: (error) => {
      toast.error(
        `경제지표 유형 알림 해제 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
      );
    },
  });

  // 구독 정보 확인 헬퍼 함수들
  const hasCompanySubscriptions = Boolean(
    data?.data?.earnings?.companies && data.data.earnings.companies.length > 0,
  );

  const hasEarningsSubscriptions = Boolean(
    data?.data?.earnings?.individual &&
      data.data.earnings.individual.length > 0,
  );

  const hasBaseNameSubscriptions = Boolean(
    data?.data?.indicators?.baseNames &&
      data.data.indicators.baseNames.length > 0,
  );

  const hasIndicatorSubscriptions = Boolean(
    data?.data?.indicators?.individual &&
      data.data.indicators.individual.length > 0,
  );

  return {
    // 데이터 및 로딩 상태
    subscriptions: data?.data,
    isLoading,
    error,

    // 구독 상태 헬퍼
    hasCompanySubscriptions,
    hasEarningsSubscriptions,
    hasBaseNameSubscriptions,
    hasIndicatorSubscriptions,

    // 뮤테이션 함수들
    removeIndicator: removeIndicatorMutation.mutate,
    removeEarnings: removeEarningsMutation.mutate,
    unsubscribeCompany: unsubscribeCompanyEarningsMutation.mutate,
    unsubscribeBaseNameIndicator: unsubscribeBaseNameIndicatorMutation.mutate,
  };
}
