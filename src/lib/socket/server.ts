import { Server as HttpServer } from 'http';
import { createSocketServer } from './config';
import { createRedisAdapter } from './redis-adapter';
import type { ServerInstance } from './config';
import type { Notification } from '@/features/notifications/types/notification';
import { createClient } from 'redis';

// Redis client para almacenamiento de notificaciones
const redisClient = createClient({
  url: process.env.REDIS_URL,
  password: process.env.REDIS_PASSWORD,
});

redisClient.connect().catch(console.error);

export async function initSocketServer(server: HttpServer): Promise<ServerInstance> {
  const io = createSocketServer(server);
  
  // Configurar adaptador Redis para Socket.IO
  await createRedisAdapter(io);

  // Health check endpoint
  server.on('request', (req, res) => {
    if (req.url === '/health') {
      res.writeHead(200);
      res.end('OK');
    }
  });

  // Middleware de autenticación
  io.use((socket, next) => {
    const userId = socket.handshake.auth.userId;
    if (!userId) {
      return next(new Error('Usuario no autenticado'));
    }
    socket.data.userId = userId;
    next();
  });

  io.on('connection', (socket) => {
    const { userId } = socket.data;
    console.log(`Usuario conectado: ${userId}`);

    // Unir al usuario a su sala personal
    socket.join(userId);

    // Obtener notificaciones
    socket.on('notifications:get', async (userId, callback) => {
      try {
        const notificationsStr = await redisClient.get(`notifications:${userId}`);
        const userNotifications: Notification[] = notificationsStr ? JSON.parse(notificationsStr) : [];
        callback({ notifications: userNotifications });
      } catch (error) {
        console.error('Error al obtener notificaciones:', error);
        callback({ notifications: [], error: 'Error al obtener notificaciones' });
      }
    });

    // Nueva notificación
    socket.on('notification:new', async (payload, callback) => {
      try {
        const notification: Notification = {
          id: Math.random().toString(36).substr(2, 9),
          ...payload,
          read: false,
          createdAt: new Date(),
        };

        const notificationsStr = await redisClient.get(`notifications:${userId}`);
        const userNotifications: Notification[] = notificationsStr ? JSON.parse(notificationsStr) : [];
        userNotifications.unshift(notification);
        
        await redisClient.set(`notifications:${userId}`, JSON.stringify(userNotifications));

        // Emitir a todos los sockets del usuario
        io.to(userId).emit('notification:new', notification);
        callback();
      } catch (error) {
        console.error('Error al crear notificación:', error);
        callback(error instanceof Error ? error.message : 'Error al crear notificación');
      }
    });

    // Marcar como leída
    socket.on('notification:read', async (notificationId, callback) => {
      try {
        const notificationsStr = await redisClient.get(`notifications:${userId}`);
        const userNotifications: Notification[] = notificationsStr ? JSON.parse(notificationsStr) : [];
        const notificationIndex = userNotifications.findIndex((n) => n.id === notificationId);

        if (notificationIndex === -1) {
          throw new Error('Notificación no encontrada');
        }

        userNotifications[notificationIndex].read = true;
        await redisClient.set(`notifications:${userId}`, JSON.stringify(userNotifications));

        // Emitir a todos los sockets del usuario
        io.to(userId).emit('notification:read', notificationId);
        callback();
      } catch (error) {
        console.error('Error al marcar como leída:', error);
        callback(error instanceof Error ? error.message : 'Error al marcar como leída');
      }
    });

    // Eliminar notificación
    socket.on('notification:delete', async (notificationId, callback) => {
      try {
        const notificationsStr = await redisClient.get(`notifications:${userId}`);
        const userNotifications: Notification[] = notificationsStr ? JSON.parse(notificationsStr) : [];
        const filteredNotifications = userNotifications.filter((n) => n.id !== notificationId);
        
        await redisClient.set(`notifications:${userId}`, JSON.stringify(filteredNotifications));

        // Emitir a todos los sockets del usuario
        io.to(userId).emit('notification:delete', notificationId);
        callback();
      } catch (error) {
        console.error('Error al eliminar notificación:', error);
        callback(error instanceof Error ? error.message : 'Error al eliminar notificación');
      }
    });

    // Marcar todas como leídas
    socket.on('notifications:markAllRead', async (userId, callback) => {
      try {
        const notificationsStr = await redisClient.get(`notifications:${userId}`);
        const userNotifications: Notification[] = notificationsStr ? JSON.parse(notificationsStr) : [];
        const updatedNotifications = userNotifications.map((n) => ({ ...n, read: true }));
        
        await redisClient.set(`notifications:${userId}`, JSON.stringify(updatedNotifications));

        // Emitir cada notificación actualizada
        updatedNotifications.forEach((notification) => {
          io.to(userId).emit('notification:read', notification.id);
        });
        callback();
      } catch (error) {
        console.error('Error al marcar todas como leídas:', error);
        callback(error instanceof Error ? error.message : 'Error al marcar todas como leídas');
      }
    });

    socket.on('disconnect', () => {
      console.log(`Usuario desconectado: ${userId}`);
    });
  });

  return io;
}
