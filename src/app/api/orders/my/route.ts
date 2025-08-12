import { NextRequest, NextResponse } from 'next/server';
import { demoOrders } from '../store';

export async function GET(_request: NextRequest) {
  try {
    const orders = demoOrders;
    return NextResponse.json({ orders }, { status: 200 });
  } catch (error) {
    console.error('Error fetching my orders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
