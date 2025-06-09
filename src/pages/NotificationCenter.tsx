import Layout from '@/components/Layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/UI/tabs';
import { Settings } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/UI/dialog';
import { useState } from 'react';
import NotificationSettings from '@/components/Notification/NotificationSettings';
import NotificationList from '@/components/Notification/NotificationList';
import MySubscriptionList from '@/components/Notification/MySubscriptionList';

export const NotificationCenter = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">알림센터</h1>
          <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
            <DialogTrigger asChild>
              <button className="rounded p-2 transition duration-200 hover:bg-gray-200">
                <Settings size={24} />
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>추가 알림 설정</DialogTitle>
              </DialogHeader>
              <NotificationSettings />
            </DialogContent>
          </Dialog>
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="lg:col-span-2">
            <Tabs defaultValue="notificationList" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="notificationList">알림 현황</TabsTrigger>
                <TabsTrigger value="MyNotification">
                  내 알림구독 관리
                </TabsTrigger>
              </TabsList>
              <TabsContent value="notificationList">
                <NotificationList />
              </TabsContent>
              <TabsContent value="MyNotification">
                <MySubscriptionList />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};
