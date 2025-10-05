import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { orderId, failureCode, failureMessage, failureReason } = await request.json();

    if (!orderId) {
      return NextResponse.json({
        success: false,
        message: 'Order ID is required'
      }, { status: 400 });
    }

    // Update the order with failure details
    const { error } = await supabaseAdmin
      .from('orders')
      .update({
        status: 'failed',
        order_status: 'failed',
        last_failure_code: failureCode || 'CLIENT_SIDE_FAILURE',
        last_failure_message: failureMessage || 'Payment failed on client side',
        updated_at: new Date().toISOString()
      })
      .eq('id', orderId)
      .eq('status', 'created'); // Only update if still in created status

    if (error) {
      console.error('Error recording payment failure:', error);
      return NextResponse.json({
        success: false,
        message: 'Failed to record payment failure',
        error: error.message
      }, { status: 500 });
    }

    console.log(`Payment failure recorded for order ${orderId}:`, {
      code: failureCode,
      reason: failureReason,
      message: failureMessage
    });

    return NextResponse.json({
      success: true,
      message: 'Payment failure recorded successfully'
    });

  } catch (error) {
    console.error('Error in record-failure endpoint:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
