'use client'

import { useOrganization } from '@/features/organizations/hooks/useOrganization'
import { CreateOrganizationForm } from '@/features/organizations/components/CreateOrganizationForm'
import { Card } from '@/shared/components/atoms/card/Card'
import { Button } from '@/shared/components/atoms/button/Button'
import { useState } from 'react'

export default function OrganizationsPage() {
  const { userMemberships, isLoading } = useOrganization()
  const [showCreateForm, setShowCreateForm] = useState(false)

  if (isLoading) {
    return <div>Loading organizations...</div>
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Organizations</h1>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          {showCreateForm ? 'Cancel' : 'Create Organization'}
        </Button>
      </div>

      {showCreateForm && (
        <div className="mb-8">
          <CreateOrganizationForm />
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {userMemberships.map((membership) => (
          <Card key={membership.organization.id} className="p-6">
            <div className="flex items-center gap-4 mb-4">
              {membership.organization.imageUrl && (
                <img
                  src={membership.organization.imageUrl}
                  alt={membership.organization.name}
                  className="w-12 h-12 rounded-full"
                />
              )}
              <div>
                <h3 className="font-semibold">{membership.organization.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Role: {membership.role.toLowerCase()}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => window.location.href = `/dashboard?org=${membership.organization.id}`}
              >
                View Dashboard
              </Button>
              {membership.role === 'OWNER' && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.location.href = `/organizations/${membership.organization.id}/settings`}
                >
                  Organization Settings
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {userMemberships.length === 0 && !showCreateForm && (
        <Card className="p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">No Organizations</h3>
          <p className="text-muted-foreground mb-4">
            You haven&apos;t created or joined any organizations yet.
          </p>
          <Button onClick={() => setShowCreateForm(true)}>
            Create Your First Organization
          </Button>
        </Card>
      )}
    </div>
  )
}
