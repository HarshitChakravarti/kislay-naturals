import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { verifyPaymentSignature } from '@/lib/razorpay';
import { processOrderNotifications } from '@/lib/orderNotifications';
import { sendMetaEvent, extractFbCookies } from '@/lib/meta-conversions';

export const dynamic = 'force-dynamic';

export async function PUT(request: NextRequest) {
  const supabase = await createClient();
  try {
    const { orderId, paymentDetails } = await request.json();

    if (!orderId || !paymentDetails) {
      return NextResponse.json({ success: false, message: 'Order ID and payment details are required' }, { status: 400 });
    }

    // Verify Razorpay signature
    const isValidSignature = verifyPaymentSignature({
      razorpay_order_id: paymentDetails.razorpay_order_id,
      razorpay_payment_id: paymentDetails.razorpay_payment_id,
      razorpay_signature: paymentDetails.razorpay_signature,
      secret: process.env.RAZORPAY_KEY_SECRET || ''
    });

    if (!isValidSignature) {
      return NextResponse.json({ success: false, message: 'Invalid payment signature' }, { status: 400 });
    }

    // Get order details from Razorpay
    const rpOrder = await fetch(`https://api.razorpay.com/v1/orders/${paymentDetails.razorpay_order_id}`, {
      headers: {
        'Authorization': `Basic ${Buffer.from(`${process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString('base64')}`
      }
    }).then(res => res.json());

    if (!rpOrder || rpOrder.error) {
      return NextResponse.json({ success: false, message: 'Failed to verify payment with Razorpay' }, { status: 400 });
    }

    // Get internal order details
    const { data: internalOrder } = await supabase
      .from('orders')
      .select('id, total_amount, order_status, status')
      .eq('id', orderId)
      .single();

    if (!internalOrder) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    const expectedAmountPaise = Math.round((internalOrder.total_amount as number) * 100);
    if (rpOrder.currency !== 'INR' || rpOrder.amount !== expectedAmountPaise) {
      console.warn('❌ Amount/currency mismatch', { rpAmount: rpOrder.amount, rpCurrency: rpOrder.currency, expectedAmountPaise });
      return NextResponse.json({ success: false, message: 'Amount or currency mismatch' }, { status: 400 });
    }

    // Update order with payment details
    const updateData = {
      razorpay_payment_id: paymentDetails.razorpay_payment_id,
      razorpay_order_id: paymentDetails.razorpay_order_id,
      razorpay_signature: paymentDetails.razorpay_signature,
      status: 'paid' as const,
      order_status: 'paid' as const,
      paid_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log('💾 Attempting to update order:', orderId, {
      hasPaymentId: Boolean(updateData.razorpay_payment_id),
      hasOrderId: Boolean(updateData.razorpay_order_id)
    });

    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId)
      .select('id, order_number, order_status, total_amount, user_name, user_email, user_mobile, product_name, unit_price, quantity, shipping_street, shipping_city, shipping_state, shipping_zip, created_at')
      .single();

    if (error) {
      console.error('❌ Supabase update error:', error);
      throw error;
    }

    console.log('✅ Order updated successfully:', data);

    // ── Meta Conversions API — Purchase event (server-side, most authoritative) ──
    try {
      const cookieHeader = request.headers.get('cookie');
      const { fbp, fbc } = extractFbCookies(cookieHeader);
      const clientIp =
        request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        request.headers.get('x-real-ip') ||
        undefined;
      const userAgent = request.headers.get('user-agent') || undefined;

      await sendMetaEvent({
        eventName: 'Purchase',
        eventSourceUrl: request.headers.get('referer') || `https://kislaynaturals.com/order-success?orderId=${data.id}`,
        actionSource: 'website',
        orderId: data.id,
        value: data.total_amount as number,
        currency: 'INR',
        contentName: data.product_name || undefined,
        contentIds: data.product_name ? [data.product_name] : undefined,
        contentType: 'product',
        contents: data.product_name ? [{
          id: data.product_name,
          quantity: (data.quantity as number) || 1,
          item_price: (data.unit_price as number) || (data.total_amount as number),
        }] : undefined,
        customer: {
          email: data.user_email || undefined,
          phone: data.user_mobile || undefined,
          firstName: data.user_name?.split(' ')[0] || undefined,
          lastName: data.user_name?.split(' ').slice(1).join(' ') || undefined,
          city: data.shipping_city || undefined,
          state: data.shipping_state || undefined,
          zip: data.shipping_zip || undefined,
          externalId: data.id,
          clientIpAddress: clientIp,
          clientUserAgent: userAgent,
          fbp,
          fbc,
        },
      });
    } catch (metaErr) {
      // Non-fatal — log but don't block the response
      console.error('⚠️ Meta CAPI Purchase event failed (non-fatal):', metaErr);
    }
    // ────────────────────────────────────────────────────────────────────────

    // Trigger notifications directly without an HTTP self-call
    console.log('📧 Triggering notifications for order:', data.id);
    
    try {
      const result = await processOrderNotifications(data.id);
      console.log('✅ Notifications triggered successfully:', result);
    } catch (error) {
      console.error('❌ Failed to trigger background notifications:', error);
      // Log to database for monitoring
      try {
        await supabaseAdmin
          .from('orders')
          .update({
            email_error: 'Notification trigger failed',
            whatsapp_error: 'Notification trigger failed',
          })
          .eq('id', data.id);
      } catch (logError) {
        console.error('❌ Failed to log notification error:', logError);
      }
    }

    // Return immediately without waiting for notifications
    return NextResponse.json({
      success: true,
      message: 'Payment updated successfully',
      order: {
        id: data.id,
        order_number: data.order_number,
        status: data.order_status,
        total_amount: data.total_amount
      }
    }, { status: 200 });

  } catch (error) {
    console.error('❌ Failed to update order payment:', error);
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    });
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, message: 'Failed to update order payment.', error: errorMessage }, { status: 500 });
  }
}