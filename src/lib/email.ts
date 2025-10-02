import { getResend } from './resend';

export interface OrderConfirmationEmailData {
  customerName: string;
  customerEmail: string;
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
      from: 'Kislay Naturals <noreply@kislaynaturals.com>',
      to: [data.customerEmail],
      subject: `Your Order ${data.orderId} - Kislay Naturals`,
      html: generateOrderConfirmationEmailHTML(data),
      text: generateOrderConfirmationEmailText(data),
      replyTo: 'naturalskislay@gmail.com',
      headers: {
        'List-Unsubscribe': `<mailto:naturalskislay@gmail.com>, <https://kislaynaturals.com/account/preferences>`,
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
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Order Receipt - Kislay Naturals</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.4;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
        }
        .container {
          background: white;
          border: 1px solid #ddd;
          padding: 30px;
        }
        .header {
          text-align: left;
          margin-bottom: 20px;
          border-bottom: 1px solid #eee;
          padding-bottom: 15px;
        }
        .logo {
          font-size: 18px;
          font-weight: bold;
          color: #333;
          margin-bottom: 5px;
        }
        .order-id {
          color: #666;
          font-size: 14px;
        }
        .greeting {
          font-size: 16px;
          margin-bottom: 15px;
          color: #333;
        }
        .order-details {
          background: #f8f9fa;
          padding: 15px;
          margin: 15px 0;
          border: 1px solid #e9ecef;
        }
        .product-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #dee2e6;
        }
        .product-info:last-child {
          border-bottom: none;
        }
        .product-name {
          font-weight: 500;
          color: #333;
        }
        .product-quantity {
          color: #666;
          font-size: 14px;
        }
        .price {
          font-weight: 500;
          color: #333;
        }
        .total {
          background: #f8f9fa;
          padding: 12px;
          text-align: center;
          font-size: 16px;
          font-weight: bold;
          margin: 15px 0;
          border: 1px solid #dee2e6;
        }
        .shipping-info {
          background: #f8f9fa;
          padding: 12px;
          margin: 15px 0;
          border: 1px solid #dee2e6;
        }
        .shipping-title {
          font-weight: 500;
          color: #333;
          margin-bottom: 8px;
        }
        .address {
          color: #666;
          line-height: 1.4;
        }
        .next-steps {
          background: #f8f9fa;
          padding: 12px;
          margin: 15px 0;
          border: 1px solid #dee2e6;
        }
        .footer {
          margin-top: 20px;
          padding-top: 15px;
          border-top: 1px solid #eee;
          color: #666;
          font-size: 13px;
        }
        .contact-info {
          margin: 10px 0;
        }
        .contact-info a {
          color: #0066cc;
          text-decoration: none;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">Kislay Naturals</div>
          <div class="order-id">Order Number: ${data.orderId}</div>
        </div>

        <div class="greeting">
          Hello ${data.customerName},
        </div>

        <p>Your order has been received and payment has been processed successfully.</p>

        <div class="order-details">
          <h3 style="margin-top: 0; color: #333; font-size: 16px;">Order Summary</h3>
          <div class="product-info">
            <div>
              <div class="product-name">${data.productName}</div>
              <div class="product-quantity">Quantity: ${data.quantity}</div>
            </div>
            <div class="price">INR ${data.unitPrice.toFixed(2)}</div>
          </div>
        </div>

        <div class="total">
          Total Amount: INR ${data.totalAmount.toFixed(2)}
        </div>

        <div class="shipping-info">
          <div class="shipping-title">Delivery Address</div>
          <div class="address">
            ${data.shippingAddress.street}<br>
            ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zip}
          </div>
        </div>

        <div class="next-steps">
          <h3 style="margin-top: 0; color: #333; font-size: 14px;">Next Steps</h3>
          <ul style="color: #666; margin: 8px 0; padding-left: 20px; font-size: 14px;">
            <li>Your order is being processed</li>
            <li>You will receive tracking information via email</li>
            <li>Estimated delivery: 3-5 business days</li>
          </ul>
        </div>

        <div class="footer">
          <div class="contact-info">
            <p><strong>Customer Support</strong></p>
            <p>Email: <a href="mailto:naturalskislay@gmail.com">naturalskislay@gmail.com</a></p>
            <p>Phone: +91 7043630938</p>
          </div>
          <p style="margin-top: 15px;">
            This is an automated receipt for your order. Please keep this email for your records.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generateOrderConfirmationEmailText(data: OrderConfirmationEmailData): string {
  return [
    `Kislay Naturals - Order Receipt`,
    `Order Number: ${data.orderId}`,
    '',
    `Hello ${data.customerName},`,
    `Your order has been received and payment has been processed successfully.`,
    '',
    `Order Summary:`,
    `Item: ${data.productName}`,
    `Quantity: ${data.quantity}`,
    `Unit Price: INR ${data.unitPrice.toFixed(2)}`,
    `Total: INR ${data.totalAmount.toFixed(2)}`,
    '',
    `Delivery Address:`,
    `${data.shippingAddress.street}`,
    `${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zip}`,
    '',
    `Next Steps:`,
    `- Your order is being processed`,
    `- You will receive tracking information via email`,
    `- Estimated delivery: 3-5 business days`,
    '',
    `Customer Support:`,
    `Email: naturalskislay@gmail.com`,
    `Phone: +91 7043630938`,
    '',
    `This is an automated receipt for your order. Please keep this email for your records.`,
  ].join('\n');
}
