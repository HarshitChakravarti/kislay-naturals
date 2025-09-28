-- Add notification tracking columns to orders table
-- This migration adds columns to track email and SMS notification status

ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS email_sent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS email_error TEXT,
ADD COLUMN IF NOT EXISTS email_error_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS email_should_retry BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS sms_sent BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS sms_error TEXT,
ADD COLUMN IF NOT EXISTS notification_sent_at TIMESTAMP WITH TIME ZONE;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_orders_email_sent ON orders(email_sent);
CREATE INDEX IF NOT EXISTS idx_orders_sms_sent ON orders(sms_sent);
CREATE INDEX IF NOT EXISTS idx_orders_notification_sent_at ON orders(notification_sent_at);

-- Add comments for documentation
COMMENT ON COLUMN orders.email_sent IS 'Whether the order confirmation email was sent successfully';
COMMENT ON COLUMN orders.email_error IS 'Error message if email sending failed';
COMMENT ON COLUMN orders.email_error_type IS 'Type of email error (invalid_email, rate_limited, quota_exceeded, network_error, unknown)';
COMMENT ON COLUMN orders.email_should_retry IS 'Whether the email should be retried (false for invalid emails)';
COMMENT ON COLUMN orders.sms_sent IS 'Whether the order confirmation SMS was sent successfully';
COMMENT ON COLUMN orders.sms_error IS 'Error message if SMS sending failed';
COMMENT ON COLUMN orders.notification_sent_at IS 'Timestamp when notifications were sent';
