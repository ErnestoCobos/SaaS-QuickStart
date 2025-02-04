import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import * as Ably from 'ably';
import { query } from '@/lib/db';

const ably = new Ably.Rest(process.env.ABLY_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { notificationId, all } = body;

    if (!notificationId && !all) {
      return new Response('Missing notificationId or all parameter', { status: 400 });
    }

    const channel = ably.channels.get(`notifications:${userId}`);

    if (all) {
      // Marcar todas las notificaciones como leídas
      const updateAllQuery = `
        UPDATE notifications
        SET read = true
        WHERE user_id = $1 AND read = false
        RETURNING id
      `;
      const result = await query(updateAllQuery, [userId]);
      const updatedIds = result.rows.map(row => row.id);

      // Publicar eventos de lectura para cada notificación
      await Promise.all(
        updatedIds.map(id =>
          channel.publish('message', {
            type: 'read',
            data: { notificationId: id },
          })
        )
      );
    } else {
      // Marcar una notificación específica como leída
      const updateQuery = `
        UPDATE notifications
        SET read = true
        WHERE id = $1 AND user_id = $2
        RETURNING id
      `;
      const result = await query(updateQuery, [notificationId, userId]);

      if (result.rowCount === 0) {
        return new Response('Notification not found', { status: 404 });
      }

      // Publicar evento de lectura
      await channel.publish('message', {
        type: 'read',
        data: { notificationId },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error marking notification as read:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
