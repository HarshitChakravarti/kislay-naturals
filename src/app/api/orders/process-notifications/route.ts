import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { sendOrderConfirmationEmail } from '@/lib/email';
import { sendOrderConfirmationWhatsApp } from '@/lib/whatsapp';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json({ success: false, message: 'Order ID is required' }, { status: 400 });
    }

    // Get order details
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    // Process notifications in background
    const notificationResults = {
      email: { success: false, error: null as string | null, errorType: null as string | null, shouldRetry: false },
      whatsapp: { success: false, error: null as string | null, whatsappLink: null as string | null, messageId: null as string | null }
    };

    // Send email notification
    try {
      const emailResult = await sendOrderConfirmationEmail({
        customerName: order.user_name,
        customerEmail: order.user_email,
        orderId: order.id,
        orderNumber: order.order_number || order.id,
        productName: order.product_name,
        quantity: order.quantity || 1,
        unitPrice: order.unit_price || order.total_amount,
        totalAmount: order.total_amount,
        orderDate: new Date(order.created_at).toLocaleDateString('en-IN'),
        shippingAddress: {
          street: order.shipping_street,
          city: order.shipping_city,
          state: order.shipping_state,
          zip: order.shipping_zip
        }
      });

      notificationResults.email = {
        success: emailResult.success,
        error: emailResult.error || null,
        errorType: emailResult.errorType || null,
        shouldRetry: emailResult.shouldRetry || false
      };
    } catch (error) {
      notificationResults.email.error = error instanceof Error ? error.message : 'Unknown error';
    }

    // Send WhatsApp notification
    try {
      const whatsappResult = await sendOrderConfirmationWhatsApp({
        customerName: order.user_name,
        customerPhone: order.user_mobile,
        orderId: order.id,
        productName: order.product_name,
        totalAmount: order.total_amount,
        orderDate: new Date(order.created_at).toLocaleDateString('en-IN'),
        shippingAddress: {
          street: order.shipping_street,
          city: order.shipping_city,
          state: order.shipping_state,
          zip: order.shipping_zip
        }
      });

      notificationResults.whatsapp = {
        success: whatsappResult.success,
        error: whatsappResult.error || null,
        whatsappLink: whatsappResult.whatsappLink || null,
        messageId: whatsappResult.messageId || null
      };
    } catch (error) {
      notificationResults.whatsapp.error = error instanceof Error ? error.message : 'Unknown error';
    }

    // Update order with notification status
    await supabaseAdmin
      .from('orders')
      .update({
        email_sent: notificationResults.email.success,
        email_error: notificationResults.email.error,
        email_error_type: notificationResults.email.errorType,
        email_should_retry: notificationResults.email.shouldRetry,
        whatsapp_sent: notificationResults.whatsapp.success,
        whatsapp_error: notificationResults.whatsapp.error,
        whatsapp_link: notificationResults.whatsapp.whatsappLink,
        whatsapp_message_id: notificationResults.whatsapp.messageId,
        notification_sent_at: new Date().toISOString()
      })
      .eq('id', orderId);

    return NextResponse.json({
      success: true,
      results: notificationResults
    });

  } catch (error) {
    console.error('Error processing notifications:', error);
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
  }
}
