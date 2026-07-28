import 'server-only'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY as string

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  // eslint-disable-next-line no-console
  console.error('[Supabase Admin] Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY - required for admin operations')
}

// Admin client for server-side admin operations ONLY
export const supabaseAdmin = createClient(
  SUPABASE_URL || '', 
  SUPABASE_SERVICE_ROLE_KEY || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function getUserBypassRLS(token: string) {
  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !user) {
      console.error('Error getting user from token:', error);
      return null;
    }

    // Return the user data directly from auth.users
    return user;
  } catch (error) {
    console.error('Error in getUserBypassRLS:', error);
    return null;
  }
}
