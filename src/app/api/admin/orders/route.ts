import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
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
    const status = searchParams.get('status');
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit - 1;

    let query = supabase
      .from('orders')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    // Filter by status if provided
    if (status) {
      query = query.eq('order_status', status);
    }

    // Pagination
    query = query.range(startIndex, endIndex);

    const { data, count, error } = await query;

    if (error) {
      return NextResponse.json({ success: false, message: error.message || 'Failed to fetch orders' }, { status: 500 });
    }

    // Build pagination info
    const pagination: any = {};
    if (count != null) {
      if (endIndex + 1 < count) {
        pagination.next = { page: page + 1, limit };
      }
      if (startIndex > 0) {
        pagination.prev = { page: page - 1, limit };
      }
    }

    return NextResponse.json({
      success: true,
      count: data?.length || 0,
      total: count || 0,
      pagination,
      data: data || [],
    });
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
