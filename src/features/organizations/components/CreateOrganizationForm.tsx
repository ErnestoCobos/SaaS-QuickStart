import { useState } from 'react'
import { OrganizationService } from '../services/organizationService'
import { useOrganization } from '../hooks/useOrganization'
import { Input } from '@/shared/components/atoms/input/Input'
import { Button } from '@/shared/components/atoms/button/Button'
import { Card } from '@/shared/components/atoms/card/Card'

export function CreateOrganizationForm() {
  const [name, setName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { selectOrganization } = useOrganization()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const organization = await OrganizationService.createOrganization({
        name,
        // Optional: Add image URL handling here
      })
      await selectOrganization(organization.id)
      setName('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create organization')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="p-6 max-w-md mx-auto">
      <h2 className="text-lg font-semibold mb-4">Create New Organization</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Organization Name
          </label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter organization name"
            required
            minLength={2}
            maxLength={50}
            className="w-full"
          />
        </div>

        {error && (
          <div className="text-sm text-red-500">
            {error}
          </div>
        )}

        <Button
          type="submit"
          disabled={isLoading || !name.trim()}
          className="w-full"
        >
          {isLoading ? 'Creating...' : 'Create Organization'}
        </Button>
      </form>
    </Card>
  )
}
