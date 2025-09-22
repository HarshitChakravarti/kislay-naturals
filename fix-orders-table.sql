-- Fix orders table to allow orders without user_id constraint
-- This will allow guest orders and authenticated user orders

-- First, drop the foreign key constraint
ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_user_id_fkey;

-- Make user_id nullable (it should already be nullable, but let's be sure)
ALTER TABLE orders ALTER COLUMN user_id DROP NOT NULL;

-- Update the RLS policy to allow inserts without user_id
DROP POLICY IF EXISTS "Users can create their own orders" ON orders;

-- Create a new policy that allows order creation for both authenticated and guest users
CREATE POLICY "Allow order creation" ON orders
    FOR INSERT WITH CHECK (
        -- Allow if user is authenticated and creating their own order
        (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
        -- Allow if user_id is null (guest orders)
        user_id IS NULL
    );

-- Also allow users to view their own orders
CREATE POLICY "Users can view their own orders" ON orders
    FOR SELECT USING (
        -- Allow if user is authenticated and viewing their own orders
        (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
        -- Allow if user_id is null (guest orders - this might need to be more restrictive in production)
        user_id IS NULL
    );

-- Allow admins to view all orders
CREATE POLICY "Admins can view all orders" ON orders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Allow admins to manage all orders
CREATE POLICY "Admins can manage all orders" ON orders
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );
