-- =============================================================
-- TROPIGO — SEED DATA
-- Run after migration 20260410000000_schema.sql
-- Apply with: npx supabase db reset --linked
-- =============================================================

-- ---------------------------------------------------------------
-- SETTINGS (singleton row already created by migration)
-- ---------------------------------------------------------------

UPDATE public.settings SET
  brand_name              = 'Tropigo',
  tagline                 = 'Discover Mauritius, Your Way',
  contact_email           = 'hello@tropigo.mu',
  contact_phone           = '+230 5 000 0000',
  whatsapp                = '+23050000000',
  address                 = '{"street": "Royal Road", "city": "Grand Baie", "region": "Rivière du Rempart", "country": "Mauritius"}',
  socials                 = '{"instagram": "https://instagram.com/tropigo", "facebook": "https://facebook.com/tropigo"}',
  supported_currencies    = '{EUR,USD,GBP,MUR}',
  default_currency        = 'EUR',
  default_seo_title       = 'Tropigo — Mauritius Tours, Transfers & Experiences',
  default_seo_description = 'Discover the best of Mauritius with Tropigo. Book guided tours, airport transfers, and island experiences.'
WHERE id = '00000000-0000-0000-0000-000000000001'::uuid;

-- ---------------------------------------------------------------
-- NAVIGATION
-- ---------------------------------------------------------------

INSERT INTO public.navigation_menus (id, key, label) VALUES
  ('11111111-0000-0000-0000-000000000001'::uuid, 'main',   'Main Navigation'),
  ('11111111-0000-0000-0000-000000000002'::uuid, 'footer', 'Footer Navigation')
ON CONFLICT DO NOTHING;

INSERT INTO public.navigation_items (menu_id, label, href, position) VALUES
  ('11111111-0000-0000-0000-000000000001'::uuid, 'Trips',        '/trips',        0),
  ('11111111-0000-0000-0000-000000000001'::uuid, 'Transfers',    '/transfers',    1),
  ('11111111-0000-0000-0000-000000000001'::uuid, 'Destinations', '/destinations', 2),
  ('11111111-0000-0000-0000-000000000002'::uuid, 'About',                '/about',                      0),
  ('11111111-0000-0000-0000-000000000002'::uuid, 'Contact',              '/contact',                    1),
  ('11111111-0000-0000-0000-000000000002'::uuid, 'FAQ',                  '/faq',                        2),
  ('11111111-0000-0000-0000-000000000002'::uuid, 'Privacy Policy',       '/legal/privacy-policy',       3),
  ('11111111-0000-0000-0000-000000000002'::uuid, 'Terms & Conditions',   '/legal/terms-and-conditions', 4);

-- ---------------------------------------------------------------
-- DESTINATIONS
-- ---------------------------------------------------------------

INSERT INTO public.destinations (slug, name, summary, region, hero_image_url, featured, position, published) VALUES
  ('grand-baie',   'Grand Baie',   'The vibrant hub of northern Mauritius.',                 'North',     'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1600&q=80', true, 0, true),
  ('le-morne',     'Le Morne',     'UNESCO heritage and world-class kitesurfing.',            'South West','https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1600&q=80', true, 1, true),
  ('ile-aux-cerfs','Île aux Cerfs','A stunning private island in the blue eastern lagoon.',   'East',      'https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=1600&q=80', true, 2, true)
ON CONFLICT (slug) DO NOTHING;

-- ---------------------------------------------------------------
-- TRANSFER ZONES
-- ---------------------------------------------------------------

INSERT INTO public.transfer_zones (id, name, description, color, sort_order) VALUES
  ('22222222-0000-0000-0000-000000000001'::uuid, 'Airport (SSR)', 'Sir Seewoosagur Ramgoolam International Airport', '#EF4444', 0),
  ('22222222-0000-0000-0000-000000000002'::uuid, 'North',         'Grand Baie, Pereybere, Cap Malheureux, Trou aux Biches', '#3B82F6', 1),
  ('22222222-0000-0000-0000-000000000003'::uuid, 'East',          'Belle Mare, Trou d''Eau Douce, Flacq, Mahébourg',       '#10B981', 2),
  ('22222222-0000-0000-0000-000000000004'::uuid, 'South',         'Blue Bay, Souillac, Bel Ombre',                         '#8B5CF6', 3),
  ('22222222-0000-0000-0000-000000000005'::uuid, 'South West',    'Le Morne, Flic en Flac, Tamarin',                       '#F59E0B', 4),
  ('22222222-0000-0000-0000-000000000006'::uuid, 'Central',       'Port Louis, Curepipe, Quatre Bornes',                   '#6B7280', 5)
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------
-- PRODUCTS — Airport Transfer
-- ---------------------------------------------------------------

INSERT INTO public.products (id, product_type, slug, title, subtitle, summary, status, base_currency, base_price, featured, position) VALUES
  ('33333333-0000-0000-0000-000000000001'::uuid, 'airport_transfer', 'airport-transfer-private', 'Private Airport Transfer', 'Door-to-door across Mauritius',
   'Reliable private transfers between SSR Airport and any destination in Mauritius.', 'published', 'EUR', 45.00, true, 0)
ON CONFLICT DO NOTHING;

INSERT INTO public.airport_transfers (product_id, pricing_model, vehicle_type, max_passengers, max_luggage, includes_meet_greet, includes_flight_tracking, notes)
VALUES ('33333333-0000-0000-0000-000000000001'::uuid, 'zone_based', 'sedan', 4, 4, true, true, 'Flight tracking included. 30 min free waiting after landing.')
ON CONFLICT DO NOTHING;

