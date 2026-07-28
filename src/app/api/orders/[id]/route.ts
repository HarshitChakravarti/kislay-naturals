import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { authenticateUser } from '@/lib/middleware/auth';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  try {
    const user = await authenticateUser(request);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Check if order exists and get current data
    const { data: existingOrder, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    // Ownership check unless admin
    const isAdmin = user.role === 'admin';
    if (!isAdmin && `${existingOrder.user_id}` !== `${user.id}`) {
      return NextResponse.json({ success: false, message: 'Not authorized to update this order' }, { status: 403 });
    }

    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid JSON body' }, { status: 400 });
    }

    // Only allow certain fields to be updated
    const allowedFields = ['order_status', 'shipping_info', 'notes'];
    const updateData: any = {};
    
    allowedFields.forEach(field => {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    });

    // If no valid fields to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ success: false, message: 'No valid fields to update' }, { status: 400 });
    }

    // Add updated_at timestamp
    updateData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, message: error.message || 'Failed to update order' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully',
      data,
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient();
  try {
    const user = await authenticateUser(request);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Check if order exists and get current data
    const { data: existingOrder, error: fetchError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchError) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    // Ownership check unless admin
    const isAdmin = user.role === 'admin';
    if (!isAdmin && `${existingOrder.user_id}` !== `${user.id}`) {
      return NextResponse.json({ success: false, message: 'Not authorized to delete this order' }, { status: 403 });
    }

    // Only allow cancellation of orders that are not yet shipped or delivered
    const cancellableStatuses = ['created', 'paid', 'processing'];
    if (!cancellableStatuses.includes(existingOrder.order_status?.toLowerCase())) {
      return NextResponse.json({ 
        success: false, 
        message: 'Order cannot be cancelled as it has already been shipped or delivered' 
      }, { status: 400 });
    }

    // Update order status to cancelled instead of deleting
    const { data, error } = await supabase
      .from('orders')
      .update({ 
        order_status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ success: false, message: error.message || 'Failed to cancel order' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Order cancelled successfully',
      data,
    }, { status: 200 });
  } catch (error) {
    console.error('Error cancelling order:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
