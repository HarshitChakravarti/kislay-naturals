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
  const displayOrderId = data.orderNumber || data.orderId;
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmed - Kislay Naturals</title>
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,Helvetica,sans-serif;">
  <!-- Wrapper table -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:20px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
          
          <!-- Green Header Bar -->
          <tr>
            <td style="background:linear-gradient(135deg,#16a34a,#15803d);height:6px;"></td>
          </tr>
          
          <!-- Logo Section -->
          <tr>
            <td align="center" style="padding:30px 40px 20px;">
              <img src="https://kislaynaturals.com/logo/logonew.png" alt="Kislay Naturals" width="160" style="display:block;max-width:160px;height:auto;" />
            </td>
          </tr>

          <!-- Confirmation Badge -->
          <tr>
            <td align="center" style="padding:0 40px 10px;">
              <table cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color:#e8f5ee;border-radius:50px;padding:8px 24px;">
                    <span style="color:#16a34a;font-size:14px;font-weight:700;letter-spacing:0.5px;">&#10003; Order Confirmed</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Order Number -->
          <tr>
            <td align="center" style="padding:4px 40px 20px;">
              <p style="margin:0;font-size:13px;color:#999;">Order ${displayOrderId}</p>
            </td>
          </tr>

          <!-- Greeting & Message -->
          <tr>
            <td style="padding:0 40px 24px;">
              <p style="margin:0 0 12px;font-size:18px;font-weight:700;color:#1a1a1a;">Dear ${data.customerName},</p>
              <p style="margin:0;font-size:15px;color:#555;line-height:1.6;">Thank you for your order! Your payment has been processed successfully and our team has started preparing your order.</p>
            </td>
          </tr>

          <!-- Order Summary Card -->
          <tr>
            <td style="padding:0 40px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;">
                <tr>
                  <td style="padding:16px 20px 12px;border-bottom:1px solid #e5e7eb;">
                    <p style="margin:0;font-size:13px;font-weight:700;color:#16a34a;text-transform:uppercase;letter-spacing:1px;">&#128230; Order Summary</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 20px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size:15px;color:#1a1a1a;font-weight:600;padding-bottom:4px;">${data.productName}</td>
                        <td align="right" style="font-size:15px;color:#1a1a1a;font-weight:600;padding-bottom:4px;">&nbsp;</td>
                      </tr>
                      <tr>
                        <td style="font-size:13px;color:#888;padding-bottom:12px;">Qty: ${data.quantity}</td>
                        <td>&nbsp;</td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:14px 20px;background-color:#e8f5ee;border-top:1px solid #d1e7dd;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size:15px;font-weight:700;color:#1a1a1a;">Payment Received</td>
                        <td align="right" style="font-size:20px;font-weight:700;color:#16a34a;">${'\u20B9'} ${(data.totalAmount || 0).toFixed(2)}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Delivery Details Card -->
          <tr>
            <td style="padding:0 40px 24px;">
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;overflow:hidden;">
                <tr>
                  <td style="padding:16px 20px 12px;border-bottom:1px solid #e5e7eb;">
                    <p style="margin:0;font-size:13px;font-weight:700;color:#16a34a;text-transform:uppercase;letter-spacing:1px;">&#128205; Delivery Details</p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 4px;font-size:15px;color:#1a1a1a;font-weight:600;">${data.shippingAddress.street}</p>
                    <p style="margin:0;font-size:14px;color:#555;">${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zip}</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td align="center" style="padding:0 40px 30px;">
              <a href="https://kislaynaturals.com/products" style="display:inline-block;background-color:#16a34a;color:#ffffff;text-decoration:none;font-size:15px;font-weight:700;padding:14px 36px;border-radius:50px;">Visit Our Store &rarr;</a>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <hr style="border:none;border-top:1px solid #eee;margin:0;" />
            </td>
          </tr>

          <!-- Customer Support -->
          <tr>
            <td align="center" style="padding:24px 40px 10px;">
              <p style="margin:0 0 8px;font-size:14px;font-weight:700;color:#1a1a1a;">Need Help?</p>
              <p style="margin:0 0 4px;font-size:13px;color:#888;">Email: <a href="mailto:support@kislaynaturals.com" style="color:#16a34a;text-decoration:none;">support@kislaynaturals.com</a></p>
              <p style="margin:0;font-size:13px;color:#888;">Phone: <a href="tel:+917043630938" style="color:#16a34a;text-decoration:none;">+91 7043630938</a></p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:24px 40px 20px;">
              <p style="margin:0;font-size:11px;color:#bbb;">This is an automated receipt. Please keep this email for your records.</p>
            </td>
          </tr>

          <!-- Green Footer Bar -->
          <tr>
            <td style="background:linear-gradient(135deg,#16a34a,#15803d);padding:16px 40px;" align="center">
              <p style="margin:0;font-size:12px;color:rgba(255,255,255,0.8);">&copy; 2026 Kislay Naturals &middot; <a href="https://kislaynaturals.com" style="color:#ffffff;text-decoration:none;">kislaynaturals.com</a></p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
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
    '',
    `Customer Support`,
    `Email: support@kislaynaturals.com`,
    `Phone: +91 7043630938`,
    '',
    `This is an automated receipt for your order.`,
    `Please keep this email for your records.`,
  ].join('\n');
}
