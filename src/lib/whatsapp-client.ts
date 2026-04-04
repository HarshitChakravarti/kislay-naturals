// Client-side WhatsApp utility for manual notifications
// This generates WhatsApp messages and links from order data

export interface OrderWhatsAppData {
  customerName: string;
  customerPhone: string;
  orderId: string;
  orderNumber?: string;
  orderItems: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  orderDate: string;
  shippingAddress?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
}

export function generateWhatsAppMessage(data: OrderWhatsAppData): string {
  const orderDate = data.orderDate || new Date().toLocaleDateString('en-IN');
  const orderDisplayId = data.orderNumber || `#${data.orderId.slice(-8).toLowerCase()}`;
  
  // Build product list
  const productList = data.orderItems
    .map(item => `• ${item.name} (Qty: ${item.quantity}) - ₹${(item.price * item.quantity).toFixed(2)}`)
    .join('\n');
  
  let message = `*Kislay Naturals - Order Confirmation*

Dear ${data.customerName},

Thank you for your order!

*Order Details:*
• Order ${orderDisplayId}
• Date: ${orderDate}

*Available Variants:*
• 10ml
• 30ml+10ml free

*Products:*
${productList}

*Total Amount: ₹${data.totalAmount.toFixed(2)}*`;

  // Add shipping address if available
  if (data.shippingAddress) {
    message += `

*Shipping Address:*
${data.shippingAddress.street}
${data.shippingAddress.city}, ${data.shippingAddress.state} - ${data.shippingAddress.zip}`;
  }

  message += `

Your order is confirmed and will be delivered within 6-10 business days.

Need help? Reply to this message or call us at +91 7043630938

Thank you for choosing Kislay Naturals!

---
*This is a message from Kislay Naturals*`;

  return message;
}

export function generateWhatsAppLink(data: OrderWhatsAppData): string {
  // Format phone number for India (+91)
  let formattedPhone = data.customerPhone.replace(/[^\d+]/g, ''); // Remove spaces and special chars except +
  
  if (!formattedPhone.startsWith('+91') && !formattedPhone.startsWith('91')) {
    formattedPhone = `+91${formattedPhone}`;
  } else if (formattedPhone.startsWith('91') && !formattedPhone.startsWith('+91')) {
    formattedPhone = `+${formattedPhone}`;
  }
  
  // Remove + from phone number for WhatsApp link
  const whatsappPhone = formattedPhone.replace('+', '');
  
  // Generate the WhatsApp message
  const message = generateWhatsAppMessage(data);
  
  // Create WhatsApp link
  const whatsappLink = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`;
  
  return whatsappLink;
}