INSERT INTO public.transfer_zone_prices (transfer_id, from_zone_id, to_zone_id, vehicle_type, price) VALUES
  ('33333333-0000-0000-0000-000000000001'::uuid, '22222222-0000-0000-0000-000000000001'::uuid, '22222222-0000-0000-0000-000000000002'::uuid, 'sedan',   45.00),
  ('33333333-0000-0000-0000-000000000001'::uuid, '22222222-0000-0000-0000-000000000001'::uuid, '22222222-0000-0000-0000-000000000003'::uuid, 'sedan',   55.00),
  ('33333333-0000-0000-0000-000000000001'::uuid, '22222222-0000-0000-0000-000000000001'::uuid, '22222222-0000-0000-0000-000000000004'::uuid, 'sedan',   40.00),
  ('33333333-0000-0000-0000-000000000001'::uuid, '22222222-0000-0000-0000-000000000001'::uuid, '22222222-0000-0000-0000-000000000005'::uuid, 'sedan',   50.00),
  ('33333333-0000-0000-0000-000000000001'::uuid, '22222222-0000-0000-0000-000000000001'::uuid, '22222222-0000-0000-0000-000000000006'::uuid, 'sedan',   35.00),
  ('33333333-0000-0000-0000-000000000001'::uuid, '22222222-0000-0000-0000-000000000001'::uuid, '22222222-0000-0000-0000-000000000002'::uuid, 'minivan', 65.00),
  ('33333333-0000-0000-0000-000000000001'::uuid, '22222222-0000-0000-0000-000000000001'::uuid, '22222222-0000-0000-0000-000000000003'::uuid, 'minivan', 75.00),
  ('33333333-0000-0000-0000-000000000001'::uuid, '22222222-0000-0000-0000-000000000001'::uuid, '22222222-0000-0000-0000-000000000005'::uuid, 'minivan', 70.00)
ON CONFLICT DO NOTHING;

INSERT INTO public.transfer_hotels (name, zone_id, address) VALUES
  ('LUX* Grand Gaube',            '22222222-0000-0000-0000-000000000002'::uuid, 'Grand Gaube, Mauritius'),
  ('Zilwa Attitude',              '22222222-0000-0000-0000-000000000002'::uuid, 'Kalodyne Road, Grand Gaube'),
  ('Heritage Le Telfair',         '22222222-0000-0000-0000-000000000004'::uuid, 'Bel Ombre, Mauritius'),
  ('Shanti Maurice',              '22222222-0000-0000-0000-000000000004'::uuid, 'Chemin Grenier, Souillac'),
  ('Sugar Beach Mauritius',       '22222222-0000-0000-0000-000000000005'::uuid, 'Flic en Flac, Mauritius'),
  ('Dinarobin Beachcomber',       '22222222-0000-0000-0000-000000000005'::uuid, 'Le Morne Peninsula'),
  ('Constance Belle Mare Plage',  '22222222-0000-0000-0000-000000000003'::uuid, 'Belle Mare, Flacq'),
  ('Four Seasons Mauritius',      '22222222-0000-0000-0000-000000000003'::uuid, 'Anahita, Beau Champ');

-- ---------------------------------------------------------------
-- PRODUCTS — Guided Trips (core business)
-- ---------------------------------------------------------------

