-- Re-enable RLS policies for production
-- This script safely re-enables RLS on all tables

-- Re-enable RLS on orders table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Re-enable RLS on order_items table  
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Re-enable RLS on user_profiles table
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Verify RLS is enabled
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('orders', 'order_items', 'user_profiles', 'products', 'reviews')
ORDER BY tablename;
