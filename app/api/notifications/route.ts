import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import * as Ably from 'ably';
import { query } from '@/lib/db';

// Inicializar cliente de Ably
const ably = new Ably.Rest(process.env.ABLY_API_KEY!);

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response('Unauthorized', { status: 401 });
    }

    const url = new URL(req.url);
    const requestedUserId = url.searchParams.get('userId');
    const cursor = url.searchParams.get('cursor');
    const limit = 20;

    // Verificar que el usuario solo acceda a sus propias notificaciones
    if (requestedUserId !== userId) {
      return new Response('Forbidden', { status: 403 });
    }

    // Construir query con paginación basada en cursor
    let queryText = `
      SELECT *
      FROM notifications
      WHERE user_id = $1
      AND archived = false
    `;
    const queryParams: any[] = [userId];

    if (cursor) {
      queryText += ` AND created_at < (SELECT created_at FROM notifications WHERE id = $2)`;
      queryParams.push(cursor);
    }

    queryText += `
      ORDER BY created_at DESC
      LIMIT $${queryParams.length + 1}
    `;
    queryParams.push(limit);

    // Obtener notificaciones
    const result = await query(queryText, queryParams);
    const notifications = result.rows;

    // Obtener el siguiente cursor
    const nextCursor = notifications.length === limit ? notifications[notifications.length - 1].id : null;

    return new Response(JSON.stringify({ notifications, nextCursor }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new Response('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { title, message, type, link } = body;

    if (!title || !message) {
      return new Response('Missing required fields', { status: 400 });
    }

    // Crear notificación en la base de datos
    const insertQuery = `
      INSERT INTO notifications (user_id, title, message, type, link)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const result = await query(insertQuery, [userId, title, message, type, link]);
    const notification = result.rows[0];

    // Publicar nueva notificación en Ably
    const channel = ably.channels.get(`notifications:${userId}`);
    await channel.publish('message', {
      type: 'new',
      data: { notification },
    });

    return new Response(JSON.stringify({ notification }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error creating notification:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
