import React from 'react';
import { Bell } from 'lucide-react';
import { useNotifications } from '../hooks/useNotifications';
import { useNotificationsUI } from './NotificationsProvider';

export const NotificationBell: React.FC = () => {
  const { unreadCount } = useNotifications();
  const { openDrawer } = useNotificationsUI();

  return (
    <button
      onClick={openDrawer}
      className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
      aria-label="Notificaciones"
    >
      <Bell className="h-5 w-5 text-gray-600" />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center h-5 w-5 text-xs text-white bg-red-500 rounded-full">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  );
};
