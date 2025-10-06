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

    console.log('🔄 Retrying notifications for order:', orderId);

    // Get order details
    const { data: order, error: orderError } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    // Check if order is paid
    if (order.status !== 'paid' && order.order_status !== 'paid') {
      return NextResponse.json({ 
        success: false, 
        message: 'Order is not paid yet' 
      }, { status: 400 });
    }

    // Process notifications
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
        unitPrice: order.unit_price || order.total_price,
        totalAmount: order.total_price,
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

      if (emailResult.success) {
        console.log('✅ Email notification sent successfully');
      } else {
        console.error('❌ Email notification failed:', emailResult.error);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ Email notification error:', errorMessage);
      notificationResults.email = { 
        success: false, 
        error: errorMessage, 
        errorType: 'network_error',
        shouldRetry: true
      };
    }

    // Send WhatsApp notification
    try {
      const whatsappResult = await sendOrderConfirmationWhatsApp({
        customerName: order.user_name,
        customerPhone: order.user_mobile,
        orderId: order.id,
        productName: order.product_name,
        totalAmount: order.total_price,
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

      if (whatsappResult.success) {
        console.log('✅ WhatsApp notification sent successfully');
      } else {
        console.error('❌ WhatsApp notification failed:', whatsappResult.error);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('❌ WhatsApp notification error:', errorMessage);
      notificationResults.whatsapp = { 
        success: false, 
        error: errorMessage, 
        whatsappLink: null, 
        messageId: null 
      };
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

    console.log('🔄 Notification retry completed for order:', orderId, notificationResults);

    return NextResponse.json({
      success: true,
      message: 'Notifications retried successfully',
      results: notificationResults
    });

  } catch (error) {
    console.error('❌ Error retrying notifications:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
