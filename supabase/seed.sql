-- =============================================================
-- TROPIGO — SEED DATA (Development)
-- Requires: 20260408000000_clean_rebuild.sql to be applied first
-- =============================================================

-- Settings
UPDATE public.settings SET
  brand_name = 'Tropigo',
  tagline = 'Discover Mauritius, Your Way',
  contact_email = 'hello@tropigo.mu',
  contact_phone = '+230 5 000 0000',
  whatsapp = '+23050000000',
  address = '{"street": "Royal Road", "city": "Grand Baie", "region": "Rivière du Rempart", "country": "Mauritius"}',
  socials = '{"instagram": "https://instagram.com/tropigo", "facebook": "https://facebook.com/tropigo"}',
  supported_currencies = '{EUR,USD,GBP,MUR}',
  default_currency = 'EUR',
  default_seo_title = 'Tropigo — Mauritius Tours, Transfers & Experiences',
  default_seo_description = 'Discover the best of Mauritius with Tropigo. Book airport transfers, activities, and packages.'
WHERE id = '00000000-0000-0000-0000-000000000001'::uuid;

-- Navigation
INSERT INTO public.navigation_menus (id, key, label) VALUES
  ('11111111-0000-0000-0000-000000000001'::uuid, 'main', 'Main Navigation'),
  ('11111111-0000-0000-0000-000000000002'::uuid, 'footer', 'Footer Navigation')
ON CONFLICT DO NOTHING;

INSERT INTO public.navigation_items (menu_id, label, href, position) VALUES
  ('11111111-0000-0000-0000-000000000001'::uuid, 'Transfers', '/transfers', 0),
  ('11111111-0000-0000-0000-000000000001'::uuid, 'Activities', '/activities', 1),
  ('11111111-0000-0000-0000-000000000001'::uuid, 'Packages', '/packages', 2),
  ('11111111-0000-0000-0000-000000000001'::uuid, 'Destinations', '/destinations', 3),
  ('11111111-0000-0000-0000-000000000002'::uuid, 'About', '/about', 0),
  ('11111111-0000-0000-0000-000000000002'::uuid, 'Contact', '/contact', 1),
  ('11111111-0000-0000-0000-000000000002'::uuid, 'FAQ', '/faq', 2),
  ('11111111-0000-0000-0000-000000000002'::uuid, 'Privacy Policy', '/legal/privacy-policy', 3),
  ('11111111-0000-0000-0000-000000000002'::uuid, 'Terms & Conditions', '/legal/terms-and-conditions', 4);

