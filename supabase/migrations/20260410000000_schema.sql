-- =============================================================
-- TROPIGO — COMPLETE SCHEMA (single migration)
-- Replaces all previous migrations. Run with:
--   npx supabase db reset --linked
-- =============================================================

-- ---------------------------------------------------------------
-- DROP LEGACY OBJECTS (idempotent)
-- ---------------------------------------------------------------

DROP TABLE IF EXISTS public.booking_slots CASCADE;
DROP TABLE IF EXISTS public.trip_schedules CASCADE;
DROP TABLE IF EXISTS public.driver_availability CASCADE;
DROP TABLE IF EXISTS public.drivers CASCADE;
DROP TABLE IF EXISTS public.trips CASCADE;
DROP TABLE IF EXISTS public.newsletter_subscriptions CASCADE;
DROP TABLE IF EXISTS public.homepage_sections CASCADE;
DROP TABLE IF EXISTS public.navigation_items CASCADE;
DROP TABLE IF EXISTS public.navigation_menus CASCADE;
DROP TABLE IF EXISTS public.promo_banners CASCADE;
DROP TABLE IF EXISTS public.testimonials CASCADE;
DROP TABLE IF EXISTS public.faqs CASCADE;
DROP TABLE IF EXISTS public.legal_pages CASCADE;
DROP TABLE IF EXISTS public.pages CASCADE;
DROP TABLE IF EXISTS public.settings CASCADE;
DROP TABLE IF EXISTS public.enquiries CASCADE;
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.transfer_booking_details CASCADE;
DROP TABLE IF EXISTS public.booking_travellers CASCADE;
DROP TABLE IF EXISTS public.booking_items CASCADE;
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.cart_items CASCADE;
DROP TABLE IF EXISTS public.booking_sessions CASCADE;
DROP TABLE IF EXISTS public.customers CASCADE;
DROP TABLE IF EXISTS public.availability_rules CASCADE;
DROP TABLE IF EXISTS public.currency_rates CASCADE;
DROP TABLE IF EXISTS public.product_pricing CASCADE;
DROP TABLE IF EXISTS public.product_media CASCADE;
DROP TABLE IF EXISTS public.product_destinations CASCADE;
DROP TABLE IF EXISTS public.package_items CASCADE;
DROP TABLE IF EXISTS public.packages CASCADE;
DROP TABLE IF EXISTS public.transfer_zone_prices CASCADE;
DROP TABLE IF EXISTS public.transfer_hotels CASCADE;
DROP TABLE IF EXISTS public.airport_transfers CASCADE;
DROP TABLE IF EXISTS public.activities CASCADE;
DROP TABLE IF EXISTS public.products CASCADE;
DROP TABLE IF EXISTS public.transfer_zones CASCADE;
DROP TABLE IF EXISTS public.destinations CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
-- Legacy tables
DROP TABLE IF EXISTS public.badge_links CASCADE;
DROP TABLE IF EXISTS public.badges CASCADE;
DROP TABLE IF EXISTS public.blog_categories CASCADE;
DROP TABLE IF EXISTS public.blog_posts CASCADE;
DROP TABLE IF EXISTS public.contact_profiles CASCADE;
DROP TABLE IF EXISTS public.pickup_locations CASCADE;
DROP TABLE IF EXISTS public.tour_activities CASCADE;
DROP TABLE IF EXISTS public.tours CASCADE;
DROP TABLE IF EXISTS public.site_settings CASCADE;
DROP TABLE IF EXISTS public.promo_codes CASCADE;

DROP TYPE IF EXISTS public.trip_mode CASCADE;
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
DROP FUNCTION IF EXISTS public.get_available_driver_count(uuid, date, time) CASCADE;
DROP FUNCTION IF EXISTS public.get_driver_availability_for_range(uuid, date, date) CASCADE;
DROP FUNCTION IF EXISTS public.decrement_driver_availability(uuid, date, time) CASCADE;
DROP FUNCTION IF EXISTS public.increment_driver_availability(uuid, date, time) CASCADE;
DROP FUNCTION IF EXISTS public.update_newsletter_updated_at() CASCADE;

