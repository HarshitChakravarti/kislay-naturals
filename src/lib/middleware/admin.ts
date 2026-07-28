import { NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function authenticateAdmin(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) return null

    const role = (user.app_metadata as any)?.role;
    if (role !== 'admin') {
      console.log('User does not have admin role');
      return null;
    }

    return { id: user.id, email: user.email, role }
  } catch (error) {
    console.error('Admin authentication error:', error)
    return null
  }
}