INSERT INTO public.products (id, product_type, slug, title, subtitle, summary, description, status, base_currency, base_price, featured, position, seo_title, seo_description) VALUES
  ('44444444-0000-0000-0000-000000000001'::uuid, 'trip', 'south-island-full-day',
   'South Island Full-Day Tour', 'Discover the wild beauty of Southern Mauritius',
   'A full-day guided driving tour through the dramatic landscapes of Southern Mauritius. Grand Bassin, Chamarel Waterfall, and the Seven Colored Earths.',
   'Experience the untamed South of Mauritius on this comprehensive full-day guided tour. Your experienced local driver will take you through scenic villages, lush sugar cane fields, and breathtaking viewpoints. We begin at Grand Bassin (Ganga Talao), the sacred crater lake, then wind through the Black River Gorges before arriving at the spectacular Chamarel Waterfall. After an included lunch, we visit the Seven Colored Earths — a unique geological formation of seven distinct colored sand dunes.',
   'published', 'EUR', 95.00, true, 0,
   'South Island Full-Day Tour — Guided Driving Tour | Tropigo',
   'Full-day guided driving tour of Southern Mauritius: Grand Bassin, Chamarel Waterfall, Seven Colored Earths. Hotel pickup, lunch, and experienced local driver included.'),

  ('44444444-0000-0000-0000-000000000002'::uuid, 'trip', 'north-island-classic',
   'North Island Classic Tour', 'Explore the vibrant North from Grand Baie to Pamplemousses',
   'Discover the highlights of Northern Mauritius — Pamplemousses Botanical Garden, Cap Malheureux, and the vibrant Grand Baie coastline.',
   'A carefully curated tour of the North. Start at the world-renowned Sir Seewoosagur Ramgoolam Botanical Garden at Pamplemousses, home to giant Victoria amazonica water lilies. Continue to Cap Malheureux with its iconic red-roofed church and panoramic views of Coin de Mire island. Enjoy free time in Grand Baie for lunch and beach time.',
   'published', 'EUR', 75.00, true, 1,
   'North Island Classic Tour — Guided Driving Tour | Tropigo',
   'Guided driving tour of Northern Mauritius: Pamplemousses Garden, Cap Malheureux, Grand Baie. Hotel pickup and local driver included.'),

  ('44444444-0000-0000-0000-000000000003'::uuid, 'trip', 'west-coast-adventure',
   'West Coast & Dolphins Tour', 'Dolphin watching, black river gorges and sunset views',
   'An unforgettable West Coast adventure — spot dolphins in the wild, explore the Black River Gorges, visit Le Morne Brabant, and watch a spectacular Indian Ocean sunset.',
   'Early morning departure for dolphin watching off the West Coast. Swim with or observe spinner dolphins in their natural habitat. Then drive through the Black River Gorges National Park with stops at Alexandra Falls and the Black River Peak. The afternoon takes us to Le Morne Brabant — the iconic UNESCO World Heritage Site.',
   'published', 'EUR', 110.00, true, 2,
   'West Coast & Dolphins Tour — Guided Driving Tour | Tropigo',
   'West Coast guided tour with dolphin watching, Black River Gorges, Le Morne Brabant. Hotel pickup, boat trip, and experienced local driver included.'),

  ('44444444-0000-0000-0000-000000000004'::uuid, 'trip', 'east-coast-leisure',
   'East Coast & Île aux Cerfs Tour', 'Crystal-clear lagoons, island paradise and the charming East',
   'A relaxed day exploring the stunning East Coast — visit Trou d''Eau Douce, spend time on Île aux Cerfs, and discover the charm of Flacq.',
   'A laid-back tour of the scenic East Coast. We start with a drive through the charming village of Trou d''Eau Douce before taking a boat to Île aux Cerfs for beach time and optional water sports. On the way back, stop at the Grand River South East viewpoint and the bustling Flacq Market.',
   'published', 'EUR', 85.00, false, 3,
   'East Coast & Île aux Cerfs Tour — Guided Driving Tour | Tropigo',
   'East Coast guided tour: Île aux Cerfs, Trou d''Eau Douce, Flacq Market. Hotel pickup, boat transfer, experienced driver included.'),

  ('44444444-0000-0000-0000-000000000005'::uuid, 'trip', 'cultural-heritage-tour',
   'Cultural Heritage Tour', 'A journey through Mauritius'' diverse cultural tapestry',
   'Immerse yourself in the multicultural soul of Mauritius — temples, markets, colonial estates, and Creole cuisine in this rich cultural driving tour.',
   'Mauritius is one of the most culturally diverse islands on Earth. This tour visits Grand Bassin (Ganga Talao) and the Mahaadyane Temple, the bustling Central Market in Port Louis, the Eureka Creole House, and a rum distillery for a guided tasting.',
   'published', 'EUR', 105.00, true, 4,
   'Cultural Heritage Tour — Guided Driving Tour | Tropigo',
   'Cultural heritage guided tour: temples, markets, Creole cuisine, colonial history. Hotel pickup, lunch, and tastings included.'),

  ('44444444-0000-0000-0000-000000000006'::uuid, 'trip', 'sunset-gastronomic-tour',
   'Sunset & Gastronomic Tour', 'A culinary journey ending with a golden Indian Ocean sunset',
   'An evening tour for food lovers — local markets, Mauritian street food, a cooking demonstration, and a sunset from a breathtaking coastal viewpoint.',
   'This tour focuses on the incredible flavors of Mauritius. We begin at a local food market, then enjoy a hands-on Creole cooking demonstration. As the golden hour approaches, drive to a scenic coastal viewpoint to watch the sun melt into the Indian Ocean. The tour ends at a beachside bar for a locally crafted cocktail.',
   'published', 'EUR', 80.00, false, 5,
   'Sunset & Gastronomic Tour — Evening Food Tour | Tropigo',
   'Evening food and sunset tour of Mauritius: markets, cooking demo, Creole cuisine, sunset viewpoint. Hotel pickup and tastings included.')
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------
-- TRIPS — extension rows for guided tours
-- ---------------------------------------------------------------

INSERT INTO public.trips (product_id, trip_mode, trip_type, duration_minutes, vehicle_type, max_passengers, pickup_included, pickup_location, pickup_time, dropoff_location, dropoff_included, included_items, excluded_items, highlights, itinerary, important_notes, destination_id, difficulty_level, min_participants)
SELECT '44444444-0000-0000-0000-000000000001'::uuid, 'guided_tour', 'south', 600, 'minivan', 6, true,
  'Hotel lobby or any hotel in your region', '07:30', 'Same as pickup', true,
  '{"Hotel pickup and dropoff","Professional English-speaking driver","Air-conditioned vehicle","Lunch at local restaurant","All entrance fees","Mineral water"}',
  '{"Alcoholic beverages","Personal expenses","Travel insurance","Optional activities","Gratuities"}',
  '{"Sacred Grand Bassin (Ganga Talao) lake","Black River Gorges viewpoints","100m Chamarel Waterfall","Seven Colored Earths geological wonder","Chamarel Rhumerie tasting","Scenic village drives"}',
  '[
    {"time":"07:30","title":"Hotel Pickup","description":"Your driver collects you from your hotel lobby.","duration_minutes":15},
    {"time":"08:30","title":"Grand Bassin (Ganga Talao)","description":"Visit the sacred crater lake, Hindu temples, and giant statues.","duration_minutes":60,"photo_url":"https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80"},
    {"time":"10:00","title":"Black River Gorges National Park","description":"Scenic drive through the national park with stops at key viewpoints.","duration_minutes":45},
    {"time":"11:00","title":"Chamarel Waterfall","description":"View the tallest waterfall in Mauritius (100m) from the panoramic viewpoint.","duration_minutes":30,"photo_url":"https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=800&q=80"},
    {"time":"12:30","title":"Lunch at Local Restaurant","description":"Included Creole lunch: rougaille, fresh fish, rice, and tropical fruits.","duration_minutes":60},
    {"time":"14:00","title":"Seven Colored Earths","description":"Explore the unique geological formation of seven distinct colored sand dunes.","duration_minutes":45,"photo_url":"https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80"},
    {"time":"15:00","title":"Chamarel Rhumerie (Optional)","description":"Visit the artisanal rum distillery. Tasting of 5 rums available (optional).","duration_minutes":30},
    {"time":"16:30","title":"Return to Hotel","description":"Scenic drive back with a final stop. Dropoff at your hotel.","duration_minutes":90}
  ]',
  'Wear comfortable walking shoes and bring sunscreen. Vegetarian lunch options available on request.',
  d.id, 'moderate', 1
