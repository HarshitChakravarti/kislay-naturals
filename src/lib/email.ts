import { getResend } from './resend';

export interface OrderConfirmationEmailData {
  customerName: string;
  customerEmail: string;
  orderId: string;
  // Prefer displaying human-friendly order number when available
  orderNumber?: string;
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

export interface EmailResult {
  success: boolean;
  error?: string;
  errorType?: 'invalid_email' | 'rate_limited' | 'quota_exceeded' | 'network_error' | 'unknown';
  shouldRetry?: boolean;
  data?: any;
}

export async function sendOrderConfirmationEmail(data: OrderConfirmationEmailData): Promise<EmailResult> {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return { 
        success: false, 
        error: 'Email service not configured',
        errorType: 'unknown',
        shouldRetry: false
      };
    }

    const resend = getResend();
    const { data: emailData, error } = await resend.emails.send({
      from: 'Kislay Naturals <orders@kislaynaturals.com>',
      to: [data.customerEmail],
      subject: `Your Order ${data.orderNumber || data.orderId} - Kislay Naturals`,
      html: generateOrderConfirmationEmailHTML(data),
      text: generateOrderConfirmationEmailText(data),
      replyTo: 'support@kislaynaturals.com',
      headers: {
        'X-Mailer': 'Kislay Naturals',
        'X-Priority': '3'
      }
    });

    if (error) {
      console.error('Error sending order confirmation email:', error);
      
      // Categorize the error based on Resend error messages
      let errorType: EmailResult['errorType'] = 'unknown';
      let shouldRetry = true;
      
      const errorMessage = error.message?.toLowerCase() || '';
      
      if (errorMessage.includes('invalid') || 
          errorMessage.includes('bounce') || 
          errorMessage.includes('not found') ||
          errorMessage.includes('does not exist') ||
          errorMessage.includes('mailbox unavailable')) {
        errorType = 'invalid_email';
        shouldRetry = false; // Don't retry invalid emails
      } else if (errorMessage.includes('rate limit') || errorMessage.includes('too many requests')) {
        errorType = 'rate_limited';
        shouldRetry = true;
      } else if (errorMessage.includes('quota') || errorMessage.includes('limit exceeded')) {
        errorType = 'quota_exceeded';
        shouldRetry = false; // Don't retry if quota exceeded
      } else if (errorMessage.includes('network') || errorMessage.includes('timeout')) {
        errorType = 'network_error';
        shouldRetry = true;
      }
      
      return { 
        success: false, 
        error: error.message,
        errorType,
        shouldRetry
      };
    }

    console.log('Order confirmation email sent successfully:', emailData);
    return { success: true, data: emailData };
  } catch (error) {
    console.error('Error in sendOrderConfirmationEmail:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      errorType: 'network_error',
      shouldRetry: true
    };
  }
}

function generateOrderConfirmationEmailHTML(data: OrderConfirmationEmailData): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Confirmation - Kislay Naturals</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
        }
        .container {
          background: white;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 30px;
        }
        .greeting {
          font-size: 16px;
          margin-bottom: 20px;
        }
        .order-summary {
          margin: 20px 0;
        }
        .order-summary h3 {
          font-size: 16px;
          margin-bottom: 10px;
          text-decoration: underline;
        }
        .product-details {
          margin: 10px 0;
        }
        .product-name {
          font-weight: bold;
          margin-bottom: 5px;
        }
        .quantity {
          margin-bottom: 5px;
        }
        .payment-received {
          font-weight: bold;
          text-decoration: underline;
        }
        .delivery-address {
          margin: 20px 0;
          border-top: 1px solid #ddd;
          padding-top: 20px;
        }
        .delivery-address h3 {
          font-size: 16px;
          margin-bottom: 10px;
          text-decoration: underline;
        }
        .shipping-info {
          margin: 10px 0;
        }
        .estimated-delivery {
          margin: 10px 0;
        }
        .customer-support {
          margin: 20px 0;
          border-top: 1px solid #ddd;
          padding-top: 20px;
        }
        .customer-support h3 {
          font-size: 16px;
          margin-bottom: 10px;
        }
        .contact-info {
          margin: 10px 0;
        }
        .contact-info a {
          color: #0066cc;
          text-decoration: underline;
        }
        .footer {
          margin-top: 20px;
          font-size: 14px;
          color: #666;
        }
        .underline {
          text-decoration: underline;
        }
        .logo {
          text-align: center;
          margin-bottom: 30px;
        }
        .logo img {
          max-width: 200px;
          height: auto;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">
          <img src="https://kislaynaturals.com/logo.png" alt="Kislay Naturals" />
        </div>
        
        <div class="greeting">
          <strong>Dear ${data.customerName},</strong>
        </div>

        <p>Thank you for your order. Your payment is processed successfully and our team has started processing your order.</p>

        <div class="order-summary">
          <h3>Here is order <span class="underline">summary</span> :</h3>
          <div class="product-details">
            <div class="product-name">${data.productName}</div>
            <div class="quantity">Quantity: ${data.quantity}</div>
            <div class="payment-received">Payment <span class="underline">Received</span> : ₹ ${(data.totalAmount || 0).toFixed(2)}</div>
          </div>
        </div>

        <div class="delivery-address">
          <h3><span class="underline">Delivery Address</span> :</h3>
          <div class="shipping-info">
            <p><strong>${data.shippingAddress.street}</strong></p>
            <p><strong>${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zip}</strong></p>
            <p>You will receive delivery and tracking information via email / WhatsApp</p>
          </div>
          <div class="estimated-delivery">
            <strong>Estimated <span class="underline">delivery</span>: 7 – 10 business days</strong>
          </div>
        </div>

        <div class="customer-support">
          <h3><strong>Customer Support</strong></h3>
          <div class="contact-info">
            <p>Email: <a href="mailto:support@kislaynaturals.com">support@kislaynaturals.com</a></p>
            <p>Phone: +91 7043630938</p>
          </div>
        </div>

        <div class="footer">
          <p>This is an automated receipt for your order.</p>
          <p>Please keep this email for your records.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateOrderConfirmationEmailText(data: OrderConfirmationEmailData): string {
  return [
    `Dear ${data.customerName},`,
    '',
    `Thank you for your order. Your payment is processed successfully and our team has started processing your order.`,
    '',
    `Here is order summary:`,
    `${data.productName}`,
    `Quantity: ${data.quantity}`,
    `Payment Received: ₹ ${(data.totalAmount || 0).toFixed(2)}`,
    '',
    `Delivery Address:`,
    `${data.shippingAddress.street}`,
    `${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zip}`,
    `You will receive delivery and tracking information via email / WhatsApp`,
    `Estimated delivery: 7 – 10 business days`,
    '',
    `Customer Support`,
    `Email: support@kislaynaturals.com`,
    `Phone: +91 7043630938`,
    '',
    `This is an automated receipt for your order.`,
    `Please keep this email for your records.`,
  ].join('\n');
}
