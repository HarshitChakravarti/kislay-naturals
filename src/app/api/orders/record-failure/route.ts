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

    // First, get order details to include user information
    const { data: orderData, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('user_name, user_email, user_mobile, total_amount')
      .eq('id', orderId)
      .single();

    if (orderError) {
      console.error('Error fetching order details:', orderError);
      return NextResponse.json({
        success: false,
        message: 'Failed to fetch order details',
        error: orderError.message
      }, { status: 500 });
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

    // Record the payment issue in the recent_payment_issues table
    const { error: issueError } = await supabaseAdmin
      .from('recent_payment_issues')
      .insert({
        order_id: orderId,
        user_name: orderData.user_name,
        user_email: orderData.user_email,
        user_mobile: orderData.user_mobile,
        failure_code: failureCode || 'CLIENT_SIDE_FAILURE',
        failure_message: failureMessage || 'Payment failed on client side',
        failure_reason: failureReason || 'client_side_failure',
        error_type: 'client_side',
        payment_gateway: 'razorpay',
        amount: orderData.total_amount,
        currency: 'INR'
      });

    if (issueError) {
      console.error('Error recording payment issue:', issueError);
      // Don't fail the entire request if issue recording fails
    }

    console.log(`Payment failure recorded for order ${orderId}:`, {
      code: failureCode,
      reason: failureReason,
      message: failureMessage,
      user_name: orderData.user_name
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