FROM public.destinations d WHERE d.slug = 'le-morne'
ON CONFLICT DO NOTHING;

INSERT INTO public.trips (product_id, trip_mode, trip_type, duration_minutes, vehicle_type, max_passengers, pickup_included, pickup_location, pickup_time, dropoff_location, dropoff_included, included_items, excluded_items, highlights, itinerary, important_notes, destination_id, difficulty_level, min_participants)
SELECT '44444444-0000-0000-0000-000000000002'::uuid, 'guided_tour', 'north', 480, 'minivan', 6, true,
  'Hotel lobby or any hotel in your region', '08:30', 'Same as pickup', true,
  '{"Hotel pickup and dropoff","Professional English-speaking driver","Air-conditioned vehicle","Entrance to Pamplemousses Garden","Mineral water"}',
  '{"Lunch (available to purchase in Grand Baie)","Alcoholic beverages","Personal expenses","Gratuities"}',
  '{"Pamplemousses Botanical Garden","Giant Victoria amazonica water lilies","Cap Malheureux red church","Grand Baie free time","Coin de Mire island views","Scenic coastal drive"}',
  '[
    {"time":"08:30","title":"Hotel Pickup","description":"Pickup from your hotel in a comfortable air-conditioned vehicle.","duration_minutes":15},
    {"time":"09:30","title":"Pamplemousses Botanical Garden","description":"Explore the oldest botanical garden in the Southern Hemisphere. See giant water lilies, spice garden, and tropical palms.","duration_minutes":90,"photo_url":"https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80"},
    {"time":"11:30","title":"Cap Malheureux & Red Church","description":"Visit the iconic red-roofed Notre Dame Auxiliatrice church with panoramic views of Coin de Mire island.","duration_minutes":30},
    {"time":"12:30","title":"Grand Baie — Free Time","description":"Enjoy free time in Grand Baie for lunch, shopping, and beach relaxation.","duration_minutes":120},
    {"time":"15:00","title":"Scenic Coastal Drive","description":"Return drive along the picturesque northern coastline with photo stops.","duration_minutes":60},
    {"time":"16:00","title":"Return to Hotel","description":"Dropoff at your hotel.","duration_minutes":30}
  ]',
  'Suitable for all ages and fitness levels. Bring a hat, sunscreen, and comfortable walking shoes.',
  d.id, 'easy', 1
FROM public.destinations d WHERE d.slug = 'grand-baie'
ON CONFLICT DO NOTHING;

INSERT INTO public.trips (product_id, trip_mode, trip_type, duration_minutes, vehicle_type, max_passengers, pickup_included, pickup_location, pickup_time, dropoff_location, dropoff_included, included_items, excluded_items, highlights, itinerary, important_notes, destination_id, difficulty_level, min_participants)
SELECT '44444444-0000-0000-0000-000000000003'::uuid, 'guided_tour', 'west', 660, 'minivan', 6, true,
  'Hotel lobby or any hotel in your region', '06:00', 'Same as pickup', true,
  '{"Early hotel pickup","Professional English-speaking driver","Air-conditioned vehicle","Dolphin watching boat trip","Snorkeling equipment","Lunch at beach restaurant","All entrance fees","Mineral water"}',
  '{"Swim-with-dolphins upgrade (optional, extra cost)","Alcoholic beverages","Personal expenses","Gratuities"}',
  '{"Dolphin watching in the wild","Black River Gorges National Park","Alexandra Falls viewpoint","Le Morne Brabant UNESCO site","Beach sunset","Scenic west coast drive"}',
  '[
    {"time":"06:00","title":"Early Hotel Pickup","description":"Early departure to catch the morning dolphin activity. Coffee and snacks provided.","duration_minutes":15},
    {"time":"06:45","title":"Tamarin Bay — Dolphin Watching","description":"Board a traditional boat for a dolphin watching trip. Spot spinner dolphins in their natural habitat.","duration_minutes":90,"photo_url":"https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=800&q=80"},
    {"time":"09:00","title":"Black River Gorges National Park","description":"Drive through the largest remaining tropical forest on Mauritius.","duration_minutes":60},
    {"time":"10:30","title":"Alexandra Falls","description":"Short walk to a hidden waterfall in the Black River Gorges.","duration_minutes":30},
    {"time":"12:00","title":"Beach Lunch","description":"Lunch at a beachside restaurant featuring fresh seafood and Creole specialties.","duration_minutes":60},
    {"time":"13:30","title":"Le Morne Brabant","description":"Visit the iconic mountain — a UNESCO World Heritage Site symbolizing freedom.","duration_minutes":60,"photo_url":"https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80"},
    {"time":"16:30","title":"Sunset Beach Stop","description":"Watch the spectacular West Coast sunset from a private beach spot.","duration_minutes":45},
    {"time":"17:30","title":"Return to Hotel","description":"Dropoff at your hotel.","duration_minutes":60}
  ]',
  'Very early start (6:00 AM). Bring swimwear, towel, and sunscreen. Motion sickness medication recommended for the boat trip.',
  d.id, 'moderate', 1