-- ---------------------------------------------------------------
-- ENUMS
-- ---------------------------------------------------------------

CREATE TYPE public.product_type AS ENUM (
  'airport_transfer',
  'activity',
  'package',
  'trip'
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

CREATE TYPE public.trip_mode AS ENUM (
  'guided_tour',
  'single_dropoff'
);

-- ---------------------------------------------------------------
-- UTILITY: updated_at trigger
-- ---------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
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
CREATE TRIGGER profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''))
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
  slug            text NOT NULL UNIQUE,
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
  updated_at      timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER destinations_updated_at BEFORE UPDATE ON public.destinations
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.transfer_zones (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  description text,
  color       text NOT NULL DEFAULT '#64748B',
  sort_order  integer NOT NULL DEFAULT 0,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.products (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_type     public.product_type NOT NULL,
  slug             text NOT NULL UNIQUE,
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
  updated_at       timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER products_updated_at BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Activities — legacy product extension (1:1)
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
CREATE TRIGGER activities_updated_at BEFORE UPDATE ON public.activities
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Airport Transfers — product extension (1:1)
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
CREATE TRIGGER airport_transfers_updated_at BEFORE UPDATE ON public.airport_transfers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

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

CREATE TABLE public.transfer_zone_prices (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transfer_id   uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  from_zone_id  uuid NOT NULL REFERENCES public.transfer_zones(id) ON DELETE CASCADE,
  to_zone_id    uuid NOT NULL REFERENCES public.transfer_zones(id) ON DELETE CASCADE,
  vehicle_type  public.vehicle_type,
  price         numeric(12,2) NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (transfer_id, from_zone_id, to_zone_id, vehicle_type)
);
CREATE TRIGGER transfer_zone_prices_updated_at BEFORE UPDATE ON public.transfer_zone_prices
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Packages — product extension (1:1)
CREATE TABLE public.packages (
  product_id          uuid PRIMARY KEY REFERENCES public.products(id) ON DELETE CASCADE,
  pricing_mode        public.package_pricing_mode NOT NULL DEFAULT 'computed',
  discount_percent    numeric(5,2) NOT NULL DEFAULT 0 CHECK (discount_percent >= 0 AND discount_percent <= 100),
  duration_days       integer,
  highlights          text[] NOT NULL DEFAULT '{}',
  important_notes     text,
  own_price           numeric(12,2),
  start_time          text,
  own_availability    jsonb NOT NULL DEFAULT '{}',
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER packages_updated_at BEFORE UPDATE ON public.packages
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

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

CREATE TABLE public.product_destinations (
  product_id      uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  destination_id  uuid NOT NULL REFERENCES public.destinations(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, destination_id)
);

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

CREATE TABLE public.product_pricing (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id  uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  currency    char(3) NOT NULL,
  price       numeric(12,2) NOT NULL CHECK (price >= 0),
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  UNIQUE (product_id, currency)
);
CREATE TRIGGER product_pricing_updated_at BEFORE UPDATE ON public.product_pricing
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.currency_rates (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  from_currency char(3) NOT NULL,
  to_currency   char(3) NOT NULL,
  rate          numeric(18,8) NOT NULL CHECK (rate > 0),
  fetched_at    timestamptz NOT NULL DEFAULT now(),
  UNIQUE (from_currency, to_currency)
);

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

-- Trips — core business product extension (1:1)
CREATE TABLE public.trips (
  product_id         uuid PRIMARY KEY REFERENCES public.products(id) ON DELETE CASCADE,
  trip_mode          public.trip_mode NOT NULL DEFAULT 'guided_tour',
  trip_type          text,
  duration_minutes   integer,
  vehicle_type       text,
  driver_id          uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  max_passengers     integer NOT NULL DEFAULT 6,
  pickup_included    boolean NOT NULL DEFAULT true,
  pickup_location    text,
  pickup_time        text,
  dropoff_location   text,
  dropoff_included   boolean NOT NULL DEFAULT true,
  included_items     text[] NOT NULL DEFAULT '{}',
  excluded_items     text[] NOT NULL DEFAULT '{}',
  highlights         text[] NOT NULL DEFAULT '{}',
  itinerary          jsonb NOT NULL DEFAULT '[]',
  important_notes    text,
  destination_id     uuid REFERENCES public.destinations(id) ON DELETE SET NULL,
  difficulty_level   text CHECK (difficulty_level IS NULL OR difficulty_level IN ('easy', 'moderate', 'challenging')),
  min_participants   integer NOT NULL DEFAULT 1,
  max_participants   integer,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER trips_updated_at BEFORE UPDATE ON public.trips
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

COMMENT ON TABLE public.trips IS 'Guided driving tours — core business. Includes driver, vehicle, pickup/dropoff, itinerary.';
COMMENT ON COLUMN public.trips.trip_mode IS 'guided_tour = multi-stop itinerary; single_dropoff = simple transport to one venue';
COMMENT ON COLUMN public.trips.itinerary IS 'Ordered stops: [{time, title, description, photo_url, duration_minutes}]';

-- Trip schedules — when each trip runs
CREATE TABLE public.trip_schedules (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id       uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  day_of_week   integer NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time    text NOT NULL,
  max_capacity  integer NOT NULL DEFAULT 6,
  is_active     boolean NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now()
);

COMMENT ON COLUMN public.trip_schedules.day_of_week IS '0=Sunday, 1=Monday, ..., 6=Saturday';

-- Drivers
CREATE TABLE public.drivers (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  first_name     text NOT NULL,
  last_name      text NOT NULL,
  phone          text,
  email          text,
  vehicle_type   text,
  license_plate  text,
  is_active      boolean NOT NULL DEFAULT true,
  created_at     timestamptz NOT NULL DEFAULT now(),
  updated_at     timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER drivers_updated_at BEFORE UPDATE ON public.drivers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Driver availability — recurring weekly schedule
CREATE TABLE public.driver_availability (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id    uuid NOT NULL REFERENCES public.drivers(id) ON DELETE CASCADE,
  day_of_week  integer NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time   text NOT NULL,
  end_time     text,
  is_available boolean NOT NULL DEFAULT true,
  created_at   timestamptz NOT NULL DEFAULT now()
);

COMMENT ON COLUMN public.driver_availability.day_of_week IS '0=Sunday through 6=Saturday';

-- Booking slots — tracks booked seats per trip departure
CREATE TABLE public.booking_slots (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id         uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  departure_date  date NOT NULL,
  start_time      text NOT NULL,
  booked_count    integer NOT NULL DEFAULT 0,
  max_capacity    integer NOT NULL DEFAULT 6,
  created_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE (trip_id, departure_date, start_time)
);

-- ---------------------------------------------------------------
-- BOOKING DOMAIN
-- ---------------------------------------------------------------

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
CREATE TRIGGER customers_updated_at BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

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
CREATE TRIGGER booking_sessions_updated_at BEFORE UPDATE ON public.booking_sessions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

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

CREATE TABLE public.bookings (
  id                     uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ref                    text NOT NULL UNIQUE,
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
  updated_at             timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER bookings_updated_at BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

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
CREATE TRIGGER payments_updated_at BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

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
CREATE TRIGGER reviews_updated_at BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

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
CREATE TRIGGER enquiries_updated_at BEFORE UPDATE ON public.enquiries
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------
-- CONTENT DOMAIN
-- ---------------------------------------------------------------

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
CREATE TRIGGER settings_updated_at BEFORE UPDATE ON public.settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- Seed singleton
INSERT INTO public.settings (id) VALUES ('00000000-0000-0000-0000-000000000001'::uuid)
  ON CONFLICT DO NOTHING;

CREATE TABLE public.pages (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             text NOT NULL UNIQUE,
  title            text NOT NULL,
  content          text,
  seo_title        text,
  seo_description  text,
  published        boolean NOT NULL DEFAULT false,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER pages_updated_at BEFORE UPDATE ON public.pages
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.legal_pages (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             text NOT NULL UNIQUE,
  title            text NOT NULL,
  content          text NOT NULL DEFAULT '',
  version          text,
  effective_date   date,
  published        boolean NOT NULL DEFAULT false,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER legal_pages_updated_at BEFORE UPDATE ON public.legal_pages
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

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
CREATE TRIGGER faqs_updated_at BEFORE UPDATE ON public.faqs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

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

CREATE TABLE public.navigation_menus (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key         text NOT NULL UNIQUE,
  label       text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
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
CREATE TRIGGER homepage_sections_updated_at BEFORE UPDATE ON public.homepage_sections
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.newsletter_subscriptions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email           text NOT NULL UNIQUE,
  first_name      text,
  status          text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
  unsubscribed_at timestamptz,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);
CREATE TRIGGER newsletter_updated_at BEFORE UPDATE ON public.newsletter_subscriptions
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
CREATE INDEX idx_trips_trip_type ON public.trips (trip_type);
CREATE INDEX idx_trips_destination ON public.trips (destination_id);
CREATE INDEX idx_trips_mode ON public.trips (trip_mode);
CREATE INDEX idx_trips_type_status ON public.products (product_type, status);

CREATE INDEX idx_product_media_product ON public.product_media (product_id, sort_order);
CREATE INDEX idx_product_media_cover ON public.product_media (product_id) WHERE is_cover = true;
CREATE INDEX idx_product_pricing_product ON public.product_pricing (product_id);
CREATE INDEX idx_package_items_package ON public.package_items (package_id, sort_order);
CREATE INDEX idx_transfer_zone_prices_transfer ON public.transfer_zone_prices (transfer_id);
CREATE INDEX idx_transfer_hotels_zone ON public.transfer_hotels (zone_id);
CREATE INDEX idx_product_destinations_destination ON public.product_destinations (destination_id);
CREATE INDEX idx_destinations_featured ON public.destinations (featured, position) WHERE published = true;

CREATE INDEX idx_trip_schedules_trip_day ON public.trip_schedules (trip_id, day_of_week, start_time) WHERE is_active = true;
CREATE INDEX idx_driver_avail_driver_day ON public.driver_availability (driver_id, day_of_week, start_time) WHERE is_available = true;

CREATE INDEX idx_booking_sessions_expires ON public.booking_sessions (expires_at);
CREATE INDEX idx_cart_items_session ON public.cart_items (session_id);
CREATE INDEX idx_bookings_customer ON public.bookings (customer_id);
CREATE INDEX idx_bookings_status ON public.bookings (status);
CREATE INDEX idx_bookings_ref ON public.bookings (ref);
CREATE INDEX idx_bookings_created ON public.bookings (created_at DESC);
CREATE INDEX idx_payments_booking ON public.payments (booking_id);
CREATE INDEX idx_payments_status ON public.payments (status);
CREATE INDEX idx_reviews_product ON public.reviews (product_id);
CREATE INDEX idx_reviews_status ON public.reviews (status);
CREATE INDEX idx_enquiries_status ON public.enquiries (status);
CREATE INDEX idx_enquiries_created ON public.enquiries (created_at DESC);
CREATE INDEX idx_currency_rates_fetched ON public.currency_rates (fetched_at);
CREATE INDEX idx_faqs_category ON public.faqs (category, position);
CREATE INDEX idx_navigation_items_menu ON public.navigation_items (menu_id, position);
CREATE INDEX idx_homepage_sections_position ON public.homepage_sections (position) WHERE published = true;
CREATE INDEX idx_newsletter_email ON public.newsletter_subscriptions (email);
CREATE INDEX idx_newsletter_status ON public.newsletter_subscriptions (status);

-- ---------------------------------------------------------------
-- HELPER FUNCTION: is_admin()
-- ---------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COALESCE((SELECT is_admin FROM public.profiles WHERE id = auth.uid()), false);
$$;

-- ---------------------------------------------------------------
-- RLS — enable on all tables
-- ---------------------------------------------------------------

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transfer_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transfer_hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.airport_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.driver_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.package_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transfer_zone_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.currency_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.availability_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_travellers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transfer_booking_details ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legal_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.promo_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigation_menus ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------
-- RLS POLICIES
-- ---------------------------------------------------------------

-- Profiles
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (id = auth.uid() OR public.is_admin());
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (id = auth.uid());
CREATE POLICY "profiles_admin_all" ON public.profiles FOR ALL USING (public.is_admin());

-- Destinations
CREATE POLICY "destinations_public_select" ON public.destinations FOR SELECT USING (published = true OR public.is_admin());
CREATE POLICY "destinations_admin_all" ON public.destinations FOR ALL USING (public.is_admin());

-- Transfer zones (reference data — fully public)
CREATE POLICY "transfer_zones_public_select" ON public.transfer_zones FOR SELECT USING (true);
CREATE POLICY "transfer_zones_admin_all" ON public.transfer_zones FOR ALL USING (public.is_admin());

-- Transfer hotels
CREATE POLICY "transfer_hotels_public_select" ON public.transfer_hotels FOR SELECT USING (published = true OR public.is_admin());
CREATE POLICY "transfer_hotels_admin_all" ON public.transfer_hotels FOR ALL USING (public.is_admin());

-- Products
CREATE POLICY "products_public_select" ON public.products FOR SELECT USING (status = 'published' OR public.is_admin());
CREATE POLICY "products_admin_all" ON public.products FOR ALL USING (public.is_admin());

-- Activities
CREATE POLICY "activities_public_select" ON public.activities FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.products WHERE products.id = activities.product_id AND (products.status = 'published' OR public.is_admin())));
CREATE POLICY "activities_admin_all" ON public.activities FOR ALL USING (public.is_admin());

-- Airport transfers
CREATE POLICY "airport_transfers_public_select" ON public.airport_transfers FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.products WHERE products.id = airport_transfers.product_id AND (products.status = 'published' OR public.is_admin())));
CREATE POLICY "airport_transfers_admin_all" ON public.airport_transfers FOR ALL USING (public.is_admin());

-- Trips
CREATE POLICY "trips_public_select" ON public.trips FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.products WHERE products.id = trips.product_id AND (products.status = 'published' OR public.is_admin())));
CREATE POLICY "trips_admin_all" ON public.trips FOR ALL USING (public.is_admin());

-- Trip schedules
CREATE POLICY "trip_schedules_public_select" ON public.trip_schedules FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "trip_schedules_admin_all" ON public.trip_schedules FOR ALL USING (public.is_admin());

-- Drivers
CREATE POLICY "drivers_public_select" ON public.drivers FOR SELECT USING (is_active = true OR public.is_admin());
CREATE POLICY "drivers_admin_all" ON public.drivers FOR ALL USING (public.is_admin());

-- Driver availability
CREATE POLICY "driver_availability_public_select" ON public.driver_availability FOR SELECT USING (is_available = true OR public.is_admin());
CREATE POLICY "driver_availability_admin_all" ON public.driver_availability FOR ALL USING (public.is_admin());

-- Booking slots
CREATE POLICY "booking_slots_public_select" ON public.booking_slots FOR SELECT USING (true);
CREATE POLICY "booking_slots_admin_all" ON public.booking_slots FOR ALL USING (public.is_admin());

-- Packages
CREATE POLICY "packages_public_select" ON public.packages FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.products WHERE products.id = packages.product_id AND (products.status = 'published' OR public.is_admin())));
CREATE POLICY "packages_admin_all" ON public.packages FOR ALL USING (public.is_admin());

