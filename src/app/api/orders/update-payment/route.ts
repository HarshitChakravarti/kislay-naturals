import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyPaymentSignature } from '@/lib/razorpay';

export const dynamic = 'force-dynamic';

export async function PUT(request: NextRequest) {
  try {
    const { orderId, paymentDetails } = await request.json();

    if (!orderId || !paymentDetails) {
      return NextResponse.json({ success: false, message: 'Order ID and payment details are required' }, { status: 400 });
    }

    // Verify Razorpay signature
    const isValidSignature = verifyPaymentSignature({
      razorpay_order_id: paymentDetails.razorpay_order_id,
      razorpay_payment_id: paymentDetails.razorpay_payment_id,
      razorpay_signature: paymentDetails.razorpay_signature,
      secret: process.env.RAZORPAY_KEY_SECRET || ''
    });

    if (!isValidSignature) {
      return NextResponse.json({ success: false, message: 'Invalid payment signature' }, { status: 400 });
    }

    // Get order details from Razorpay
    const rpOrder = await fetch(`https://api.razorpay.com/v1/orders/${paymentDetails.razorpay_order_id}`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64')}`
      }
    }).then(res => res.json());

    if (!rpOrder || rpOrder.error) {
      return NextResponse.json({ success: false, message: 'Failed to verify payment with Razorpay' }, { status: 400 });
    }

    // Get internal order details
    const { data: internalOrder } = await supabase
      .from('orders')
      .select('id, total_price, order_status, status')
      .eq('id', orderId)
      .single();

    if (!internalOrder) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    const expectedAmountPaise = Math.round((internalOrder.total_price as number) * 100);
    if (rpOrder.currency !== 'INR' || rpOrder.amount !== expectedAmountPaise) {
      console.warn('❌ Amount/currency mismatch', { rpAmount: rpOrder.amount, rpCurrency: rpOrder.currency, expectedAmountPaise });
      return NextResponse.json({ success: false, message: 'Amount or currency mismatch' }, { status: 400 });
    }

    // Update order with payment details
    const updateData = {
      razorpay_payment_id: paymentDetails.razorpay_payment_id,
      razorpay_order_id: paymentDetails.razorpay_order_id,
      razorpay_signature: paymentDetails.razorpay_signature,
      status: 'paid' as const,
      order_status: 'paid' as const,
      paid_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log('💾 Attempting to update order:', orderId, {
      hasPaymentId: Boolean(updateData.razorpay_payment_id),
      hasOrderId: Boolean(updateData.razorpay_order_id)
    });

    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId)
      .select('id, order_number, order_status, total_price, user_name, user_email, user_mobile, product_name, unit_price, quantity, shipping_street, shipping_city, shipping_state, shipping_zip, created_at')
      .single();

    if (error) {
      console.error('❌ Supabase update error:', error);
      throw error;
    }

    console.log('✅ Order updated successfully:', data);

    // Trigger background notification processing (non-blocking)
    fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/orders/process-notifications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderId: data.id }),
    }).catch(error => {
      console.error('Failed to trigger background notifications:', error);
    });

    // Return immediately without waiting for notifications
    return NextResponse.json({
      success: true,
      message: 'Payment updated successfully',
      order: {
        id: data.id,
        order_number: data.order_number,
        status: data.order_status,
        total_price: data.total_price
      }
    }, { status: 200 });

  } catch (error) {
    console.error('❌ Failed to update order payment:', error);
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    });
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, message: 'Failed to update order payment.', error: errorMessage }, { status: 500 });
  }
}