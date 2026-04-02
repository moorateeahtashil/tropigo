# AGENTS.md

## Mission

Build a small-company, production-ready Mauritius tourism website and booking platform from the PRD, but keep the implementation lean.

Primary goal:
- ship the booking funnel first
- keep the stack simple and low-cost
- use the provided HTML reference as the visual guide for UI feel, spacing, typography, section rhythm, and component style
- launch a clean Phase 1 first, then add extras later

## How Codex should work in this repo

- Read this file before making changes.
- Keep changes small and reviewable.
- For any task that changes schema, auth, payments, booking rules, or deployment, create or update `PLANS.md` first.
- In `PLANS.md`, include:
  - goal
  - assumptions
  - files to change
  - risks
  - implementation steps
  - verification checklist
- Do not silently expand the stack.
- Do not add paid services unless they are clearly approved here or requested by the repo owner.
- Do not fake payment success, fake availability, or placeholder security as if it were production-complete.

## Visual reference rule

The repo may include one or more HTML files used as a design reference.

Before implementing UI:
1. inspect the HTML reference file(s) first
2. extract the visual system:
   - fonts
   - spacing scale
   - border radius
   - button styles
   - card styles
   - section spacing
   - layout rhythm
   - header/footer patterns
   - color palette
3. reproduce the same overall feel in the app without blindly copying messy markup
4. prefer clean Next.js + Tailwind components
5. if the reference uses a custom font:
   - use the same font only if it is already provided or easily available
   - otherwise choose the closest free alternative and document the substitution
6. keep visual consistency with the reference across all public pages

If a reference HTML file is present, treat it as the main source of truth for the look and feel.

## Keep the stack intentionally small

Use a single app unless there is a real need for more.

### Required stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui only when it speeds up implementation
- Supabase for:
  - PostgreSQL database
  - auth
  - storage if uploads are needed
- Resend for transactional email if email is required
- PayPal or Stripe only when payment work starts and the provider is confirmed

### Explicitly avoid for the first build
- monorepo unless complexity truly justifies it
- separate worker app unless background jobs become necessary
- Payload CMS
- custom design system package
- S3 or R2 unless later approved
- extra infra services for problems that do not exist yet

## Free or low-cost defaults

Use the cheapest reasonable option first.

- Deploy app: Vercel free tier
- Database/Auth/Storage: Supabase free tier
- Images/assets:
  - start with local assets in `/public` when possible
  - if admin uploads are required, use Supabase Storage free tier
  - Cloudinary free tier is acceptable if image tooling becomes necessary
- Email: Resend free tier
- Analytics: GA4
- Error tracking:
  - start with built-in logs
  - add Sentry only if errors become hard to track
- Maps/autocomplete:
  - do not add Google Places on day one unless the feature is actively being built
  - a validated text field is acceptable for MVP if pickup autocomplete is not yet required

## Suggested app structure

Use a simple single-app layout:

- `app/` - routes and pages
- `components/` - reusable UI components
- `lib/` - helpers, config, utilities
- `lib/server/` - server-only code
- `features/` - domain modules like tours, booking, checkout, account
- `supabase/` - client and server setup
- `styles/` - global styles
- `docs/` - notes and setup guides
- `public/` - static assets and reference assets
- `PLANS.md` - plan for larger changes

If the repo already has a different structure, stay consistent unless there is a strong reason to refactor.

## Launch scope priority

Build in this order unless told otherwise:

1. layout shell using the HTML reference style
2. homepage
3. tours listing
4. tour detail page
5. booking widget
6. cart
7. checkout
8. payment integration
9. booking confirmation
10. simple admin/auth
11. contact, FAQ, legal pages
12. SEO and deployment polish

## Defer these unless explicitly requested

- loyalty program
- chatbot
- advanced multilingual tooling
- advanced recommendation engine
- overly complex review systems
- extra commerce products beyond tours

## Booking rules

Treat booking as critical logic.

- validate price on the server
- validate availability on the server
- never trust client totals
- create a clear booking reference
- store booking status explicitly
- support enquiry fallback when instant booking is not possible
- prevent duplicate bookings on refresh or retry
- do not mark bookings as paid until the provider confirms payment

## Auth and admin rules

Keep admin simple.

- use Supabase Auth
- protect admin routes
- support at least:
  - tours
  - pricing
  - availability
  - featured homepage content
  - FAQs
  - testimonials
  - legal pages
- prefer a lightweight custom admin section inside the same app over a separate CMS product

## SEO and performance rules

- prefer server rendering for public SEO pages
- keep pages text-rich and indexable
- use clean URLs
- provide title/meta/canonical/Open Graph
- generate sitemap
- use responsive images
- keep client-side JavaScript light
- prioritize mobile performance

## Definition of done

A task is not done unless:
- the code builds
- the page or feature works in the browser
- loading, empty, and error states are handled
- the main happy path is tested manually
- risky logic has tests where reasonable
- docs are updated if setup changed
- the result still matches the reference UI direction

## Commands

Use `pnpm` unless the repo already uses something else.

Expected commands:
- `pnpm install`
- `pnpm dev`
- `pnpm build`
- `pnpm lint`
- `pnpm test`

If the actual repo commands differ, update this file.

## Important note about AGENTS.md

`AGENTS.md` is not an executable script.
Codex reads it automatically when you run Codex inside this repository.

Use it like this from the repo root:

```bash
codex
```

Optional quick-start scaffold in a new repo:

```bash
/init
```

Then ask Codex to work, for example:
- "Read AGENTS.md and summarize the project rules."
- "Inspect the HTML reference file and build the homepage in the same style."
- "Create PLANS.md and scaffold the lean stack described in AGENTS.md."

## Keep this file current

Whenever the project decisions change, update:
- stack choices
- commands
- deployment choices
- storage choice
- payment provider choice
- reference UI instructions