-- Package items
CREATE POLICY "package_items_public_select" ON public.package_items FOR SELECT USING (true);
CREATE POLICY "package_items_admin_all" ON public.package_items FOR ALL USING (public.is_admin());

-- Product destinations
CREATE POLICY "product_destinations_public_select" ON public.product_destinations FOR SELECT USING (true);
CREATE POLICY "product_destinations_admin_all" ON public.product_destinations FOR ALL USING (public.is_admin());

-- Product media
CREATE POLICY "product_media_public_select" ON public.product_media FOR SELECT USING (true);
CREATE POLICY "product_media_admin_all" ON public.product_media FOR ALL USING (public.is_admin());

-- Product pricing
CREATE POLICY "product_pricing_public_select" ON public.product_pricing FOR SELECT USING (true);
CREATE POLICY "product_pricing_admin_all" ON public.product_pricing FOR ALL USING (public.is_admin());

-- Transfer zone prices
CREATE POLICY "transfer_zone_prices_public_select" ON public.transfer_zone_prices FOR SELECT USING (true);
CREATE POLICY "transfer_zone_prices_admin_all" ON public.transfer_zone_prices FOR ALL USING (public.is_admin());

-- Currency rates
CREATE POLICY "currency_rates_public_select" ON public.currency_rates FOR SELECT USING (true);
CREATE POLICY "currency_rates_admin_all" ON public.currency_rates FOR ALL USING (public.is_admin());

