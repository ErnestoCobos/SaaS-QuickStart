 import { prisma } from '@/lib/prisma'
import { 
  CreateOrganizationInput, 
  UpdateOrganizationInput, 
  InviteMemberInput,
  UpdateMemberRoleInput,
  MembershipRole
} from '@/types/organization'
import { requireAuth } from '@/lib/auth'

export class OrganizationService {
  static async createOrganization(input: CreateOrganizationInput) {
    const { userId } = requireAuth()
    if (!userId) throw new Error('User not authenticated')

    const { name, slug = name.toLowerCase().replace(/\s+/g, '-'), imageUrl } = input

    const organization = await prisma.organization.create({
      data: {
        name,
        slug,
        imageUrl,
        members: {
          create: {
            userId,
            role: MembershipRole.OWNER
          }
        }
      },
      include: {
        members: true
      }
    })

    return organization
  }

  static async updateOrganization(id: string, input: UpdateOrganizationInput) {
    const { userId } = requireAuth()
    if (!userId) throw new Error('User not authenticated')

    // Verify user has permission
    const membership = await prisma.membership.findFirst({
      where: {
        organizationId: id,
        userId,
        role: {
          in: [MembershipRole.OWNER, MembershipRole.ADMIN]
        }
      }
    })

    if (!membership) throw new Error('Not authorized')

    const organization = await prisma.organization.update({
      where: { id },
      data: input,
      include: {
        members: true
      }
    })

    return organization
  }

  static async inviteMember({ email, role = MembershipRole.MEMBER, organizationId }: InviteMemberInput) {
    const { userId } = requireAuth()
    if (!userId) throw new Error('User not authenticated')

    // Verify user has permission to invite
    const membership = await prisma.membership.findFirst({
      where: {
        organizationId,
        userId,
        role: {
          in: [MembershipRole.OWNER, MembershipRole.ADMIN]
        }
      }
    })

    if (!membership) throw new Error('Not authorized')

    // In a real app, you would:
    // 1. Create a pending invitation record
    // 2. Send an email to the user
    // 3. Create the membership when they accept
    // For now, we'll just create the membership directly
    const newMembership = await prisma.membership.create({
      data: {
        role,
        organizationId,
        userId: email // This is temporary, in reality would be the user's ID when they accept
      },
      include: {
        organization: true
      }
    })

    return newMembership
  }

  static async updateMemberRole({ memberId, role, organizationId }: UpdateMemberRoleInput) {
    const { userId } = requireAuth()
    if (!userId) throw new Error('User not authenticated')

    // Verify user has permission
    const userMembership = await prisma.membership.findFirst({
      where: {
        organizationId,
        userId,
        role: MembershipRole.OWNER
      }
    })

    if (!userMembership) throw new Error('Only owners can update member roles')

    const updatedMembership = await prisma.membership.update({
      where: { id: memberId },
      data: { role },
      include: {
        organization: true
      }
    })

    return updatedMembership
  }

  static async getUserOrganizations(userId: string) {
    const memberships = await prisma.membership.findMany({
      where: { userId },
      include: {
        organization: true
      }
    })

    return memberships
  }

  static async getOrganization(id: string) {
    const organization = await prisma.organization.findUnique({
      where: { id },
      include: {
        members: true
      }
    })

    return organization
  }

  static async deleteOrganization(id: string) {
    const { userId } = requireAuth()
    if (!userId) throw new Error('User not authenticated')

    // Verify user is owner
    const membership = await prisma.membership.findFirst({
      where: {
        organizationId: id,
        userId,
        role: MembershipRole.OWNER
      }
    })

    if (!membership) throw new Error('Only owners can delete organizations')

    // Delete organization and all related data (Prisma will handle cascading deletes)
    const deletedOrg = await prisma.organization.delete({
      where: { id }
    })

    return deletedOrg
  }
}
