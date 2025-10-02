-- Add payment retry tracking and failure management columns to orders table
-- This enables proper retry handling and expiry management

-- Add new columns for payment retry tracking
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS payment_attempts INTEGER DEFAULT 0 CHECK (payment_attempts >= 0),
ADD COLUMN IF NOT EXISTS last_failure_code VARCHAR(100),
ADD COLUMN IF NOT EXISTS last_failure_message TEXT,
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_payment_attempts ON orders(payment_attempts);
CREATE INDEX IF NOT EXISTS idx_orders_last_failure_code ON orders(last_failure_code);
CREATE INDEX IF NOT EXISTS idx_orders_expires_at ON orders(expires_at);

-- Create a partial index for non-null expires_at (we'll filter expired ones in queries)
CREATE INDEX IF NOT EXISTS idx_orders_with_expiry ON orders(id, expires_at) WHERE expires_at IS NOT NULL;

-- Add a function to automatically expire old orders
CREATE OR REPLACE FUNCTION expire_old_orders()
RETURNS void AS $$
BEGIN
    -- Mark orders as expired if they haven't been paid and are past expiry
    UPDATE orders 
    SET 
        status = 'cancelled',
        order_status = 'cancelled',
        updated_at = NOW()
    WHERE 
        expires_at IS NOT NULL 
        AND expires_at < NOW() 
        AND status = 'created' 
        AND order_status = 'created';
END;
$$ LANGUAGE plpgsql;

-- Optionally, create a function to check if an order is expired
CREATE OR REPLACE FUNCTION is_order_expired(order_uuid UUID)
RETURNS boolean AS $$
DECLARE
    order_expires_at TIMESTAMP WITH TIME ZONE;
BEGIN
    SELECT expires_at INTO order_expires_at
    FROM orders 
    WHERE id = order_uuid;
    
    IF order_expires_at IS NULL THEN
        RETURN false; -- No expiry set
    END IF;
    
    RETURN order_expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Comment explaining the new columns
COMMENT ON COLUMN orders.payment_attempts IS 'Number of payment attempts made for this order';
COMMENT ON COLUMN orders.last_failure_code IS 'Code from the last payment failure (e.g., CARD_DECLINED, INSUFFICIENT_FUNDS)';
COMMENT ON COLUMN orders.last_failure_message IS 'Detailed message from the last payment failure';
COMMENT ON COLUMN orders.expires_at IS 'When this order expires and can no longer be paid';
