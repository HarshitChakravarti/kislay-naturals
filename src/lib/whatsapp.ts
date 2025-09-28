// WhatsApp notification service for order confirmations
// Supports both automatic sending via Business API and link generation

export interface OrderConfirmationWhatsAppData {
  customerName: string;
  customerPhone: string;
  orderId: string;
  productName: string;
  totalAmount: number;
  orderDate?: string;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
}

export interface WhatsAppResult {
  success: boolean;
  error?: string;
  whatsappLink?: string;
  message?: string;
  messageId?: string;
}

// Main function that tries automatic sending first, falls back to link generation
export async function sendOrderConfirmationWhatsApp(data: OrderConfirmationWhatsAppData): Promise<WhatsAppResult> {
  try {
    // First, try to send automatically via WhatsApp Business API
    const autoResult = await sendOrderConfirmationWhatsAppAPI(data);
    
    if (autoResult.success) {
      console.log('✅ WhatsApp message sent automatically via Business API');
      return autoResult;
    }
    
    // If automatic sending fails, fall back to link generation
    console.log('⚠️ Automatic WhatsApp sending failed, generating link instead');
    return await generateWhatsAppLink(data);
    
  } catch (error) {
    console.error('Error in WhatsApp notification:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Automatic sending via WhatsApp Business API
export async function sendOrderConfirmationWhatsAppAPI(data: OrderConfirmationWhatsAppData): Promise<WhatsAppResult> {
  try {
    // Check if WhatsApp Business API is configured
    if (!process.env.WHATSAPP_ACCESS_TOKEN || !process.env.WHATSAPP_PHONE_NUMBER_ID) {
      console.log('WhatsApp Business API not configured, falling back to link generation');
      return await generateWhatsAppLink(data);
    }

    // Format phone number for WhatsApp API (remove + and any spaces)
    const formattedPhone = data.customerPhone.replace(/[^\d]/g, '');
    if (!formattedPhone.startsWith('91')) {
      return {
        success: false,
        error: 'Invalid phone number format for India'
      };
    }

    // Generate the message
    const message = generateOrderConfirmationWhatsAppMessage(data);
    
    // Send via WhatsApp Business API
    const response = await fetch(`https://graph.facebook.com/v18.0/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: formattedPhone,
        type: 'text',
        text: {
          body: message
        }
      })
    });

    const result = await response.json();

    if (response.ok && result.messages && result.messages[0]) {
      console.log('WhatsApp message sent successfully:', result.messages[0].id);
      return {
        success: true,
        messageId: result.messages[0].id,
        message
      };
    } else {
      console.error('WhatsApp API error:', result);
      return {
        success: false,
        error: result.error?.message || 'WhatsApp API error'
      };
    }

  } catch (error) {
    console.error('Error sending WhatsApp via API:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Fallback: Generate WhatsApp link for manual sending
export async function generateWhatsAppLink(data: OrderConfirmationWhatsAppData): Promise<WhatsAppResult> {
  try {
    // Format phone number for India (+91)
    const formattedPhone = data.customerPhone.startsWith('+91') 
      ? data.customerPhone 
      : `+91${data.customerPhone}`;
    
    // Remove + from phone number for WhatsApp link
    const whatsappPhone = formattedPhone.replace('+', '');
    
    // Generate the WhatsApp message
    const message = generateOrderConfirmationWhatsAppMessage(data);
    
    // Create WhatsApp link
    const whatsappLink = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`;
    
    console.log('WhatsApp link generated for:', whatsappPhone);
    console.log('WhatsApp link:', whatsappLink);
    
    return {
      success: true,
      whatsappLink,
      message
    };
    
  } catch (error) {
    console.error('Error generating WhatsApp link:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

function generateOrderConfirmationWhatsAppMessage(data: OrderConfirmationWhatsAppData): string {
  const orderDate = data.orderDate || new Date().toLocaleDateString('en-IN');
  
  let message = `🌿 *Kislay Naturals - Order Confirmation*

Dear ${data.customerName},

Thank you for your order! 🙏

📋 *Order Details:*
• Order #${data.orderId}
• Product: ${data.productName}
• Amount: ₹${data.totalAmount.toFixed(2)}
• Date: ${orderDate}`;

  // Add shipping address if available
  if (data.shippingAddress) {
    message += `

🚚 *Shipping Address:*
${data.shippingAddress.street}
${data.shippingAddress.city}, ${data.shippingAddress.state} - ${data.shippingAddress.zip}`;
  }

  message += `

Your order is confirmed and will be shipped within 3-5 business days.

Need help? Reply to this message or call us at +91 7043630938

Thank you for choosing Kislay Naturals! 🌱

---
*This is an automated message from Kislay Naturals*`;

  return message;
}

// Function to generate WhatsApp link for any message
export function createWhatsAppLink(phoneNumber: string, message: string): string {
  const formattedPhone = phoneNumber.startsWith('+91') 
    ? phoneNumber 
    : `+91${phoneNumber}`;
  
  const whatsappPhone = formattedPhone.replace('+', '');
  return `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`;
}
