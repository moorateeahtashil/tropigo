-- =============================================================
-- TROPIGO — FIX ADMIN ROLE + UPDATE SETTINGS SCHEMA
-- =============================================================

-- 1. Ensure the profiles table has all necessary columns
-- (The columns should already exist from clean_rebuild, this just verifies)

-- 2. If you have a user and need to grant admin, run:
-- UPDATE public.profiles SET is_admin = true WHERE email = 'YOUR_EMAIL@example.com';

-- 3. Ensure settings singleton has proper defaults
UPDATE public.settings SET
  brand_name = COALESCE(brand_name, 'Tropigo'),
  tagline = COALESCE(tagline, 'Discover Mauritius, Your Way'),
  default_currency = COALESCE(default_currency, 'EUR'),
  supported_currencies = CASE 
    WHEN supported_currencies IS NULL OR array_length(supported_currencies, 1) IS NULL 
    THEN '{EUR,USD,GBP,MUR}' 
    ELSE supported_currencies 
  END
WHERE id = '00000000-0000-0000-0000-000000000001'::uuid;
