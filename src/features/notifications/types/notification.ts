export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  read: boolean;
  createdAt: Date;
  link?: string;
  action?: {
    label: string;
    url: string;
  };
}

export interface NotificationPayload {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  link?: string;
  action?: {
    label: string;
    url: string;
  };
}

export interface NotificationResponse {
  success: boolean;
  message?: string;
  notification?: Notification;
}

export interface NotificationEvent {
  NEW: 'notification:new';
  READ: 'notification:read';
  DELETE: 'notification:delete';
  UPDATE: 'notification:update';
}

export const NOTIFICATION_EVENTS: NotificationEvent = {
  NEW: 'notification:new',
  READ: 'notification:read',
  DELETE: 'notification:delete',
  UPDATE: 'notification:update',
};
