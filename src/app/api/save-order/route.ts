import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { OrderDetails } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: OrderDetails = await request.json();

    if (!body || !body.user || !body.product || !body.quantity || !body.totalAmount || !body.shippingAddress || !body.paymentDetails) {
      return NextResponse.json({ success: false, message: 'Invalid order payload.' }, { status: 400 });
    }

    const payload = body;

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

    const { data, error } = await supabase
      .from('orders')
      .insert([insertRow])
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      message: 'Order saved successfully.',
      order: data,
    }, { status: 201 });

  } catch (error) {
    console.error('Failed to save order:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, message: 'Failed to save order.', error: errorMessage }, { status: 500 });
  }
}
