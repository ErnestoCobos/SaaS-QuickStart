import { useState } from 'react'
import { useOrganization } from '../hooks/useOrganization'
import { Button } from '@/shared/components/atoms/button/Button'
import { Card } from '@/shared/components/atoms/card/Card'

export function OrganizationSwitcher() {
  const { currentOrganization, userMemberships, selectOrganization, isLoading } = useOrganization()
  const [isOpen, setIsOpen] = useState(false)

  if (isLoading) {
    return <div>Loading organizations...</div>
  }

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="ghost"
        className="flex items-center gap-2"
      >
        {currentOrganization?.imageUrl && (
          <img
            src={currentOrganization.imageUrl}
            alt={currentOrganization.name}
            className="w-6 h-6 rounded-full"
          />
        )}
        <span>{currentOrganization?.name || 'Select Organization'}</span>
      </Button>

      {isOpen && (
        <Card className="absolute top-full left-0 mt-2 w-64 z-50">
          <div className="p-2">
            <h3 className="text-sm font-medium mb-2">Your Organizations</h3>
            <div className="space-y-1">
              {userMemberships.map((membership) => (
                <button
                  key={membership.organization.id}
                  onClick={() => {
                    selectOrganization(membership.organization.id)
                    setIsOpen(false)
                  }}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                    currentOrganization?.id === membership.organization.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {membership.organization.imageUrl && (
                      <img
                        src={membership.organization.imageUrl}
                        alt={membership.organization.name}
                        className="w-5 h-5 rounded-full"
                      />
                    )}
                    <span>{membership.organization.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
