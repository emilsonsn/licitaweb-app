export interface INotificationItem {
  id: number;
  title: string;
  body: string;
  date: Date;
  status: NotificationStatus;
  type: NotificationType;
}

export enum NotificationStatus {
  UNREAD,
  READ
}

export enum NotificationType {
  TASK = 'TASK',
  REQUEST = 'REQUEST',
  TENDER = 'TENDER',
  NOTIFICATION = 'NOTIFICATION'
}
