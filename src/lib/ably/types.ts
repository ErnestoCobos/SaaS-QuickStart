import type * as Ably from 'ably';
import type { Notification } from '@/features/notifications/types/notification';

export type NotificationChannel = `notifications:${string}`;

export interface NotificationMessage {
  type: 'notification:new' | 'notification:read' | 'notification:delete';
  data: {
    notification?: Notification;
    notificationId?: string;
  };
}

export interface AblyClientConfig {
  authUrl: string;
  authMethod?: string;
  clientId?: string;
}

export interface PresenceData {
  clientId: string;
  status: 'online' | 'away';
  lastSeen?: Date;
}

export type AblyChannelInstance = Ably.RealtimeChannel;
export type AblyPresenceMessage = {
  clientId: string;
  data: PresenceData;
  timestamp: number;
};
export type AblyMessage = {
  name: string;
  data: any;
  timestamp: number;
};
