import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { createClient } from '@/utils/supabase/server';
import { authenticateUser } from '@/lib/middleware/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = await authenticateUser(request);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Not authorized to access this route' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit - 1;

    // Get users from auth.users using service role
    const { data: users, error } = await supabaseAdmin.auth.admin.listUsers({
      page: page,
      perPage: limit
    });

    if (error) {
      return NextResponse.json({ success: false, message: error.message || 'Failed to fetch users' }, { status: 500 });
    }

    // Transform user data to match our format
    const transformedUsers = users.users.map((user: any) => ({
      id: user.id,
      email: user.email,
      name: user.user_metadata?.name || user.email,
      role: user.user_metadata?.role || 'user',
      created_at: user.created_at,
      last_sign_in_at: user.last_sign_in_at,
      email_confirmed_at: user.email_confirmed_at,
    }));

    return NextResponse.json({
      success: true,
      count: users.total,
      data: transformedUsers,
    });
  } catch (error) {
    console.error('Error fetching admin users:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
