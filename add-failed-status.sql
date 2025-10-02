-- Update orders table to support 'failed' status
-- This allows distinction between cancelled and failed payments

-- Add 'failed' to the status check constraint
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check 
CHECK (status IN ('created', 'paid', 'shipped', 'delivered', 'cancelled', 'failed'));

-- Add 'failed' to the order_status check constraint  
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_order_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_order_status_check 
CHECK (order_status IN ('created', 'paid', 'processing', 'shipped', 'delivered', 'cancelled', 'failed'));

-- Create index on failed orders for analytics
CREATE INDEX IF NOT EXISTS idx_orders_failed_status ON orders(status) WHERE status = 'failed';
CREATE INDEX IF NOT EXISTS idx_orders_failed_order_status ON orders(order_status) WHERE order_status = 'failed';
