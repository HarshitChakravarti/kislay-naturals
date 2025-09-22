import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    let token = request.cookies.get('token')?.value
    if (!token && request.headers.get('authorization')?.startsWith('Bearer ')) {
      token = request.headers.get('authorization')?.split(' ')[1]
    }

    if (!token) {
      return NextResponse.json({ success: false, message: 'Not authorized to access this route' }, { status: 401 })
    }

    const { data, error } = await supabase.auth.getUser(token)
    if (error || !data?.user) {
      const response = NextResponse.json({ success: false, message: 'Invalid or expired token' }, { status: 401 })
      response.cookies.set('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: new Date(0),
        path: '/',
      })
      return response
    }

    // Map Supabase user to our UserData format
    const user = {
      _id: data.user.id,
      username: data.user.user_metadata?.username || data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'User',
      name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
      email: data.user.email,
      role: data.user.user_metadata?.role || 'user',
      createdAt: data.user.created_at,
      updatedAt: data.user.updated_at
    }

    return NextResponse.json({ success: true, data: user }, { status: 200, headers: { 'Cache-Control': 'no-store, max-age=0' } })
  } catch (error) {
    console.error('Error in /api/auth/me:', error)
    const response = NextResponse.json({ success: false, message: 'Not authorized to access this route' }, { status: 401, headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate', 'Pragma': 'no-cache', 'Expires': '0' } })
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(0),
      path: '/',
    })
    return response
  }
}
