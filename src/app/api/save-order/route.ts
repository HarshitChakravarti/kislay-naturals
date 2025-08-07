import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { Order } from '@/types';
import { WithId } from 'mongodb';

export async function POST(request: NextRequest) {
  try {
    const orderData: Omit<Order, '_id' | 'createdAt' | 'updatedAt' | 'orderStatus'> = await request.json();

    if (!orderData) {
      return NextResponse.json({ success: false, message: 'Order data is missing.' }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const collection = db.collection<Omit<Order, '_id'>>('orders');

    const newOrder: Omit<Order, '_id'> = {
      ...orderData,
      orderStatus: 'paid',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await collection.insertOne(newOrder);

    const insertedOrder = {
      _id: result.insertedId.toHexString(),
      ...newOrder
    } as WithId<Order>;

    return NextResponse.json({ 
      success: true, 
      message: 'Order saved successfully.',
      order: insertedOrder
    }, { status: 201 });

  } catch (error) {
    console.error('Failed to save order:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, message: 'Failed to save order.', error: errorMessage }, { status: 500 });
  }
}
