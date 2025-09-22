import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Testing order_items table...\n');

    // Get the latest order
    const { data: orders, error: ordersError } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);

    if (ordersError) {
      console.error('❌ Error fetching orders:', ordersError);
      return NextResponse.json({ error: 'Failed to fetch orders', details: ordersError }, { status: 500 });
    }

    if (orders.length === 0) {
      return NextResponse.json({ message: 'No orders found' });
    }

    const latestOrder = orders[0];
    console.log('📦 Latest Order:', latestOrder);

    // Get order items for this order
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select('*')
      .eq('order_id', latestOrder.id);

    if (itemsError) {
      console.error('❌ Error fetching order items:', itemsError);
      return NextResponse.json({ error: 'Failed to fetch order items', details: itemsError }, { status: 500 });
    }

    console.log('🛒 Order Items:', orderItems);

    return NextResponse.json({
      success: true,
      order: latestOrder,
      orderItems: orderItems,
      message: `Found ${orderItems.length} order item(s) for order ${latestOrder.id}`
    });

  } catch (error) {
    console.error('❌ Test failed:', error);
    return NextResponse.json({ error: 'Test failed', details: error }, { status: 500 });
  }
}
