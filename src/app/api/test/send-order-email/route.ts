import { NextRequest, NextResponse } from 'next/server';
import { sendOrderConfirmationEmail } from '../../../../lib/email';

// Dev-only test endpoint to trigger an order confirmation email via Resend
export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({
      success: false,
      message: 'Test endpoints are disabled in production'
    }, { status: 403 });
  }

  try {
    const body = await request.json().catch(() => ({}));
    const to: string | undefined = body?.to || process.env.DEV_TEST_EMAIL;

    if (!to) {
      return NextResponse.json({
        success: false,
        message: 'Recipient email is required. Provide in body { to: string } or set DEV_TEST_EMAIL.'
      }, { status: 400 });
    }

    const now = new Date();
    const result = await sendOrderConfirmationEmail({
      customerName: 'Kislay Test User',
      customerEmail: to,
      orderId: `TEST-${now.getTime()}`,
      orderNumber: `KN-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${now.getTime()}`,
      productName: 'Monk Fruit Sweetener (Test)',
      quantity: 1,
      unitPrice: 299,
      totalAmount: 299,
      orderDate: now.toISOString(),
      shippingAddress: {
        street: '123 Test Street',
        city: 'Jaipur',
        state: 'RJ',
        zip: '302001'
      }
    });

    if (!result.success) {
      return NextResponse.json({
        success: false,
        message: 'Failed to send email',
        error: result.error,
        errorType: result.errorType,
        shouldRetry: result.shouldRetry
      }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Email sent', data: result.data });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Unexpected error while sending test email',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}