FROM public.destinations d WHERE d.slug = 'le-morne'
ON CONFLICT DO NOTHING;

INSERT INTO public.trips (product_id, trip_mode, trip_type, duration_minutes, vehicle_type, max_passengers, pickup_included, pickup_location, pickup_time, dropoff_location, dropoff_included, included_items, excluded_items, highlights, itinerary, important_notes, destination_id, difficulty_level, min_participants)
SELECT '44444444-0000-0000-0000-000000000004'::uuid, 'guided_tour', 'east', 540, 'minivan', 6, true,
  'Hotel lobby or any hotel in your region', '08:00', 'Same as pickup', true,
  '{"Hotel pickup and dropoff","Professional English-speaking driver","Air-conditioned vehicle","Boat transfer to Île aux Cerfs","Beach time","Mineral water"}',
  '{"Lunch","Water sports on Île aux Cerfs (extra cost)","Alcoholic beverages","Personal expenses","Gratuities"}',
  '{"Trou d''Eau Douce village","Île aux Cerfs pristine beach","Crystal-clear lagoon","Flacq Market (Wed & Sun)","East Coast scenic drive"}',
  '[
    {"time":"08:00","title":"Hotel Pickup","description":"Morning pickup from your hotel.","duration_minutes":15},
    {"time":"09:00","title":"Trou d''Eau Douce","description":"Charming fishing village. Board the boat to Île aux Cerfs.","duration_minutes":30,"photo_url":"https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=800&q=80"},
    {"time":"09:30","title":"Île aux Cerfs — Free Time","description":"Enjoy the pristine white-sand beach and turquoise lagoon. Optional water sports available.","duration_minutes":180,"photo_url":"https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80"},
    {"time":"13:00","title":"Lunch Break","description":"Free time for lunch in Trou d''Eau Douce.","duration_minutes":60},
    {"time":"14:30","title":"East Coast Scenic Drive","description":"Drive along the beautiful eastern coastline with stops at viewpoints.","duration_minutes":60},
    {"time":"15:30","title":"Flacq Market (Wed & Sun)","description":"Largest open-air market in Mauritius. Spices, textiles, and local crafts.","duration_minutes":45},
    {"time":"16:30","title":"Return to Hotel","description":"Dropoff at your hotel.","duration_minutes":60}
  ]',
  'Bring beachwear, towel, sunscreen, and cash for optional water sports. Boat transfer is weather dependent.',
  d.id, 'easy', 1
FROM public.destinations d WHERE d.slug = 'ile-aux-cerfs'
ON CONFLICT DO NOTHING;

INSERT INTO public.trips (product_id, trip_mode, trip_type, duration_minutes, vehicle_type, max_passengers, pickup_included, pickup_location, pickup_time, dropoff_location, dropoff_included, included_items, excluded_items, highlights, itinerary, important_notes, destination_id, difficulty_level, min_participants)
SELECT '44444444-0000-0000-0000-000000000005'::uuid, 'guided_tour', 'cultural', 600, 'minivan', 6, true,
  'Hotel lobby or any hotel in your region', '08:00', 'Same as pickup', true,
  '{"Hotel pickup and dropoff","Professional English-speaking driver","Air-conditioned vehicle","Creole lunch","Market tour","Rum tasting","All entrance fees","Mineral water"}',
  '{"Alcoholic beverages beyond rum tasting","Personal shopping","Gratuities"}',
  '{"Grand Bassin Hindu temples","Port Louis Central Market","Creole cooking demo","Eureka Creole House","Rum distillery tasting","Multicultural heritage sites"}',
  '[
    {"time":"08:00","title":"Hotel Pickup","description":"Morning pickup from your hotel.","duration_minutes":15},
    {"time":"09:00","title":"Grand Bassin (Ganga Talao)","description":"Visit the sacred Hindu lake and the magnificent Mahaadyane Temple.","duration_minutes":60,"photo_url":"https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80"},
    {"time":"10:30","title":"Port Louis Central Market","description":"Vibrant open-air market — spices, tropical fruits, and Mauritian street food.","duration_minutes":60},
    {"time":"12:00","title":"Creole Lunch","description":"Authentic Creole lunch at a local restaurant. Rougaille, dholl puri, fresh seafood.","duration_minutes":60},
    {"time":"13:30","title":"Eureka Creole House","description":"Beautifully restored 18th-century Creole colonial house with gardens and waterfall.","duration_minutes":45,"photo_url":"https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80"},
    {"time":"14:30","title":"Rum Distillery & Tasting","description":"Guided visit of an artisanal rum distillery. Tasting of 5 different rums included.","duration_minutes":45},
    {"time":"16:00","title":"Return to Hotel","description":"Scenic drive back with final photo stops.","duration_minutes":60}
  ]',
  'Dress modestly when visiting temples (covered shoulders and knees). Vegetarian and halal lunch options available on request.',
  d.id, 'easy', 1
FROM public.destinations d WHERE d.slug = 'grand-baie'
ON CONFLICT DO NOTHING;

