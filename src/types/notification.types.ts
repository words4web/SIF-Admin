export type NotificationPermissionStatus =
  | "default"
  | "granted"
  | "denied"
  | "unsupported";

export interface INotificationState {
  unreadCount: number;
  fcmToken: string | null;
  permissionStatus: NotificationPermissionStatus;
  isToggledOn: boolean;
}

export interface NotificationItem {
  _id: string;
  userId: string;
  userModel: string;
  type: string;
  title: string;
  body: string;
  isRead: boolean;
  metadata?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}
