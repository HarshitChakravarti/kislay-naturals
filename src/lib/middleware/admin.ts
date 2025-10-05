import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, getUserBypassRLS } from '../supabase'

export interface AdminRequest extends NextRequest {
  user?: { id: string; email: string | null | undefined; role?: string; [key: string]: unknown }
}

export async function authenticateAdmin(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value || request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token || typeof token !== 'string' || token.trim() === '') return null

    const user = await getUserBypassRLS(token);
    if (!user) return null;
    const role = (user.user_metadata as any)?.role

    // Check if user has admin role
    if (role !== 'admin') return null

    return { 
      id: user.id, 
      email: user.email, 
      role: role 
    }
  } catch (error) {
    console.error('Admin authentication error:', error)
    return null
  }
}

export function withAdminAuth(handler: (request: AdminRequest) => Promise<NextResponse>) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const user = await authenticateAdmin(request)
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        message: 'Admin authentication required' 
      }, { status: 401 })
    }
    
    const adminRequest = request as AdminRequest
    adminRequest.user = user
    return handler(adminRequest)
  }
}

export function withAdminAuthDynamic(handler: (request: AdminRequest, context: any) => Promise<NextResponse>) {
  return async (request: NextRequest, context: any): Promise<NextResponse> => {
    const user = await authenticateAdmin(request)
    if (!user) {
      return NextResponse.json({ 
        success: false, 
        message: 'Admin authentication required' 
      }, { status: 401 })
    }
    
    const adminRequest = request as AdminRequest
    adminRequest.user = user
    return handler(adminRequest, context)
  }
}
