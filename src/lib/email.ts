import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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

    const { data: emailData, error } = await resend.emails.send({
      from: 'Kislay Naturals <noreply@kislaynaturals.com>',
      to: [data.customerEmail],
      subject: `Order Confirmation - ${data.orderId}`,
      html: generateOrderConfirmationEmailHTML(data),
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
      <title>Order Confirmation - Kislay Naturals</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f8f9fa;
        }
        .container {
          background: white;
          border-radius: 12px;
          padding: 40px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
          text-align: center;
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #10b981;
        }
        .logo {
          font-size: 28px;
          font-weight: bold;
          color: #10b981;
          margin-bottom: 10px;
        }
        .order-id {
          background: #f0fdf4;
          color: #166534;
          padding: 8px 16px;
          border-radius: 6px;
          font-weight: 600;
          display: inline-block;
        }
        .greeting {
          font-size: 18px;
          margin-bottom: 20px;
          color: #374151;
        }
        .order-details {
          background: #f9fafb;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .product-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 0;
          border-bottom: 1px solid #e5e7eb;
        }
        .product-info:last-child {
          border-bottom: none;
        }
        .product-name {
          font-weight: 600;
          color: #111827;
        }
        .product-quantity {
          color: #6b7280;
        }
        .price {
          font-weight: 600;
          color: #10b981;
        }
        .total {
          background: #10b981;
          color: white;
          padding: 15px;
          border-radius: 8px;
          text-align: center;
          font-size: 20px;
          font-weight: bold;
          margin: 20px 0;
        }
        .shipping-info {
          background: #fef3c7;
          padding: 15px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .shipping-title {
          font-weight: 600;
          color: #92400e;
          margin-bottom: 10px;
        }
        .address {
          color: #78350f;
          line-height: 1.5;
        }
        .appreciation {
          text-align: center;
          margin: 30px 0;
          padding: 20px;
          background: linear-gradient(135deg, #10b981, #059669);
          color: white;
          border-radius: 12px;
        }
        .appreciation h2 {
          margin: 0 0 10px 0;
          font-size: 24px;
        }
        .appreciation p {
          margin: 0;
          font-size: 16px;
          opacity: 0.9;
        }
        .footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          color: #6b7280;
          font-size: 14px;
        }
        .contact-info {
          margin: 15px 0;
        }
        .contact-info a {
          color: #10b981;
          text-decoration: none;
        }
        .contact-info a:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🌿 Kislay Naturals</div>
          <div class="order-id">Order #${data.orderId}</div>
        </div>

        <div class="greeting">
          Dear ${data.customerName},
        </div>

        <p>Thank you for choosing Kislay Naturals! We're thrilled to confirm that your order has been successfully placed and payment has been received.</p>

        <div class="appreciation">
          <h2>🙏 Thank You!</h2>
          <p>Your support means the world to us. We're committed to providing you with the finest natural products for your health and wellness journey.</p>
        </div>

        <div class="order-details">
          <h3 style="margin-top: 0; color: #111827;">Order Details</h3>
          <div class="product-info">
            <div>
              <div class="product-name">${data.productName}</div>
              <div class="product-quantity">Quantity: ${data.quantity}</div>
            </div>
            <div class="price">₹${data.unitPrice.toFixed(2)}</div>
          </div>
        </div>

        <div class="total">
          Total Amount: ₹${data.totalAmount.toFixed(2)}
        </div>

        <div class="shipping-info">
          <div class="shipping-title">📦 Shipping Address</div>
          <div class="address">
            ${data.shippingAddress.street}<br>
            ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zip}
          </div>
        </div>

        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #166534;">📋 What's Next?</h3>
          <ul style="color: #166534; margin: 10px 0; padding-left: 20px;">
            <li>Your order is being prepared for shipment</li>
            <li>You'll receive a tracking number once your order ships</li>
            <li>Expected delivery: 3-5 business days</li>
            <li>Free shipping on all orders!</li>
          </ul>
        </div>

        <div class="footer">
          <div class="contact-info">
            <p><strong>Need help?</strong></p>
            <p>📧 Email: <a href="mailto:naturalskislay@gmail.com">naturalskislay@gmail.com</a></p>
            <p>📱 WhatsApp: <a href="https://wa.me/917043630938">+91 7043630938</a></p>
            <p>🌐 Website: <a href="https://kislaynaturals.com">kislaynaturals.com</a></p>
          </div>
          <p style="margin-top: 20px;">
            Thank you for choosing Kislay Naturals for your natural health journey!<br>
            <em>Your wellness is our priority.</em>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

