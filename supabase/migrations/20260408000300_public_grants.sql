-- Ensure anon/authenticated can read via RLS by granting SELECT
-- Also set sane defaults for future objects after schema resets.

-- Schema usage for app roles
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON SCHEMA public TO postgres, service_role;

-- Existing objects: allow reads; RLS will still enforce row filters
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Make future tables/sequences readable by default (still RLS-gated)
ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT ON TABLES TO anon, authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO anon, authenticated;

-- Give service_role full control (server-side ops, webhooks, admin)
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO service_role;

