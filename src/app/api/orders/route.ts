import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { authenticateUser } from '@/lib/middleware/auth';
import type { OrderItem } from '@/types';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const user = await authenticateUser(request);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ success: false, message: error.message || 'Failed to fetch orders' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      count: data?.length || 0,
      data: data || [],
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await authenticateUser(request);
    if (!user) {
      return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    let body: any;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid JSON body' }, { status: 400 });
    }

    const {
      orderItems,
      shippingInfo,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = body;

    if (!orderItems || orderItems.length === 0) {
      return NextResponse.json({ success: false, message: 'No order items' }, { status: 400 });
    }

    // Get product details for all items to ensure correctness and pricing
    const productIds = orderItems.map((i: any) => i.product);
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('id,name,price,images')
      .in('id', productIds);

    if (productsError) {
      return NextResponse.json({ success: false, message: productsError.message || 'Failed to fetch products' }, { status: 500 });
    }

    // Build normalized items from DB data
    const itemsFromDB = orderItems.map((item: any) => {
      const dbProduct = products?.find((p) => `${p.id}` === `${item.product}`);
      if (!dbProduct) {
        throw new Error(`Product not found with id ${item.product}`);
      }
      return {
        name: dbProduct.name,
        quantity: item.quantity,
        image: Array.isArray(dbProduct.images) ? dbProduct.images[0] : dbProduct.images,
        price: dbProduct.price,
        product_id: dbProduct.id,
      };
    });

    const computedItemsPrice = itemsFromDB.reduce((acc: number, it: any) => acc + it.price * it.quantity, 0);
    const finalItemsPrice = typeof itemsPrice === 'number' ? itemsPrice : computedItemsPrice;
    const finalTaxPrice = 0; // No tax
    const finalShippingPrice = 0; // No shipping
    const finalTotalPrice = finalItemsPrice; // Only product price

    // Insert order in orders table
    const orderPayload = {
      user_id: user.id,
      shipping_info: shippingInfo || null,
      payment_info: paymentInfo || null,
      items_price: finalItemsPrice,
      tax_price: finalTaxPrice,
      shipping_price: finalShippingPrice,
      total_amount: finalTotalPrice,
      paid_at: new Date().toISOString(),
      order_status: 'Processing',
      // Optionally store items snapshot as JSON if your schema supports it
      order_items_snapshot: itemsFromDB,
    };

    const { data: orderInsert, error: orderError } = await supabase
      .from('orders')
      .insert([orderPayload])
      .select('id')
      .single();

    if (orderError) {
      return NextResponse.json({ success: false, message: orderError.message || 'Failed to create order' }, { status: 500 });
    }

    const orderId = orderInsert.id;

    // If you have a separate order_items table, insert rows there as well
    if (orderId) {
      const orderItemsRows = itemsFromDB.map((it: any) => ({
        order_id: orderId,
        product_id: it.product_id,
        name: it.name,
        image: it.image,
        price: it.price,
        quantity: it.quantity,
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItemsRows);
      if (itemsError && itemsError.code !== '42P01') {
        // 42P01 = relation does not exist (in case the table isn't present). Ignore if no table.
        return NextResponse.json({ success: false, message: itemsError.message || 'Failed to create order items' }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: true,
      order: { id: orderId, ...orderPayload },
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
