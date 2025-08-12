import { NextRequest, NextResponse } from 'next/server';
import { demoOrders, Order } from '../store';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const orders = demoOrders;
    const order = orders.find((o) => o.id === id);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ order }, { status: 200 });
  } catch (error) {
    console.error('Error fetching order by id:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
