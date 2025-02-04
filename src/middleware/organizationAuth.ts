import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUserId } from '@/lib/auth'

export async function organizationAuth(request: NextRequest) {
  try {
    const userId = getCurrentUserId()

    // Get organization ID from URL or header
    const organizationId = request.headers.get('x-organization-id') || 
      request.nextUrl.searchParams.get('organizationId')

    if (!organizationId) {
      return new NextResponse('Organization ID is required', { status: 400 })
    }

    // Check if user is a member of the organization
    const membership = await prisma.membership.findFirst({
      where: {
        userId,
        organizationId,
      },
    })

    if (!membership) {
      return new NextResponse('Not a member of this organization', { status: 403 })
    }

    // Add membership info to request for use in API routes
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-membership-role', membership.role)

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    })
  } catch (error) {
    console.error('Organization auth error:', error)
    return new NextResponse('Unauthorized', { status: 401 })
  }
}

// Helper to check if user has required role
export function requireRole(role: string) {
  return async function(request: NextRequest) {
    const membershipRole = request.headers.get('x-membership-role')
    
    if (!membershipRole) {
      return new NextResponse('Membership role not found', { status: 403 })
    }

    if (role === 'OWNER' && membershipRole !== 'OWNER') {
      return new NextResponse('Owner permission required', { status: 403 })
    }

    if (role === 'ADMIN' && !['OWNER', 'ADMIN'].includes(membershipRole)) {
      return new NextResponse('Admin permission required', { status: 403 })
    }

    return NextResponse.next()
  }
}
