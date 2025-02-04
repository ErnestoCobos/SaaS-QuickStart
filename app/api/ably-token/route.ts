import { NextRequest } from 'next/server';
import * as Ably from 'ably';
import { auth } from '@clerk/nextjs/server';

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new Response('Unauthorized', { status: 401 });
    }

    const client = new Ably.Rest(process.env.ABLY_API_KEY!);
    const tokenRequestData = await client.auth.createTokenRequest({
      clientId: userId,
      capability: {
        [`notifications:${userId}`]: ['publish', 'subscribe', 'presence'],
      },
    });

    return new Response(JSON.stringify(tokenRequestData), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error generating Ably token:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
