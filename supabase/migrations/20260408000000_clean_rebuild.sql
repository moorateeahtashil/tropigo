-- =============================================================
-- TROPIGO — COMPLETE SCHEMA REBUILD
-- Drops all legacy tables and rebuilds from clean domain model.
-- Run this migration after removing all prior migrations.
-- =============================================================

-- ---------------------------------------------------------------
-- DROP LEGACY OBJECTS (safe guard — idempotent)
-- ---------------------------------------------------------------

DROP TABLE IF EXISTS public.badge_links CASCADE;
DROP TABLE IF EXISTS public.badges CASCADE;
DROP TABLE IF EXISTS public.blog_categories CASCADE;
DROP TABLE IF EXISTS public.blog_posts CASCADE;
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.booking_items CASCADE;
DROP TABLE IF EXISTS public.booking_sessions CASCADE;
DROP TABLE IF EXISTS public.cart_items CASCADE;
DROP TABLE IF EXISTS public.contact_profiles CASCADE;
DROP TABLE IF EXISTS public.destinations CASCADE;
DROP TABLE IF EXISTS public.enquiries CASCADE;
DROP TABLE IF EXISTS public.faqs CASCADE;
DROP TABLE IF EXISTS public.footer_blocks CASCADE;
DROP TABLE IF EXISTS public.homepage_sections CASCADE;
DROP TABLE IF EXISTS public.legal_pages CASCADE;
DROP TABLE IF EXISTS public.navigation_links CASCADE;
DROP TABLE IF EXISTS public.navigation_items CASCADE;
DROP TABLE IF EXISTS public.navigation_menus CASCADE;
DROP TABLE IF EXISTS public.pages CASCADE;
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.pickup_locations CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.promo_banners CASCADE;
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.settings CASCADE;
DROP TABLE IF EXISTS public.site_settings CASCADE;
DROP TABLE IF EXISTS public.testimonials CASCADE;
DROP TABLE IF EXISTS public.tour_activities CASCADE;
DROP TABLE IF EXISTS public.tours CASCADE;
DROP TABLE IF EXISTS public.activities CASCADE;
DROP TABLE IF EXISTS public.packages CASCADE;
DROP TABLE IF EXISTS public.package_items CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.transfer_zones CASCADE;
DROP TABLE IF EXISTS public.customers CASCADE;

DROP TYPE IF EXISTS public.product_type CASCADE;
DROP TYPE IF EXISTS public.product_status CASCADE;
DROP TYPE IF EXISTS public.booking_status CASCADE;
DROP TYPE IF EXISTS public.payment_status CASCADE;
DROP TYPE IF EXISTS public.payment_provider CASCADE;
DROP TYPE IF EXISTS public.transfer_pricing_model CASCADE;
DROP TYPE IF EXISTS public.package_pricing_mode CASCADE;
DROP TYPE IF EXISTS public.vehicle_type CASCADE;
DROP TYPE IF EXISTS public.location_type CASCADE;
DROP TYPE IF EXISTS public.review_status CASCADE;
DROP TYPE IF EXISTS public.media_type CASCADE;

DROP FUNCTION IF EXISTS public.set_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.is_admin() CASCADE;

-- ---------------------------------------------------------------
-- ENUMS
-- ---------------------------------------------------------------

CREATE TYPE public.product_type AS ENUM (
  'airport_transfer',
  'activity',
  'package'
);

CREATE TYPE public.product_status AS ENUM (
  'draft',
  'published',
  'archived'
);

CREATE TYPE public.booking_status AS ENUM (
  'draft',
  'pending',
  'processing',
  'confirmed',
  'cancelled',
  'failed',
  'refunded'
);

CREATE TYPE public.payment_status AS ENUM (
  'pending',
  'succeeded',
  'failed',
  'refunded'
);

CREATE TYPE public.payment_provider AS ENUM (
  'stripe',
  'paypal',
  'manual'
);

CREATE TYPE public.transfer_pricing_model AS ENUM (
  'fixed',
  'zone_based',
  'distance_based'
);

CREATE TYPE public.package_pricing_mode AS ENUM (
  'fixed',
  'computed',
  'computed_with_discount'
);

CREATE TYPE public.vehicle_type AS ENUM (
  'sedan',
  'minivan',
  'bus',
  'luxury'
);

