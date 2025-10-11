import { supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/middleware/auth';
import type { OrderDetails } from '@/types';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log(' Create order endpoint called');
    
    const body: OrderDetails = await request.json();
    console.log(' Request body received:', JSON.stringify(body, null, 2));

    if (!body || !body.user || !body.product || !body.quantity || !body.totalAmount || !body.shippingAddress) {
      console.log(' Invalid payload - missing required fields');
      return NextResponse.json({ success: false, message: 'Invalid order payload.' }, { status: 400 });
    }

    // Try to get authenticated user
    let authenticatedUser: { id: string; email: string | undefined; role: any } | null = null;
    try {
      authenticatedUser = await authenticateUser(request);
    } catch (error) {
      console.log(' No authenticated user, creating guest order');
    }

    const payload = body;

    // Calculate pricing - only product price, no tax or shipping
    const itemsPrice = payload.product.price * payload.quantity;
    const totalPrice = itemsPrice; // Only product price

    // Normalize key fields for easier querying; also store full payload
    const insertRow = {
      user_id: authenticatedUser?.id || null, // Set user_id if authenticated
      user_name: payload.user.name,
      user_email: payload.user.email,
      user_mobile: payload.user.mobile,
      product_id: payload.product.id,
      product_name: payload.product.name,
      unit_price: payload.product.price,
      quantity: payload.quantity,
      total_amount: totalPrice,
      total_price: totalPrice, // Add the missing total_price field that the database expects
      items_price: itemsPrice,
      tax_price: 0, // No tax
      shipping_price: 0, // No shipping
      shipping_street: payload.shippingAddress.street,
      shipping_city: payload.shippingAddress.city,
      shipping_state: payload.shippingAddress.state,
      shipping_zip: payload.shippingAddress.zip,
      status: 'created' as const,
      order_status: 'created' as const,
      payload, // store full JSON for flexibility
    };

    console.log(' Attempting to insert order:', JSON.stringify(insertRow, null, 2));

    // Insert into orders table
    const { data: orderData, error: orderError } = await supabaseAdmin
      .from('orders')
      .insert([insertRow])
      .select('id, total_amount, order_status')
      .single();

    if (orderError) {
      console.error('Supabase order insert error:', JSON.stringify(orderError, null, 2));
      throw orderError;
    }

    console.log(' Order created successfully:', orderData);

    // Insert into order_items table
    const itemTotalPrice = payload.product.price * payload.quantity;
    
    const orderItem = {
      order_id: orderData.id,
      product_id: payload.product.id,
      name: payload.product.name,
      image: payload.product.image || null,
      price: payload.product.price,
      quantity: payload.quantity,
      description: payload.product.description || null,
      category: payload.product.category || null,
      sku: payload.product.sku || null,
      total_amount: itemTotalPrice,
      discount_amount: 0, // No discount for now
      tax_rate: 0, // No tax
      tax_amount: 0, // No tax
    };

    console.log(' Attempting to insert order item:', JSON.stringify(orderItem, null, 2));

    const { data: itemData, error: itemError } = await supabaseAdmin
      .from('order_items')
      .insert([orderItem])
      .select('id')
      .single();

    if (itemError) {
      console.error(' Supabase order item insert error:', itemError);
      // Note: We don't throw here to avoid breaking the order creation
      // The order is already created, we just log the item error
      console.warn(' Order created but item details not saved:', itemError);
    } else {
      console.log(' Order item created successfully:', itemData);
    }

    return NextResponse.json({
      success: true,
      message: 'Order created successfully.',
      order: {
        id: orderData.id,
        total_amount: orderData.total_amount,
        order_status: orderData.order_status
      },
    }, { status: 201 });

  } catch (error) {
    console.error(' Failed to create order:', error);
    console.error(' Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    });
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, message: 'Failed to create order.', error: errorMessage }, { status: 500 });
  }
}