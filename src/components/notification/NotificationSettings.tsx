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

const NotificationSettings = () => {
  const queryClient = useQueryClient();

  const [emailEnabled, setEmailEnabled] = useState<boolean>(false);
  const [slackEnabled, setSlackEnabled] = useState<boolean>(false);
  const [slackWebhookUrl, setSlackWebhookUrl] = useState<string | undefined>(
    undefined,
  );

  const { data, isLoading } = useQuery({
    queryKey: ['notificationSettings'],
    queryFn: getNotificationSettings,
  });

  useEffect(() => {
    if (data?.data) {
      setEmailEnabled(data.data.emailEnabled);
      setSlackEnabled(data.data.slackEnabled);
      setSlackWebhookUrl(data.data.slackWebhookUrl || undefined);
    }
  }, [data]);

  const updateSettingsMutation = useMutation({
    mutationFn: (settings: {
      emailEnabled: boolean;
      slackEnabled: boolean;
      slackWebhookUrl?: string;
    }) => updateNotificationSettings(settings),
    onSuccess: (responseData) => {
      queryClient.invalidateQueries({ queryKey: ['notificationSettings'] });
      if (responseData?.data) {
        setEmailEnabled(responseData.data.emailEnabled);
        setSlackEnabled(responseData.data.slackEnabled);
        setSlackWebhookUrl(responseData.data.slackWebhookUrl || undefined);
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
    if (slackEnabled && !slackWebhookUrl?.trim()) {
      toast.error('Slack 알림을 사용하려면 웹훅 URL을 입력해야 합니다.');
      return;
    }

    const settingsToUpdate: {
      emailEnabled: boolean;
      slackEnabled: boolean;
      slackWebhookUrl?: string;
    } = {
      emailEnabled,
      slackEnabled,
      slackWebhookUrl: slackEnabled ? slackWebhookUrl?.trim() : undefined,
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
              <div className="space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between rounded-lg p-5">
                <Label htmlFor="email-notifications" className="font-medium">
                  이메일 알림
                </Label>
                <Switch
                  id="email-notifications"
                  checked={emailEnabled}
                  onCheckedChange={setEmailEnabled}
                  disabled={updateSettingsMutation.isPending}
                />
              </div>

              <div className="flex items-center justify-between rounded-lg p-5">
                <Label htmlFor="slack-notifications" className="font-medium">
                  Slack 알림
                </Label>
                <Switch
                  id="slack-notifications"
                  checked={slackEnabled}
                  onCheckedChange={setSlackEnabled}
                  disabled={updateSettingsMutation.isPending}
                />
              </div>

              {slackEnabled && (
                <div className="space-y-2 rounded-lg border p-4">
                  <Label htmlFor="slack-webhook-url" className="font-medium">
                    Slack 웹훅 URL
                  </Label>
                  <Input
                    id="slack-webhook-url"
                    value={slackWebhookUrl}
                    onChange={(e) => setSlackWebhookUrl(e.target.value)}
                    placeholder="https://hooks.slack.com/services/..."
                    disabled={updateSettingsMutation.isPending}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Slack 알림을 받기 위해 웹훅 URL을 입력해주세요.
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>
        <CardFooter className="flex justify-end space-x-2 p-4">
          <Button
            onClick={handleSubmit}
            disabled={isLoading || updateSettingsMutation.isPending}
          >
            {updateSettingsMutation.isPending ? '적용 중...' : '적용'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default NotificationSettings;