CREATE TYPE public.location_type AS ENUM (
  'airport',
  'hotel',
  'address',
  'custom'
);

CREATE TYPE public.review_status AS ENUM (
  'pending',
  'approved',
  'rejected'
);

CREATE TYPE public.media_type AS ENUM (
  'image',
  'video'
);

-- ---------------------------------------------------------------
-- UTILITY: updated_at trigger
-- ---------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- ---------------------------------------------------------------
-- PROFILES (extends auth.users)
-- ---------------------------------------------------------------

CREATE TABLE public.profiles (
  id          uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       text NOT NULL,
  full_name   text,
  avatar_url  text,
  is_admin    boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Auto-create profile on Supabase Auth user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ---------------------------------------------------------------
-- CATALOG DOMAIN
-- ---------------------------------------------------------------

CREATE TABLE public.destinations (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug            text NOT NULL,
  name            text NOT NULL,
  summary         text,
  description     text,
  region          text,
  hero_image_url  text,
  gallery_urls    text[] NOT NULL DEFAULT '{}',
  lat             numeric(10,6),
  lng             numeric(10,6),
  featured        boolean NOT NULL DEFAULT false,
  position        integer NOT NULL DEFAULT 0,
  seo_title       text,
  seo_description text,
  published       boolean NOT NULL DEFAULT false,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT destinations_slug_key UNIQUE (slug)
);

CREATE TRIGGER destinations_updated_at
  BEFORE UPDATE ON public.destinations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Transfer zones — for zone-based pricing
CREATE TABLE public.transfer_zones (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  description text,
  color       text NOT NULL DEFAULT '#64748B',
  sort_order  integer NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Products — unified base table for all product types
CREATE TABLE public.products (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_type     public.product_type NOT NULL,
  slug             text NOT NULL,
  title            text NOT NULL,
  subtitle         text,
  summary          text,
  description      text,
  status           public.product_status NOT NULL DEFAULT 'draft',
  base_currency    char(3) NOT NULL DEFAULT 'MUR',
  base_price       numeric(12,2),
  featured         boolean NOT NULL DEFAULT false,
  position         integer NOT NULL DEFAULT 0,
  seo_title        text,
  seo_description  text,
  seo_image_url    text,
  canonical_url    text,
  noindex          boolean NOT NULL DEFAULT false,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT products_slug_key UNIQUE (slug)
);

CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Activities — extends products (1:1)
CREATE TABLE public.activities (
  product_id         uuid PRIMARY KEY REFERENCES public.products(id) ON DELETE CASCADE,
  duration_minutes   integer,
  tour_type          text CHECK (tour_type IN ('private', 'group', 'shared')),
  transportation     text,
  pickup_location    text,
  pickup_time        text,
  min_participants   integer NOT NULL DEFAULT 1,
  max_participants   integer,
  difficulty_level   text CHECK (difficulty_level IN ('easy', 'moderate', 'challenging')),
  included_items     text[] NOT NULL DEFAULT '{}',
  excluded_items     text[] NOT NULL DEFAULT '{}',
  highlights         text[] NOT NULL DEFAULT '{}',
  itinerary          jsonb NOT NULL DEFAULT '[]',
  important_notes    text,
  destination_id     uuid REFERENCES public.destinations(id) ON DELETE SET NULL,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER activities_updated_at
  BEFORE UPDATE ON public.activities
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Airport Transfers — extends products (1:1)
CREATE TABLE public.airport_transfers (
  product_id                uuid PRIMARY KEY REFERENCES public.products(id) ON DELETE CASCADE,
  pricing_model             public.transfer_pricing_model NOT NULL DEFAULT 'fixed',
  vehicle_type              public.vehicle_type NOT NULL DEFAULT 'sedan',
  max_passengers            integer NOT NULL DEFAULT 4,
  max_luggage               integer,
  includes_meet_greet       boolean NOT NULL DEFAULT false,
  includes_flight_tracking  boolean NOT NULL DEFAULT false,
  base_fare                 numeric(12,2),
  per_km_rate               numeric(8,4),
  waiting_fee_per_hour      numeric(8,2),
  notes                     text,
  created_at                timestamptz NOT NULL DEFAULT now(),
  updated_at                timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER airport_transfers_updated_at
  BEFORE UPDATE ON public.airport_transfers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Transfer hotels — maps hotel names to zones for zone_based pricing
CREATE TABLE public.transfer_hotels (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  zone_id     uuid REFERENCES public.transfer_zones(id) ON DELETE SET NULL,
  address     text,
  latitude    numeric(10,6),
  longitude   numeric(10,6),
  published   boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Transfer zone prices — price matrix per zone pair
CREATE TABLE public.transfer_zone_prices (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transfer_id   uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  from_zone_id  uuid NOT NULL REFERENCES public.transfer_zones(id) ON DELETE CASCADE,
  to_zone_id    uuid NOT NULL REFERENCES public.transfer_zones(id) ON DELETE CASCADE,
  vehicle_type  public.vehicle_type,
  price         numeric(12,2) NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT transfer_zone_prices_unique UNIQUE (transfer_id, from_zone_id, to_zone_id, vehicle_type)
);

CREATE TRIGGER transfer_zone_prices_updated_at
  BEFORE UPDATE ON public.transfer_zone_prices
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Packages — extends products (1:1)
CREATE TABLE public.packages (
  product_id        uuid PRIMARY KEY REFERENCES public.products(id) ON DELETE CASCADE,
  pricing_mode      public.package_pricing_mode NOT NULL DEFAULT 'computed',
  discount_percent  numeric(5,2) NOT NULL DEFAULT 0 CHECK (discount_percent >= 0 AND discount_percent <= 100),
  duration_days     integer,
  highlights        text[] NOT NULL DEFAULT '{}',
  important_notes   text,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER packages_updated_at
  BEFORE UPDATE ON public.packages
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Package items — components that make up a package
CREATE TABLE public.package_items (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id          uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  product_id          uuid NOT NULL REFERENCES public.products(id),
  sort_order          integer NOT NULL DEFAULT 0,
  is_optional         boolean NOT NULL DEFAULT false,
  is_default_selected boolean NOT NULL DEFAULT true,
  quantity            integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  price_override      numeric(12,2),
  notes               text,
  created_at          timestamptz NOT NULL DEFAULT now()
);

-- Product destinations — many-to-many
CREATE TABLE public.product_destinations (
  product_id      uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  destination_id  uuid NOT NULL REFERENCES public.destinations(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, destination_id)
);

-- Product media — images and videos per product
CREATE TABLE public.product_media (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  url         text NOT NULL,
  alt         text,
  media_type  public.media_type NOT NULL DEFAULT 'image',
  is_cover    boolean NOT NULL DEFAULT false,
  sort_order  integer NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Product pricing — manual currency override prices (admin-set)
CREATE TABLE public.product_pricing (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  currency    char(3) NOT NULL,
  price       numeric(12,2) NOT NULL CHECK (price >= 0),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT product_pricing_unique UNIQUE (product_id, currency)
);

CREATE TRIGGER product_pricing_updated_at
  BEFORE UPDATE ON public.product_pricing
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Currency rates — cached exchange rates, refreshed by cron every 6h
CREATE TABLE public.currency_rates (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_currency char(3) NOT NULL,
  to_currency   char(3) NOT NULL,
  rate          numeric(18,8) NOT NULL CHECK (rate > 0),
  fetched_at    timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT currency_rates_unique UNIQUE (from_currency, to_currency)
);

-- Availability rules — blackout dates, schedules, advance booking cutoffs
CREATE TABLE public.availability_rules (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id         uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  rule_type          text NOT NULL CHECK (rule_type IN ('blackout', 'schedule', 'cutoff')),
  start_date         date,
  end_date           date,
  days_of_week       integer[] NOT NULL DEFAULT '{}',
  min_advance_hours  integer NOT NULL DEFAULT 24,
  max_advance_days   integer,
  notes              text,
  created_at         timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------
-- BOOKING DOMAIN
-- ---------------------------------------------------------------

-- Customers — separate from auth.users to support guest checkout
CREATE TABLE public.customers (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supabase_user_id  uuid UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
  email             text NOT NULL,
  first_name        text NOT NULL,
  last_name         text NOT NULL,
  phone             text,
  country           text,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Booking sessions — ephemeral, expire 2h after last activity
CREATE TABLE public.booking_sessions (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  currency                char(3) NOT NULL DEFAULT 'EUR',
  customer_email          text,
  exchange_rates_snapshot jsonb NOT NULL DEFAULT '{}',
  metadata                jsonb NOT NULL DEFAULT '{}',
  expires_at              timestamptz NOT NULL DEFAULT now() + interval '2 hours',
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER booking_sessions_updated_at
  BEFORE UPDATE ON public.booking_sessions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Cart items — line items in a session, prices frozen at add time
CREATE TABLE public.cart_items (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id            uuid NOT NULL REFERENCES public.booking_sessions(id) ON DELETE CASCADE,
  product_id            uuid NOT NULL REFERENCES public.products(id),
  product_type          public.product_type NOT NULL,
  quantity              integer NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price            numeric(12,2) NOT NULL,
  currency              char(3) NOT NULL,
  exchange_rate         numeric(18,8) NOT NULL DEFAULT 1,
  price_snapshot        jsonb NOT NULL DEFAULT '{}',
  booking_date          date,
  booking_time          text,
  special_requirements  text,
  created_at            timestamptz NOT NULL DEFAULT now()
);

-- Bookings — permanent records created at checkout
CREATE TABLE public.bookings (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ref                    text NOT NULL,
  session_id             uuid REFERENCES public.booking_sessions(id) ON DELETE SET NULL,
  customer_id            uuid REFERENCES public.customers(id) ON DELETE SET NULL,
  status                 public.booking_status NOT NULL DEFAULT 'pending',
  currency               char(3) NOT NULL,
  subtotal               numeric(12,2) NOT NULL,
  total_amount           numeric(12,2) NOT NULL,
  exchange_rate_snapshot jsonb NOT NULL DEFAULT '{}',
  special_requirements   text,
  internal_notes         text,
  confirmed_at           timestamptz,
  cancelled_at           timestamptz,
  created_at             timestamptz NOT NULL DEFAULT now(),
  updated_at             timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT bookings_ref_key UNIQUE (ref)
);

CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Booking items — immutable line item snapshot
CREATE TABLE public.booking_items (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id     uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  product_id     uuid REFERENCES public.products(id) ON DELETE SET NULL,
  product_type   public.product_type NOT NULL,
  product_title  text NOT NULL,
  quantity       integer NOT NULL DEFAULT 1,
  unit_price     numeric(12,2) NOT NULL,
  total_price    numeric(12,2) NOT NULL,
  currency       char(3) NOT NULL,
  booking_date   date,
  booking_time   text,
  snapshot       jsonb NOT NULL DEFAULT '{}',
  created_at     timestamptz NOT NULL DEFAULT now()
);

-- Booking travellers — per booking
CREATE TABLE public.booking_travellers (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id            uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  first_name            text NOT NULL,
  last_name             text NOT NULL,
  email                 text,
  phone                 text,
  date_of_birth         date,
  nationality           text,
  passport_number       text,
  is_lead_traveller     boolean NOT NULL DEFAULT false,
  special_requirements  text,
  created_at            timestamptz NOT NULL DEFAULT now()
);

-- Transfer booking details — supplemental for transfer line items
CREATE TABLE public.transfer_booking_details (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_item_id       uuid NOT NULL REFERENCES public.booking_items(id) ON DELETE CASCADE,
  pickup_type           public.location_type NOT NULL,
  dropoff_type          public.location_type NOT NULL,
  pickup_location       text NOT NULL,
  dropoff_location      text NOT NULL,
  pickup_datetime       timestamptz NOT NULL,
  passenger_count       integer NOT NULL,
  luggage_count         integer,
  flight_number         text,
  special_instructions  text,
  created_at            timestamptz NOT NULL DEFAULT now()
);

-- Payments — one per booking, supports multiple providers
CREATE TABLE public.payments (
  id                          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id                  uuid NOT NULL REFERENCES public.bookings(id) ON DELETE CASCADE,
  provider                    public.payment_provider NOT NULL,
  provider_session_id         text,
  provider_payment_intent_id  text,
  status                      public.payment_status NOT NULL DEFAULT 'pending',
  amount                      numeric(12,2) NOT NULL,
  currency                    char(3) NOT NULL,
  provider_fee                numeric(12,2),
  metadata                    jsonb NOT NULL DEFAULT '{}',
  paid_at                     timestamptz,
  refunded_at                 timestamptz,
  created_at                  timestamptz NOT NULL DEFAULT now(),
  updated_at                  timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Reviews — product-linked, moderated
CREATE TABLE public.reviews (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id       uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  booking_id       uuid REFERENCES public.bookings(id) ON DELETE SET NULL,
  customer_id      uuid REFERENCES public.customers(id) ON DELETE SET NULL,
  author_name      text NOT NULL,
  author_email     text,
  rating           integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title            text,
  body             text NOT NULL,
  status           public.review_status NOT NULL DEFAULT 'pending',
  admin_reply      text,
  helpful_count    integer NOT NULL DEFAULT 0,
  verified_booking boolean NOT NULL DEFAULT false,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Enquiries — fallback contact for bookings or general
CREATE TABLE public.enquiries (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name                text NOT NULL,
  email               text NOT NULL,
  phone               text,
  subject             text,
  message             text NOT NULL,
  related_product_id  uuid REFERENCES public.products(id) ON DELETE SET NULL,
  status              text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved', 'archived')),
  admin_notes         text,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER enquiries_updated_at
  BEFORE UPDATE ON public.enquiries
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------
-- CONTENT DOMAIN
-- ---------------------------------------------------------------

-- Settings — singleton row (enforced by fixed PK)
CREATE TABLE public.settings (
  id                      uuid PRIMARY KEY DEFAULT '00000000-0000-0000-0000-000000000001'::uuid,
  brand_name              text NOT NULL DEFAULT 'Tropigo',
  tagline                 text,
  logo_url                text,
  favicon_url             text,
  contact_email           text,
  contact_phone           text,
  whatsapp                text,
  address                 jsonb NOT NULL DEFAULT '{}',
  socials                 jsonb NOT NULL DEFAULT '{}',
  supported_currencies    text[] NOT NULL DEFAULT '{MUR,EUR,USD,GBP}',
  default_currency        char(3) NOT NULL DEFAULT 'EUR',
  ga4_id                  text,
  default_seo_title       text,
  default_seo_description text,
  default_og_image_url    text,
  maintenance_mode        boolean NOT NULL DEFAULT false,
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER settings_updated_at
  BEFORE UPDATE ON public.settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed singleton settings row
INSERT INTO public.settings (id) VALUES ('00000000-0000-0000-0000-000000000001'::uuid)
  ON CONFLICT DO NOTHING;

-- Static pages (about, contact, etc.)
CREATE TABLE public.pages (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             text NOT NULL,
  title            text NOT NULL,
  content          text,
  seo_title        text,
  seo_description  text,
  published        boolean NOT NULL DEFAULT false,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT pages_slug_key UNIQUE (slug)
);

CREATE TRIGGER pages_updated_at
  BEFORE UPDATE ON public.pages
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Legal pages (T&Cs, privacy, etc.)
CREATE TABLE public.legal_pages (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             text NOT NULL,
  title            text NOT NULL,
  content          text NOT NULL DEFAULT '',
  version          text,
  effective_date   date,
  published        boolean NOT NULL DEFAULT false,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT legal_pages_slug_key UNIQUE (slug)
);

CREATE TRIGGER legal_pages_updated_at
  BEFORE UPDATE ON public.legal_pages
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- FAQs — can be global or product-linked
CREATE TABLE public.faqs (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category           text NOT NULL DEFAULT 'general',
  question           text NOT NULL,
  answer             text NOT NULL,
  position           integer NOT NULL DEFAULT 0,
  related_product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  published          boolean NOT NULL DEFAULT true,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER faqs_updated_at
  BEFORE UPDATE ON public.faqs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Testimonials
CREATE TABLE public.testimonials (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name         text NOT NULL,
  author_location     text,
  quote               text NOT NULL,
  rating              integer CHECK (rating BETWEEN 1 AND 5),
  photo_url           text,
  related_product_id  uuid REFERENCES public.products(id) ON DELETE SET NULL,
  position            integer NOT NULL DEFAULT 0,
  published           boolean NOT NULL DEFAULT false,
  created_at          timestamptz NOT NULL DEFAULT now()
);

-- Promo banners — time-controlled, placement-aware
CREATE TABLE public.promo_banners (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title             text NOT NULL,
  body              text,
  cta_label         text,
  cta_url           text,
  placement         text NOT NULL DEFAULT 'sitewide_top'
                    CHECK (placement IN ('sitewide_top', 'homepage_hero', 'footer', 'inline')),
  background_color  text NOT NULL DEFAULT '#0D2B45',
  text_color        text NOT NULL DEFAULT '#FFFFFF',
  start_at          timestamptz,
  end_at            timestamptz,
  active            boolean NOT NULL DEFAULT false,
  priority          integer NOT NULL DEFAULT 0,
  created_at        timestamptz NOT NULL DEFAULT now()
);

-- Navigation menus
CREATE TABLE public.navigation_menus (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key         text NOT NULL,
  label       text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT navigation_menus_key_unique UNIQUE (key)
);

CREATE TABLE public.navigation_items (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_id         uuid NOT NULL REFERENCES public.navigation_menus(id) ON DELETE CASCADE,
  parent_id       uuid REFERENCES public.navigation_items(id) ON DELETE CASCADE,
  label           text NOT NULL,
  href            text NOT NULL,
  link_type       text NOT NULL DEFAULT 'internal'
                  CHECK (link_type IN ('internal', 'external', 'anchor')),
  open_in_new_tab boolean NOT NULL DEFAULT false,
  position        integer NOT NULL DEFAULT 0,
  visible         boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- Homepage sections — CMS-driven layout blocks
CREATE TABLE public.homepage_sections (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_type  text NOT NULL
                CHECK (section_type IN (
                  'hero', 'transfers_cta', 'featured_activities',
                  'featured_packages', 'destinations', 'testimonials',
                  'promo', 'faqs', 'stats', 'custom'
                )),
  title         text,
  subtitle      text,
  data          jsonb NOT NULL DEFAULT '{}',
  position      integer NOT NULL DEFAULT 0,
  published     boolean NOT NULL DEFAULT false,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER homepage_sections_updated_at
  BEFORE UPDATE ON public.homepage_sections
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------
-- INDEXES
-- ---------------------------------------------------------------

CREATE INDEX idx_products_status ON public.products (status);
CREATE INDEX idx_products_type ON public.products (product_type);
CREATE INDEX idx_products_featured ON public.products (featured) WHERE featured = true;
CREATE INDEX idx_products_slug ON public.products (slug);
CREATE INDEX idx_products_position ON public.products (product_type, position);

CREATE INDEX idx_activities_destination ON public.activities (destination_id);

CREATE INDEX idx_product_media_product ON public.product_media (product_id, sort_order);
CREATE INDEX idx_product_media_cover ON public.product_media (product_id) WHERE is_cover = true;

CREATE INDEX idx_product_pricing_product ON public.product_pricing (product_id);
CREATE INDEX idx_package_items_package ON public.package_items (package_id, sort_order);
CREATE INDEX idx_transfer_zone_prices_transfer ON public.transfer_zone_prices (transfer_id);
CREATE INDEX idx_transfer_hotels_zone ON public.transfer_hotels (zone_id);

CREATE INDEX idx_booking_sessions_expires ON public.booking_sessions (expires_at);
CREATE INDEX idx_cart_items_session ON public.cart_items (session_id);

CREATE INDEX idx_bookings_customer ON public.bookings (customer_id);
CREATE INDEX idx_bookings_status ON public.bookings (status);
CREATE INDEX idx_bookings_ref ON public.bookings (ref);
CREATE INDEX idx_bookings_created ON public.bookings (created_at DESC);

CREATE INDEX idx_payments_booking ON public.payments (booking_id);
CREATE INDEX idx_payments_provider_session ON public.payments (provider_session_id);
CREATE INDEX idx_payments_provider_intent ON public.payments (provider_payment_intent_id);
CREATE INDEX idx_payments_status ON public.payments (status);

CREATE INDEX idx_reviews_product ON public.reviews (product_id);
CREATE INDEX idx_reviews_status ON public.reviews (status);

CREATE INDEX idx_enquiries_status ON public.enquiries (status);
CREATE INDEX idx_enquiries_created ON public.enquiries (created_at DESC);

CREATE INDEX idx_currency_rates_fetched ON public.currency_rates (fetched_at);

CREATE INDEX idx_faqs_category ON public.faqs (category, position);
CREATE INDEX idx_navigation_items_menu ON public.navigation_items (menu_id, position);
CREATE INDEX idx_homepage_sections_position ON public.homepage_sections (position)
  WHERE published = true;

CREATE INDEX idx_product_destinations_destination ON public.product_destinations (destination_id);
CREATE INDEX idx_destinations_featured ON public.destinations (featured, position)
  WHERE published = true;
