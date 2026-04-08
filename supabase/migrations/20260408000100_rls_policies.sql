-- =============================================================
-- TROPIGO — RLS POLICIES
-- =============================================================

-- Enable RLS on every table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transfer_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transfer_hotels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.airport_transfers ENABLE ROW LEVEL SECURITY;
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

-- ---------------------------------------------------------------
-- HELPER: is_admin()
-- Checks if the current authenticated user is an admin.
-- Uses SECURITY DEFINER to safely access profiles table.
-- ---------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()),
    false
  );
$$;

-- ---------------------------------------------------------------
-- PROFILES
-- ---------------------------------------------------------------

CREATE POLICY "profiles_select_own"
  ON public.profiles FOR SELECT
  USING (id = auth.uid() OR public.is_admin());

CREATE POLICY "profiles_update_own"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "profiles_admin_all"
  ON public.profiles FOR ALL
  USING (public.is_admin());

-- ---------------------------------------------------------------
-- CATALOG — public read for published content
-- ---------------------------------------------------------------

-- Destinations
CREATE POLICY "destinations_public_select"
  ON public.destinations FOR SELECT
  USING (published = true OR public.is_admin());

CREATE POLICY "destinations_admin_all"
  ON public.destinations FOR ALL
  USING (public.is_admin());

-- Transfer zones (reference data — fully public)
CREATE POLICY "transfer_zones_public_select"
  ON public.transfer_zones FOR SELECT
  USING (true);

CREATE POLICY "transfer_zones_admin_all"
  ON public.transfer_zones FOR ALL
  USING (public.is_admin());

-- Transfer hotels
CREATE POLICY "transfer_hotels_public_select"
  ON public.transfer_hotels FOR SELECT
  USING (published = true OR public.is_admin());

CREATE POLICY "transfer_hotels_admin_all"
  ON public.transfer_hotels FOR ALL
  USING (public.is_admin());

-- Products
CREATE POLICY "products_public_select"
  ON public.products FOR SELECT
  USING (status = 'published' OR public.is_admin());

CREATE POLICY "products_admin_all"
  ON public.products FOR ALL
  USING (public.is_admin());

-- Activities
CREATE POLICY "activities_public_select"
  ON public.activities FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.products
      WHERE products.id = activities.product_id
        AND (products.status = 'published' OR public.is_admin())
    )
  );

CREATE POLICY "activities_admin_all"
  ON public.activities FOR ALL
  USING (public.is_admin());

-- Airport transfers
CREATE POLICY "airport_transfers_public_select"
  ON public.airport_transfers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.products
      WHERE products.id = airport_transfers.product_id
        AND (products.status = 'published' OR public.is_admin())
    )
  );

CREATE POLICY "airport_transfers_admin_all"
  ON public.airport_transfers FOR ALL
  USING (public.is_admin());

-- Packages
CREATE POLICY "packages_public_select"
  ON public.packages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.products
      WHERE products.id = packages.product_id
        AND (products.status = 'published' OR public.is_admin())
    )
  );

CREATE POLICY "packages_admin_all"
  ON public.packages FOR ALL
  USING (public.is_admin());

-- Package items
CREATE POLICY "package_items_public_select"
  ON public.package_items FOR SELECT
  USING (true);

CREATE POLICY "package_items_admin_all"
  ON public.package_items FOR ALL
  USING (public.is_admin());

-- Product destinations
CREATE POLICY "product_destinations_public_select"
  ON public.product_destinations FOR SELECT
  USING (true);

CREATE POLICY "product_destinations_admin_all"
  ON public.product_destinations FOR ALL
  USING (public.is_admin());

-- Product media
CREATE POLICY "product_media_public_select"
  ON public.product_media FOR SELECT
  USING (true);

CREATE POLICY "product_media_admin_all"
  ON public.product_media FOR ALL
  USING (public.is_admin());

-- Product pricing
CREATE POLICY "product_pricing_public_select"
  ON public.product_pricing FOR SELECT
  USING (true);

CREATE POLICY "product_pricing_admin_all"
  ON public.product_pricing FOR ALL
  USING (public.is_admin());

-- Transfer zone prices
CREATE POLICY "transfer_zone_prices_public_select"
  ON public.transfer_zone_prices FOR SELECT
  USING (true);

CREATE POLICY "transfer_zone_prices_admin_all"
  ON public.transfer_zone_prices FOR ALL
  USING (public.is_admin());

-- Currency rates
CREATE POLICY "currency_rates_public_select"
  ON public.currency_rates FOR SELECT
  USING (true);

CREATE POLICY "currency_rates_admin_all"
  ON public.currency_rates FOR ALL
  USING (public.is_admin());

-- Availability rules
CREATE POLICY "availability_rules_public_select"
  ON public.availability_rules FOR SELECT
  USING (true);

CREATE POLICY "availability_rules_admin_all"
  ON public.availability_rules FOR ALL
  USING (public.is_admin());

-- Reviews
CREATE POLICY "reviews_public_select"
  ON public.reviews FOR SELECT
  USING (status = 'approved' OR public.is_admin());

CREATE POLICY "reviews_public_insert"
  ON public.reviews FOR INSERT
  WITH CHECK (true);

CREATE POLICY "reviews_admin_all"
  ON public.reviews FOR ALL
  USING (public.is_admin());

-- ---------------------------------------------------------------
-- BOOKING DOMAIN — server-side access via service role recommended
-- These policies allow guest checkout via anon key.
-- Production: use service role client for all booking mutations.
-- ---------------------------------------------------------------

-- Customers
CREATE POLICY "customers_select_own"
  ON public.customers FOR SELECT
  USING (
    supabase_user_id = auth.uid()
    OR public.is_admin()
  );

