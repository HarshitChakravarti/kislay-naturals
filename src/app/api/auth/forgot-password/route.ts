import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    let body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid JSON in request body' }, { status: 400 })
    }

    const email = body.email
    if (!email) {
      return NextResponse.json({ success: false, message: 'Email is required' }, { status: 400 })
    }

    const redirectTo = process.env.SUPABASE_RESET_REDIRECT || 'https://your-frontend/reset-password'
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo })
    
    if (error) {
      return NextResponse.json({ success: false, message: error.message || 'Failed to send reset email' }, { status: 400 })
    }
    
    return NextResponse.json({ success: true, data: 'Email sent' }, { status: 200 })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ success: false, message: 'An error occurred while processing forgot password' }, { status: 500 })
  }
}
