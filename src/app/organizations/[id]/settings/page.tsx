'use client'

import { useState } from 'react'
import { useOrganization } from '@/features/organizations/hooks/useOrganization'
import { OrganizationService } from '@/features/organizations/services/organizationService'
import { Card } from '@/shared/components/atoms/card/Card'
import { Input } from '@/shared/components/atoms/input/Input'
import { Button } from '@/shared/components/atoms/button/Button'
import { MembershipRole } from '@prisma/client'

interface Member {
  id: string
  role: MembershipRole
  user: {
    email: string
    firstName?: string
    lastName?: string
  }
}

export default function OrganizationSettingsPage({ params }: { params: { id: string } }) {
  const { currentOrganization } = useOrganization()
  const [inviteEmail, setInviteEmail] = useState('')
  const [isInviting, setIsInviting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState('')

  if (!currentOrganization) {
    return <div>Loading organization...</div>
  }

  const handleInviteMember = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsInviting(true)
    setError(null)

    try {
      await OrganizationService.inviteMember({
        email: inviteEmail,
        organizationId: params.id,
        role: MembershipRole.MEMBER
      })
      setInviteEmail('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to invite member')
    } finally {
      setIsInviting(false)
    }
  }

  const handleUpdateMemberRole = async (memberId: string, newRole: MembershipRole) => {
    try {
      await OrganizationService.updateMemberRole({
        memberId,
        role: newRole,
        organizationId: params.id
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update member role')
    }
  }

  const handleDeleteOrganization = async () => {
    if (confirmDelete !== currentOrganization.name) {
      setError('Please type the organization name to confirm deletion')
      return
    }

    setIsDeleting(true)
    try {
      // Add delete organization functionality to OrganizationService
      await OrganizationService.deleteOrganization(params.id)
      window.location.href = '/organizations'
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete organization')
      setIsDeleting(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Organization Settings</h1>

      <div className="grid gap-6">
        {/* Organization Details */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Organization Details</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input
                value={currentOrganization.name}
                disabled
                className="max-w-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">ID</label>
              <Input
                value={currentOrganization.id}
                disabled
                className="max-w-md font-mono"
              />
            </div>
          </div>
        </Card>

        {/* Members Management */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Members</h2>
          
          {/* Invite Form */}
          <form onSubmit={handleInviteMember} className="mb-6">
            <div className="flex gap-4 max-w-md">
              <Input
                type="email"
                placeholder="Email address"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
              />
              <Button type="submit" disabled={isInviting}>
                {isInviting ? 'Inviting...' : 'Invite'}
              </Button>
            </div>
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          </form>

          {/* Members List */}
          <div className="space-y-4">
            {currentOrganization.members.map((member: Member) => (
              <div
                key={member.id}
                className="flex items-center justify-between p-4 bg-muted rounded-lg"
              >
                <div>
                  <p className="font-medium">
                    {member.user.firstName} {member.user.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">{member.user.email}</p>
                </div>
                <select
                  value={member.role}
                  onChange={(e) => handleUpdateMemberRole(member.id, e.target.value as MembershipRole)}
                  className="px-2 py-1 rounded border bg-background"
                  disabled={member.role === MembershipRole.OWNER}
                >
                  <option value={MembershipRole.MEMBER}>Member</option>
                  <option value={MembershipRole.ADMIN}>Admin</option>
                  <option value={MembershipRole.OWNER}>Owner</option>
                </select>
              </div>
            ))}
          </div>
        </Card>

        {/* Danger Zone */}
        <Card className="p-6 border-red-200">
          <h2 className="text-lg font-semibold mb-4 text-red-600">Danger Zone</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Once you delete an organization, there is no going back. Please be certain.
          </p>
          <div className="space-y-4">
            <Input
              type="text"
              placeholder={`Type "${currentOrganization.name}" to confirm`}
              value={confirmDelete}
              onChange={(e) => setConfirmDelete(e.target.value)}
              className="max-w-md"
            />
            <Button
              variant="destructive"
              disabled={isDeleting || confirmDelete !== currentOrganization.name}
              onClick={handleDeleteOrganization}
            >
              {isDeleting ? 'Deleting...' : 'Delete Organization'}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