-- Availability rules
CREATE POLICY "availability_rules_public_select" ON public.availability_rules FOR SELECT USING (true);
CREATE POLICY "availability_rules_admin_all" ON public.availability_rules FOR ALL USING (public.is_admin());

-- Customers
CREATE POLICY "customers_select_own" ON public.customers FOR SELECT USING (supabase_user_id = auth.uid() OR public.is_admin());
CREATE POLICY "customers_insert_guest" ON public.customers FOR INSERT WITH CHECK (true);
CREATE POLICY "customers_update_own" ON public.customers FOR UPDATE USING (supabase_user_id = auth.uid());
CREATE POLICY "customers_admin_all" ON public.customers FOR ALL USING (public.is_admin());

-- Booking sessions
CREATE POLICY "booking_sessions_insert" ON public.booking_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "booking_sessions_select" ON public.booking_sessions FOR SELECT USING (true);
CREATE POLICY "booking_sessions_update" ON public.booking_sessions FOR UPDATE USING (true);
CREATE POLICY "booking_sessions_admin_all" ON public.booking_sessions FOR ALL USING (public.is_admin());

-- Cart items
CREATE POLICY "cart_items_all" ON public.cart_items FOR ALL USING (true);

-- Bookings
CREATE POLICY "bookings_select_own" ON public.bookings FOR SELECT
  USING (customer_id IN (SELECT id FROM public.customers WHERE supabase_user_id = auth.uid()) OR public.is_admin());
