-- Temporarily disable RLS for orders table to allow testing
-- WARNING: This should only be used for testing, not in production

-- Disable RLS on orders table
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;

-- This will allow any client to insert/select from orders table
-- Remember to re-enable RLS after testing with:
-- ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
