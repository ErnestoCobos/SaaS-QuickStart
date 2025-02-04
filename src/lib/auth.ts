import { getAuth } from '@clerk/nextjs/server'
import { NextRequest } from 'next/server'

export const getCurrentUserId = () => {
  // Create a dummy request for server-side operations
  const req = new NextRequest(new URL('http://localhost:3000'))
  const { userId } = getAuth(req)
  if (!userId) throw new Error('User not authenticated')
  return userId
}

export const requireAuth = () => {
  const userId = getCurrentUserId()
  return { userId }
}
