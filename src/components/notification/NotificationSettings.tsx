import { Card, CardContent, CardHeader, CardTitle } from '@/components/UI/card';
import { Label } from '@/components/UI/label';
import { RadioGroup, RadioGroupItem } from '@/components/UI/radio-group';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
  getNotificationSettings,
  updateNotificationSettings,
} from '@/api/services/notificationService';

export default function NotificationSettings() {
  const queryClient = useQueryClient();
  const [preferredMethod, setPreferredMethod] = useState<
    'EMAIL' | 'PUSH' | 'BOTH'
  >('BOTH');

  // 알림 설정 조회
  const { data, isLoading } = useQuery({
    queryKey: ['notificationSettings'],
    queryFn: () => getNotificationSettings(),
  });

  // 초기 값 설정
  useEffect(() => {
    if (data?.data) {
      setPreferredMethod(data.data.preferredMethod);
    }
  }, [data]);

  // 알림 설정 업데이트 mutation
  const updateSettingsMutation = useMutation({
    mutationFn: (settings: { preferredMethod: 'EMAIL' | 'PUSH' | 'BOTH' }) =>
      updateNotificationSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificationSettings'] });
      toast.success('알림 설정이 업데이트되었습니다.');
    },
    onError: (error) => {
      toast.error(
        `알림 설정 업데이트 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
      );
    },
  });

  // 설정 변경 핸들러
  const handleMethodChange = (value: string) => {
    const method = value as 'EMAIL' | 'PUSH' | 'BOTH';
    setPreferredMethod(method);
    updateSettingsMutation.mutate({ preferredMethod: method });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>알림 설정</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-4 text-center">
              <p className="text-sm text-muted-foreground">로딩 중...</p>
            </div>
          ) : (
            <RadioGroup
              value={preferredMethod}
              onValueChange={handleMethodChange}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="PUSH" id="push" />
                <Label htmlFor="push">PUSH 알림</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="EMAIL" id="email" />
                <Label htmlFor="email">이메일 알림</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="BOTH" id="both" />
                <Label htmlFor="both">PUSH 알림 + 이메일 알림</Label>
              </div>
            </RadioGroup>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
