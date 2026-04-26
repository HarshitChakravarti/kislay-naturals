-- Script to update existing products with default variants
-- Run this after adding the variants column to populate existing products

-- Update all products that don't have variants set
UPDATE products 
SET variants = '[
  {"size": "10ml", "price": 299, "originalPrice": 399},
  {"size": "30ml", "price": 699, "originalPrice": 999}
]'::jsonb
WHERE variants IS NULL 
   OR variants = '[]'::jsonb
   OR jsonb_array_length(variants) = 0;

-- Verify the update
SELECT id, name, variants 
FROM products 
WHERE variants IS NOT NULL 
  AND jsonb_array_length(variants) > 0;
