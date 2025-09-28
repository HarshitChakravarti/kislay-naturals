import { NextRequest, NextResponse } from 'next/server';
import { sendOrderConfirmationNotifications } from '@/lib/notifications';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('🧪 Test notifications endpoint called');
    
    const body = await request.json();
    console.log('📦 Request body received:', JSON.stringify(body, null, 2));

    const { 
      customerName, 
      customerEmail, 
      customerPhone, 
      orderId, 
      productName, 
      quantity, 
      unitPrice, 
      totalAmount,
      shippingAddress 
    } = body;

    if (!customerName || !customerEmail || !customerPhone || !orderId || !productName) {
      return NextResponse.json({ 
        success: false, 
        message: 'Missing required fields: customerName, customerEmail, customerPhone, orderId, productName' 
      }, { status: 400 });
    }

    const notificationData = {
      customerName,
      customerEmail,
      customerPhone,
      orderId: orderId.toString(),
      productName,
      quantity: quantity || 1,
      unitPrice: unitPrice || 100,
      totalAmount: totalAmount || 100,
      orderDate: new Date().toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      shippingAddress: shippingAddress || {
        street: '123 Test Street',
        city: 'Test City',
        state: 'Test State',
        zip: '123456'
      }
    };

    console.log('📧📱 Sending test notifications...');
    const result = await sendOrderConfirmationNotifications(notificationData);
    
    return NextResponse.json({
      success: result.success,
      message: 'Test notifications sent',
      results: result.results
    }, { status: 200 });

  } catch (error) {
    console.error('❌ Failed to send test notifications:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to send test notifications', 
      error: errorMessage 
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Test notifications endpoint',
    usage: 'POST with customerName, customerEmail, customerPhone, orderId, productName',
    example: {
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      customerPhone: '9876543210',
      orderId: 'TEST-123',
      productName: 'Test Product',
      quantity: 1,
      unitPrice: 100,
      totalAmount: 100,
      shippingAddress: {
        street: '123 Test Street',
        city: 'Test City',
        state: 'Test State',
        zip: '123456'
      }
    }
  });
}

