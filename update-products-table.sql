-- SQL script to update products table schema
-- Run this in your Supabase SQL Editor

-- First, let's see the current table structure
-- SELECT column_name, data_type, is_nullable 
-- FROM information_schema.columns 
-- WHERE table_name = 'products' AND table_schema = 'public';

-- Add missing columns to the products table
-- (These will be added as nullable columns, then we can populate them)

-- Add description column
ALTER TABLE products ADD COLUMN IF NOT EXISTS description TEXT;

-- Add originalPrice column  
ALTER TABLE products ADD COLUMN IF NOT EXISTS "originalPrice" DECIMAL;

-- Rename image_url to image for consistency
ALTER TABLE products RENAME COLUMN image_url TO image;

-- Add rating column
ALTER TABLE products ADD COLUMN IF NOT EXISTS rating DECIMAL;

-- Add numReviews column
ALTER TABLE products ADD COLUMN IF NOT EXISTS "numReviews" INTEGER;

-- Add avgRating column
ALTER TABLE products ADD COLUMN IF NOT EXISTS "avgRating" DECIMAL;

-- Add badge column
ALTER TABLE products ADD COLUMN IF NOT EXISTS badge TEXT;

-- Add category column
ALTER TABLE products ADD COLUMN IF NOT EXISTS category TEXT;

-- Rename in_stock to inStock for consistency
ALTER TABLE products RENAME COLUMN in_stock TO "inStock";

-- Add slug column
ALTER TABLE products ADD COLUMN IF NOT EXISTS slug TEXT;

-- Add createdAt column
ALTER TABLE products ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Add updatedAt column
ALTER TABLE products ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update the id column to be text instead of int8 for consistency
-- First, let's create a new column
ALTER TABLE products ADD COLUMN IF NOT EXISTS id_text TEXT;

-- Copy existing data to new column (convert int to text)
UPDATE products SET id_text = id::TEXT WHERE id_text IS NULL;

-- Drop the old id column and rename the new one
ALTER TABLE products DROP COLUMN IF EXISTS id;
ALTER TABLE products RENAME COLUMN id_text TO id;

-- Make id the primary key
ALTER TABLE products ADD PRIMARY KEY (id);

-- Now let's clear the existing test data and add proper products
DELETE FROM products;

-- Insert the new product data
INSERT INTO products (
  id, name, description, price, "originalPrice", image, rating, "numReviews", "avgRating", 
  badge, category, "inStock", slug, "createdAt", "updatedAt"
) VALUES 
(
  '1',
  'Kislay Monk Fruit Sweetener Drops',
  'Kislay Monk Fruit Sweetener Drops – 100% Natural & Zero Calorie Sugar Substitute

Fuel your lifestyle with natural, low-carb goodness – packed with clean energy, rich nutrients, and zero guilt.

Say goodbye to sugar and artificial sweeteners! Kislay Monk Fruit Sweetener Drops are made from pure monk fruit extract, offering a zero-calorie, zero-glycemic index, and 100% natural sugar substitute that''s perfect for your healthy lifestyle.

Whether you''re diabetic, health-conscious, on a low-carb or keto diet, or simply want a clean alternative to sugar, Kislay drops deliver the same sweet taste without the crash.',
  299,
  350,
  '/p1.png',
  4.5,
  12,
  4.5,
  'Featured',
  'Sweeteners',
  true,
  'kislay-monk-fruit-sweetener-drops',
  NOW(),
  NOW()
),
(
  '2',
  'Monk Fruit Sweetener Drop',
  'Kislay Monk Fruit Sweetener Drops - 100% Natural & Zero Calorie Sugar Substitute Fuel your lifestyle with natural, low-carb goodness - packed with clean energy, rich nutrients, and zero guilt. Say goodbye to sugar and artificial sweeteners! Kislay Monk Fruit Sweetener Drops are made from pure monk fruit extract, offering a zero-calorie, zero-glycemic index, and 100% natural sugar substitute that''s perfect for your healthy lifestyle.',
  229,
  349,
  '/productimage-removebg-preview.png',
  4.5,
  100,
  4.5,
  'Best Seller',
  'Sweeteners',
  true,
  'monk-fruit-sweetener-drop',
  NOW(),
  NOW()
),
(
  '3',
  'Premium Monk Fruit Extract',
  'Premium quality monk fruit extract with enhanced sweetness and zero calories. Perfect for baking, beverages, and daily use.',
  399,
  499,
  '/p2.png',
  4.8,
  25,
  4.8,
  'Premium',
  'Sweeteners',
  true,
  'premium-monk-fruit-extract',
  NOW(),
  NOW()
);

-- Verify the data
SELECT * FROM products ORDER BY "createdAt" DESC;
