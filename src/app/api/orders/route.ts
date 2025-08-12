import { NextRequest, NextResponse } from 'next/server';
import { demoOrders, Order } from './store';

export async function POST(request: NextRequest) {
  const headers = new Headers();
  headers.set('Content-Type', 'application/json');

  try {
    let body: Partial<Order>;
    try {
      body = await request.json();
    } catch {
      return new NextResponse(JSON.stringify({ error: 'Invalid JSON body' }), {
        status: 400,
        headers,
      });
    }

    const order: Order = {
      id: body.id || `o_${Date.now()}`,
      items: Array.isArray(body.items) ? body.items : [],
      total: typeof body.total === 'number' ? body.total : 0,
      user: typeof body.user === 'string' ? body.user : undefined,
      status: (body.status as Order['status']) || 'created',
      createdAt: new Date().toISOString(),
    };

    demoOrders.unshift(order);

    return NextResponse.json({ order }, { status: 201, headers });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
