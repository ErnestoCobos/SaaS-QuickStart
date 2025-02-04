'use client';

import React from 'react';
import { Bell } from 'lucide-react';

interface NotificationButtonProps {
  unreadCount: number;
  onClick: () => void;
}

export const NotificationButton: React.FC<NotificationButtonProps> = ({
  unreadCount,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-8 right-8 flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg transition-colors"
    >
      <Bell className="h-5 w-5" />
      <span className="font-medium">
        {unreadCount > 0 ? `${unreadCount} Notificaciones nuevas` : 'Ver notificaciones'}
      </span>
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center text-xs">
          {unreadCount}
        </span>
      )}
    </button>
  );
};
