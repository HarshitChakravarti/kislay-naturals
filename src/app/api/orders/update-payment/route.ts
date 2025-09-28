import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendOrderConfirmationNotifications } from '@/lib/notifications';

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function PUT(request: NextRequest) {
  try {
    console.log('📥 Update order payment endpoint called');
    
    const body = await request.json();
    console.log('📦 Request body received:', JSON.stringify(body, null, 2));

    const { orderId, paymentDetails } = body;

    if (!orderId || !paymentDetails) {
      console.log('❌ Invalid payload - missing orderId or paymentDetails');
      return NextResponse.json({ success: false, message: 'Invalid payload.' }, { status: 400 });
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

    console.log('💾 Attempting to update order:', orderId, updateData);

    const { data, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId)
      .select('id, order_status, total_price, user_name, user_email, user_mobile, product_name, unit_price, quantity, shipping_street, shipping_city, shipping_state, shipping_zip, created_at')
      .single();

    if (error) {
      console.error('❌ Supabase update error:', error);
      throw error;
    }

    console.log('✅ Order updated successfully:', data);

    // Send order confirmation notifications (email and WhatsApp)
    let notificationResults = null;
    try {
      const notificationData = {
        customerName: data.user_name,
        customerEmail: data.user_email,
        customerPhone: data.user_mobile,
        orderId: data.id.toString(),
        productName: data.product_name,
        quantity: data.quantity,
        unitPrice: data.unit_price,
        totalAmount: data.total_price,
        orderDate: new Date(data.created_at).toLocaleDateString('en-IN', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        shippingAddress: {
          street: data.shipping_street,
          city: data.shipping_city,
          state: data.shipping_state,
          zip: data.shipping_zip
        }
      };

      console.log('📧💬 Sending order confirmation notifications...');
      const notificationResult = await sendOrderConfirmationNotifications(notificationData);
      notificationResults = notificationResult;
      
      if (notificationResult.success) {
        console.log('✅ Order confirmation notifications sent successfully');
      } else {
        console.warn('⚠️ Some notifications may have failed, but order was updated successfully');
      }
    } catch (notificationError) {
      console.error('❌ Error sending notifications:', notificationError);
      notificationResults = {
        success: false,
        results: {
          email: { success: false, error: 'Notification service error', errorType: 'network_error', shouldRetry: true },
          whatsapp: { success: false, error: 'Notification service error', whatsappLink: null, messageId: null }
        }
      };
    }

    // Update order with notification status
    if (notificationResults) {
      try {
        const notificationUpdateData = {
          email_sent: notificationResults.results.email.success,
          email_error: notificationResults.results.email.error,
          email_error_type: notificationResults.results.email.errorType,
          email_should_retry: notificationResults.results.email.shouldRetry,
          whatsapp_sent: notificationResults.results.whatsapp.success,
          whatsapp_error: notificationResults.results.whatsapp.error,
          whatsapp_link: notificationResults.results.whatsapp.whatsappLink,
          whatsapp_message_id: notificationResults.results.whatsapp.messageId,
          notification_sent_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        console.log('💾 Updating order with notification status:', notificationUpdateData);

        const { error: notificationUpdateError } = await supabase
          .from('orders')
          .update(notificationUpdateData)
          .eq('id', orderId);

        if (notificationUpdateError) {
          console.error('❌ Failed to update notification status:', notificationUpdateError);
        } else {
          console.log('✅ Notification status updated successfully');
        }
      } catch (updateError) {
        console.error('❌ Error updating notification status:', updateError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Order payment updated successfully.',
      order: data,
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
