export enum MembershipRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER'
}

export interface Organization {
  id: string
  name: string
  slug: string
  imageUrl?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface User {
  id: string
  email: string
  firstName?: string | null
  lastName?: string | null
}

export interface Membership {
  id: string
  role: MembershipRole
  organizationId: string
  userId: string
  user: User
  createdAt: Date
  updatedAt: Date
}

export type OrganizationWithMemberships = Organization & {
  members: Membership[]
}

export type MembershipWithOrganization = Membership & {
  organization: Organization
}

export interface CreateOrganizationInput {
  name: string
  slug?: string // Optional, can be generated from name
  imageUrl?: string
}

export interface UpdateOrganizationInput {
  name?: string
  slug?: string
  imageUrl?: string
}

export interface InviteMemberInput {
  email: string
  role?: MembershipRole
  organizationId: string
}

export interface UpdateMemberRoleInput {
  memberId: string
  role: MembershipRole
  organizationId: string
}

// Helper type for organization settings
export interface OrganizationSettings {
  allowPublicProjects: boolean
  allowMemberInvites: boolean
  requireAdminApproval: boolean
}

// Helper functions
export const isOwner = (role: MembershipRole) => role === 'OWNER'
export const isAdmin = (role: MembershipRole) => role === 'ADMIN' || role === 'OWNER'
export const canInviteMembers = (role: MembershipRole, settings: OrganizationSettings) => 
  isAdmin(role) || (settings.allowMemberInvites && role === 'MEMBER')
