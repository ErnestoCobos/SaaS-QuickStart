import { io, Socket } from 'socket.io-client';
import type { ServerToClientEvents, ClientToServerEvents } from './config';

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

export const getSocketClient = () => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000', {
      path: '/api/socket',
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('Socket conectado');
    });

    socket.on('connect_error', (error) => {
      console.error('Error de conexión:', error);
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket desconectado:', reason);
    });
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
