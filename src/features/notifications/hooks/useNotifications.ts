'use client';

import { useEffect, useState, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { createAblyClient } from '@/lib/ably/client';
import type { Notification, NotificationPayload } from '../types/notification';
import type { NotificationChannel, NotificationMessage } from '@/lib/ably/types';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    if (!user?.id) return;

    let isActive = true; // For preventing state updates after unmount
    const channelName = `notifications:${user.id}` as NotificationChannel;
    const ablyClient = createAblyClient({
      authUrl: '/api/ably-token',
      clientId: user.id,
    });

    // Load initial notifications
    const loadInitialNotifications = async () => {
      try {
        const response = await fetch(`/api/notifications?userId=${user.id}`);
        if (!response.ok) throw new Error('Error loading notifications');
        const data = await response.json();
        if (!isActive) return;
        setNotifications(data.notifications);
        setUnreadCount(data.notifications.filter((n: Notification) => !n.read).length);
        setConnected(true);
        setError(null); // Clear any previous errors
      } catch (err) {
        if (!isActive) return;
        setError(err instanceof Error ? err.message : 'Error loading notifications');
        setConnected(false);
      }
    };

    // Notification event handlers
    const handleNewNotification = (message: NotificationMessage) => {
      if (!message.data.notification || !isActive) return;
      const notification = message.data.notification;
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
      
      if ('Notification' in window && window.Notification.permission === 'granted') {
        new window.Notification(notification.title, {
          body: notification.message,
        });
      }
    };

    const handleNotificationRead = (message: NotificationMessage) => {
      if (!message.data.notificationId || !isActive) return;
      const { notificationId } = message.data;
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    };

    const handleNotificationDelete = (message: NotificationMessage) => {
      if (!message.data.notificationId || !isActive) return;
      const { notificationId } = message.data;
      setNotifications((prev) => {
        const notification = prev.find((n) => n.id === notificationId);
        if (!notification) return prev;
        const newNotifications = prev.filter((n) => n.id !== notificationId);
        if (!notification.read) {
          setUnreadCount((count) => Math.max(0, count - 1));
        }
        return newNotifications;
      });
    };

    // Set up subscription with automatic reconnection
    let unsubscribe: (() => void) | undefined;
    let reconnectTimeout: NodeJS.Timeout;
    
    const setupSubscription = async (retryCount = 0) => {
      try {
        if (!isActive) return;

        unsubscribe = await ablyClient.subscribe(
          channelName,
          (message: NotificationMessage) => {
            switch (message.type) {
              case 'notification:new':
                handleNewNotification(message);
                break;
              case 'notification:read':
                handleNotificationRead(message);
                break;
              case 'notification:delete':
                handleNotificationDelete(message);
                break;
            }
          }
        );

        await ablyClient.enterPresence(channelName, { status: 'online' });
        if (!isActive) {
          unsubscribe?.();
          return;
        }

        setConnected(true);
        setError(null);
        await loadInitialNotifications();
      } catch (err) {
        if (!isActive) return;
        
        console.error('Subscription error:', err);
        setError(err instanceof Error ? err.message : 'Error setting up notifications');
        setConnected(false);

        // Implement exponential backoff for retries
        if (retryCount < 3) {
          const delay = Math.min(1000 * Math.pow(2, retryCount), 5000);
          reconnectTimeout = setTimeout(() => {
            setupSubscription(retryCount + 1);
          }, delay);
        }
      }
    };

    setupSubscription();

    // Cleanup function
    return () => {
      isActive = false;
      clearTimeout(reconnectTimeout);
      
      // Use Promise.all to handle all cleanup operations
      Promise.all([
        unsubscribe?.(),
        ablyClient.leavePresence(channelName).catch(err => {
          console.warn('Error leaving presence:', err);
          // Don't throw, just log the error
        })
      ]).finally(() => {
        ablyClient.disconnect();
      });
    };
  }, [user?.id]);

  // Actions
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const response = await fetch('/api/notifications/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId }),
      });

      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error marking as read');
      throw err; // Re-throw to allow handling by the UI
    }
  }, []);

  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      const response = await fetch('/api/notifications/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete notification');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error deleting notification');
      throw err; // Re-throw to allow handling by the UI
    }
  }, []);

  const sendNotification = useCallback(async (payload: NotificationPayload) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to send notification');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error sending notification');
      throw err; // Re-throw to allow handling by the UI
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const response = await fetch('/api/notifications/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ all: true }),
      });

      if (!response.ok) {
        throw new Error('Failed to mark all as read');
      }

      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error marking all as read');
      throw err; // Re-throw to allow handling by the UI
    }
  }, [user?.id]);

  return {
    notifications,
    unreadCount,
    markAsRead,
    deleteNotification,
    sendNotification,
    markAllAsRead,
    connected,
    error,
  };
};
