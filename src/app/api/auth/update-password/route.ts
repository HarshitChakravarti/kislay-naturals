import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { createClient } from '@/utils/supabase/server';
import { authenticateUser } from '@/lib/middleware/auth'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function PUT(request: NextRequest) {
  const supabase = await createClient();
  try {
    const user = await authenticateUser(request)
    if (!user) {
      return NextResponse.json({ success: false, message: 'Not authorized' }, { status: 401 })
    }

    let body
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid JSON in request body' }, { status: 400 })
    }

    const { currentPassword, newPassword } = body
    if (!newPassword) {
      return NextResponse.json({ success: false, message: 'New password is required' }, { status: 400 })
    }

    // Verify current password by attempting sign-in
    if (currentPassword) {
      const { error: verifyErr } = await supabase.auth.signInWithPassword({ 
        email: user.email!, 
        password: currentPassword 
      })
      if (verifyErr) {
        return NextResponse.json({ success: false, message: 'Password is incorrect' }, { status: 401 })
      }
    }

    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(user.id, { 
      password: newPassword 
    })
    
    if (error) {
      return NextResponse.json({ success: false, message: error.message || 'Failed to update password' }, { status: 400 })
    }
    
    return NextResponse.json({ success: true, data }, { status: 200 })
  } catch (error) {
    console.error('Update password error:', error)
    return NextResponse.json({ success: false, message: 'An error occurred while updating password' }, { status: 500 })
  }
}
