-- =============================================================
-- TROPIGO — TRIPS PRODUCT MODEL
-- Introduces 'trip' as a first-class product type.
-- Trips are the client's core business: guided driving tours
-- with driver, vehicle, pickup/dropoff, itinerary, schedule.
-- 
-- "Activities" (like Casela) are reframed as trips — the client
-- owns the full experience (transport + guide + venue visit).
-- The activities table is retained for backward compatibility
-- but new products should use the trips model.
-- =============================================================

-- ---------------------------------------------------------------
-- 1. ADD 'trip' TO product_type ENUM
-- ---------------------------------------------------------------

-- Postgres doesn't support adding to enums idempotently, so we
-- check if the value already exists before altering.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_enum WHERE enumlabel = 'trip' 
    AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'product_type')
  ) THEN
    ALTER TYPE public.product_type ADD VALUE 'trip';
  END IF;
END $$;

-- ---------------------------------------------------------------
-- 2. CREATE trips TABLE (extends products 1:1)
-- ---------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.trips (
  product_id         uuid PRIMARY KEY REFERENCES public.products(id) ON DELETE CASCADE,
  trip_type          text,                              -- e.g. 'north', 'south', 'east', 'west', 'custom'
  duration_minutes   integer,
  vehicle_type       text,                              -- e.g. 'sedan', 'minivan', 'suv', 'luxury'
  driver_id          uuid REFERENCES public.profiles(id) ON DELETE SET NULL,  -- assigned driver
  max_passengers     integer NOT NULL DEFAULT 6,
  pickup_included    boolean NOT NULL DEFAULT true,
  pickup_location    text,
  pickup_time        text,                              -- e.g. '08:00'
  dropoff_location   text,
  dropoff_included   boolean NOT NULL DEFAULT true,
  included_items     text[] NOT NULL DEFAULT '{}',      -- e.g. 'Hotel pickup', 'Lunch', 'Guide'
  excluded_items     text[] NOT NULL DEFAULT '{}',      -- e.g. 'Entrance fees', 'Drinks'
  highlights         text[] NOT NULL DEFAULT '{}',      -- e.g. 'Pamplemousses Garden', 'Grand Bassin'
  itinerary          jsonb NOT NULL DEFAULT '[]',       -- [{time, title, description, photo_url}]
  important_notes    text,
  destination_id     uuid REFERENCES public.destinations(id) ON DELETE SET NULL,
  difficulty_level   text CHECK (difficulty_level IS NULL OR difficulty_level IN ('easy', 'moderate', 'challenging')),
  min_participants   integer NOT NULL DEFAULT 1,
  max_participants   integer,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER trips_updated_at
  BEFORE UPDATE ON public.trips
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ---------------------------------------------------------------
-- 3. ADD trip_id TO package_items (packages can contain trips)
-- ---------------------------------------------------------------

-- package_items.product_id already references products, which now
-- includes trip-type products. No schema change needed — just
-- documenting that packages can contain trips via the existing FK.

-- ---------------------------------------------------------------
-- 4. ADD own_price, start_time TO packages
-- ---------------------------------------------------------------

-- Packages already have pricing_mode and discount_percent.
-- Add explicit own_price field for fixed-price packages.
ALTER TABLE public.packages
  ADD COLUMN IF NOT EXISTS own_price numeric(12,2),
  ADD COLUMN IF NOT EXISTS start_time text,               -- e.g. '07:00'
  ADD COLUMN IF NOT EXISTS own_availability jsonb NOT NULL DEFAULT '{}';  -- {days_of_week, max_bookings_per_day}

-- ---------------------------------------------------------------
-- 5. INDEXES for performance
-- ---------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_products_type_status ON public.products(product_type, status);
CREATE INDEX IF NOT EXISTS idx_trips_trip_type ON public.trips(trip_type);
CREATE INDEX IF NOT EXISTS idx_trips_destination ON public.trips(destination_id);

-- ---------------------------------------------------------------
-- 6. COMMENTS for documentation
-- ---------------------------------------------------------------

COMMENT ON TABLE public.trips IS 'Guided driving tours — the client core business. Includes driver, vehicle, pickup, itinerary.';
COMMENT ON COLUMN public.trips.trip_type IS 'Geographic or thematic classification: north, south, east, west, island, custom';
COMMENT ON COLUMN public.trips.itinerary IS 'Ordered list of stops: [{time, title, description, photo_url, duration_minutes}]';
COMMENT ON TABLE public.activities IS 'Legacy model for backward compatibility. New products should use trips.';
