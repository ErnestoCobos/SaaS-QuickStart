import React from 'react';
import { Bell, Check, Trash2, Info, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import type { Notification as AppNotification } from '../types/notification';

interface NotificationItemProps {
  notification: AppNotification;
  onRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const getNotificationIcon = (type: AppNotification['type']) => {
  switch (type) {
    case 'info':
      return <Info className="h-5 w-5 text-blue-500" />;
    case 'success':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'warning':
      return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    case 'error':
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    default:
      return <Bell className="h-5 w-5 text-gray-500" />;
  }
};

const getTimeAgo = (date: Date) => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
  let interval = seconds / 31536000; // años
  if (interval > 1) return `hace ${Math.floor(interval)} años`;
  
  interval = seconds / 2592000; // meses
  if (interval > 1) return `hace ${Math.floor(interval)} meses`;
  
  interval = seconds / 86400; // días
  if (interval > 1) return `hace ${Math.floor(interval)} días`;
  
  interval = seconds / 3600; // horas
  if (interval > 1) return `hace ${Math.floor(interval)} horas`;
  
  interval = seconds / 60; // minutos
  if (interval > 1) return `hace ${Math.floor(interval)} minutos`;
  
  return 'hace un momento';
};

export const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onRead,
  onDelete,
}) => {
  const { id, title, message, type, read, createdAt, link, action } = notification;

  return (
    <div
      className={`
        relative flex items-start gap-4 p-4 transition-colors
        ${read ? 'bg-white' : 'bg-blue-50'}
        ${link || action ? 'cursor-pointer' : ''}
        hover:bg-gray-50
      `}
    >
      <div className="flex-shrink-0">{getNotificationIcon(type)}</div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="font-medium text-gray-900">{title}</p>
          <span className="text-xs text-gray-500">
            {getTimeAgo(new Date(createdAt))}
          </span>
        </div>

        <p className="mt-1 text-sm text-gray-600">{message}</p>

        {action && (
          <button
            onClick={() => window.open(action.url, '_blank')}
            className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            {action.label}
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {!read && (
          <button
            onClick={() => onRead(id)}
            className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
            title="Marcar como leída"
          >
            <Check className="h-4 w-4" />
          </button>
        )}
        <button
          onClick={() => onDelete(id)}
          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
          title="Eliminar notificación"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {!read && (
        <div className="absolute top-4 right-4 h-2 w-2 rounded-full bg-blue-500" />
      )}
    </div>
  );
};
