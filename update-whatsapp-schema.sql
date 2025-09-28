-- Update orders table to replace SMS columns with WhatsApp columns
-- This migration updates the notification tracking from SMS to WhatsApp

-- First, drop the old SMS columns
ALTER TABLE orders 
DROP COLUMN IF EXISTS sms_sent,
DROP COLUMN IF EXISTS sms_error;

-- Add new WhatsApp columns
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS whatsapp_sent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS whatsapp_error TEXT,
ADD COLUMN IF NOT EXISTS whatsapp_link TEXT,
ADD COLUMN IF NOT EXISTS whatsapp_message_id VARCHAR(255);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_orders_whatsapp_sent ON orders(whatsapp_sent);
CREATE INDEX IF NOT EXISTS idx_orders_whatsapp_message_id ON orders(whatsapp_message_id);

-- Add comments for documentation
COMMENT ON COLUMN orders.whatsapp_sent IS 'Whether the order confirmation WhatsApp message was sent successfully';
COMMENT ON COLUMN orders.whatsapp_error IS 'Error message if WhatsApp sending failed';
COMMENT ON COLUMN orders.whatsapp_link IS 'WhatsApp link generated for manual sending (fallback)';
COMMENT ON COLUMN orders.whatsapp_message_id IS 'WhatsApp message ID from Business API (if sent automatically)';

-- Update existing records to set whatsapp_sent to false for orders that had sms_sent
UPDATE orders 
SET whatsapp_sent = FALSE 
WHERE whatsapp_sent IS NULL;
