import { Server as HttpServer } from 'http';
import { Server as SocketServer, ServerOptions } from 'socket.io';
import { Socket } from 'socket.io-client';
import type { Notification, NotificationPayload } from '@/features/notifications/types/notification';

export interface ServerToClientEvents {
  'notification:new': (notification: Notification) => void;
  'notification:read': (notificationId: string) => void;
  'notification:delete': (notificationId: string) => void;
  'notification:update': (notification: Notification) => void;
}

export interface ClientToServerEvents {
  'notifications:get': (userId: string, callback: (response: { notifications: Notification[]; error?: string }) => void) => void;
  'notifications:markAllRead': (userId: string, callback: (error?: string) => void) => void;
  'notification:new': (payload: NotificationPayload, callback: (error?: string) => void) => void;
  'notification:read': (notificationId: string, callback: (error?: string) => void) => void;
  'notification:delete': (notificationId: string, callback: (error?: string) => void) => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  userId: string;
}

export type ServerSocket = Socket<ServerToClientEvents, ClientToServerEvents>;
export type ServerInstance = SocketServer<ClientToServerEvents, ServerToClientEvents, InterServerEvents, SocketData>;

const SOCKET_CONFIG: Partial<ServerOptions> = {
  path: '/api/socket',
  cors: {
    origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  allowEIO3: true,
  connectTimeout: 45000,
  pingTimeout: 60000,
  pingInterval: 25000,
  cookie: {
    name: 'io',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 86400000, // 24 hours
  },
};

export const createSocketServer = (httpServer: HttpServer): ServerInstance => {
  const io = new SocketServer<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >(httpServer, SOCKET_CONFIG);

  return io;
};
