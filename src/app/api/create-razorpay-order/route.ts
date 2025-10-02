import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { rateLimit } from '@/lib/middleware/rateLimit';

export async function POST(request: NextRequest) {
  try {
    const rl = rateLimit(request, 10, 60 * 1000);
    if (!rl.success) {
      return NextResponse.json({ 
        success: false, 
        message: rl.message 
      }, { status: 429, headers: { 'Retry-After': rl.retryAfter?.toString() || '60' } });
    }

    const { amount, currency, orderId } = await request.json();

    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid amount' 
      }, { status: 400 });
    }

    const cur = (currency || 'INR').toUpperCase();
    if (!['INR'].includes(cur)) {
      return NextResponse.json({ 
        success: false, 
        message: 'Unsupported currency' 
      }, { status: 400 });
    }

    const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_id || !key_secret) {
      return NextResponse.json({ 
        success: false, 
        message: 'Razorpay is not configured' 
      }, { status: 500 });
    }

    const razorpay = new Razorpay({ key_id, key_secret });

    const options = {
      amount: Math.round(amount),
      currency: cur,
      receipt: String(orderId || `receipt_order_${Date.now()}`),
      notes: orderId ? { internal_order_id: String(orderId) } : undefined,
    } as const;

    const order = await razorpay.orders.create(options as any);
    // Persist linkage immediately if internal order id provided
    if (orderId) {
      try {
        const { createClient } = await import('@supabase/supabase-js')
        const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
        await supabaseAdmin
          .from('orders')
          .update({ razorpay_order_id: order.id, updated_at: new Date().toISOString() })
          .eq('id', orderId)
      } catch (e) {
        console.warn('⚠️ Failed to persist razorpay_order_id linkage', { orderId })
      }
    }
    return NextResponse.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to create Razorpay order',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
