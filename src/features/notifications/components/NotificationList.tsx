'use client';

import React, { useState, useRef, useEffect } from 'react';
import { NotificationItem } from './NotificationItem';
import type { Notification as AppNotification } from '../types/notification';
import { Check, Trash2, Loader2 } from 'lucide-react';

interface NotificationListProps {
  notifications: AppNotification[];
  onRead: (id: string) => void;
  onDelete: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDeleteAll: () => void;
  pageSize?: number;
}

type FilterType = 'all' | 'unread' | 'read';

export const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  onRead,
  onDelete,
  onMarkAllAsRead,
  onDeleteAll,
  pageSize = 10,
}) => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [displayCount, setDisplayCount] = useState(pageSize);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredNotifications = notifications.filter((notification) => {
    switch (filter) {
      case 'unread':
        return !notification.read;
      case 'read':
        return notification.read;
      default:
        return true;
    }
  });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (
        container.scrollHeight - container.scrollTop <= container.clientHeight + 100 &&
        displayCount < filteredNotifications.length &&
        !isLoading
      ) {
        setIsLoading(true);
        // Simular carga con un pequeño delay
        setTimeout(() => {
          setDisplayCount(prev => Math.min(prev + pageSize, filteredNotifications.length));
          setIsLoading(false);
        }, 500);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [displayCount, filteredNotifications.length, isLoading, pageSize]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              filter === 'all'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Todas ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              filter === 'unread'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            No leídas ({unreadCount})
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              filter === 'read'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Leídas ({notifications.length - unreadCount})
          </button>
        </div>

        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Check className="h-4 w-4" />
              Marcar todas como leídas
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={onDeleteAll}
              className="flex items-center gap-1 px-3 py-1 text-sm text-gray-600 hover:text-red-600 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
              Eliminar todas
            </button>
          )}
        </div>
      </div>

      <div ref={containerRef} className="flex-1 overflow-auto divide-y">
        {filteredNotifications.length > 0 ? (
          <>
            {filteredNotifications.slice(0, displayCount).map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onRead={onRead}
              onDelete={onDelete}
            />
            ))}
            {isLoading && (
              <div className="flex justify-center items-center p-4">
                <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No hay notificaciones
          </div>
        )}
      </div>
    </div>
  );
};
