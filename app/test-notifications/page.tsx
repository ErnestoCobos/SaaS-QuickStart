'use client';

import { useState } from 'react';
import { useNotifications } from '@/features/notifications/hooks/useNotifications';
import { NotificationType } from '@/features/notifications/types/notification';
import { useUser } from '@clerk/nextjs';

export default function TestNotifications() {
  const { sendNotification, connected, error } = useNotifications();
  const { user } = useUser();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState<NotificationType>('info');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message || !user?.id) return;

    sendNotification({
      title,
      message,
      type,
      userId: user.id,
    });

    // Limpiar el formulario
    setTitle('');
    setMessage('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Test de Notificaciones</h1>

      <div className="mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-gray-600">
            {connected ? 'Conectado' : 'Desconectado'}
          </span>
        </div>
        {error && (
          <div className="mt-2 text-sm text-red-600">
            Error: {error}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Título
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Mensaje
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            rows={3}
            required
          />
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Tipo
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value as NotificationType)}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="info">Info</option>
            <option value="success">Success</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          disabled={!connected}
        >
          Enviar Notificación
        </button>
      </form>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Instrucciones:</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
          <li>Asegúrate de que el estado muestre &quot;Conectado&quot;</li>
          <li>Completa el formulario con el título y mensaje de la notificación</li>
          <li>Selecciona el tipo de notificación</li>
          <li>Haz clic en &quot;Enviar Notificación&quot;</li>
          <li>La notificación aparecerá en el icono de la campana en la barra superior</li>
        </ol>
      </div>
    </div>
  );
}
