-- Migration: Add variants column to products table
-- This adds support for product variants (e.g., 10ml, 30ml) with different pricing

-- Add variants column as JSONB to store variant information
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS variants JSONB DEFAULT '[]'::jsonb;

-- Add comment to explain the column structure
COMMENT ON COLUMN products.variants IS 'Array of product variants. Each variant should have: {size: string, price: number, originalPrice: number}';

-- Example: Update existing products with default variants if needed
-- Uncomment and modify the product ID as needed:
-- UPDATE products 
-- SET variants = '[
--   {"size": "10ml", "price": 299, "originalPrice": 399},
--   {"size": "30ml", "price": 699, "originalPrice": 999}
-- ]'::jsonb
-- WHERE id = 'your-product-id-here' AND (variants IS NULL OR variants = '[]'::jsonb);

-- Create an index on variants for better query performance (optional)
CREATE INDEX IF NOT EXISTS idx_products_variants ON products USING GIN (variants);
