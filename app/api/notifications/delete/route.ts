import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import * as Ably from 'ably';
import { query } from '@/lib/db';

const ably = new Ably.Rest(process.env.ABLY_API_KEY!);

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { notificationId } = body;

    if (!notificationId) {
      return new Response('Missing notificationId', { status: 400 });
    }

    // Archivar notificación en lugar de eliminarla
    const archiveQuery = `
      UPDATE notifications
      SET archived = true
      WHERE id = $1 AND user_id = $2
      RETURNING id
    `;
    const result = await query(archiveQuery, [notificationId, userId]);

    if (result.rowCount === 0) {
      return new Response('Notification not found', { status: 404 });
    }

    // Publicar evento de eliminación para actualizar el frontend
    const channel = ably.channels.get(`notifications:${userId}`);
    await channel.publish('message', {
      type: 'delete',
      data: { notificationId },
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error archiving notification:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