INSERT INTO public.trips (product_id, trip_mode, trip_type, duration_minutes, vehicle_type, max_passengers, pickup_included, pickup_location, pickup_time, dropoff_location, dropoff_included, included_items, excluded_items, highlights, itinerary, important_notes, destination_id, difficulty_level, min_participants)
SELECT '44444444-0000-0000-0000-000000000006'::uuid, 'guided_tour', 'custom', 300, 'sedan', 4, true,
  'Hotel lobby or any hotel in your region', '15:00', 'Same as pickup', true,
  '{"Hotel pickup and dropoff","Professional English-speaking driver","Air-conditioned vehicle","Food market tour","Cooking demonstration","Rum/cocktail at sunset bar"}',
  '{"Dinner (not included)","Personal expenses","Gratuities"}',
  '{"Local food market visit","Hands-on cooking demo","Tropical fruit tasting","Sunset coastal viewpoint","Beachside cocktail"}',
  '[
    {"time":"15:00","title":"Hotel Pickup","description":"Afternoon pickup from your hotel.","duration_minutes":15},
    {"time":"15:30","title":"Local Food Market","description":"Explore a local market with your guide. Taste tropical fruits, spices, and street food.","duration_minutes":45},
    {"time":"16:30","title":"Cooking Demonstration","description":"Hands-on Creole cooking demonstration at a local kitchen.","duration_minutes":45},
    {"time":"17:30","title":"Sunset Coastal Viewpoint","description":"Drive to a scenic coastal spot to watch the sun set over the Indian Ocean.","duration_minutes":45},
    {"time":"18:30","title":"Beachside Bar","description":"Unwind with a locally crafted cocktail at a beachside bar.","duration_minutes":30},
    {"time":"19:15","title":"Return to Hotel","description":"Dropoff at your hotel.","duration_minutes":30}
  ]',
  'This is an evening tour. Perfect for those who want a relaxed, cultural experience without a full-day commitment.',
  d.id, 'easy', 1
FROM public.destinations d WHERE d.slug = 'grand-baie'
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------
-- PRODUCTS — Single Drop-off Trips
-- ---------------------------------------------------------------

INSERT INTO public.products (id, product_type, slug, title, subtitle, summary, description, status, base_currency, base_price, featured, position) VALUES
  ('44444444-0000-0000-0000-000000000007'::uuid, 'trip', 'casela-dropoff',
   'Casela Wildlife Park Drop-off', 'Hotel pickup and drop-off to Casela',
   'Convenient round-trip transfer from your hotel to Casela Wildlife Park.',
   'A simple, reliable round-trip transfer to Casela Wildlife Park. No guided tour — just comfortable, punctual transport so you can explore Casela at your own pace.',
   'published', 'EUR', 35.00, false, 10),

  ('44444444-0000-0000-0000-000000000008'::uuid, 'trip', 'la-vanille-dropoff',
   'La Vanille Nature Park Drop-off', 'Hotel transfer to La Vanille Nature Park',
   'Round-trip transfer from your hotel to La Vanille Nature Park (Crocodile Park).',
   'Easy round-trip transfer to La Vanille Nature Park. Famous for its crocodile farm, giant tortoises, and nature trails.',
   'published', 'EUR', 30.00, false, 11),

  ('44444444-0000-0000-0000-000000000009'::uuid, 'trip', 'seven-colored-earths-dropoff',
   'Seven Colored Earths Drop-off', 'Direct transfer to Chamarel Seven Colored Earths',
   'Round-trip transfer to the Seven Colored Earths and Chamarel Waterfall viewpoint.',
   'Direct transport to the Seven Colored Earths and Chamarel area. Your driver takes you to the main entrance, then waits for your signal when ready to return.',
   'published', 'EUR', 40.00, false, 12)
ON CONFLICT DO NOTHING;

INSERT INTO public.trips (product_id, trip_mode, trip_type, duration_minutes, vehicle_type, max_passengers, pickup_included, pickup_location, pickup_time, dropoff_location, dropoff_included, included_items, excluded_items, highlights, itinerary, important_notes, destination_id, difficulty_level, min_participants)
SELECT '44444444-0000-0000-0000-000000000007'::uuid, 'single_dropoff', 'custom', 60, 'sedan', 4, true,
  'Hotel lobby or any hotel in your region', '08:00', 'Casela Wildlife Park, Cascavelle', true,
  '{"Hotel pickup and drop-off","Air-conditioned vehicle","Bottled water","Flexible return time","Child seat on request"}',
  '{"Casela entrance fees","Food and drinks","Personal expenses","Activities inside the park","Gratuities"}',
  '{"Door-to-door service","Flexible return timing","Explore at your own pace","Air-conditioned comfort"}',
  '[]',
  'Casela entrance tickets must be purchased separately. Allow a full day for your visit.',
  d.id, 'easy', 1
FROM public.destinations d WHERE d.slug = 'grand-baie'
ON CONFLICT DO NOTHING;

INSERT INTO public.trips (product_id, trip_mode, trip_type, duration_minutes, vehicle_type, max_passengers, pickup_included, pickup_location, pickup_time, dropoff_location, dropoff_included, included_items, excluded_items, highlights, itinerary, important_notes, destination_id, difficulty_level, min_participants)
SELECT '44444444-0000-0000-0000-000000000008'::uuid, 'single_dropoff', 'south', 50, 'sedan', 4, true,
  'Hotel lobby or any hotel in your region', '09:00', 'La Vanille Nature Park, Rivière des Anguilles', true,
  '{"Hotel pickup and drop-off","Air-conditioned vehicle","Bottled water","Flexible return time"}',
  '{"Park entrance fees","Food and drinks","Personal expenses","Gratuities"}',
  '{"Crocodile farm visit","Giant tortoise encounter","Nature trails","Flexible return timing"}',
  '[]',
  'Park entrance tickets must be purchased separately. Allow 2–3 hours for the park visit.',
  d.id, 'easy', 1
