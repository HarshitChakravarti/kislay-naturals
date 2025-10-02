import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// This endpoint is for testing purposes only - should be removed in production
export async function POST(request: NextRequest) {
  // Only allow in development environment
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ 
      success: false, 
      message: 'Test endpoints not available in production' 
    }, { status: 403 });
  }

  try {
    const { action, orderId, value } = await request.json();

    if (!orderId) {
      return NextResponse.json({
        success: false,
        message: 'Order ID is required'
      }, { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!, 
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    if (action === 'expire_order') {
      // Set expires_at to 1 minute ago
      const pastTime = new Date();
      pastTime.setMinutes(pastTime.getMinutes() - 1);

      const { error } = await supabaseAdmin
        .from('orders')
        .update({
          expires_at: pastTime.toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;

      return NextResponse.json({
        success: true,
        message: `Order ${orderId} expired (set to ${pastTime.toISOString()})`
      });

    } else if (action === 'set_max_attempts') {
      // Set payment_attempts to 5 (max limit)
      const { error } = await supabaseAdmin
        .from('orders')
        .update({
          payment_attempts: 5,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;

      return NextResponse.json({
        success: true,
        message: `Order ${orderId} set to max attempts (5)`
      });

    } else if (action === 'reset_order') {
      // Reset order for fresh testing
      const { error } = await supabaseAdmin
        .from('orders')
        .update({
          payment_attempts: 0,
          expires_at: null,
          status: 'created',
          order_status: 'created',
          last_failure_code: null,
          last_failure_message: null,
          razorpay_order_id: null,
          razorpay_payment_id: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;

      return NextResponse.json({
        success: true,
        message: `Order ${orderId} reset for testing`
      });

    } else if (action === 'get_order_status') {
      // Get current order status for verification
      const { data, error } = await supabaseAdmin
        .from('orders')
        .select('id, status, order_status, payment_attempts, expires_at, last_failure_code, created_at, updated_at')
        .eq('id', orderId)
        .single();

      if (error) throw error;

      return NextResponse.json({
        success: true,
        data: {
          ...data,
          is_expired: data.expires_at ? new Date(data.expires_at) < new Date() : false,
          is_max_attempts: data.payment_attempts >= 5
        }
      });

    } else {
      return NextResponse.json({
        success: false,
        message: 'Invalid action. Use: expire_order, set_max_attempts, reset_order, or get_order_status'
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Test helper error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to execute test action',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
