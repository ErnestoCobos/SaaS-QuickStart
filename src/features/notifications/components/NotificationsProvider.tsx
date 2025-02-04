'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { useUser } from '@clerk/nextjs';
import { useNotifications } from '../hooks/useNotifications';
import { NotificationsDrawer } from './NotificationsDrawer';

interface NotificationsContextType {
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const useNotificationsUI = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotificationsUI must be used within a NotificationsProvider');
  }
  return context;
};

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useUser();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const {
    notifications,
    unreadCount,
    markAsRead,
    deleteNotification,
    markAllAsRead,
  } = useNotifications();

  const handleDeleteAll = useCallback(() => {
    notifications.forEach((notification) => {
      deleteNotification(notification.id);
    });
  }, [notifications, deleteNotification]);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  // Solo mostrar el drawer y el botón si hay un usuario autenticado
  return (
    <NotificationsContext.Provider value={{ isDrawerOpen, openDrawer, closeDrawer }}>
      {children}
      {user && (
        <NotificationsDrawer
          isOpen={isDrawerOpen}
          onClose={closeDrawer}
          notifications={notifications}
          onRead={markAsRead}
          onDelete={deleteNotification}
          onMarkAllAsRead={markAllAsRead}
          onDeleteAll={handleDeleteAll}
        />
      )}
    </NotificationsContext.Provider>
  );
};