FROM public.destinations d WHERE d.slug = 'le-morne'
ON CONFLICT DO NOTHING;

INSERT INTO public.trips (product_id, trip_mode, trip_type, duration_minutes, vehicle_type, max_passengers, pickup_included, pickup_location, pickup_time, dropoff_location, dropoff_included, included_items, excluded_items, highlights, itinerary, important_notes, destination_id, difficulty_level, min_participants)
SELECT '44444444-0000-0000-0000-000000000009'::uuid, 'single_dropoff', 'south', 75, 'sedan', 4, true,
  'Hotel lobby or any hotel in your region', '08:30', 'Seven Colored Earths, Chamarel', true,
  '{"Hotel pickup and drop-off","Air-conditioned vehicle","Bottled water","Flexible return time"}',
  '{"Entrance fees","Food and drinks","Personal expenses","Gratuities"}',
  '{"Seven Colored Earths viewpoint","Chamarel Waterfall viewpoint","Chamarel village","Flexible return timing"}',
  '[]',
  'Entrance fees not included. The drive to Chamarel is scenic but winding.',
  d.id, 'easy', 1
FROM public.destinations d WHERE d.slug = 'le-morne'
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------
-- PRODUCT DESTINATIONS
-- ---------------------------------------------------------------

INSERT INTO public.product_destinations (product_id, destination_id)
SELECT p.id, d.id FROM (VALUES
  ('44444444-0000-0000-0000-000000000001'::uuid, 'le-morne'),
  ('44444444-0000-0000-0000-000000000002'::uuid, 'grand-baie'),
  ('44444444-0000-0000-0000-000000000003'::uuid, 'le-morne'),
  ('44444444-0000-0000-0000-000000000004'::uuid, 'ile-aux-cerfs'),
  ('44444444-0000-0000-0000-000000000005'::uuid, 'grand-baie'),
  ('44444444-0000-0000-0000-000000000006'::uuid, 'grand-baie'),
  ('44444444-0000-0000-0000-000000000007'::uuid, 'grand-baie'),
  ('44444444-0000-0000-0000-000000000008'::uuid, 'le-morne'),
  ('44444444-0000-0000-0000-000000000009'::uuid, 'le-morne'),
  ('33333333-0000-0000-0000-000000000001'::uuid, 'grand-baie')
) AS pairs(pid, slug)
JOIN public.destinations d ON d.slug = pairs.slug
JOIN public.products p ON p.id = pairs.pid
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------------
-- AVAILABILITY RULES
-- ---------------------------------------------------------------

INSERT INTO public.availability_rules (product_id, rule_type, days_of_week, min_advance_hours, max_advance_days) VALUES
  ('44444444-0000-0000-0000-000000000001'::uuid, 'schedule', '{0,1,2,3,4,5,6}', 24, 90),
  ('44444444-0000-0000-0000-000000000002'::uuid, 'schedule', '{0,1,2,3,4,5,6}', 24, 90),
  ('44444444-0000-0000-0000-000000000003'::uuid, 'schedule', '{0,1,2,3,4,5,6}', 24, 90),
  ('44444444-0000-0000-0000-000000000004'::uuid, 'schedule', '{0,1,2,3,4,5,6}', 24, 90),
  ('44444444-0000-0000-0000-000000000005'::uuid, 'schedule', '{0,1,2,3,4,5,6}', 24, 90),
  ('44444444-0000-0000-0000-000000000006'::uuid, 'schedule', '{0,1,2,3,4,5,6}', 24, 90),
  ('44444444-0000-0000-0000-000000000007'::uuid, 'schedule', '{0,1,2,3,4,5,6}', 12, 60),
  ('44444444-0000-0000-0000-000000000008'::uuid, 'schedule', '{0,1,2,3,4,5,6}', 12, 60),
  ('44444444-0000-0000-0000-000000000009'::uuid, 'schedule', '{0,1,2,3,4,5,6}', 12, 60);

-- ---------------------------------------------------------------
-- PRODUCT MEDIA
-- ---------------------------------------------------------------

