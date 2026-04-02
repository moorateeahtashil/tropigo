# AGENTS.md

## Project mission

Build a premium, conversion-focused Mauritius tourism website and booking platform based on the approved PRD.

Primary launch goal:
- ship a production-ready booking website fast
- prioritize the booking funnel, SEO, mobile UX, admin manageability, and operational reliability
- deliver launch scope first, then phase 2 enhancements

Treat this repository as a greenfield implementation unless the existing code clearly indicates otherwise.

## Codex operating rules

- Read this file before making changes.
- For any task estimated to touch more than 3 files, or any task that changes data models, payments, auth, CMS, booking logic, or deployment, first create or update `PLANS.md`.
- In `PLANS.md`, write:
  - goal
  - assumptions
  - affected files
  - risks
  - step-by-step implementation plan
  - verification checklist
- Do not start large implementation work until `PLANS.md` is written.
- Keep diffs small and reviewable.
- Prefer completing one vertical slice fully rather than scattering partial implementations.
- Never silently change the stack, deployment target, schema direction, or payment approach.
- Ask for approval before introducing a new paid third-party service that is not already listed in this file.
- Do not add mock features that are presented as production-complete.
- Do not ship placeholder security, fake payment success flows, or fake availability logic as final code.

## Product scope priority

Implement in this order unless explicitly told otherwise.

### Phase 1 launch scope
1. Marketing website shell
2. Homepage
3. Tours listing and filtering
4. Tour detail page
5. Booking widget and availability rules
6. Cart
7. Checkout
8. Payment integration
9. Order confirmation emails
10. Basic user accounts
11. CMS/admin for tours, prices, dates, pages
12. Contact, FAQ, WhatsApp, legal pages
13. SEO, analytics, monitoring, backups, QA, deployment

### Phase 2 scope
- loyalty wallet and tiers
- chatbot and recommendation assistant
- advanced multilingual content workflows
- richer review moderation
- advanced promotions
- extra commerce products beyond tours unless already prioritized

When in doubt, optimize for launch scope first.

## Required architecture

Use a modular monolith.

### Required stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- Node.js runtime where needed for server actions, route handlers, webhooks, and workers
- PostgreSQL
- Prisma ORM
- Payload CMS backed by PostgreSQL
- Auth.js for authentication
- Stripe-compatible card flow if selected by the business, plus adapters for PayPal and local Mauritius payment methods
- Resend or Postmark for transactional email
- Google Places API for pickup location autocomplete
- GA4, Google Tag Manager, Google Search Console
- Sentry for error tracking

### Deployment target
- Frontend/app on Vercel
- PostgreSQL, background jobs, and webhooks on Railway
- Media assets storage

Do not replace this stack without approval.

## Engineering principles

- Prefer server-rendered or hybrid-rendered pages for SEO-critical routes.
- Keep public pages fast and cache-friendly.
- Keep business logic out of UI components.
- Put booking, pricing, payment, and loyalty calculations in dedicated domain modules.
- Use typed interfaces everywhere.
- Validate all external input on the server.
- Use progressive enhancement for forms and key user journeys.
- Favor simple, explicit code over framework cleverness.
- Avoid premature microservices.
- Avoid over-abstracting until a second real use case exists.

## Definition of done

A task is not done unless all relevant items below are satisfied:
- code builds locally
- lint passes
- tests added or updated where logic changed
- happy path verified
- failure path verified
- loading and empty states handled
- errors are user-safe and developer-actionable
- analytics events added for key conversion actions where relevant
- docs updated if setup or behavior changed

## Repository layout

Use this layout unless a strong reason emerges not to.

- `apps/web` - Next.js customer-facing app
- `apps/worker` - background jobs, webhooks, retry handlers
- `packages/ui` - shared UI components
- `packages/config` - eslint, tsconfig, shared config
- `packages/domain` - core business logic
- `packages/db` - Prisma schema, migrations, DB utilities
- `packages/cms` - Payload config, collections, admin helpers
- `docs/` - architecture notes, setup guides, runbooks
- `docs/adr/` - architecture decision records
- `PLANS.md` - execution plan for large tasks

If starting from a single-app repository, keep the same separation logically using top-level folders.

## Core domain model

Maintain these core entities unless the project owner approves changes:
- User
- Account
- Session
- Tour
- TourVariant or TicketType if needed
- Destination
- ActivityCategory
- Region
- TourImage
- AvailabilitySlot
- PickupOption
- Coupon
- Booking
- BookingItem
- Payment
- Refund
- Wishlist
- Review
- Testimonial
- StaticPage
- BlogPost
- FAQ
- LoyaltyWallet
- LoyaltyTransaction
- AuditLog

Any schema change affecting bookings, payments, or availability must include migration notes and test coverage.

## UX rules

- Mobile-first by default.
- Booking CTA must remain obvious on tour detail pages.
- Important information must be visible before checkout:
  - price
  - inclusions/exclusions
  - duration
  - pickup info
  - availability
  - cancellation/refund notes
- Do not make users create an account before checkout.
- Preserve trust throughout the funnel:
  - secure payment messaging
  - contact options
  - WhatsApp access
  - clear totals
  - no hidden fees
- Forms must have clear validation and accessible labels.
- Support English first. Structure code so French can be added cleanly.

## SEO rules

All public content pages must support:
- clean URLs
- unique title and meta description
- canonical tags where relevant
- Open Graph metadata
- structured data where relevant
- XML sitemap support
- robots rules
- indexable text content, not text embedded only in images

Priority SEO routes:
- homepage
- destination pages
- activity pages
- tour detail pages
- blog/article pages
- legal pages

## Booking rules

