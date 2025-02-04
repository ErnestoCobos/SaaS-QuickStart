import { prisma } from '../prisma';
import { headers } from 'next/headers';
import type { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers';

export interface AuditLogData {
  action: string;
  entityType: string;
  entityId: string;
  userId: string;
  metadata?: Record<string, any>;
}

export class AuditService {
  private static async getHeaders(): Promise<{ ipAddress: string; userAgent: string }> {
    try {
      const headersList = await headers();
      return {
        ipAddress: headersList.get('x-forwarded-for') || 
                  headersList.get('x-real-ip') || 
                  'unknown',
        userAgent: headersList.get('user-agent') || 'unknown',
      };
    } catch (error) {
      console.warn('Failed to get request headers:', error);
      return {
        ipAddress: 'unknown',
        userAgent: 'unknown',
      };
    }
  }

  static async log(data: AuditLogData): Promise<void> {
    const { ipAddress, userAgent } = await AuditService.getHeaders();
    
    await prisma.auditLog.create({
      data: {
        action: data.action,
        entityType: data.entityType,
        entityId: data.entityId,
        userId: data.userId,
        metadata: data.metadata || {},
        ipAddress,
        userAgent,
      },
    });
  }

  static async getUserLogs(userId: string, options?: {
    limit?: number;
    offset?: number;
    entityType?: string;
    action?: string;
  }): Promise<{
    logs: Array<{
      id: string;
      action: string;
      entityType: string;
      entityId: string;
      metadata: any;
      createdAt: Date;
      ipAddress?: string;
      userAgent?: string;
    }>;
    total: number;
  }> {
    const where = {
      userId,
      ...(options?.entityType ? { entityType: options.entityType } : {}),
      ...(options?.action ? { action: options.action } : {}),
    };

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: options?.limit || 50,
        skip: options?.offset || 0,
        select: {
          id: true,
          action: true,
          entityType: true,
          entityId: true,
          metadata: true,
          createdAt: true,
          ipAddress: true,
          userAgent: true,
        },
      }),
      prisma.auditLog.count({ where }),
    ]);

    return { logs, total };
  }

  static async getEntityLogs(entityType: string, entityId: string, options?: {
    limit?: number;
    offset?: number;
    action?: string;
  }): Promise<{
    logs: Array<{
      id: string;
      action: string;
      userId: string;
      metadata: any;
      createdAt: Date;
      ipAddress?: string;
      userAgent?: string;
    }>;
    total: number;
  }> {
    const where = {
      entityType,
      entityId,
      ...(options?.action ? { action: options.action } : {}),
    };

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: options?.limit || 50,
        skip: options?.offset || 0,
        select: {
          id: true,
          action: true,
          userId: true,
          metadata: true,
          createdAt: true,
          ipAddress: true,
          userAgent: true,
        },
      }),
      prisma.auditLog.count({ where }),
    ]);

    return { logs, total };
  }
}
