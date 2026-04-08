# AGENTS.md

## Project
Tropigo — Mauritius tourism and booking platform

## Mission
Rebuild Tropigo into a modular, scalable travel commerce platform supporting:
- Airport Transfers
- Activities / Trips
- Packages built from multiple activities

The system must include:
- public website
- admin CMS
- multi-currency pricing
- booking session + cart + checkout
- Stripe-first payment flow
- reviews
- content management
- SEO-friendly pages
- Supabase-backed architecture with secure access patterns

---

## Stack
- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase (Postgres, Auth, Storage)
- Resend
- Stripe-first, PayPal-ready
- Vercel

---

## Non-negotiable rules

### 1. Architecture may be broken and rebuilt
Agents are allowed to:
- remove weak scaffolding
- redesign folders
- redesign schema
- rename features for clarity
- replace poor assumptions

Do not preserve bad architecture just because it already exists.

### 2. Build in stages
Agents must work stage by stage.
Do not jump ahead unless the current stage is logically complete.

### 3. Do not force everything into a “tour” model
The platform must use a unified product model with specialized product types:
- `airport_transfer`
- `activity`
- `package`

### 4. Separate concerns
Keep these concerns clearly separated:
- UI/presentation
- domain logic
- data access
- validation
- pricing logic
- booking logic
- payment logic
- admin logic
- content/CMS logic

### 5. Security matters
Booking, payment, customer, and admin data must be treated as sensitive.
Design with Supabase RLS and secure server-side flows in mind.

### 6. Webhook is source of truth
Payment success shown in frontend is not enough.
Booking confirmation must be driven by verified server-side payment webhook logic.

### 7. Paid pricing must be immutable
Display pricing can be dynamic.
Checkout pricing must be snapshotted/frozen.
Paid booking amounts must never be recalculated.

### 8. Avoid placeholder architecture
Minor placeholders are acceptable only when unavoidable.
Do not leave major workflow gaps hidden behind TODOs.

---

## Product model

### Product types
The platform must support:
- airport transfers
- activities
- packages

### Activity requirements
Each activity must support at least:
- trip details
- duration
- tour type
- transportation
- pickup location
- pickup time
- price
- main photo
- gallery photos
- description
- included
- excluded
- destination/region
- optional availability rules

### Package requirements
Packages must support:
- multiple linked activities/components
- ordering of components
- optional items
- included-by-default items
- package-level price logic or override
- minimal duplication of linked activity content

### Airport transfer requirements
Airport transfers must support:
- top-level navigation entry
- dedicated public flow
- fixed pricing
- dynamic/zone/distance-based pricing
- pickup/dropoff fields
- passenger count
- luggage notes
- optional flight number
- special instructions

---

## Multi-currency rules
The system must support:
- base currency per product
- base price per product
- manual admin override prices by currency
- live conversion fallback using a free API
- supported currency settings
- customer display currency switching
- booking session exchange-rate snapshot
- frozen checkout totals

Priority order:
1. manual override price
2. derived converted price
3. frozen booking snapshot once checkout starts

---

## Booking lifecycle rules
Expected flow:
1. customer selects/configures product
2. system creates booking session
3. system stores cart items and pricing snapshot
4. customer enters contact/traveller info
5. payment session is created
6. verified payment webhook confirms payment
7. booking is confirmed
8. confirmation page/email is sent

Important:
- booking session is not final booking
- payment success page is not proof of payment
- webhook-confirmed state drives final booking confirmation

---

## Admin requirements
Admin must eventually support:
- destinations
- activities
- packages
- airport transfers
- pricing/currencies
- availability rules
- reviews moderation
- bookings
- enquiries
- homepage sections
- navigation
- testimonials
- promos
- FAQ
- legal pages
- SEO metadata
- media/storage references
- settings

---

## Design direction
Public site:
- premium modern 2026 travel UI/UX
- elegant, clean, image-led
- premium but usable
- strong mobile-first experience

Admin:
- modern, minimal, efficient
- clear hierarchy
- excellent form UX
- reusable patterns

Typography:
- primary: Manrope
- secondary marketing accent: Instrument Serif

---

## Folder and code quality expectations

### Code quality
Agents should prefer:
- strong typing
- explicit naming
- reusable utilities
- predictable data contracts
- validation schemas
- clean separation of server/client concerns

### Preferred architecture
Use domain-oriented or feature-oriented organization.

Examples of good boundaries:
- `features/catalog`
- `features/booking`
- `features/pricing`
- `features/transfers`
- `features/admin`
- `features/content`

### Avoid
- dumping everything into `lib`
- giant page files with mixed business logic
- duplicate pricing logic in UI components
- duplicate booking logic in multiple routes
- fragile hardcoded content

---

## DB and Supabase expectations
Schema must be normalized and include at minimum:
- products
- activities
- packages
- package_items
- airport_transfers
- transfer_zones
- transfer_zone_prices
- destinations
- product_destinations
- product_media
- product_pricing
- currency_rates
- availability_rules
- reviews
- booking_sessions
- cart_items
- customers
- bookings
- booking_travellers
- payments
- enquiries
- pages
- faqs
- testimonials
- promos
- navigation_items
- legal_pages
- settings

Agents should account for:
- enums
- FKs
- indexes
- publish state
- slug uniqueness
- audit timestamps
- RLS-sensitive tables

---

## Output format for every agent task
Every agent must return:

### 1. Summary
What was completed.

### 2. Files changed
Explicit list of created/updated/deleted files.

### 3. Key decisions
Important architectural or implementation choices.

### 4. Assumptions
Anything assumed because requirements were unclear.

### 5. Deferred items
Anything intentionally left for a later stage.

### 6. Risks
Any possible issues or follow-up concerns.

---

## Stage discipline
Agents must respect stage boundaries.

### Example
- DB agent should not invent final UI pages unless necessary
- UI agent should not redesign DB without clearly flagging it
- payment agent should not bypass booking snapshot logic
- admin agent should not hardcode content that belongs in CMS

---

## If tradeoffs are needed
Prefer:
1. correctness
2. maintainability
3. security
4. premium UX
5. scalability

Do not prefer speed if it damages the above.

---

## Final principle
Build Tropigo like a real modular booking platform, not a brochure site with a hacked checkout.