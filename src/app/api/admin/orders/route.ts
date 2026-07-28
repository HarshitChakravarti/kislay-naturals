import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { withAdminAuth, AdminRequest } from '@/lib/middleware/admin';

export const dynamic = 'force-dynamic';

export const GET = withAdminAuth(async (request: AdminRequest) => {
  try {
    console.log('Admin orders API called by user:', request.user);
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const status = searchParams.get('status');
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit - 1;

    // Build query for orders only (without join to avoid relationship issues)
    let query = supabaseAdmin
      .from('orders')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false });

    // Filter by status if provided
    if (status) {
      query = query.eq('order_status', status);
    }

    // Pagination
    query = query.range(startIndex, endIndex);

    const { data: orders, count, error } = await query;

    if (error) {
      console.error('Error fetching orders:', error);
      return NextResponse.json({ 
        success: false, 
        message: error.message || 'Failed to fetch orders',
        error: error
      }, { status: 500 });
    }

    console.log('Orders fetched successfully:', { count: orders?.length, total: count });

    // Fetch user profiles for the orders if needed
    let ordersWithProfiles = orders || [];
    if (orders && orders.length > 0) {
      const userIds = Array.from(new Set(orders.map(order => order.user_id).filter(Boolean)));
      if (userIds.length > 0) {
        const { data: profiles } = await supabaseAdmin
          .from('user_profiles')
          .select('id, username, full_name, phone')
          .in('id', userIds);
        
        // Map profiles to orders
        ordersWithProfiles = orders.map(order => ({
          ...order,
          user_profiles: profiles?.find(profile => profile.id === order.user_id) || null,
          offer_availed: false
        }));
      }
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
      count: ordersWithProfiles?.length || 0,
      total: count || 0,
      pagination,
      data: ordersWithProfiles || [],
    });
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
});
