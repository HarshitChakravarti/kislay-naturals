-- Disable RLS for order_items table to allow testing
-- WARNING: This should only be used for testing, not in production

-- Disable RLS on order_items table
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;

-- This will allow any client to insert/select from order_items table
-- Remember to re-enable RLS after testing with:
-- ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
