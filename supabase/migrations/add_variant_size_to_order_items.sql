-- Migration: Add variant_size column to order_items table
-- This adds support for storing product variant size (e.g., 10ml, 30ml) in order items

-- Add variant_size column to order_items table
ALTER TABLE order_items 
ADD COLUMN IF NOT EXISTS variant_size VARCHAR(50);

-- Add comment to explain the column
COMMENT ON COLUMN order_items.variant_size IS 'Product variant size (e.g., 10ml, 30ml) selected by the customer';

-- Create an index for better query performance (optional)
CREATE INDEX IF NOT EXISTS idx_order_items_variant_size ON order_items(variant_size);

