import { sendOrderConfirmationEmail, type OrderConfirmationEmailData, type EmailResult } from './email';
import { sendOrderConfirmationWhatsApp, type OrderConfirmationWhatsAppData } from './whatsapp';

export interface OrderNotificationData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  orderId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  orderDate: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
}

export async function sendOrderConfirmationNotifications(data: OrderNotificationData) {
  console.log('📧📱 Sending order confirmation notifications...', {
    orderId: data.orderId,
    customerEmail: data.customerEmail,
    customerPhone: data.customerPhone
  });

  const results = {
    email: { success: false, error: null as string | null, errorType: null as string | null, shouldRetry: false },
    whatsapp: { success: false, error: null as string | null, whatsappLink: null as string | null, messageId: null as string | null }
  };

  // Send email notification
  try {
    const emailData: OrderConfirmationEmailData = {
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      orderId: data.orderId,
      productName: data.productName,
      quantity: data.quantity,
      unitPrice: data.unitPrice,
      totalAmount: data.totalAmount,
      orderDate: data.orderDate,
      shippingAddress: data.shippingAddress
    };

    const emailResult: EmailResult = await sendOrderConfirmationEmail(emailData);
    results.email = {
      success: emailResult.success,
      error: emailResult.error || null,
      errorType: emailResult.errorType || null,
      shouldRetry: emailResult.shouldRetry || false
    };
    
    if (emailResult.success) {
      console.log('✅ Email notification sent successfully');
    } else {
      console.error('❌ Email notification failed:', {
        error: emailResult.error,
        errorType: emailResult.errorType,
        shouldRetry: emailResult.shouldRetry
      });
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ Email notification error:', errorMessage);
    results.email = { 
      success: false, 
      error: errorMessage, 
      errorType: 'network_error',
      shouldRetry: true
    };
  }

  // Send WhatsApp notification
  try {
    const whatsappData: OrderConfirmationWhatsAppData = {
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      orderId: data.orderId,
      productName: data.productName,
      totalAmount: data.totalAmount,
      orderDate: data.orderDate,
      shippingAddress: data.shippingAddress
    };

    const whatsappResult = await sendOrderConfirmationWhatsApp(whatsappData);
    results.whatsapp = {
      success: whatsappResult.success,
      error: whatsappResult.error || null,
      whatsappLink: whatsappResult.whatsappLink || null,
      messageId: whatsappResult.messageId || null
    };
    
    if (whatsappResult.success) {
      if (whatsappResult.messageId) {
        console.log('✅ WhatsApp message sent automatically via Business API');
        console.log('Message ID:', whatsappResult.messageId);
      } else {
        console.log('✅ WhatsApp link generated successfully');
        console.log('WhatsApp link:', whatsappResult.whatsappLink);
      }
    } else {
      console.error('❌ WhatsApp notification failed:', whatsappResult.error);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('❌ WhatsApp notification error:', errorMessage);
    results.whatsapp = { success: false, error: errorMessage, whatsappLink: null, messageId: null };
  }

  // Log overall results
  const emailSuccess = results.email.success;
  const whatsappSuccess = results.whatsapp.success;
  
  if (emailSuccess && whatsappSuccess) {
    console.log('🎉 All notifications sent successfully');
  } else if (emailSuccess || whatsappSuccess) {
    console.log('⚠️ Partial notification success:', {
      email: emailSuccess ? '✅' : '❌',
      whatsapp: whatsappSuccess ? '✅' : '❌'
    });
  } else {
    console.error('❌ All notifications failed');
  }

  return {
    success: emailSuccess || whatsappSuccess, // Consider it successful if at least one notification was sent
    results
  };
}