-- Destinations
INSERT INTO public.destinations (slug, name, summary, region, hero_image_url, featured, position, published) VALUES
  ('grand-baie', 'Grand Baie', 'The vibrant hub of northern Mauritius.', 'North', 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1600&q=80', true, 0, true),
  ('le-morne', 'Le Morne', 'UNESCO heritage and world-class kitesurfing.', 'South West', 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1600&q=80', true, 1, true),
  ('ile-aux-cerfs', 'Île aux Cerfs', 'A stunning private island in the blue eastern lagoon.', 'East', 'https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=1600&q=80', true, 2, true)
ON CONFLICT (slug) DO NOTHING;

-- Transfer zones
INSERT INTO public.transfer_zones (id, name, description, color, sort_order) VALUES
  ('22222222-0000-0000-0000-000000000001'::uuid, 'Airport (SSR)', 'Sir Seewoosagur Ramgoolam International Airport', '#EF4444', 0),
  ('22222222-0000-0000-0000-000000000002'::uuid, 'North', 'Grand Baie, Pereybere, Cap Malheureux, Trou aux Biches', '#3B82F6', 1),
  ('22222222-0000-0000-0000-000000000003'::uuid, 'East', 'Belle Mare, Trou d''Eau Douce, Flacq, Mahébourg', '#10B981', 2),
  ('22222222-0000-0000-0000-000000000004'::uuid, 'South', 'Blue Bay, Souillac, Bel Ombre', '#8B5CF6', 3),
  ('22222222-0000-0000-0000-000000000005'::uuid, 'South West', 'Le Morne, Flic en Flac, Tamarin', '#F59E0B', 4),
  ('22222222-0000-0000-0000-000000000006'::uuid, 'Central', 'Port Louis, Curepipe, Quatre Bornes', '#6B7280', 5)
ON CONFLICT DO NOTHING;

-- Products
INSERT INTO public.products (id, product_type, slug, title, subtitle, summary, status, base_currency, base_price, featured, position) VALUES
  ('33333333-0000-0000-0000-000000000001'::uuid, 'airport_transfer', 'airport-transfer-private', 'Private Airport Transfer', 'Door-to-door across Mauritius', 'Reliable private transfers between SSR Airport and any destination in Mauritius.', 'published', 'EUR', 45.00, true, 0),
  ('33333333-0000-0000-0000-000000000002'::uuid, 'activity', 'ile-aux-cerfs-island-trip', 'Île aux Cerfs Island Day Trip', 'Full-day boat trip to the most beautiful island', 'Spend a magical day on Île aux Cerfs with speedboat, water sports, and BBQ lunch.', 'published', 'EUR', 89.00, true, 0),
  ('33333333-0000-0000-0000-000000000003'::uuid, 'activity', 'le-morne-kitesurfing-lesson', 'Kitesurfing Lesson at Le Morne', 'Learn at the world-famous Le Morne lagoon', 'IKO-certified kitesurfing lessons at one of the world''s best locations.', 'published', 'EUR', 120.00, true, 1),
  ('33333333-0000-0000-0000-000000000004'::uuid, 'activity', 'underwater-sea-walk', 'Underwater Sea Walk', 'Walk on the ocean floor, no experience needed', 'Walk among tropical fish at 3–4m depth with a special helmet. No diving experience required.', 'published', 'EUR', 65.00, false, 2),
  ('33333333-0000-0000-0000-000000000005'::uuid, 'package', 'mauritius-highlights-package', 'Mauritius Highlights Package', 'The best of Mauritius in one bundle', 'Island trip, sea walk, and transfers — all in one discounted package.', 'published', 'EUR', null, true, 0)
ON CONFLICT DO NOTHING;

-- Airport transfer extension
INSERT INTO public.airport_transfers (product_id, pricing_model, vehicle_type, max_passengers, max_luggage, includes_meet_greet, includes_flight_tracking, notes)
VALUES ('33333333-0000-0000-0000-000000000001'::uuid, 'zone_based', 'sedan', 4, 4, true, true, 'Flight tracking included. 30 min free waiting after landing.')
ON CONFLICT DO NOTHING;

-- Zone prices
INSERT INTO public.transfer_zone_prices (transfer_id, from_zone_id, to_zone_id, vehicle_type, price) VALUES
  ('33333333-0000-0000-0000-000000000001'::uuid, '22222222-0000-0000-0000-000000000001'::uuid, '22222222-0000-0000-0000-000000000002'::uuid, 'sedan', 45.00),
  ('33333333-0000-0000-0000-000000000001'::uuid, '22222222-0000-0000-0000-000000000001'::uuid, '22222222-0000-0000-0000-000000000003'::uuid, 'sedan', 55.00),
  ('33333333-0000-0000-0000-000000000001'::uuid, '22222222-0000-0000-0000-000000000001'::uuid, '22222222-0000-0000-0000-000000000004'::uuid, 'sedan', 40.00),
  ('33333333-0000-0000-0000-000000000001'::uuid, '22222222-0000-0000-0000-000000000001'::uuid, '22222222-0000-0000-0000-000000000005'::uuid, 'sedan', 50.00),
  ('33333333-0000-0000-0000-000000000001'::uuid, '22222222-0000-0000-0000-000000000001'::uuid, '22222222-0000-0000-0000-000000000006'::uuid, 'sedan', 35.00),
  ('33333333-0000-0000-0000-000000000001'::uuid, '22222222-0000-0000-0000-000000000001'::uuid, '22222222-0000-0000-0000-000000000002'::uuid, 'minivan', 65.00),
  ('33333333-0000-0000-0000-000000000001'::uuid, '22222222-0000-0000-0000-000000000001'::uuid, '22222222-0000-0000-0000-000000000003'::uuid, 'minivan', 75.00),
  ('33333333-0000-0000-0000-000000000001'::uuid, '22222222-0000-0000-0000-000000000001'::uuid, '22222222-0000-0000-0000-000000000005'::uuid, 'minivan', 70.00)
ON CONFLICT DO NOTHING;

-- Hotels
INSERT INTO public.transfer_hotels (name, zone_id, address) VALUES
  ('LUX* Grand Gaube', '22222222-0000-0000-0000-000000000002'::uuid, 'Grand Gaube, Mauritius'),
  ('Zilwa Attitude', '22222222-0000-0000-0000-000000000002'::uuid, 'Kalodyne Road, Grand Gaube'),
  ('Heritage Le Telfair', '22222222-0000-0000-0000-000000000004'::uuid, 'Bel Ombre, Mauritius'),
  ('Shanti Maurice', '22222222-0000-0000-0000-000000000004'::uuid, 'Chemin Grenier, Souillac'),
  ('Sugar Beach Mauritius', '22222222-0000-0000-0000-000000000005'::uuid, 'Flic en Flac, Mauritius'),
  ('Dinarobin Beachcomber', '22222222-0000-0000-0000-000000000005'::uuid, 'Le Morne Peninsula'),
  ('Constance Belle Mare Plage', '22222222-0000-0000-0000-000000000003'::uuid, 'Belle Mare, Flacq'),
  ('Four Seasons Mauritius', '22222222-0000-0000-0000-000000000003'::uuid, 'Anahita, Beau Champ');

-- Activities
INSERT INTO public.activities (product_id, duration_minutes, tour_type, pickup_location, pickup_time, min_participants, max_participants, included_items, excluded_items, highlights, destination_id)
SELECT
  '33333333-0000-0000-0000-000000000002'::uuid,
  480, 'shared', 'Your hotel or agreed meeting point', '08:30 AM',
  2, 30,
  '{"Speedboat transfers","BBQ seafood lunch","Snorkelling equipment","Licensed guide","Life jackets"}',
  '{"Alcoholic beverages","Personal insurance","Tips"}',
  '{"White-sand beaches","Snorkelling","Traditional BBQ","Water sports","Lagoon views"}',
  d.id FROM public.destinations d WHERE d.slug = 'ile-aux-cerfs'
ON CONFLICT DO NOTHING;

INSERT INTO public.activities (product_id, duration_minutes, tour_type, pickup_location, pickup_time, min_participants, max_participants, included_items, excluded_items, highlights, destination_id)
SELECT
  '33333333-0000-0000-0000-000000000003'::uuid,
  180, 'private', 'Le Morne Beach', '09:00 AM',
  1, 2,
  '{"3-hour IKO lesson","All equipment","Safety harness","Wetsuit","Safety briefing"}',
  '{"Transport to Le Morne","Personal insurance"}',
  '{"World-class conditions","IKO-certified instructors","Le Morne backdrop"}',
  d.id FROM public.destinations d WHERE d.slug = 'le-morne'
ON CONFLICT DO NOTHING;

INSERT INTO public.activities (product_id, duration_minutes, tour_type, pickup_location, pickup_time, min_participants, max_participants, included_items, excluded_items, highlights, destination_id)
SELECT
  '33333333-0000-0000-0000-000000000004'::uuid,
  90, 'shared', 'Grand Baie boat jetty', '10:00 AM',
  1, 8,
  '{"Helmet","Instructor guide","Fish feeding","Towels"}',
  '{"Transport","Personal photos","Tips"}',
  '{"No experience needed","Walk at 3-4m depth","Tropical fish","Suitable for all ages"}',
  d.id FROM public.destinations d WHERE d.slug = 'grand-baie'
ON CONFLICT DO NOTHING;

-- Package
INSERT INTO public.packages (product_id, pricing_mode, discount_percent, duration_days, highlights)
VALUES ('33333333-0000-0000-0000-000000000005'::uuid, 'computed_with_discount', 15.00, 3,
  '{"Île aux Cerfs day trip","Underwater sea walk","Private airport transfers","15% bundle discount","Flexible scheduling"}')
ON CONFLICT DO NOTHING;

INSERT INTO public.package_items (package_id, product_id, sort_order, is_optional, is_default_selected, quantity) VALUES
  ('33333333-0000-0000-0000-000000000005'::uuid, '33333333-0000-0000-0000-000000000002'::uuid, 0, false, true, 1),
  ('33333333-0000-0000-0000-000000000005'::uuid, '33333333-0000-0000-0000-000000000004'::uuid, 1, false, true, 1),
  ('33333333-0000-0000-0000-000000000005'::uuid, '33333333-0000-0000-0000-000000000001'::uuid, 2, true, true, 2)
ON CONFLICT DO NOTHING;

-- Product destinations
INSERT INTO public.product_destinations (product_id, destination_id)
SELECT '33333333-0000-0000-0000-000000000002'::uuid, id FROM public.destinations WHERE slug = 'ile-aux-cerfs'
ON CONFLICT DO NOTHING;
INSERT INTO public.product_destinations (product_id, destination_id)
SELECT '33333333-0000-0000-0000-000000000003'::uuid, id FROM public.destinations WHERE slug = 'le-morne'
ON CONFLICT DO NOTHING;
INSERT INTO public.product_destinations (product_id, destination_id)
SELECT '33333333-0000-0000-0000-000000000004'::uuid, id FROM public.destinations WHERE slug = 'grand-baie'
ON CONFLICT DO NOTHING;

-- Media
INSERT INTO public.product_media (product_id, url, alt, is_cover, sort_order) VALUES
  ('33333333-0000-0000-0000-000000000001'::uuid, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80', 'Private airport transfer', true, 0),
  ('33333333-0000-0000-0000-000000000002'::uuid, 'https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=1200&q=80', 'Île aux Cerfs lagoon', true, 0),
  ('33333333-0000-0000-0000-000000000002'::uuid, 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1200&q=80', 'Speedboat to island', false, 1),
  ('33333333-0000-0000-0000-000000000003'::uuid, 'https://images.unsplash.com/photo-1530053969600-caed2596d242?w=1200&q=80', 'Kitesurfing Le Morne', true, 0),
  ('33333333-0000-0000-0000-000000000004'::uuid, 'https://images.unsplash.com/photo-1560275619-4cc5fa59d3ae?w=1200&q=80', 'Underwater sea walk', true, 0),
  ('33333333-0000-0000-0000-000000000005'::uuid, 'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=1200&q=80', 'Mauritius highlights package', true, 0);

-- Currency rates
INSERT INTO public.currency_rates (from_currency, to_currency, rate) VALUES
  ('EUR', 'USD', 1.0850), ('EUR', 'GBP', 0.8560), ('EUR', 'MUR', 48.50),
  ('USD', 'EUR', 0.9217), ('USD', 'GBP', 0.7887), ('USD', 'MUR', 44.70),
  ('GBP', 'EUR', 1.1682), ('GBP', 'USD', 1.2679), ('GBP', 'MUR', 56.67),
  ('MUR', 'EUR', 0.0206), ('MUR', 'USD', 0.0224), ('MUR', 'GBP', 0.0177)
ON CONFLICT (from_currency, to_currency) DO UPDATE SET rate = EXCLUDED.rate, fetched_at = now();

-- Testimonials
INSERT INTO public.testimonials (author_name, author_location, quote, rating, position, published) VALUES
  ('Sophie Laurent', 'Paris, France', 'The Île aux Cerfs trip was the highlight of our honeymoon. Everything was perfectly organised. Tropigo made it effortless.', 5, 0, true),
  ('James & Karen Mitchell', 'London, UK', 'The driver was waiting with a sign, the car was immaculate. Perfect airport transfer experience.', 5, 1, true),
  ('Marco Bianchi', 'Milan, Italy', 'Tried the underwater sea walk with my family — my daughter was absolutely amazed. Highly recommend!', 5, 2, true),
  ('Anita Müller', 'Vienna, Austria', 'My kitesurfing lesson at Le Morne was incredible. I was up on the board by the end of the session!', 5, 3, true);

-- FAQs
INSERT INTO public.faqs (category, question, answer, position, published) VALUES
  ('booking', 'Can I book last minute?', 'We recommend booking at least 48 hours in advance. For urgent requests, contact us directly.', 0, true),
  ('booking', 'How do I get my booking confirmation?', 'You will receive an email confirmation within minutes of completing payment with your booking reference.', 1, true),
  ('booking', 'Can I change or cancel my booking?', 'Free cancellation up to 48 hours before your activity. Within 48 hours, a 50% charge applies.', 2, true),
  ('transfers', 'What happens if my flight is delayed?', 'We track all incoming flights in real time. Your driver will adjust automatically at no extra charge for the first 60 minutes.', 0, true),
  ('transfers', 'Do you offer child seats?', 'Yes, child seats are available on request at no extra charge. Specify age and weight when booking.', 1, true),
  ('activities', 'Are activities weather dependent?', 'Water activities are weather dependent. If unsafe, we will reschedule or offer a full refund.', 0, true),
  ('payments', 'What currencies do you accept?', 'We accept EUR, USD, GBP, and MUR. Prices are locked at checkout with no hidden fees.', 0, true),
  ('payments', 'Is my payment secure?', 'All payments are processed through Stripe, PCI-DSS Level 1 certified. We never store card details.', 1, true);

-- Legal pages
INSERT INTO public.legal_pages (slug, title, content, version, effective_date, published) VALUES
  ('terms-and-conditions', 'Terms & Conditions', '# Terms & Conditions

All bookings are confirmed after full payment. Cancellations more than 48 hours before activity receive a full refund. Within 48 hours, 50% charge applies.', '1.0', '2026-04-01', true),
  ('privacy-policy', 'Privacy Policy', '# Privacy Policy

We collect your name, email, and booking details to process your reservation. Data is not sold to third parties. Contact hello@tropigo.mu for data requests.', '1.0', '2026-04-01', true)
ON CONFLICT (slug) DO NOTHING;

-- Homepage sections
INSERT INTO public.homepage_sections (section_type, title, subtitle, data, position, published) VALUES
  ('hero', 'Discover Mauritius, Your Way', 'Premium transfers, island activities, and curated packages.', '{"cta_primary_label":"Explore Activities","cta_primary_href":"/activities","cta_secondary_label":"Book a Transfer","cta_secondary_href":"/transfers","hero_image_url":"https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=1920&q=80"}', 0, true),
  ('transfers_cta', 'Airport Transfers', 'Arrive relaxed. Depart on time.', '{"cta_label":"See Prices","cta_href":"/transfers","image_url":"https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80"}', 1, true),
  ('featured_activities', 'Top Experiences', 'Curated adventures for every traveller.', '{"limit":6}', 2, true),
  ('destinations', 'Explore Mauritius', 'From northern beaches to the wild southwestern coast.', '{"limit":3}', 3, true),
  ('testimonials', 'What Our Guests Say', 'Thousands of happy travellers trust Tropigo.', '{"limit":4}', 4, true),
  ('faqs', 'Frequently Asked Questions', null, '{"limit":6,"category":"booking"}', 5, true);
