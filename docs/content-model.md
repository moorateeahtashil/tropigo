# Content Model (Supabase)

This document summarizes the backend-first content architecture used to power all public-facing content. Admin UI comes later; this is the schema foundation.

## Conventions
- UUID `id`, `created_at`, `updated_at` on all tables
- Slugs are unique and URL-safe on sluggable entities
- `published` + `published_at` for public visibility; homepage sections and promos also have time windows
- SEO fields as explicit columns for SSR pages
- JSONB used for flexible blocks (e.g., homepage sections, footer content)

## Entities
- site_settings (singleton): brand, locales, GA, SEO defaults
- navigation_menus / navigation_links: hierarchical menu structure (legacy)
- navigation_items: flattened menu items by area (main/utility/footer)
- footer_blocks (legacy) and footer_groups: footer column content
- homepage_sections: flexible blocks (hero, badges, regions, etc.)
- destinations, activities, tours (+ tours_activities join)
- activity_categories (+ tours_activity_categories): taxonomy for tours
- testimonials, faqs, legal_pages
- static_pages: general CMS pages
- badges: small highlights for sitewide or context-specific use
- promo_banners: campaign messaging with placements + windows
- contact_profiles (legacy) and contact_settings (singleton-style)
- tour_images: ordered gallery per tour
- availability_slots: inventory windows per tour with capacity and price
- coupons: server-validated discounts (admin-only)
- profiles: linked to auth.users with is_admin flag
- bookings, booking_items: booking foundation with owner+admin RLS

## RLS & Policies
- RLS enabled on all tables
- Public read-only policies for published/visible/active rows
- Admin CRUD via JWT claims: `role=admin` or `is_admin=true`
- No public writes

## Seed Data
- Minimal records to enable local development: menus, footer, a few destinations/activities/tours, testimonials, faqs, legal page, badge, promo, contact

## Developer Notes
- Apply migrations in a Supabase project
- Load seed data for local/dev environments only
- Generate types when a project exists:
  - `pnpm dlx supabase gen types typescript --project-id <project-id> --schema public > lib/server/db-types.ts`
- For uploads, use Supabase Storage later (not required yet)

## Future Admin UI
- Build lightweight admin in the same app, protected by Supabase Auth
- CRUD for: tours, pricing, availability, homepage sections, FAQs, testimonials, legal pages, featured content
