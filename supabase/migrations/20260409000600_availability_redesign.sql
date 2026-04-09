-- =============================================================
-- TROPIGO — AVAILABILITY REDESIGN
-- Simple but effective availability for trips and drivers.
--
-- Pattern (used by GetYourGuide/Viator):
-- 1. Trip schedule: which days it runs + start times + max capacity
-- 2. Driver availability: days + time ranges when driver is free
-- 3. Booking: trip schedule must match + driver must be available
-- =============================================================

-- 1. TRIP SCHEDULES — when each trip runs
-- A trip can have multiple departures per day (e.g., 08:00, 14:00)
-- and only run on specific days of the week.
CREATE TABLE IF NOT EXISTS public.trip_schedules (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id         uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  day_of_week     integer NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),  -- 0=Sun, 1=Mon, ..., 6=Sat
  start_time      text NOT NULL,  -- e.g., '08:00'
  max_capacity    integer NOT NULL DEFAULT 6,  -- max passengers per departure
  is_active       boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now()
);

-- Index for fast schedule lookups
CREATE INDEX IF NOT EXISTS idx_trip_schedules_trip_day ON public.trip_schedules(trip_id, day_of_week, start_time) WHERE is_active = true;

-- 2. DRIVER AVAILABILITY REDESIGN
-- Replace existing driver_availability with a simpler model.
-- Drivers define which days/times they're available.
-- This supports "mass availability" (e.g., available Mon-Fri 08:00-18:00).

-- Drop old table and recreate with new structure
DROP TABLE IF EXISTS public.driver_availability CASCADE;
DROP TABLE IF EXISTS public.drivers CASCADE;

CREATE TABLE public.drivers (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         uuid REFERENCES auth.users(id) ON DELETE SET NULL,  -- optional: link to auth user
  first_name      text NOT NULL,
  last_name       text NOT NULL,
  phone           text,
  email           text,
  vehicle_type    text,  -- sedan, minivan, suv, luxury
  license_plate   text,
  is_active       boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER drivers_updated_at
  BEFORE UPDATE ON public.drivers
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.driver_availability (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id       uuid NOT NULL REFERENCES public.drivers(id) ON DELETE CASCADE,
  day_of_week     integer NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time      text NOT NULL,  -- e.g., '08:00'
  end_time        text,           -- e.g., '18:00' (null = all day)
  is_available    boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_driver_avail_driver_day ON public.driver_availability(driver_id, day_of_week, start_time) WHERE is_available = true;

-- 3. BOOKING SLOTS — tracks how many seats are booked per trip departure
-- This prevents overbooking by counting confirmed bookings per slot.
CREATE TABLE IF NOT EXISTS public.booking_slots (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id         uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  departure_date  date NOT NULL,
  start_time      text NOT NULL,
  booked_count    integer NOT NULL DEFAULT 0,
  max_capacity    integer NOT NULL DEFAULT 6,
  created_at      timestamptz NOT NULL DEFAULT now(),
  UNIQUE(trip_id, departure_date, start_time)
);

COMMENT ON COLUMN public.trip_schedules.day_of_week IS '0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday';
COMMENT ON COLUMN public.trip_schedules.start_time IS 'Departure time in 24h format, e.g., 08:00';
COMMENT ON COLUMN public.trip_schedules.max_capacity IS 'Maximum passengers per departure';
COMMENT ON COLUMN public.driver_availability.day_of_week IS '0=Sunday through 6=Saturday';
COMMENT ON COLUMN public.booking_slots.booked_count IS 'Number of confirmed bookings for this slot';
