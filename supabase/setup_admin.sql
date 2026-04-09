-- =============================================================
-- TROPIGO — CREATE ADMIN USER
-- Run this in Supabase SQL Editor to create an admin account.
--
-- After running, create the auth user in:
--   Supabase Dashboard → Authentication → Users → Add User
--   Email: admin@tropigo.mu
--   Password: Admin123! (change this immediately)
--
-- Then run the UPDATE below to grant admin privileges.
-- =============================================================

-- Step 1: Create the auth user via Supabase Dashboard (not SQL)
-- Go to: Authentication → Users → Add user
-- Email: admin@tropigo.mu
-- Password: Choose a strong password

-- Step 2: After the user exists, grant admin privileges:
-- Uncomment and run this AFTER creating the auth user:

-- UPDATE public.profiles 
-- SET is_admin = true 
-- WHERE email = 'admin@tropigo.mu';

-- Verify:
-- SELECT email, is_admin FROM public.profiles WHERE email = 'admin@tropigo.mu';