CREATE POLICY "bookings_insert" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "bookings_admin_all" ON public.bookings FOR ALL USING (public.is_admin());

-- Booking items
CREATE POLICY "booking_items_select_own" ON public.booking_items FOR SELECT
  USING (booking_id IN (SELECT b.id FROM public.bookings b JOIN public.customers c ON c.id = b.customer_id WHERE c.supabase_user_id = auth.uid()) OR public.is_admin());
CREATE POLICY "booking_items_insert" ON public.booking_items FOR INSERT WITH CHECK (true);
CREATE POLICY "booking_items_admin_all" ON public.booking_items FOR ALL USING (public.is_admin());

-- Booking travellers
CREATE POLICY "booking_travellers_select_own" ON public.booking_travellers FOR SELECT
  USING (booking_id IN (SELECT b.id FROM public.bookings b JOIN public.customers c ON c.id = b.customer_id WHERE c.supabase_user_id = auth.uid()) OR public.is_admin());
CREATE POLICY "booking_travellers_insert" ON public.booking_travellers FOR INSERT WITH CHECK (true);
CREATE POLICY "booking_travellers_admin_all" ON public.booking_travellers FOR ALL USING (public.is_admin());

-- Transfer booking details
CREATE POLICY "transfer_booking_details_all" ON public.transfer_booking_details FOR ALL USING (true);

