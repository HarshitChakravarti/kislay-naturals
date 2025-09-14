import { NextRequest, NextResponse } from 'next/server'
import { supabase, supabaseAdmin } from '@/lib/supabase'
import { rateLimit } from '@/lib/middleware/rateLimit'
import { generateCSRFToken, validateCSRFToken } from '@/lib/middleware/csrf'

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
    const rateLimitResult = rateLimit(request, 10, 15 * 60 * 1000)
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

    const { name, email, password, role, csrfToken } = body

    const sessionId = request.headers.get('x-session-id') || 'default'
    if (!validateCSRFToken(sessionId, csrfToken)) {
      return NextResponse.json({ success: false, message: 'Invalid CSRF token' }, { status: 403 })
    }

    if (!name || !email || !password) {
      return NextResponse.json({ success: false, message: 'Name, email, and password are required' }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ success: false, message: 'Password must be at least 8 characters long' }, { status: 400 })
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, message: 'Please enter a valid email address' }, { status: 400 })
    }

    // Create user via Admin API so we can set metadata
    const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, role: role || 'user' },
    })

    if (createErr) {
      return NextResponse.json({ success: false, message: createErr.message || 'Failed to register' }, { status: 400 })
    }

    // Sign in to get a session (Admin API doesn't return a session)
    const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({ email, password })
    if (signInErr || !signInData?.session?.access_token) {
      return NextResponse.json({ success: false, message: signInErr?.message || 'Failed to sign in newly created user' }, { status: 500 })
    }

    const response = NextResponse.json({ 
      success: true, 
      user: signInData.user, 
      token: signInData.session.access_token 
    }, { status: 200 })

    setSessionCookie(response, signInData.session.access_token)
    return response
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ success: false, message: 'An error occurred during registration' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const sessionId = request.headers.get('x-session-id') || 'default'
  const csrfToken = generateCSRFToken(sessionId)
  return NextResponse.json({ csrfToken })
} 