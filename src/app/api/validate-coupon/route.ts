import { NextRequest, NextResponse } from 'next/server';
import { validateCouponData } from '@/lib/coupon';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { couponCode, productId, variantSize, quantity, cartItems } = body;

    const result = await validateCouponData(couponCode, productId, variantSize, quantity, cartItems);

    if (!result.valid) {
      return NextResponse.json(result, { status: result.message === 'Coupon code is required' ? 400 : 200 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error validating coupon:', error);
    return NextResponse.json({ valid: false, message: 'Internal server error' }, { status: 500 });
  }
}
