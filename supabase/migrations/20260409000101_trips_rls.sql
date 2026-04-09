-- =============================================================
-- TROPIGO — RLS POLICIES FOR TRIPS
-- Mirrors the pattern used for activities/products:
-- - Public read for published products
-- - Admin full access
-- =============================================================

-- Enable RLS on trips table
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;

-- Public can read trip data (joined through products where status = 'published')
CREATE POLICY "Trips are viewable by everyone when published"
  ON public.trips
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.products
      WHERE products.id = trips.product_id
      AND products.status = 'published'
    )
  );

-- Admins can do everything on trips
CREATE POLICY "Admins have full access to trips"
  ON public.trips
  USING (public.is_admin())
  WITH CHECK (public.is_admin());