Treat booking as a high-integrity domain.

- Validate availability on the server.
- Validate price on the server.
- Never trust client-calculated totals.
- Preserve a clear booking reference for each successful booking.
- Store booking status transitions explicitly.
- Support inquiry fallback when a tour cannot be instantly booked.
- Log payment provider events and webhook outcomes.
- Implement idempotency for payment confirmation and webhook processing.
- Prevent duplicate booking creation on retries or refreshes.

## Payment rules

- Use a provider abstraction layer.
- Keep provider-specific code isolated.
- Never store raw card details in our database.
- Verify payment status server-side before marking a booking as paid.
- Webhook handlers must be idempotent.
- Failed payments must not create paid bookings.
- Success pages must reflect actual payment state, not optimistic client state.

## Auth and security rules

- Use secure server-side session handling.
- Hash passwords with modern defaults through the auth library.
- Protect admin routes and mutation endpoints.
- Apply role-based access control for admin and operations users.
- Add rate limiting for sensitive endpoints where practical.
- Add reCAPTCHA or equivalent on public spam-prone forms.
- Do not log secrets, card data, or sensitive personal details.
- Use environment variables for all secrets and provider keys.
- Keep a clear `.env.example` file.

## CMS and admin rules

The admin/CMS must allow non-technical staff to manage:
- tours
- prices
- availability
- pickup details
- homepage featured content
- destinations
- FAQs
- testimonials
- legal pages
- blog or guide content
- coupons

Prefer config-driven collections and reusable field groups.
Document any manual admin workflow in `docs/`.

## Performance rules

- Optimize for Core Web Vitals.
- Use responsive images and lazy loading.
- Avoid shipping oversized client bundles.
- Prefer server components unless interactivity is required.
- Defer non-critical scripts.
- Audit large dependencies before adding them.

## Accessibility rules

- Use semantic HTML first.
- Ensure keyboard access for nav, filters, dialogs, carousels, and forms.
- Maintain visible focus states.
- Provide alt text strategy for tour imagery.
- Ensure color contrast is sufficient.
- Avoid inaccessible custom controls when native elements work.

## Observability and operations

Before production, ensure:
- Sentry installed
- analytics events wired
- uptime monitoring configured
- backups documented
- rollback procedure documented
- failed job retry strategy documented
- webhook replay strategy documented

Put operational runbooks in `docs/runbooks/`.

## Testing strategy

### Minimum required
- unit tests for pricing, booking, coupon, and loyalty calculations
- integration tests for booking creation, checkout, and payment confirmation
- end-to-end tests for:
  - browsing to booking
  - booking to checkout
  - successful payment
  - failed payment
  - contact form submission
  - login and password reset

### Preferred tools
- Vitest for unit/integration tests
- Playwright for end-to-end tests

## Commands

If bootstrapping the repo, use `pnpm`.

Expected commands:
- `pnpm install`
- `pnpm dev`
- `pnpm build`
- `pnpm lint`
- `pnpm test`
- `pnpm test:e2e`
- `pnpm prisma migrate dev`
- `pnpm prisma generate`

If commands differ after scaffolding, update this file immediately.

## Code style

- Use strict TypeScript.
- Avoid `any` unless unavoidable and justified with a comment.
- Prefer small pure functions for business logic.
- Keep React components focused on rendering and interaction.
- Name files consistently and predictably.
- Prefer explicit return types on exported functions.
- Add concise comments only where intent is not obvious from the code.
- Do not add decorative comments or banner comments.

## Data and content seeding

Provide realistic seed data for:
- tours
- destinations
- categories
- availability
- reviews
- FAQ
- homepage sections

Seed data must look like plausible Mauritius tourism content, but clearly be seed content and easy to replace.

## Git and change management

- Make one logical change per commit.
- Keep commit messages clear and imperative.
- Update docs in the same change when behavior or setup changes.
- For risky changes, include a short rollback note in the PR description or plan.
- If you discover a repeated instruction gap, update `AGENTS.md`.

## Review checklist for Codex

Before submitting work, verify:
- no broken imports
- no dead routes
- no orphaned components
- no secrets committed
- no fake production logic
- no inaccessible key flow
- no server/client trust boundary violations
- no unhandled async errors
- no missing empty/loading/error states
- no payment or booking state inconsistencies

## When blocked

If a requirement is ambiguous:
1. choose the safest interpretation that preserves launch scope
2. document the assumption in `PLANS.md` or the changed file
3. proceed without blocking unless the ambiguity affects money movement, legal policy, or irreversible schema design

If the ambiguity affects payments, compliance, pricing, or deletion of live data, stop and ask for approval.

## First tasks Codex should execute in a greenfield repo

1. Scaffold the workspace with `pnpm`.
2. Create the Next.js app and shared packages.
3. Set up Tailwind, shadcn/ui, ESLint, Prettier if used, and TypeScript strict mode.
4. Set up Prisma and PostgreSQL.
5. Add Payload CMS.
6. Add Auth.js.
7. Create the initial schema and migrations.
8. Build the public layout and homepage.
9. Build tours listing and tour detail pages.
10. Build the booking flow end to end.
11. Add payment adapters.
12. Add email notifications.
13. Add admin workflows.
14. Add tests, observability, SEO, and deployment config.

## Non-goals for initial implementation

- native mobile app
- microservices
- event-driven distributed architecture
- overly advanced AI chatbot logic
- speculative personalization systems
- unnecessary vendor lock-in abstractions
- custom design system package before launch needs justify it

## Keep this file current

Whenever implementation reality changes:
- update commands
- update paths
- update deployment notes
- update testing expectations
- add new guardrails if recurring mistakes appear
