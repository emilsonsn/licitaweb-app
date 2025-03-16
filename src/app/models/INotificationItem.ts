export interface INotificationItem {
  id: number;
  title: string;
  body: string;
  date: Date;
  status: NotificationStatus;
}

export enum NotificationStatus {
  UNREAD,
  READ
}
