import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export interface AuthenticatedRequest extends NextRequest {
  user?: { id: string; email: string | null | undefined; role?: string; [key: string]: unknown }
}

export async function authenticateUser(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) return null

    return { id: user.id, email: user.email, role: (user.user_metadata as any)?.role }
  } catch (error) {
    console.error('Authentication error:', error)
    return null
  }
}

export function requireAuth(handler: (request: AuthenticatedRequest) => Promise<NextResponse>) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const user = await authenticateUser(request)
    if (!user) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 })
    }
    const authenticatedRequest = request as AuthenticatedRequest
    authenticatedRequest.user = user
    return handler(authenticatedRequest)
  }
}