import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { OrderDetails } from '@/types';

// Use service role key to bypass RLS for guest orders
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
  try {
    console.log('📥 Save-order endpoint called');
    
    const body: OrderDetails = await request.json();
    console.log('📦 Request body received:', JSON.stringify(body, null, 2));

    if (!body || !body.user || !body.product || !body.quantity || !body.totalAmount || !body.shippingAddress || !body.paymentDetails) {
      console.log('❌ Invalid payload - missing required fields');
      return NextResponse.json({ success: false, message: 'Invalid order payload.' }, { status: 400 });
    }

    const payload = body;

    // Ensure paymentDetails exists after validation
    if (!payload.paymentDetails) {
      console.log('❌ Payment details missing after validation');
      return NextResponse.json({ success: false, message: 'Payment details are required.' }, { status: 400 });
    }

    // Normalize key fields for easier querying; also store full payload
    const insertRow = {
      user_name: payload.user.name,
      user_email: payload.user.email,
      user_mobile: payload.user.mobile,
      product_id: payload.product.id,
      product_name: payload.product.name,
      unit_price: payload.product.price,
      quantity: payload.quantity,
      total_amount: payload.totalAmount,
      shipping_street: payload.shippingAddress.street,
      shipping_city: payload.shippingAddress.city,
      shipping_state: payload.shippingAddress.state,
      shipping_zip: payload.shippingAddress.zip,
      razorpay_payment_id: payload.paymentDetails.razorpay_payment_id,
      razorpay_order_id: payload.paymentDetails.razorpay_order_id,
      razorpay_signature: payload.paymentDetails.razorpay_signature,
      status: 'paid' as const,
      payload, // store full JSON for flexibility
    };

    console.log('💾 Attempting to insert order:', JSON.stringify(insertRow, null, 2));

    const { data, error } = await supabaseAdmin
      .from('orders')
      .insert([insertRow])
      .select('*')
      .single();

    if (error) {
      console.error('❌ Supabase insert error:', error);
      throw error;
    }

    console.log('✅ Order inserted successfully:', data);

    return NextResponse.json({
      success: true,
      message: 'Order saved successfully.',
      order: data,
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Failed to save order:', error);
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    });
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, message: 'Failed to save order.', error: errorMessage }, { status: 500 });
  }
}
