import { Card, CardContent, CardFooter } from '@/components/UI/card';
import { Label } from '@/components/UI/label';
import { Switch } from '@/components/UI/switch';
import { Input } from '@/components/UI/input';
import { Button } from '@/components/UI/button';
import { Skeleton } from '@/components/UI/Skeleton';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import {
  getNotificationSettings,
  updateNotificationSettings,
} from '@/api/services/notificationService';
import { validateSlackWebhookUrl } from '@/utils/validation';

const NotificationSettings = () => {
  const queryClient = useQueryClient();

  const [emailEnabled, setEmailEnabled] = useState<boolean>(false);
  const [slackEnabled, setSlackEnabled] = useState<boolean>(false);
  const [slackWebhookUrl, setSlackWebhookUrl] = useState<string | undefined>(
    undefined,
  );
  const [allEnabled, setAllEnabled] = useState<boolean>(true);
  const [slackUrlError, setSlackUrlError] = useState<string>('');

  // 원래 사용자 설정을 저장할 상태 (allEnabled가 false일 때 복원용)
  const [originalEmailEnabled, setOriginalEmailEnabled] =
    useState<boolean>(false);
  const [originalSlackEnabled, setOriginalSlackEnabled] =
    useState<boolean>(false);

  const { data, isLoading } = useQuery({
    queryKey: ['notificationSettings'],
    queryFn: getNotificationSettings,
  });

  useEffect(() => {
    if (data?.data) {
      const settings = data.data;
      setEmailEnabled(settings.emailEnabled);
      setSlackEnabled(settings.slackEnabled);
      setSlackWebhookUrl(settings.slackWebhookUrl || undefined);
      setAllEnabled(settings.allEnabled ?? true);

      if (settings.allEnabled ?? true) {
        setOriginalEmailEnabled(settings.emailEnabled);
        setOriginalSlackEnabled(settings.slackEnabled);
      }
    }
  }, [data]);

  const handleAllEnabledChange = (enabled: boolean) => {
    setAllEnabled(enabled);

    if (!enabled) {
      setOriginalEmailEnabled(emailEnabled);
      setOriginalSlackEnabled(slackEnabled);
      setEmailEnabled(false);
      setSlackEnabled(false);
      setSlackUrlError('');
    } else {
      setEmailEnabled(originalEmailEnabled);
      setSlackEnabled(originalSlackEnabled);
    }
  };

  // Slack 웹훅 URL 변경 핸들러
  const handleSlackWebhookUrlChange = (value: string) => {
    setSlackWebhookUrl(value);
    if (slackEnabled && value) {
      const error = validateSlackWebhookUrl(value, true);
      setSlackUrlError(error);
    } else {
      setSlackUrlError('');
    }
  };

  // 개별 알림 설정 변경 시 원래 설정도 업데이트
  const handleEmailEnabledChange = (enabled: boolean) => {
    setEmailEnabled(enabled);
    if (allEnabled) {
      setOriginalEmailEnabled(enabled);
    }
  };

  const handleSlackEnabledChange = (enabled: boolean) => {
    setSlackEnabled(enabled);
    if (allEnabled) {
      setOriginalSlackEnabled(enabled);
    }
    if (!enabled) {
      setSlackUrlError('');
    }
  };

  const updateSettingsMutation = useMutation({
    mutationFn: (settings: {
      emailEnabled: boolean;
      slackEnabled: boolean;
      slackWebhookUrl?: string;
      allEnabled: boolean;
    }) => updateNotificationSettings(settings),
    onSuccess: (responseData) => {
      queryClient.invalidateQueries({ queryKey: ['notificationSettings'] });
      if (responseData?.data) {
        const settings = responseData.data;
        setEmailEnabled(settings.emailEnabled);
        setSlackEnabled(settings.slackEnabled);
        setSlackWebhookUrl(settings.slackWebhookUrl || undefined);
        setAllEnabled(settings.allEnabled);

        // 성공적으로 업데이트된 후 원래 설정도 업데이트
        if (settings.allEnabled) {
          setOriginalEmailEnabled(settings.emailEnabled);
          setOriginalSlackEnabled(settings.slackEnabled);
        }
      }
      toast.success('알림 설정이 업데이트되었습니다.');
    },
    onError: (error) => {
      toast.error(
        `알림 설정 업데이트 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
      );
    },
  });

  const handleSubmit = () => {
    // Slack 웹훅 URL 검증
    if (slackEnabled) {
      if (!slackWebhookUrl?.trim()) {
        toast.error('Slack 알림을 사용하려면 웹훅 URL을 입력해야 합니다.');
        setSlackUrlError('Slack 웹훅 URL을 입력해주세요.');
        return;
      }

      const urlError = validateSlackWebhookUrl(slackWebhookUrl, true);
      if (urlError) {
        toast.error(urlError);
        setSlackUrlError(urlError);
        return;
      }
    }

    const settingsToUpdate: {
      emailEnabled: boolean;
      slackEnabled: boolean;
      slackWebhookUrl?: string;
      allEnabled: boolean;
    } = {
      emailEnabled,
      slackEnabled,
      slackWebhookUrl: slackEnabled ? slackWebhookUrl?.trim() : undefined,
      allEnabled,
    };

    updateSettingsMutation.mutate(settingsToUpdate);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-6 w-10" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-6 w-10" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-6 w-10" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between rounded-lg p-5">
                <div>
                  <Label htmlFor="all-notifications" className="font-medium">
                    전체 알림 허용
                  </Label>
                </div>
                <Switch
                  id="all-notifications"
                  checked={allEnabled}
                  onCheckedChange={handleAllEnabledChange}
                  disabled={updateSettingsMutation.isPending}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg p-5">
                <Label htmlFor="email-notifications" className="font-medium">
                  이메일 알림
                </Label>
                <Switch
                  id="email-notifications"
                  checked={emailEnabled}
                  onCheckedChange={handleEmailEnabledChange}
                  disabled={updateSettingsMutation.isPending || !allEnabled}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg p-5">
                <Label htmlFor="slack-notifications" className="font-medium">
                  Slack 알림
                </Label>
                <Switch
                  id="slack-notifications"
                  checked={slackEnabled}
                  onCheckedChange={handleSlackEnabledChange}
                  disabled={updateSettingsMutation.isPending || !allEnabled}
                />
              </div>

              {slackEnabled && allEnabled && (
                <div className="space-y-2 rounded-lg border p-4">
                  <Label htmlFor="slack-webhook-url" className="font-medium">
                    Slack 웹훅 URL
                  </Label>
                  <Input
                    id="slack-webhook-url"
                    value={slackWebhookUrl || ''}
                    onChange={(e) =>
                      handleSlackWebhookUrlChange(e.target.value)
                    }
                    placeholder="https://hooks.slack.com/services/.../.../..."
                    disabled={updateSettingsMutation.isPending}
                    required
                    className={slackUrlError ? 'border-red-500' : ''}
                  />
                  {slackUrlError && (
                    <p className="text-sm text-red-600">{slackUrlError}</p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Slack 알림을 받기 위해 올바른 형식의 웹훅 URL을
                    입력해주세요.
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-end space-x-2 p-4">
          <Button
            onClick={handleSubmit}
            disabled={
              isLoading ||
              updateSettingsMutation.isPending ||
              (slackEnabled && !!slackUrlError)
            }
          >
            {updateSettingsMutation.isPending ? '적용 중...' : '적용'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NotificationSettings;
