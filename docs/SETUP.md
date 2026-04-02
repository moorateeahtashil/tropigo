# Setup

Prereqs: Node 18+, pnpm

1. Install dependencies

   pnpm install

2. Dev

   pnpm dev

3. Environment (optional for now)

   - NEXT_PUBLIC_SUPABASE_URL=
   - NEXT_PUBLIC_SUPABASE_ANON_KEY=

4. Supabase schema (when you have a project)

   - Install Supabase CLI: https://supabase.com/docs/guides/cli
   - Login and link your project (or use a local instance)
   - Apply migrations:

     supabase db push --include "supabase/migrations/*.sql"

   - Seed (dev only):

     supabase db query < supabase/seed.sql

   - Generate types:

     pnpm dlx supabase gen types typescript --project-id <project-id> --schema public > lib/server/db-types.ts
