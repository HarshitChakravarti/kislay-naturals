import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { createClient } from '@/utils/supabase/server';
import { authenticateUser } from '@/lib/middleware/auth'

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

export async function PUT(request: NextRequest) {
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

    const updates: any = {}
    if (body.email) updates.email = body.email
    
    // Merge metadata updates
    const user_metadata = { 
      ...((user as any).user_metadata || {}), 
      name: body.name ?? (user as any).name 
    }

    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
      ...updates,
      user_metadata,
    })

    if (error) {
      return NextResponse.json({ success: false, message: error.message || 'Failed to update user' }, { status: 400 })
    }

    return NextResponse.json({ success: true, data }, { status: 200 })
  } catch (error) {
    console.error('Update details error:', error)
    return NextResponse.json({ success: false, message: 'An error occurred while updating details' }, { status: 500 })
  }
}
