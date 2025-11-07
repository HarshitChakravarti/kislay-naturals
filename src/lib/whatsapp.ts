// WhatsApp notification service for order confirmations
// Manual notification system - generates WhatsApp links for manual sending

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

// Main function - generates WhatsApp link for manual sending
// Automated API calls have been removed - this now only generates links
export async function sendOrderConfirmationWhatsApp(data: OrderConfirmationWhatsAppData): Promise<WhatsAppResult> {
  try {
    // Generate WhatsApp link for manual sending
    console.log('Generating WhatsApp link for manual notification');
    return await generateWhatsAppLink(data);
    
  } catch (error) {
    console.error('Error generating WhatsApp link:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Generate WhatsApp link for manual sending
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
  
  let message = `*Kislay Naturals - Order Confirmation*

Dear ${data.customerName},

Thank you for your order!

*Order Details:*
• Order #${data.orderId}
• Product: ${data.productName}
• Amount: ₹${data.totalAmount.toFixed(2)}
• Date: ${orderDate}`;

  // Add shipping address if available
  if (data.shippingAddress) {
    message += `

*Shipping Address:*
${data.shippingAddress.street}
${data.shippingAddress.city}, ${data.shippingAddress.state} - ${data.shippingAddress.zip}`;
  }

  message += `

Your order is confirmed and will be shipped within 3-5 business days.

Need help? Reply to this message or call us at +91 7043630938

Thank you for choosing Kislay Naturals!

---
*This is a message from Kislay Naturals*`;

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
