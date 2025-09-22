-- Add Kislay Monk Fruit Sweetener Drops to the products table
-- This is the main product for Kislay Naturals

INSERT INTO products (
    name,
    description,
    price,
    original_price,
    image,
    images,
    badge,
    category,
    in_stock,
    slug,
    rating,
    num_reviews,
    avg_rating
) VALUES (
    'Kislay Monk Fruit Sweetener Drops',
    'The perfect monk fruit sweetener for you. Made from 100% natural monk fruit extract, our sweetener provides the perfect balance of sweetness without any calories or artificial ingredients. Ideal for diabetics, keto dieters, and anyone looking to reduce sugar intake while maintaining great taste.',
    299.00,
    350.00,
    '/p1.png',
    '["/p1.png", "/p2.png", "/p3.png", "/p33.png"]'::jsonb,
    'Featured',
    'Sweeteners',
    true,
    'kislay-monk-fruit-sweetener-drops',
    4.5,
    12,
    4.5
);

-- Verify the product was added
SELECT 
    id,
    name,
    price,
    original_price,
    image,
    badge,
    category,
    in_stock,
    slug,
    avg_rating,
    num_reviews,
    created_at
FROM products 
WHERE slug = 'kislay-monk-fruit-sweetener-drops';
