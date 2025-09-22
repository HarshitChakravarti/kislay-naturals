import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { rateLimit } from '@/lib/middleware/rateLimit'
import { validateCSRFToken, generateCSRFToken } from '@/lib/middleware/csrf'

// Helper to set cookie with Supabase access token
const setSessionCookie = (response: NextResponse, access_token: string) => {
  const maxAge = parseInt(process.env.JWT_COOKIE_EXPIRE || '7', 10) * 24 * 60 * 60 * 1000
  response.cookies.set({
    name: 'token',
    value: access_token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge,
    path: '/',
  })
}

export async function POST(request: NextRequest) {
  try {
    const rateLimitResult = rateLimit(request, 5, 15 * 60 * 1000)
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, message: rateLimitResult.message },
        { status: 429, headers: { 'Retry-After': rateLimitResult.retryAfter?.toString() || '900' } }
      )
    }

    let body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid JSON in request body' }, { status: 400 })
    }

    const { emailOrUsername, password, csrfToken } = body

    const sessionId = request.headers.get('x-session-id') || 'default'
    if (!validateCSRFToken(sessionId, csrfToken)) {
      return NextResponse.json({ success: false, message: 'Invalid CSRF token' }, { status: 403 })
    }

    if (!emailOrUsername || !password) {
      return NextResponse.json({ success: false, message: 'Please provide an email and password' }, { status: 400 })
    }

    // Determine if the input is an email or username
    const isEmail = emailOrUsername.includes('@');
    const email = isEmail ? emailOrUsername : null;
    
    // For now, we'll only support email login since Supabase requires email
    // TODO: Implement username lookup if needed
    if (!isEmail) {
      return NextResponse.json({ success: false, message: 'Please use your email address to sign in' }, { status: 400 })
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error || !data?.session?.access_token) {
      return NextResponse.json({ success: false, message: error?.message || 'Invalid credentials' }, { status: 401 })
    }

    // Map Supabase user to our UserData format
    const userData = {
      _id: data.user.id,
      username: data.user.user_metadata?.username || data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'User',
      name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
      email: data.user.email,
      role: data.user.user_metadata?.role || 'user',
      createdAt: data.user.created_at,
      updatedAt: data.user.updated_at
    };

    const response = NextResponse.json({ 
      success: true, 
      user: userData, 
      token: data.session.access_token 
    }, { status: 200 })

    setSessionCookie(response, data.session.access_token)
    return response
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ success: false, message: 'An error occurred during login' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const sessionId = request.headers.get('x-session-id') || 'default'
  const csrfToken = generateCSRFToken(sessionId)
  return NextResponse.json({ csrfToken })
}
