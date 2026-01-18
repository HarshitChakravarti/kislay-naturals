-- Migration: Update original_price to 399 for products
-- This updates the slashed/original price from 350 to 399

-- Update all products that have original_price = 350 or NULL to 399
UPDATE products 
SET original_price = 399
WHERE original_price IS NULL 
   OR original_price = 350;

-- Verify the update
SELECT id, name, price, original_price 
FROM products 
WHERE original_price = 399;
