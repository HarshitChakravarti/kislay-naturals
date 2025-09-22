-- Disable RLS for user_profiles table to allow testing
-- WARNING: This should only be used for testing, not in production

-- Disable RLS on user_profiles table
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- This will allow any client to insert/select from user_profiles table
-- Remember to re-enable RLS after testing with:
-- ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
