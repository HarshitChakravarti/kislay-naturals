import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { rateLimit } from '@/lib/middleware/rateLimit';
import { createClient } from '@supabase/supabase-js';

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

    // Validate required parameters
    if (!orderId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Order ID is required' 
      }, { status: 400 });
    }

    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ 
        success: false, 
        message: 'Invalid amount' 
      }, { status: 400 });
    }

    // Initialize Supabase client
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!, 
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Check if order exists and get current state
    const { data: existingOrder, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('id, status, order_status, payment_attempts, expires_at, razorpay_order_id, order_number')
      .eq('id', orderId)
      .single();

    if (orderError || !existingOrder) {
      return NextResponse.json({ 
        success: false, 
        message: 'Order not found' 
      }, { status: 404 });
    }

    // Check if order is expired
    if (existingOrder.expires_at && new Date(existingOrder.expires_at) < new Date()) {
      return NextResponse.json({ 
        success: false, 
        message: 'Order has expired. Please create a new order.' 
      }, { status: 410 });
    }

    // Check if order is already paid
    if (existingOrder.status === 'paid' || existingOrder.order_status === 'paid') {
      return NextResponse.json({ 
        success: false, 
        message: 'Order is already paid' 
      }, { status: 400 });
    }

    // Check attempt limits (max 5 attempts)
    if (existingOrder.payment_attempts >= 5) {
      return NextResponse.json({ 
        success: false, 
        message: 'Maximum payment attempts exceeded. Please create a new order.' 
      }, { status: 400 });
    }

    // If we already have a razorpay_order_id, reuse it instead of creating new
    if (existingOrder.razorpay_order_id) {
      // Increment attempts and refresh expiry
      const expiresAt = new Date();
      expiresAt.setMinutes(expiresAt.getMinutes() + 15); // 15 minutes from now

      await supabaseAdmin
        .from('orders')
        .update({ 
          payment_attempts: existingOrder.payment_attempts + 1,
          expires_at: expiresAt.toISOString(),
          updated_at: new Date().toISOString() 
        })
        .eq('id', orderId);

      return NextResponse.json({
        success: true,
        data: { 
          id: existingOrder.razorpay_order_id,
          amount: Math.round(amount),
          currency: (currency || 'INR').toUpperCase()
        }
      });
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
      receipt: String(existingOrder?.order_number || orderId || `receipt_order_${Date.now()}`),
      notes: (orderId || existingOrder?.order_number)
        ? {
            ...(orderId ? { internal_order_id: String(orderId) } : {}),
            ...(existingOrder?.order_number
              ? { order_number: String(existingOrder.order_number) }
              : {}),
          }
        : undefined,
    } as const;

    const razorpayOrder = await razorpay.orders.create(options as any);
    
    // Set expiry time (15 minutes from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);
    
    // Persist linkage immediately with attempt tracking and expiry
    if (orderId) {
      try {
        await supabaseAdmin
          .from('orders')
          .update({ 
            razorpay_order_id: razorpayOrder.id,
            payment_attempts: existingOrder.payment_attempts + 1,
            expires_at: expiresAt.toISOString(),
            updated_at: new Date().toISOString() 
          })
          .eq('id', orderId)
      } catch (e) {
        console.warn('⚠️ Failed to persist razorpay_order_id linkage', { orderId })
      }
    }
    
    return NextResponse.json({
      success: true,
      data: razorpayOrder
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
