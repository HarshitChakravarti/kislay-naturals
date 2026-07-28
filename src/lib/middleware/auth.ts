import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function authenticateUser(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) return null

    return { id: user.id, email: user.email, role: (user.app_metadata as any)?.role }
  } catch (error) {
    console.error('Authentication error:', error)
    return null
  }
}