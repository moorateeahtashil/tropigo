# Tropigo

Lean Mauritius tourism site and booking platform scaffolded with:

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Supabase client placeholders

## Getting Started

1. Install dependencies

   pnpm install

2. Run the dev server

   pnpm dev

## Docker

Dev (hot reload):

  docker compose up --build

Production image:

  docker compose --profile prod build web-prod
  docker compose --profile prod up web-prod

Or using Dockerfile directly:

  docker build -t tropigo .
  docker run -p 3000:3000 --env-file .env.local tropigo

## Supabase (content backend)

- Apply migrations to your Supabase project:

  supabase db push --include "supabase/migrations/*.sql"

- Seed data for local/dev (optional):

  supabase db query < supabase/seed.sql

- Generate typed DB client types:

  pnpm dlx supabase gen types typescript --project-id <project-id> --schema public > lib/server/db-types.ts

### API smoke tests

- Public sections (RLS-published only):

  curl http://localhost:3000/api/sections | jq

- Admin sections (requires Supabase access token with role=admin or is_admin=true):

  curl -H "Authorization: Bearer <ACCESS_TOKEN>" http://localhost:3000/api/admin/sections | jq

The admin route forwards your Supabase JWT to the database so RLS policies apply server-side.

## Commands

- pnpm dev – start dev server
- pnpm build – production build
- pnpm start – start production server
- pnpm lint – lint

## Structure

- app/ – routes and pages (App Router)
- components/ – reusable UI
- lib/ – helpers and config
- supabase/ – client setup placeholders
- styles/ – global styles
- public/ – static assets and reference assets
- docs/ – setup notes
- PLANS.md – plan for larger changes

See AGENTS.md for project rules and scope.