-- Payments
CREATE POLICY "payments_admin_select" ON public.payments FOR SELECT USING (public.is_admin());
CREATE POLICY "payments_insert" ON public.payments FOR INSERT WITH CHECK (true);
CREATE POLICY "payments_update" ON public.payments FOR UPDATE USING (true);

-- Reviews
CREATE POLICY "reviews_public_select" ON public.reviews FOR SELECT USING (status = 'approved' OR public.is_admin());
CREATE POLICY "reviews_public_insert" ON public.reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "reviews_admin_all" ON public.reviews FOR ALL USING (public.is_admin());

-- Enquiries
CREATE POLICY "enquiries_insert" ON public.enquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "enquiries_admin_all" ON public.enquiries FOR ALL USING (public.is_admin());

-- Settings
CREATE POLICY "settings_public_select" ON public.settings FOR SELECT USING (true);
CREATE POLICY "settings_admin_all" ON public.settings FOR ALL USING (public.is_admin());

-- Pages
CREATE POLICY "pages_public_select" ON public.pages FOR SELECT USING (published = true OR public.is_admin());
CREATE POLICY "pages_admin_all" ON public.pages FOR ALL USING (public.is_admin());

-- Legal pages
CREATE POLICY "legal_pages_public_select" ON public.legal_pages FOR SELECT USING (published = true OR public.is_admin());
CREATE POLICY "legal_pages_admin_all" ON public.legal_pages FOR ALL USING (public.is_admin());

