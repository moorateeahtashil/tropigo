-- =============================================================
-- TROPIGO — TRIPS: ADD trip_mode FOR SINGLE DROPOFF SUPPORT
-- Allows trips to be either guided multi-stop tours OR
-- simple single-destination drop-offs (e.g., hotel → Casela).
-- =============================================================

-- 1. Add trip_mode enum
CREATE TYPE public.trip_mode AS ENUM ('guided_tour', 'single_dropoff');

-- 2. Add trip_mode column to trips table
ALTER TABLE public.trips
  ADD COLUMN IF NOT EXISTS trip_mode public.trip_mode NOT NULL DEFAULT 'guided_tour';

-- 3. Make itinerary nullable for single_dropoff trips (already defaults to [])
COMMENT ON COLUMN public.trips.trip_mode IS 'guided_tour = multi-stop itinerary; single_dropoff = simple transport to one venue';
COMMENT ON COLUMN public.trips.dropoff_location IS 'For single_dropoff: the destination venue (e.g., Casela). For guided_tour: return location.';

-- 4. Add index for filtering by mode
CREATE INDEX IF NOT EXISTS idx_trips_mode ON public.trips(trip_mode);
