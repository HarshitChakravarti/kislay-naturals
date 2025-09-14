import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '../supabase'

export interface AuthenticatedRequest extends NextRequest {
  user?: { id: string; email: string | null | undefined; role?: string; [key: string]: unknown }
}

export async function authenticateUser(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token || typeof token !== 'string' || token.trim() === '') return null

    const { data, error } = await supabase.auth.getUser(token)
    if (error || !data?.user) return null

    return { id: data.user.id, email: data.user.email, role: (data.user.user_metadata as any)?.role }
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