-- =============================================================
-- TROPIGO — Driver Availability System
-- Tracks drivers and their availability per date/time slot.
-- When a booking is made, driver count is decremented.
-- When driver count reaches 0, that slot becomes unavailable.
-- =============================================================

-- Drivers table
CREATE TABLE IF NOT EXISTS public.drivers (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name  text NOT NULL,
  last_name   text NOT NULL,
  phone       text,
  email       text,
  vehicle_type text CHECK (vehicle_type IN ('sedan', 'minivan', 'bus', 'luxury')),
  license_plate text,
  is_active   boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- Driver availability per date/time slot
CREATE TABLE IF NOT EXISTS public.driver_availability (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id       uuid NOT NULL REFERENCES public.drivers(id) ON DELETE CASCADE,
  product_id      uuid REFERENCES public.products(id) ON DELETE CASCADE, -- NULL = available for all
  available_date  date NOT NULL,
  start_time      time NOT NULL,
  end_time        time,
  is_available    boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT driver_availability_unique UNIQUE (driver_id, product_id, available_date, start_time)
);

-- Function to get available driver count for a product/date/time
CREATE OR REPLACE FUNCTION public.get_available_driver_count(
  p_product_id uuid,
  p_date date,
  p_start_time time
) RETURNS integer
LANGUAGE sql
STABLE
AS $$
  SELECT COUNT(*)::integer
  FROM public.driver_availability da
  WHERE da.available_date = p_date
    AND da.start_time = p_start_time
    AND da.is_available = true
    AND (da.product_id IS NULL OR da.product_id = p_product_id)
    AND da.driver_id IN (SELECT id FROM public.drivers WHERE is_active = true)
$$;

-- Function to get driver availability for a date range
CREATE OR REPLACE FUNCTION public.get_driver_availability_for_range(
  p_product_id uuid,
  p_start_date date,
  p_end_date date
) RETURNS TABLE(
  available_date date,
  start_time time,
  available_count integer
)
LANGUAGE sql
STABLE
AS $$
  SELECT 
    da.available_date,
    da.start_time,
    COUNT(*) FILTER (WHERE da.is_available = true)::integer as available_count
  FROM public.driver_availability da
  WHERE da.available_date >= p_start_date
    AND da.available_date <= p_end_date
    AND (da.product_id IS NULL OR da.product_id = p_product_id)
    AND da.driver_id IN (SELECT id FROM public.drivers WHERE is_active = true)
  GROUP BY da.available_date, da.start_time
  ORDER BY da.available_date, da.start_time
$$;

-- Function to decrement driver availability (call on confirmed booking)
CREATE OR REPLACE FUNCTION public.decrement_driver_availability(
  p_product_id uuid,
  p_date date,
  p_start_time time
) RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Get the first available driver for this slot
  UPDATE public.driver_availability
  SET is_available = false
  WHERE id = (
    SELECT da.id
    FROM public.driver_availability da
    WHERE da.available_date = p_date
      AND da.start_time = p_start_time
      AND da.is_available = true
      AND (da.product_id IS NULL OR da.product_id = p_product_id)
      AND da.driver_id IN (SELECT id FROM public.drivers WHERE is_active = true)
    LIMIT 1
  );
END;
$$;

-- Function to increment driver availability (call on cancellation)
CREATE OR REPLACE FUNCTION public.increment_driver_availability(
  p_product_id uuid,
  p_date date,
  p_start_time time
) RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Mark the most recently unavailable driver as available again
  UPDATE public.driver_availability
  SET is_available = true
  WHERE id = (
    SELECT da.id
    FROM public.driver_availability da
    WHERE da.available_date = p_date
      AND da.start_time = p_start_time
      AND da.is_available = false
      AND (da.product_id IS NULL OR da.product_id = p_product_id)
    ORDER BY da.updated_at DESC
    LIMIT 1
  );
END;
$$;

-- RLS Policies
ALTER TABLE public.drivers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.driver_availability ENABLE ROW LEVEL SECURITY;

-- Anyone can read drivers
CREATE POLICY "drivers_read_public" ON public.drivers
  FOR SELECT USING (true);

-- Only admins can manage drivers
CREATE POLICY "drivers_admin_all" ON public.drivers
  FOR ALL USING (public.is_admin());

-- Anyone can read driver availability
CREATE POLICY "driver_availability_read_public" ON public.driver_availability
  FOR SELECT USING (true);

-- Only admins can manage driver availability
CREATE POLICY "driver_availability_admin_all" ON public.driver_availability
  FOR ALL USING (public.is_admin());
