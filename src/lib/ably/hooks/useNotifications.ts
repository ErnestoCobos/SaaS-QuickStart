import { useEffect, useState, useMemo } from 'react';
import { useUser } from '@clerk/nextjs';
import { createAblyClient } from '../client';
import type { Notification } from '@/features/notifications/types/notification';
import type { NotificationMessage } from '../types';

export function useNotifications() {
  const { user } = useUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const unreadCount = useMemo(() => 
    notifications.filter(n => !n.read).length,
  [notifications]);

  useEffect(() => {
    if (!user?.id) return;

    const channelName = `notifications:${user.id}` as const;
    const ablyClient = createAblyClient({
      authUrl: '/api/ably-token',
      clientId: user.id,
    });

    const handleNotification = (message: NotificationMessage) => {
      switch (message.type) {
        case 'new':
          if (message.data.notification) {
            setNotifications(prev => [message.data.notification!, ...prev]);
          }
          break;
        case 'read':
          if (message.data.notificationId) {
            setNotifications(prev =>
              prev.map(n =>
                n.id === message.data.notificationId ? { ...n, read: true } : n
              )
            );
          }
          break;
        case 'delete':
          if (message.data.notificationId) {
            setNotifications(prev =>
              prev.filter(n => n.id !== message.data.notificationId)
            );
          }
          break;
      }
    };

    // Suscribirse al canal
    let unsubscribe: (() => void) | undefined;
    
    const setupSubscription = async () => {
      try {
        unsubscribe = await ablyClient.subscribe(
          channelName as `notifications:${string}`,
          handleNotification
        );
        await ablyClient.enterPresence(
          channelName as `notifications:${string}`,
          { status: 'online' }
        );
        
        // Cargar notificaciones iniciales
        const response = await fetch(`/api/notifications?userId=${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setNotifications(data.notifications);
        }
      } catch (error) {
        console.error('Error setting up notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    setupSubscription();

    // Cleanup
    return () => {
      unsubscribe?.();
      ablyClient.leavePresence(channelName as `notifications:${string}`).catch(console.error);
      ablyClient.disconnect();
    };
  }, [user?.id]);

  const markAllAsRead = async () => {
    if (!user?.id) return;

    try {
      const response = await fetch('/api/notifications/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, all: true }),
      });

      if (!response.ok) {
        throw new Error('Failed to mark all notifications as read');
      }

      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      setError('Failed to mark all notifications as read');
    }
  };

  const markAsRead = async (notificationId: string) => {
    if (!user?.id) return;

    try {
      const response = await fetch('/api/notifications/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId, userId: user.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    if (!user?.id) return;

    try {
      const response = await fetch('/api/notifications/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId, userId: user.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete notification');
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  return {
    notifications,
    loading,
    error,
    unreadCount,
    markAsRead,
    deleteNotification,
    markAllAsRead,
  };
}
