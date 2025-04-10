export interface Notification {
  id: number;
  contentType: 'EARNINGS' | 'DIVIDEND' | 'ECONOMIC_INDICATOR';
  contentId: number;
  userId: number;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationSettings {
  emailEnabled: boolean;
  pushEnabled: boolean;
  preferredMethod: 'EMAIL' | 'PUSH' | 'BOTH';
}

export interface IndicatorNotification {
  id: number;
  name: string;
  country: string;
  releaseDate: string;
  importance: number;
  notificationId?: number;
}

export interface EarningsNotification {
  id: number;
  companyName: string;
  country: string;
  releaseDate: string;
  ticker: string;
  notificationId?: number;
}

export interface NotificationResponse {
  notifications: Notification[];
  total: number;
}
