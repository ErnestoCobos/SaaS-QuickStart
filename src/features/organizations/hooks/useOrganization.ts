import { useState, useEffect, createContext, useContext } from 'react'
import { useAuth } from '@clerk/nextjs'
import { OrganizationService } from '../services/organizationService'
import type { OrganizationWithMemberships, MembershipWithOrganization } from '@/types/organization'

interface OrganizationContextType {
  currentOrganization: OrganizationWithMemberships | null
  userMemberships: MembershipWithOrganization[]
  isLoading: boolean
  error: Error | null
  selectOrganization: (organizationId: string) => Promise<void>
}

const OrganizationContext = createContext<OrganizationContextType | undefined>(undefined)

export function OrganizationProvider({ children }: { children: React.ReactNode }) {
  const { userId } = useAuth()
  const [currentOrganization, setCurrentOrganization] = useState<OrganizationWithMemberships | null>(null)
  const [userMemberships, setUserMemberships] = useState<MembershipWithOrganization[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (!userId) return

    const loadUserOrganizations = async () => {
      try {
        const memberships = await OrganizationService.getUserOrganizations(userId)
        setUserMemberships(memberships)
        
        // If there's only one organization, select it automatically
        if (memberships.length === 1) {
          const org = await OrganizationService.getOrganization(memberships[0].organizationId)
          if (org) setCurrentOrganization(org)
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load organizations'))
      } finally {
        setIsLoading(false)
      }
    }

    loadUserOrganizations()
  }, [userId])

  const selectOrganization = async (organizationId: string) => {
    try {
      const organization = await OrganizationService.getOrganization(organizationId)
      if (!organization) throw new Error('Organization not found')
      setCurrentOrganization(organization)
      // Store selected organization ID in localStorage for persistence
      localStorage.setItem('selectedOrganizationId', organizationId)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to select organization'))
      throw err
    }
  }

  return (
    <OrganizationContext.Provider
      value={{
        currentOrganization,
        userMemberships,
        isLoading,
        error,
        selectOrganization,
      }}
    >
      {children}
    </OrganizationContext.Provider>
  )
}

export function useOrganization() {
  const context = useContext(OrganizationContext)
  if (context === undefined) {
    throw new Error('useOrganization must be used within an OrganizationProvider')
  }
  return context
}
