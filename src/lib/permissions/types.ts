export type PermissionName = 
  | 'create:users'
  | 'read:users'
  | 'update:users'
  | 'delete:users'
  | 'create:organizations'
  | 'read:organizations'
  | 'update:organizations'
  | 'delete:organizations'
  | 'manage:roles'
  | 'manage:permissions'
  | 'view:audit_logs'
  | 'manage:billing'
  | 'manage:settings';

export interface Permission {
  id: string;
  name: PermissionName;
  description?: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
}

export interface UserPermissions {
  roles: Role[];
  customRoles: Role[];
  membershipRole: string;
}

// Default permission sets for built-in roles
export const DEFAULT_ROLE_PERMISSIONS: Record<string, PermissionName[]> = {
  OWNER: [
    'create:users',
    'read:users',
    'update:users',
    'delete:users',
    'create:organizations',
    'read:organizations',
    'update:organizations',
    'delete:organizations',
    'manage:roles',
    'manage:permissions',
    'view:audit_logs',
    'manage:billing',
    'manage:settings'
  ],
  ADMIN: [
    'create:users',
    'read:users',
    'update:users',
    'create:organizations',
    'read:organizations',
    'update:organizations',
    'manage:roles',
    'view:audit_logs',
    'manage:settings'
  ],
  MANAGER: [
    'read:users',
    'update:users',
    'read:organizations',
    'update:organizations',
    'view:audit_logs'
  ],
  MEMBER: [
    'read:users',
    'read:organizations'
  ],
  VIEWER: [
    'read:organizations'
  ],
  GUEST: []
};
