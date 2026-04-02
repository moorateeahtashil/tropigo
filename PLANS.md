# PLANS.md

## Plan A: Scaffold & Docker (Completed)

- Lean Next.js + TS + Tailwind scaffold, layout shell, Supabase client placeholder, Docker dev/prod. See README for usage.

---

## Plan B: Backend‑First Content Architecture (Current)

Goal
- Design a Supabase (Postgres) content model so all public-facing content can be managed from the backend, enabling homepage, listings, and informational pages to be driven by data. No UI changes yet.

Assumptions
- Single-app Next.js with Supabase for DB/Auth/Storage per AGENTS.md.
- Public pages are server-rendered; content is published via explicit flags/timestamps.
- Use JSONB where flexible, normalized tables where relational clarity is needed.
- Reference UI (reference.html + reference_admin.html) informs content fields, not markup.

Files to Change (in this plan)
- supabase/migrations/*.sql – schema and RLS policies
- supabase/seed.sql – optional seed content for local dev
- lib/server/db-types.ts – generated types (via Supabase CLI) and helpers
- docs/content-model.md – schema overview and editing guidelines

Out of Scope (for this plan)
- Admin UI (build later after schema finalization)
- Booking workflow, pricing/availability logic

Risks
- Over-flexible JSON can complicate querying for SEO; balance with structured fields.
- RLS complexity; ensure public read-only access for published content only.
- Slugs and uniqueness constraints must be enforced to prevent SEO regressions.

Implementation Steps
1) Create base schema tables and enums
2) Add indexes, foreign keys, uniqueness, default timestamps
3) Add RLS and policies (public read for published content, admin CRUD)
4) Add seed data for development
5) Generate typed client types and DB helpers
6) Documentation for editors (content-model.md)

Verification Checklist
- All migrations apply cleanly on a fresh Supabase DB
- RLS: anonymous can select only published content
- Admin role can CRUD content
- Example queries return homepage content blocks, navigation, destinations, tours, FAQs, legal, testimonials, promos
- SEO fields exist on content entities and are non-null where required for public pages

---

Content Model (Supabase)

Conventions
- id: UUID default gen_random_uuid(); created_at/updated_at timestamptz default now(), triggers for updated_at
- slug: text unique, lowercase, URL-safe
- position: integer for ordering
- seo fields: seo_title, seo_description, seo_image_url, canonical_url, noindex boolean default false, structured_data jsonb
- published: boolean default false, published_at timestamptz null

1) site_settings (singleton)
- id (uuid, default fixed UUID or enforce single row via CHECK)
- brand_name text, logo_url text, default_locale text, currency text
- contact_email text, phone text, address jsonb, socials jsonb
- ga4_id text, meta jsonb
- seo defaults: seo_title_template text, default_meta_description text, default_og_image_url text
Constraint: enforce one row via CHECK (id = '00000000-0000-0000-0000-000000000001') or unique boolean is_singleton = true

2) navigation_menus
- id, key text unique (e.g., 'main', 'footer', 'utility'), label text, description text

navigation_links
- id, menu_id fk -> navigation_menus, parent_id fk self (nullable), label text, href text, link_type text check ('internal','external','anchor')
- page_ref_type text nullable ('destination','activity','tour','legal','custom')
- page_ref_id uuid nullable (soft reference only)
- position int, visible boolean default true
Indexes: (menu_id, position), (parent_id)

3) footer_blocks
- id, key text unique ('company','explore','support','legal'), title text, content jsonb (links/columns), position

4) homepage_sections
- id, section_type text check ('hero','badges','regions','experiences','features','testimonials','faqs','promo','cta','custom')
- title text, subtitle text, data jsonb (flexible payload for cards/grids)
- position int, published boolean default false, start_at timestamptz null, end_at timestamptz null

5) destinations
- id, name, slug unique, summary text, body text, hero_image_url text, gallery_urls text[]
- region text, lat numeric, lng numeric, featured boolean default false, position int
- seo_* fields, published, published_at
Indexes: slug unique, (featured, position), gin on to_tsvector(name || summary)

6) activities
- id, name, slug unique, description text, icon_url text, image_url text
- seo_* fields, published, position

7) tours
- id, name, slug unique, destination_id fk -> destinations, summary text, description text
- duration text, difficulty text, price_from numeric(12,2), currency text
- hero_image_url text, gallery_urls text[]
- is_active boolean default true, featured boolean default false, position int
- seo_* fields, published, published_at

tours_activities (join)
- tour_id fk -> tours, activity_id fk -> activities
PK (tour_id, activity_id)

8) testimonials
- id, author_name text, author_location text, quote text, rating int check 1..5
- photo_url text, related_tour_id fk nullable, related_destination_id fk nullable
- published boolean default false, position int

9) faqs
- id, category text, question text, answer text, position int, published boolean

10) legal_pages
- id, title text, slug unique, content markdown text (or richtext jsonb), position int
- seo_* fields, published, published_at

11) badges
- id, label text, description text, icon_url text, context text check ('sitewide','homepage','tour','destination'), position int, published boolean

12) promo_banners
- id, title text, body text, cta_label text, cta_url text
- placement text check ('sitewide_top','homepage_hero','footer','inline')
- start_at timestamptz, end_at timestamptz, active boolean default false
- background jsonb (color/image), priority int

13) contact_profiles (or site_contact)
- id, label text ('primary'), emails text[], phones text[], whatsapp text, address jsonb, hours jsonb
- published boolean default false
Note: Alternatively, keep contact info in site_settings; we keep a separate table to support multiple profiles if needed.

14) media (optional later)
- Defer unless uploads needed (then use Supabase Storage). For now use URLs.

RLS & Auth
- Enable RLS on all tables.
- Anonymous: SELECT only rows where published = true AND (now() between start_at and end_at if present).
- Admin: authenticated users with jwt claim `role` = 'admin' or `is_admin` = true can CRUD.
- Policies use `auth.jwt()` claims. Admin creation handled manually for MVP.
- Ensure no public INSERT/UPDATE/DELETE on any content table.

Indexes & Constraints
- UNIQUE on slug for sluggable tables.
- Foreign keys with ON DELETE SET NULL where content is optional; cascade for join tables.
- GIN index for text search fields if needed later.

Seed Data (dev)
- site_settings (singleton)
- navigation_menus ('main','footer') + representative links
- footer_blocks base columns/links
- 2–3 destinations, 2–3 activities, 2 tours with activities
- 2 testimonials, 3 faqs, 1 promo banner, 2 badges
- homepage_sections with hero + badges + regions layout data in jsonb

Deliverables in Repo (as part of this plan execution)
- supabase/migrations/20260402T000000_init_content.sql (schema + RLS skeleton)
- supabase/seed.sql (dev content)
- docs/content-model.md (explain each table, expected editors’ flow)
- lib/server/db-types.ts (generated; commit when stable) – generation command documented

Rollout Plan
- Apply migrations to Supabase project.
- Generate types: `pnpm dlx supabase gen types typescript --project-id <id> --schema public > lib/server/db-types.ts`
- Wire read-only queries on server components as a next step (not in this plan).
