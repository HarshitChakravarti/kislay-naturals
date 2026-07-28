import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json({ 
        success: false, 
        message: 'Order ID is required' 
      }, { status: 400 });
    }
    console.log('📥 Fetching notification status for order:', orderId);

    // Fetch order with notification status and minimal delivery details
    const { data: order, error } = await supabase
      .from('orders')
      .select(`
        id,
        order_number,
        email_sent,
        email_error,
        email_error_type,
        email_should_retry,
        whatsapp_sent,
        whatsapp_error,
        whatsapp_link,
        whatsapp_message_id,
        notification_sent_at,
        user_email,
        user_mobile,
        user_name,
        shipping_street,
        shipping_city,
        shipping_state,
        shipping_zip,
        paid_at,
        created_at
      `)
      .eq('id', orderId)
      .single();

    if (error) {
      console.error('❌ Error fetching order notification status:', error);
      return NextResponse.json({ 
        success: false, 
        message: 'Order not found' 
      }, { status: 404 });
    }

    if (!order) {
      return NextResponse.json({ 
        success: false, 
        message: 'Order not found' 
      }, { status: 404 });
    }

    console.log('✅ Order notification status fetched:', order);

    // Format the response
    const notificationStatus = {
      orderId: order.id,
      orderNumber: order.order_number || null,
      email: {
        sent: order.email_sent || false,
        error: order.email_error || null,
        errorType: order.email_error_type || null,
        shouldRetry: order.email_should_retry || false,
        address: order.user_email
      },
      whatsapp: {
        sent: order.whatsapp_sent || false,
        error: order.whatsapp_error || null,
        link: order.whatsapp_link || null,
        messageId: order.whatsapp_message_id || null,
        phone: order.user_mobile
      },
      sentAt: order.notification_sent_at || null,
      userName: order.user_name || null,
      shippingAddress: {
        street: order.shipping_street || null,
        city: order.shipping_city || null,
        state: order.shipping_state || null,
        zip: order.shipping_zip || null,
      },
      paidAt: order.paid_at || null,
      createdAt: order.created_at || null
    };

    return NextResponse.json({
      success: true,
      data: notificationStatus
    }, { status: 200 });

  } catch (error) {
    console.error('❌ Failed to fetch notification status:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ 
      success: false, 
      message: 'Failed to fetch notification status', 
      error: errorMessage 
    }, { status: 500 });
  }
}
