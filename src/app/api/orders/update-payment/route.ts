import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function PUT(request: NextRequest) {
  try {
    console.log('📥 Update order payment endpoint called');
    
    const body = await request.json();
    console.log('📦 Request body received:', JSON.stringify(body, null, 2));

    const { orderId, paymentDetails } = body;

    if (!orderId || !paymentDetails) {
      console.log('❌ Invalid payload - missing orderId or paymentDetails');
      return NextResponse.json({ success: false, message: 'Invalid payload.' }, { status: 400 });
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

    console.log('💾 Attempting to update order:', orderId, updateData);

    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId)
      .select('id, order_status, total_price')
      .single();

    if (error) {
      console.error('❌ Supabase update error:', error);
      throw error;
    }

    console.log('✅ Order updated successfully:', data);

    return NextResponse.json({
      success: true,
      message: 'Order payment updated successfully.',
      order: data,
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