-- FAQs
CREATE POLICY "faqs_public_select" ON public.faqs FOR SELECT USING (published = true OR public.is_admin());
CREATE POLICY "faqs_admin_all" ON public.faqs FOR ALL USING (public.is_admin());

-- Testimonials
CREATE POLICY "testimonials_public_select" ON public.testimonials FOR SELECT USING (published = true OR public.is_admin());
CREATE POLICY "testimonials_admin_all" ON public.testimonials FOR ALL USING (public.is_admin());

-- Promo banners
CREATE POLICY "promo_banners_public_select" ON public.promo_banners FOR SELECT
  USING ((active = true AND (start_at IS NULL OR start_at <= now()) AND (end_at IS NULL OR end_at >= now())) OR public.is_admin());
CREATE POLICY "promo_banners_admin_all" ON public.promo_banners FOR ALL USING (public.is_admin());

-- Navigation
CREATE POLICY "navigation_menus_public_select" ON public.navigation_menus FOR SELECT USING (true);
CREATE POLICY "navigation_menus_admin_all" ON public.navigation_menus FOR ALL USING (public.is_admin());
CREATE POLICY "navigation_items_public_select" ON public.navigation_items FOR SELECT USING (visible = true OR public.is_admin());
CREATE POLICY "navigation_items_admin_all" ON public.navigation_items FOR ALL USING (public.is_admin());

-- Homepage sections
CREATE POLICY "homepage_sections_public_select" ON public.homepage_sections FOR SELECT USING (published = true OR public.is_admin());
CREATE POLICY "homepage_sections_admin_all" ON public.homepage_sections FOR ALL USING (public.is_admin());

-- Newsletter
CREATE POLICY "newsletter_admin_select" ON public.newsletter_subscriptions FOR SELECT USING (public.is_admin());
CREATE POLICY "newsletter_public_insert" ON public.newsletter_subscriptions FOR INSERT WITH CHECK (true);
CREATE POLICY "newsletter_admin_update" ON public.newsletter_subscriptions FOR UPDATE USING (public.is_admin());
CREATE POLICY "newsletter_admin_delete" ON public.newsletter_subscriptions FOR DELETE USING (public.is_admin());

-- ---------------------------------------------------------------
-- GRANTS
-- ---------------------------------------------------------------

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON SCHEMA public TO postgres, service_role;

GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT ON SEQUENCES TO anon, authenticated;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO service_role;
