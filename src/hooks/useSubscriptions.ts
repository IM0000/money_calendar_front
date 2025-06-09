import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  getCompanySubscriptions,
  getIndicatorGroupSubscriptions,
  unsubscribeCompany,
  unsubscribeIndicatorGroup,
} from '@/api/services/subscriptionService';

/**
 * 구독 관련 데이터 조회 및 변경을 위한 커스텀 훅
 * 회사 단위 구독과 지표 그룹 단위 구독 관리 기능을 제공합니다.
 */
export function useSubscriptions() {
  const queryClient = useQueryClient();

  // 회사 구독 목록 조회
  const { data: companySubscriptions, isLoading: isCompanyLoading } = useQuery({
    queryKey: ['companySubscriptions'],
    queryFn: () => getCompanySubscriptions(),
    refetchOnWindowFocus: false,
  });

  // 지표 그룹 구독 목록 조회
  const { data: indicatorGroupSubscriptions, isLoading: isIndicatorLoading } =
    useQuery({
      queryKey: ['indicatorGroupSubscriptions'],
      queryFn: () => getIndicatorGroupSubscriptions(),
      refetchOnWindowFocus: false,
    });

  // 회사 구독 해제 뮤테이션
  const unsubscribeCompanyMutation = useMutation({
    mutationFn: (companyId: number) => unsubscribeCompany(companyId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          const key = query.queryKey[0] as string;
          return [
            'companySubscriptions',
            'calendarEvents',
            'searchCompanies',
            'searchIndicators',
            'companyEarnings',
            'companyDividends',
            'indicatorGroupHistory',
            'userSubscriptions',
          ].includes(key);
        },
      });
      toast.success('회사 구독이 해제되었습니다.');
    },
    onError: (error) => {
      toast.error(
        `회사 구독 해제 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
      );
    },
  });

  // 지표 그룹 구독 해제 뮤테이션
  const unsubscribeIndicatorGroupMutation = useMutation({
    mutationFn: ({
      baseName,
      country,
    }: {
      baseName: string;
      country?: string;
    }) => unsubscribeIndicatorGroup(baseName, country),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) => {
          const key = query.queryKey[0] as string;
          return [
            'indicatorGroupSubscriptions',
            'calendarEvents',
            'searchCompanies',
            'searchIndicators',
            'companyEarnings',
            'companyDividends',
            'indicatorGroupHistory',
            'userSubscriptions',
          ].includes(key);
        },
      });
      toast.success('지표 그룹 구독이 해제되었습니다.');
    },
    onError: (error) => {
      toast.error(
        `지표 그룹 구독 해제 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
      );
    },
  });

  // 구독 상태 헬퍼 함수들
  const hasCompanySubscriptions = Boolean(
    companySubscriptions?.data && companySubscriptions.data.length > 0,
  );

  const hasIndicatorGroupSubscriptions = Boolean(
    indicatorGroupSubscriptions?.data &&
      indicatorGroupSubscriptions.data.length > 0,
  );

  const totalSubscriptions =
    (companySubscriptions?.data?.length || 0) +
    (indicatorGroupSubscriptions?.data?.length || 0);

  return {
    // 데이터 및 로딩 상태
    companySubscriptions: companySubscriptions?.data || [],
    indicatorGroupSubscriptions: indicatorGroupSubscriptions?.data || [],
    isLoading: isCompanyLoading || isIndicatorLoading,

    // 구독 상태 헬퍼
    hasCompanySubscriptions,
    hasIndicatorGroupSubscriptions,
    totalSubscriptions,

    // 뮤테이션 함수들
    unsubscribeCompany: unsubscribeCompanyMutation.mutate,
    unsubscribeIndicatorGroup: unsubscribeIndicatorGroupMutation.mutate,

    // 로딩 상태
    isUnsubscribingCompany: unsubscribeCompanyMutation.isPending,
    isUnsubscribingIndicatorGroup: unsubscribeIndicatorGroupMutation.isPending,
  };
}