INSERT INTO public.product_media (product_id, url, alt, is_cover, sort_order) VALUES
  ('33333333-0000-0000-0000-000000000001'::uuid, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80', 'Private airport transfer',     true,  0),
  ('44444444-0000-0000-0000-000000000001'::uuid, 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1200&q=80', 'Chamarel South Tour',       true,  0),
  ('44444444-0000-0000-0000-000000000001'::uuid, 'https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=1200&q=80',  'Seven Colored Earths',       false, 1),
  ('44444444-0000-0000-0000-000000000002'::uuid, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80', 'North Island Tour',          true,  0),
  ('44444444-0000-0000-0000-000000000003'::uuid, 'https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=1200&q=80', 'West Coast Dolphins',        true,  0),
  ('44444444-0000-0000-0000-000000000004'::uuid, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80', 'Île aux Cerfs East Tour',    true,  0),
  ('44444444-0000-0000-0000-000000000005'::uuid, 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1200&q=80', 'Cultural Heritage Tour',   true,  0),
  ('44444444-0000-0000-0000-000000000006'::uuid, 'https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=1200&q=80', 'Sunset Gastronomic Tour',    true,  0),
  ('44444444-0000-0000-0000-000000000007'::uuid, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1600&q=80', 'Casela Wildlife Park',       true,  0),
  ('44444444-0000-0000-0000-000000000008'::uuid, 'https://images.unsplash.com/photo-1560275619-4cc5fa59d3ae?w=1600&q=80', 'La Vanille crocodile park',  true,  0),
  ('44444444-0000-0000-0000-000000000009'::uuid, 'https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=1600&q=80', 'Seven Colored Earths',       true,  0);

-- ---------------------------------------------------------------
-- CURRENCY RATES
-- ---------------------------------------------------------------

INSERT INTO public.currency_rates (from_currency, to_currency, rate) VALUES
  ('EUR', 'USD', 1.0850), ('EUR', 'GBP', 0.8560), ('EUR', 'MUR', 48.50),
  ('USD', 'EUR', 0.9217), ('USD', 'GBP', 0.7887), ('USD', 'MUR', 44.70),
  ('GBP', 'EUR', 1.1682), ('GBP', 'USD', 1.2679), ('GBP', 'MUR', 56.67),
  ('MUR', 'EUR', 0.0206), ('MUR', 'USD', 0.0224), ('MUR', 'GBP', 0.0177)
ON CONFLICT (from_currency, to_currency) DO UPDATE SET rate = EXCLUDED.rate, fetched_at = now();

-- ---------------------------------------------------------------
-- TESTIMONIALS
-- ---------------------------------------------------------------

INSERT INTO public.testimonials (author_name, author_location, quote, rating, position, published) VALUES
  ('Sophie Laurent',         'Paris, France',   'The South Island tour was the highlight of our honeymoon. Everything was perfectly organised. Tropigo made it effortless.', 5, 0, true),
  ('James & Karen Mitchell', 'London, UK',      'The driver was waiting with a sign, the car was immaculate. Perfect airport transfer experience.',                          5, 1, true),
  ('Marco Bianchi',          'Milan, Italy',    'Tried the West Coast dolphins tour with my family — absolutely incredible. Highly recommend!',                              5, 2, true),
  ('Anita Müller',           'Vienna, Austria', 'The Cultural Heritage Tour was wonderful. Our driver was knowledgeable and patient.',                                       5, 3, true);

-- ---------------------------------------------------------------
-- FAQs
-- ---------------------------------------------------------------

INSERT INTO public.faqs (category, question, answer, position, published) VALUES
  ('booking',    'Can I book last minute?',                     'We recommend booking at least 48 hours in advance. For urgent requests, contact us directly.',                                                 0, true),
  ('booking',    'How do I get my booking confirmation?',       'You will receive an email confirmation within minutes of completing payment with your booking reference.',                                       1, true),
  ('booking',    'Can I change or cancel my booking?',         'Free cancellation up to 48 hours before your activity. Within 48 hours, a 50% charge applies.',                                                 2, true),
  ('transfers',  'What happens if my flight is delayed?',      'We track all incoming flights in real time. Your driver will adjust automatically at no extra charge for the first 60 minutes.',                0, true),
  ('transfers',  'Do you offer child seats?',                  'Yes, child seats are available on request at no extra charge. Specify age and weight when booking.',                                             1, true),
  ('activities', 'Are activities weather dependent?',          'Water activities are weather dependent. If unsafe, we will reschedule or offer a full refund.',                                                  0, true),
  ('payments',   'What currencies do you accept?',             'We accept EUR, USD, GBP, and MUR. Prices are locked at checkout with no hidden fees.',                                                          0, true),
  ('payments',   'Is my payment secure?',                      'All payments are processed through Stripe, PCI-DSS Level 1 certified. We never store card details.',                                            1, true);

-- ---------------------------------------------------------------
-- LEGAL PAGES
-- ---------------------------------------------------------------

INSERT INTO public.legal_pages (slug, title, content, version, effective_date, published) VALUES
  ('terms-and-conditions', 'Terms & Conditions',
   '# Terms & Conditions

All bookings are confirmed after full payment. Cancellations more than 48 hours before activity receive a full refund. Within 48 hours, 50% charge applies.',
   '1.0', '2026-04-01', true),
  ('privacy-policy', 'Privacy Policy',
   '# Privacy Policy

We collect your name, email, and booking details to process your reservation. Data is not sold to third parties. Contact hello@tropigo.mu for data requests.',
   '1.0', '2026-04-01', true)
ON CONFLICT (slug) DO NOTHING;

-- ---------------------------------------------------------------
-- HOMEPAGE SECTIONS
-- ---------------------------------------------------------------

INSERT INTO public.homepage_sections (section_type, title, subtitle, data, position, published) VALUES
  ('hero',                'Discover Mauritius, Your Way',     'Premium tours, transfers, and island experiences.',
   '{"cta_primary_label":"Explore Trips","cta_primary_href":"/trips","cta_secondary_label":"Book a Transfer","cta_secondary_href":"/transfers","hero_image_url":"https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1920&q=80"}', 0, true),
  ('transfers_cta',       'Airport Transfers',                'Arrive relaxed. Depart on time.',
   '{"cta_label":"See Prices","cta_href":"/transfers","image_url":"https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80"}', 1, true),
  ('featured_activities', 'Top Experiences',                  'Curated adventures for every traveller.',
   '{"limit":6}', 2, true),
  ('destinations',        'Explore Mauritius',                'From northern beaches to the wild southwestern coast.',
   '{"limit":3}', 3, true),
  ('testimonials',        'What Our Guests Say',              'Thousands of happy travellers trust Tropigo.',
   '{"limit":4}', 4, true),
  ('faqs',                'Frequently Asked Questions',       null,
   '{"limit":6,"category":"booking"}', 5, true);
