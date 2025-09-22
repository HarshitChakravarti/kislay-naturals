-- Enhance order_items table with additional useful fields
-- This adds more fields for better order management and reporting

-- Add new columns to order_items table
ALTER TABLE order_items 
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS category VARCHAR(100),
ADD COLUMN IF NOT EXISTS sku VARCHAR(100),
ADD COLUMN IF NOT EXISTS total_price DECIMAL(10,2) CHECK (total_price >= 0),
ADD COLUMN IF NOT EXISTS discount_amount DECIMAL(10,2) DEFAULT 0 CHECK (discount_amount >= 0),
ADD COLUMN IF NOT EXISTS tax_rate DECIMAL(5,2) DEFAULT 18.00 CHECK (tax_rate >= 0),
ADD COLUMN IF NOT EXISTS tax_amount DECIMAL(10,2) DEFAULT 0 CHECK (tax_amount >= 0),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Create index on total_price for reporting
CREATE INDEX IF NOT EXISTS idx_order_items_total_price ON order_items(total_price);

-- Create index on category for filtering
CREATE INDEX IF NOT EXISTS idx_order_items_category ON order_items(category);

-- Update the updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for order_items
DROP TRIGGER IF EXISTS update_order_items_updated_at ON order_items;
CREATE TRIGGER update_order_items_updated_at
    BEFORE UPDATE ON order_items
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
