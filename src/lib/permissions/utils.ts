import { PermissionName, UserPermissions, DEFAULT_ROLE_PERMISSIONS, Permission, Role } from './types';
import { prisma } from '../prisma';
import type { Prisma } from '@prisma/client';

interface RoleAssignment {
  role: Role;
}

interface ExtendedMembership {
  id: string;
  role: string;
  roleAssignments: RoleAssignment[];
}

interface PrismaPermission {
  id: string;
  name: string;
  description: string | null;
}

type PrismaTransaction = Omit<
  typeof prisma,
  '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
>;

export class PermissionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PermissionError';
  }
}

export async function getUserPermissions(userId: string, organizationId: string): Promise<UserPermissions> {
  const membership = await prisma.membership.findUnique({
    where: {
      userId_organizationId: {
        userId,
        organizationId,
      },
    },
    include: {
      roleAssignments: {
        include: {
          role: {
            include: {
              permissions: true,
            },
          },
        },
      },
    },
  });

  if (!membership) {
    throw new PermissionError('User is not a member of this organization');
  }

  // Get the built-in role permissions
  const builtInRolePermissions = DEFAULT_ROLE_PERMISSIONS[membership.role] || [];
  const builtInRole: Role = {
    id: membership.role,
    name: membership.role,
    description: undefined,
    permissions: builtInRolePermissions.map(name => ({
      id: name,
      name,
      description: `Built-in permission: ${name}`,
    }))
  };

  // Map custom roles
  const customRoles = (membership as unknown as ExtendedMembership).roleAssignments.map((mr: RoleAssignment) => ({
    id: mr.role.id,
    name: mr.role.name,
    description: mr.role.description,
    permissions: mr.role.permissions.map(p => ({
      id: p.id,
      name: p.name as PermissionName,
      description: p.description,
    })),
  }));

  return {
    roles: [builtInRole],
    customRoles,
    membershipRole: membership.role,
  };
}

export function hasPermission(
  userPermissions: UserPermissions,
  requiredPermission: PermissionName
): boolean {
  // Check built-in role permissions
  const rolePermissions = DEFAULT_ROLE_PERMISSIONS[userPermissions.membershipRole] || [];
  if (rolePermissions.includes(requiredPermission)) {
    return true;
  }

  // Check custom role permissions
  return userPermissions.customRoles.some(role =>
    role.permissions.some(permission => permission.name === requiredPermission)
  );
}

export function requirePermission(
  userPermissions: UserPermissions,
  requiredPermission: PermissionName
): void {
  if (!hasPermission(userPermissions, requiredPermission)) {
    throw new PermissionError(`Missing required permission: ${requiredPermission}`);
  }
}

export async function assignRoleToUser(
  userId: string,
  organizationId: string,
  roleId: string,
  actorPermissions: UserPermissions
): Promise<void> {
  // Check if actor has permission to manage roles
  requirePermission(actorPermissions, 'manage:roles');

  await prisma.$transaction(async (tx: PrismaTransaction) => {
    const membership = await tx.membership.findUnique({
      where: {
        userId_organizationId: {
          userId,
          organizationId,
        },
      },
    });

    if (!membership) {
      throw new PermissionError('User is not a member of this organization');
    }

    await tx.membershipToRole.create({
      data: {
        membershipId: membership.id,
        roleId,
      },
    });
  });
}

export async function createRole(
  organizationId: string,
  name: string,
  description: string | undefined,
  permissionNames: PermissionName[],
  actorPermissions: UserPermissions
): Promise<Role> {
  // Check if actor has permission to manage roles
  requirePermission(actorPermissions, 'manage:roles');

  return await prisma.$transaction(async (tx: PrismaTransaction) => {
    // Get or create permissions
    const permissions = await Promise.all(
      permissionNames.map(async (name) => {
        return await tx.permission.upsert({
          where: { name },
          create: { name, description: `Permission to ${name.replace(':', ' ')}` },
          update: {},
        });
      })
    );

    // Create the role with permissions
    const role = await tx.role.create({
      data: {
        name,
        description,
        permissions: {
          connect: permissions.map((p: PrismaPermission) => ({ id: p.id })),
        },
      },
      include: {
        permissions: true,
      },
    });

    return {
      id: role.id,
      name: role.name,
      description: role.description || undefined,
      permissions: role.permissions.map((p: PrismaPermission) => ({
        id: p.id,
        name: p.name as PermissionName,
        description: p.description || undefined,
      })),
    };
  });
}

export async function updateRole(
  roleId: string,
  updates: {
    name?: string;
    description?: string;
    permissionNames?: PermissionName[];
  },
  actorPermissions: UserPermissions
): Promise<Role> {
  requirePermission(actorPermissions, 'manage:roles');

  return await prisma.$transaction(async (tx: PrismaTransaction) => {
    const updateData = {
      name: updates.name,
      description: updates.description,
    } as const;

    if (updates.permissionNames) {
      const permissions = await Promise.all(
        updates.permissionNames.map(async (name) => {
          return await tx.permission.upsert({
            where: { name },
            create: { name, description: `Permission to ${name.replace(':', ' ')}` },
            update: {},
          });
        })
      );

      Object.assign(updateData, {
        permissions: {
          set: permissions.map((p: PrismaPermission) => ({ id: p.id })),
        },
      });
    }

    const role = await tx.role.update({
      where: { id: roleId },
      data: updateData,
      include: {
        permissions: true,
      },
    });

    return {
      id: role.id,
      name: role.name,
      description: role.description || undefined,
      permissions: role.permissions.map((p: PrismaPermission) => ({
        id: p.id,
        name: p.name as PermissionName,
        description: p.description || undefined,
      })),
    };
  });
}
