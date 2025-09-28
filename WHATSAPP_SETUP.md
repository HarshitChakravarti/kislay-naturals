# WhatsApp Business API Setup Guide

This guide will help you set up automatic WhatsApp message sending for order confirmations.

## Option 1: WhatsApp Business API (Recommended for Production)

### Step 1: Create WhatsApp Business Account
1. Go to [Facebook Business](https://business.facebook.com/)
2. Create a Business Account or use existing one
3. Go to WhatsApp Business API section

### Step 2: Get API Credentials
1. Create a WhatsApp Business App
2. Get your credentials:
   - **Access Token**: Your WhatsApp Business API access token
   - **Phone Number ID**: Your WhatsApp Business phone number ID
   - **Webhook Verify Token**: For webhook verification (optional)

### Step 3: Add Environment Variables
Add these to your `.env.local` file:

```env
# WhatsApp Business API Configuration
WHATSAPP_ACCESS_TOKEN=your_access_token_here
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id_here
WHATSAPP_WEBHOOK_VERIFY_TOKEN=your_webhook_verify_token_here
```

### Step 4: Test the Integration
The system will automatically try to send via WhatsApp Business API first, and fall back to link generation if not configured.

## Option 2: Third-Party Services (Easier Setup)

### Using Twilio WhatsApp API
1. Sign up for [Twilio](https://www.twilio.com/)
2. Enable WhatsApp Sandbox or get WhatsApp Business approval
3. Add Twilio credentials to environment variables:

```env
# Twilio WhatsApp Configuration
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_WHATSAPP_NUMBER=whatsapp:+14155238886
```

### Using MessageBird WhatsApp API
1. Sign up for [MessageBird](https://www.messagebird.com/)
2. Get WhatsApp Business API access
3. Add MessageBird credentials:

```env
# MessageBird WhatsApp Configuration
MESSAGEBIRD_ACCESS_KEY=your_messagebird_access_key
MESSAGEBIRD_WHATSAPP_CHANNEL_ID=your_whatsapp_channel_id
```

## Option 3: WhatsApp Cloud API (Free Tier Available)

### Step 1: Create Meta Developer Account
1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Create a new app and select "Business" type
3. Add WhatsApp product to your app

### Step 2: Get Credentials
1. In your app dashboard, go to WhatsApp > Getting Started
2. Copy your:
   - **Temporary Access Token** (for testing)
   - **Phone Number ID**
   - **App Secret**

### Step 3: Environment Variables
```env
# WhatsApp Cloud API Configuration
WHATSAPP_ACCESS_TOKEN=your_temporary_access_token
WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id
WHATSAPP_APP_SECRET=your_app_secret
```

## Testing Your Setup

### Test with Environment Variables
1. Add the environment variables to your `.env.local`
2. Restart your development server
3. Place a test order
4. Check the console logs for WhatsApp API responses

### Test Without API (Fallback Mode)
If no environment variables are set, the system will generate WhatsApp links that you can manually send.

## Message Templates (For Production)

For production use, you'll need to create approved message templates:

### Example Template
```
Hello {{1}}! Your order #{{2}} for {{3}} (₹{{4}}) has been confirmed. 
We'll ship it within 3-5 business days. 
Need help? Contact us at +91 7043630938
```

### Template Variables
- {{1}} - Customer Name
- {{2}} - Order ID
- {{3}} - Product Name
- {{4}} - Total Amount

## Important Notes

1. **Customer Consent**: Ensure customers have opted in to receive WhatsApp messages
2. **Message Templates**: Only pre-approved templates can initiate conversations
3. **Rate Limits**: WhatsApp has rate limits for message sending
4. **Compliance**: Follow WhatsApp's business policies and guidelines

## Troubleshooting

### Common Issues
1. **"WhatsApp Business API not configured"**: Add environment variables
2. **"Invalid phone number format"**: Ensure phone numbers start with 91 for India
3. **"WhatsApp API error"**: Check your access token and phone number ID

### Debug Mode
Enable debug logging by setting:
```env
DEBUG_WHATSAPP=true
```

## Support

For issues with WhatsApp Business API setup, refer to:
- [WhatsApp Business API Documentation](https://developers.facebook.com/docs/whatsapp)
- [Meta Business Help Center](https://www.facebook.com/business/help)
