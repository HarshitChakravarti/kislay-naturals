import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { withAdminAuthDynamic, AdminRequest } from '@/lib/middleware/admin';

export const dynamic = 'force-dynamic';

export const GET = withAdminAuthDynamic(async (request: AdminRequest, { params }: { params: { id: string } }) => {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ 
        success: false, 
        message: 'Order ID is required' 
      }, { status: 400 });
    }

    // Fetch order first
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', id)
      .single();

    if (orderError) {
      if (orderError.code === 'PGRST116') {
        return NextResponse.json({ 
          success: false, 
          message: 'Order not found' 
        }, { status: 404 });
      }
      return NextResponse.json({ 
        success: false, 
        message: orderError.message || 'Failed to fetch order' 
      }, { status: 500 });
    }

    // Fetch user profile if user_id exists
    let userProfile: any = null;
    if (order.user_id) {
      const { data: profile } = await supabaseAdmin
        .from('user_profiles')
        .select('id, username, full_name, phone')
        .eq('id', order.user_id)
        .single();
      userProfile = profile;
    }

    // Fetch order items with product details
    const { data: orderItems, error: itemsError } = await supabaseAdmin
      .from('order_items')
      .select(`
        *,
        products (
          id,
          name,
          image,
          price
        )
      `)
      .eq('order_id', id);

    let finalOrderItems = orderItems || [];

    // If no order items found in order_items table, check for fallback data in main order
    if (itemsError || !orderItems || orderItems.length === 0) {
      console.log('⚠️ No order items found in order_items table, checking fallback data');
      
      if (order.order_items_snapshot && Array.isArray(order.order_items_snapshot)) {
        console.log('✅ Found fallback order items in main order record');
        finalOrderItems = order.order_items_snapshot.map((item: any, index: number) => ({
          id: `fallback-${index}`,
          order_id: id,
          product_id: item.product_id,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
          description: item.description,
          category: item.category,
          sku: item.sku,
          products: {
            id: item.product_id,
            name: item.name,
            image: item.image,
            price: item.price
          }
        }));
      } else {
        console.log('⚠️ No fallback order items found either');
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        ...order,
        user_profiles: userProfile,
        order_items: finalOrderItems
      }
    });
  } catch (error) {
    console.error('Error fetching admin order details:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
});

export const PUT = withAdminAuthDynamic(async (request: AdminRequest, { params }: { params: { id: string } }) => {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ 
        success: false, 
        message: 'Order ID is required' 
      }, { status: 400 });
    }

    const body = await request.json();
    const { order_status } = body;

    if (!order_status) {
      return NextResponse.json({ 
        success: false, 
        message: 'Order status is required' 
      }, { status: 400 });
    }

    // Validate order status
    const validStatuses = ['created', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(order_status)) {
      return NextResponse.json({ 
        success: false, 
        message: `Invalid order status. Must be one of: ${validStatuses.join(', ')}` 
      }, { status: 400 });
    }

    // Update order status
    const { data: updatedOrder, error: updateError } = await supabaseAdmin
      .from('orders')
      .update({ 
        order_status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('*')
      .single();

    if (updateError) {
      if (updateError.code === 'PGRST116') {
        return NextResponse.json({ 
          success: false, 
          message: 'Order not found' 
        }, { status: 404 });
      }
      return NextResponse.json({ 
        success: false, 
        message: updateError.message || 'Failed to update order' 
      }, { status: 500 });
    }

    // Fetch user profile for the updated order
    let userProfile: any = null;
    if (updatedOrder.user_id) {
      const { data: profile } = await supabaseAdmin
        .from('user_profiles')
        .select('id, username, full_name, phone')
        .eq('id', updatedOrder.user_id)
        .single();
      userProfile = profile;
    }

    return NextResponse.json({
      success: true,
      message: 'Order status updated successfully',
      data: {
        ...updatedOrder,
        user_profiles: userProfile
      }
    });
  } catch (error) {
    console.error('Error updating admin order:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
});

export const DELETE = withAdminAuthDynamic(async (request: AdminRequest, { params }: { params: { id: string } }) => {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json({ 
        success: false, 
        message: 'Order ID is required' 
      }, { status: 400 });
    }

    console.log('🗑️ Attempting to delete order:', id);

    // First, delete order items
    const { error: itemsError } = await supabaseAdmin
      .from('order_items')
      .delete()
      .eq('order_id', id);

    if (itemsError) {
      console.error('❌ Error deleting order items:', itemsError);
      // Continue with order deletion even if items deletion fails
    } else {
      console.log('✅ Order items deleted successfully');
    }

    // Then delete the main order
    const { error: orderError } = await supabaseAdmin
      .from('orders')
      .delete()
      .eq('id', id);

    if (orderError) {
      console.error('❌ Error deleting order:', orderError);
      return NextResponse.json({ 
        success: false, 
        message: orderError.message || 'Failed to delete order' 
      }, { status: 500 });
    }

    console.log('✅ Order deleted successfully:', id);

    return NextResponse.json({ 
      success: true, 
      message: 'Order deleted successfully' 
    });

  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error' 
    }, { status: 500 });
  }
});
