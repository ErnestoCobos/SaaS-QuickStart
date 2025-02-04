import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AuditService } from '../lib/audit/audit-service';
import { getAuth } from '@clerk/nextjs/server';

export async function auditLoggerMiddleware(
  request: NextRequest,
  handler: () => Promise<NextResponse>
) {
  const { userId } = getAuth(request);
  
  if (!userId) {
    return handler();
  }

  try {
    const response = await handler();
    
    // Only log successful requests
    if (response.ok) {
      const url = new URL(request.url);
      const pathParts = url.pathname.split('/').filter(Boolean);
      
      // Determine entity type and action from the path
      const entityType = pathParts[0] || 'unknown';
      let action = request.method.toLowerCase();
      
      // Map HTTP methods to actions
      switch (action) {
        case 'post':
          action = 'create';
          break;
        case 'put':
        case 'patch':
          action = 'update';
          break;
        case 'delete':
          action = 'delete';
          break;
        default:
          action = 'access';
      }

      await AuditService.log({
        action: `${entityType}.${action}`,
        entityType,
        entityId: pathParts[1] || 'unknown',
        userId,
        metadata: {
          method: request.method,
          path: url.pathname,
          timestamp: new Date().toISOString(),
        },
      });
    }

    return response;
  } catch (error) {
    // Log error but don't block the request
    console.error('Audit logging failed:', error);
    return handler();
  }
}

// Helper to wrap API routes with audit logging
export function withAuditLog(handler: (req: NextRequest) => Promise<NextResponse>) {
  return (request: NextRequest) => auditLoggerMiddleware(request, () => handler(request));
}
