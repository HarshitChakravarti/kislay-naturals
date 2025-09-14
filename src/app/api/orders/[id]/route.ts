import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { authenticateUser } from '@/lib/middleware/auth';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await authenticateUser(request);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return NextResponse.json({ success: false, message: error.message || 'Order not found' }, { status: 404 });
    }

    // Ownership check unless admin
    const isAdmin = user.role === 'admin';
    if (!isAdmin && `${order.user_id}` !== `${user.id}`) {
      return NextResponse.json({ success: false, message: 'Not authorized to access this order' }, { status: 403 });
    }

    // Try to fetch order items if table exists
    let items: any[] = [];
    const { data: orderItems, error: itemsErr } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', id);
    if (!itemsErr && orderItems) items = orderItems;

    return NextResponse.json({ success: true, data: { ...order, items } }, { status: 200 });
  } catch (error) {
    console.error('Error fetching order by id:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