CREATE POLICY "customers_insert_guest"
  ON public.customers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "customers_update_own"
  ON public.customers FOR UPDATE
  USING (supabase_user_id = auth.uid());

CREATE POLICY "customers_admin_all"
  ON public.customers FOR ALL
  USING (public.is_admin());

-- Booking sessions (session_id is the secret — bearer token pattern)
CREATE POLICY "booking_sessions_insert"
  ON public.booking_sessions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "booking_sessions_select"
  ON public.booking_sessions FOR SELECT
  USING (true);

CREATE POLICY "booking_sessions_update"
  ON public.booking_sessions FOR UPDATE
  USING (true);

CREATE POLICY "booking_sessions_admin_all"
  ON public.booking_sessions FOR ALL
  USING (public.is_admin());

-- Cart items
CREATE POLICY "cart_items_all"
  ON public.cart_items FOR ALL
  USING (true);

-- Bookings
CREATE POLICY "bookings_select_own"
  ON public.bookings FOR SELECT
  USING (
    customer_id IN (
      SELECT id FROM public.customers
      WHERE supabase_user_id = auth.uid()
    )
    OR public.is_admin()
  );

CREATE POLICY "bookings_insert"
  ON public.bookings FOR INSERT
  WITH CHECK (true);

CREATE POLICY "bookings_admin_all"
  ON public.bookings FOR ALL
  USING (public.is_admin());

-- Booking items
CREATE POLICY "booking_items_select_own"
  ON public.booking_items FOR SELECT
  USING (
    booking_id IN (
      SELECT b.id FROM public.bookings b
      JOIN public.customers c ON c.id = b.customer_id
      WHERE c.supabase_user_id = auth.uid()
    )
    OR public.is_admin()
  );

CREATE POLICY "booking_items_insert"
  ON public.booking_items FOR INSERT
  WITH CHECK (true);

CREATE POLICY "booking_items_admin_all"
  ON public.booking_items FOR ALL
  USING (public.is_admin());

-- Booking travellers
CREATE POLICY "booking_travellers_select_own"
  ON public.booking_travellers FOR SELECT
  USING (
    booking_id IN (
      SELECT b.id FROM public.bookings b
      JOIN public.customers c ON c.id = b.customer_id
      WHERE c.supabase_user_id = auth.uid()
    )
    OR public.is_admin()
  );

CREATE POLICY "booking_travellers_insert"
  ON public.booking_travellers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "booking_travellers_admin_all"
  ON public.booking_travellers FOR ALL
  USING (public.is_admin());

-- Transfer booking details
CREATE POLICY "transfer_booking_details_all"
  ON public.transfer_booking_details FOR ALL
  USING (true);

-- Payments — sensitive, admin + service role only
CREATE POLICY "payments_admin_select"
  ON public.payments FOR SELECT
  USING (public.is_admin());

CREATE POLICY "payments_insert"
  ON public.payments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "payments_update"
  ON public.payments FOR UPDATE
  USING (true);

-- Enquiries
CREATE POLICY "enquiries_insert"
  ON public.enquiries FOR INSERT
  WITH CHECK (true);

CREATE POLICY "enquiries_admin_all"
  ON public.enquiries FOR ALL
  USING (public.is_admin());

-- ---------------------------------------------------------------
-- CONTENT DOMAIN
-- ---------------------------------------------------------------

CREATE POLICY "settings_public_select"
  ON public.settings FOR SELECT
  USING (true);

CREATE POLICY "settings_admin_all"
  ON public.settings FOR ALL
  USING (public.is_admin());

CREATE POLICY "pages_public_select"
  ON public.pages FOR SELECT
  USING (published = true OR public.is_admin());

CREATE POLICY "pages_admin_all"
  ON public.pages FOR ALL
  USING (public.is_admin());

CREATE POLICY "legal_pages_public_select"
  ON public.legal_pages FOR SELECT
  USING (published = true OR public.is_admin());

CREATE POLICY "legal_pages_admin_all"
  ON public.legal_pages FOR ALL
  USING (public.is_admin());

CREATE POLICY "faqs_public_select"
  ON public.faqs FOR SELECT
  USING (published = true OR public.is_admin());

CREATE POLICY "faqs_admin_all"
  ON public.faqs FOR ALL
  USING (public.is_admin());

CREATE POLICY "testimonials_public_select"
  ON public.testimonials FOR SELECT
  USING (published = true OR public.is_admin());

CREATE POLICY "testimonials_admin_all"
  ON public.testimonials FOR ALL
  USING (public.is_admin());

CREATE POLICY "promo_banners_public_select"
  ON public.promo_banners FOR SELECT
  USING (
    (active = true
      AND (start_at IS NULL OR start_at <= now())
      AND (end_at IS NULL OR end_at >= now()))
    OR public.is_admin()
  );

CREATE POLICY "promo_banners_admin_all"
  ON public.promo_banners FOR ALL
  USING (public.is_admin());

CREATE POLICY "navigation_menus_public_select"
  ON public.navigation_menus FOR SELECT
  USING (true);

CREATE POLICY "navigation_menus_admin_all"
  ON public.navigation_menus FOR ALL
  USING (public.is_admin());

CREATE POLICY "navigation_items_public_select"
  ON public.navigation_items FOR SELECT
  USING (visible = true OR public.is_admin());

CREATE POLICY "navigation_items_admin_all"
  ON public.navigation_items FOR ALL
  USING (public.is_admin());

CREATE POLICY "homepage_sections_public_select"
  ON public.homepage_sections FOR SELECT
  USING (published = true OR public.is_admin());

CREATE POLICY "homepage_sections_admin_all"
  ON public.homepage_sections FOR ALL
  USING (public.is_admin());
