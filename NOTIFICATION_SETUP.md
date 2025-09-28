# Order Confirmation Notifications Setup

This document explains how to set up automated email and SMS notifications for order confirmations.

## Overview

When a customer completes their payment, the system will automatically send:
1. **Email confirmation** with detailed order information and appreciation message
2. **SMS confirmation** with order summary and thank you message

## Required Environment Variables

Add these environment variables to your `.env.local` file:

### Email Service (Resend)
```env
RESEND_API_KEY=your_resend_api_key
```

### SMS Service (Twilio)
```env
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
```

## Service Setup Instructions

### 1. Resend Email Service

1. Go to [Resend.com](https://resend.com)
2. Sign up for a free account
3. Verify your domain (or use the default domain for testing)
4. Get your API key from the dashboard
5. Add `RESEND_API_KEY` to your environment variables

**Free tier includes:**
- 3,000 emails per month
- 100 emails per day
- Perfect for small to medium businesses

### 2. Twilio SMS Service

1. Go to [Twilio.com](https://twilio.com)
2. Sign up for a free account
3. Get a phone number for SMS (free trial includes $15 credit)
4. Get your Account SID and Auth Token from the console
5. Add the Twilio credentials to your environment variables

**Free tier includes:**
- $15 credit (approximately 1,500 SMS messages)
- Perfect for testing and small volume

## Email Template Features

The email confirmation includes:
- ✅ Professional HTML design with Kislay Naturals branding
- ✅ Order details (ID, product, quantity, price)
- ✅ Customer information and shipping address
- ✅ Appreciation message and brand messaging
- ✅ Contact information and support details
- ✅ Mobile-responsive design

## SMS Template Features

The SMS confirmation includes:
- ✅ Concise order summary
- ✅ Order ID and total amount
- ✅ Thank you message
- ✅ Support contact information
- ✅ Emoji formatting for better readability

## Testing

To test the notifications:

1. **Set up the services** with the credentials above
2. **Place a test order** through your checkout flow
3. **Complete the payment** using Razorpay test mode
4. **Check your email** for the confirmation email
5. **Check your phone** for the SMS confirmation

## Troubleshooting

### Email Not Sending
- Check if `RESEND_API_KEY` is correctly set
- Verify your domain is verified in Resend
- Check the server logs for error messages

### SMS Not Sending
- Check if Twilio credentials are correctly set
- Verify the phone number format (should include country code)
- Check if you have sufficient Twilio credits
- Check the server logs for error messages

### Both Not Sending
- Check if all environment variables are set
- Restart your development server after adding new environment variables
- Check the server logs for detailed error messages

## Production Considerations

1. **Email Deliverability**: Use a verified domain for better deliverability
2. **SMS Compliance**: Ensure you have customer consent for SMS messages
3. **Rate Limiting**: Consider implementing rate limiting for notifications
4. **Monitoring**: Set up monitoring for failed notifications
5. **Backup**: Consider having a fallback notification method

## Cost Estimation

### Resend (Email)
- Free: 3,000 emails/month
- Pro: $20/month for 50,000 emails
- Scale: $0.40 per 1,000 additional emails

### Twilio (SMS)
- India: ~$0.01 per SMS
- US: ~$0.0075 per SMS
- Free trial: $15 credit included

For 100 orders/month:
- Email: Free (Resend free tier)
- SMS: ~$1/month (Twilio)
- **Total: ~$1/month**

## Support

If you need help setting up the notifications:
1. Check the server logs for detailed error messages
2. Verify all environment variables are correctly set
3. Test with a small order first
4. Contact support if issues persist
