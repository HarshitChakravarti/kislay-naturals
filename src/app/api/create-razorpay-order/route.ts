import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { rateLimit } from '@/lib/middleware/rateLimit';

export async function POST(request: NextRequest) {
  try {
    const rl = rateLimit(request, 10, 60 * 1000);
    if (!rl.success) {
      return NextResponse.json({ error: rl.message }, { status: 429, headers: { 'Retry-After': rl.retryAfter?.toString() || '60' } });
    }

    const { amount, currency } = await request.json();

    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const cur = (currency || 'INR').toUpperCase();
    if (!['INR'].includes(cur)) {
      return NextResponse.json({ error: 'Unsupported currency' }, { status: 400 });
    }

    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_id || !key_secret) {
      return NextResponse.json({ error: 'Razorpay is not configured' }, { status: 500 });
    }

    const razorpay = new Razorpay({ key_id, key_secret });

    const options = {
      amount: Math.round(amount * 100),
      currency: cur,
      receipt: `receipt_order_${Date.now()}`,
    } as const;

    const order = await razorpay.orders.create(options as any);
    return NextResponse.json(order);
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json({ error: 'Failed to create Razorpay order' }, { status: 500 });
  }
}
