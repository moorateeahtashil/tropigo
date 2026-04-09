-- =============================================================
-- TROPIGO — SEED DATA FOR TRIPS
-- Run after 20260409000100_trips_model.sql
-- Realistic guided driving tours for a Mauritius driver/guide business
-- =============================================================

-- ---- TRIP PRODUCTS ----

INSERT INTO public.products (id, product_type, slug, title, subtitle, summary, description, status, base_currency, base_price, featured, position, seo_title, seo_description) VALUES
  (
    '44444444-0000-0000-0000-000000000001'::uuid,
    'trip',
    'south-island-full-day',
    'South Island Full-Day Tour',
    'Discover the wild beauty of Southern Mauritius',
    'A full-day guided driving tour through the dramatic landscapes of Southern Mauritius. From the sacred waters of Grand Bassin to the thundering Chamarel Waterfall and the mystical Seven Colored Earths.',
    'Experience the untamed South of Mauritius on this comprehensive full-day guided tour. Your experienced local driver will take you through scenic villages, lush sugar cane fields, and breathtaking viewpoints.\n\nWe begin at Grand Bassin (Ganga Talao), the sacred crater lake that is the spiritual heart of Mauritian Hinduism. Then we wind our way through the Black River Gorges National Park before arriving at the spectacular Chamarel Waterfall — the tallest in Mauritius at 100m.\n\nAfter a included lunch at a local restaurant, we visit the Seven Colored Earths, a unique geological formation of seven distinct colored sand dunes. The tour concludes with a stop at the Chamarel Rhumerie for a tasting (optional) before returning to your hotel.',
    'published',
    'EUR',
    95.00,
    true,
    0,
    'South Island Full-Day Tour — Guided Driving Tour | Tropigo',
    'Full-day guided driving tour of Southern Mauritius including Grand Bassin, Chamarel Waterfall, Seven Colored Earths. Hotel pickup, lunch, and experienced local driver included.'
  ),
  (
    '44444444-0000-0000-0000-000000000002'::uuid,
    'trip',
    'north-island-classic',
    'North Island Classic Tour',
    'Explore the vibrant North from Grand Baie to Pamplemousses',
    'Discover the highlights of Northern Mauritius — the famous Pamplemousses Botanical Garden, the colorful village of Grand Baie, the red-roofed church of Cap Malheureux, and the scenic coastline.',
    'A carefully curated tour of the North — the most visited and vibrant region of Mauritius. Perfect for first-time visitors who want to experience the essence of the island.\n\nStart at the world-renowned Sir Seewoosagur Ramgoolam Botanical Garden at Pamplemousses, home to the giant Victoria amazonica water lilies and a stunning collection of tropical plants.\n\nContinue to Cap Malheureux with its iconic red-roofed church and panoramic views of Coin de Mire island. Enjoy free time in Grand Baie for lunch, shopping, and beach time before a scenic coastal drive back.',
    'published',
    'EUR',
    75.00,
    true,
    1,
    'North Island Classic Tour — Guided Driving Tour | Tropigo',
    'Guided driving tour of Northern Mauritius: Pamplemousses Garden, Cap Malheureux, Grand Baie. Hotel pickup, local driver, curated itinerary included.'
  ),
  (
    '44444444-0000-0000-0000-000000000003'::uuid,
    'trip',
    'west-coast-adventure',
    'West Coast & Dolphins Tour',
    'Dolphin watching, black river gorges and sunset views',
    'An unforgettable West Coast adventure — spot dolphins in the wild, explore the Black River Gorges, visit the dramatic Le Morne Brabant mountain, and watch a spectacular Indian Ocean sunset.',
    'Early morning departure for an exciting dolphin watching boat trip off the West Coast. Swim with or observe these magnificent creatures in their natural habitat.\n\nAfter the boat trip, we drive through the Black River Gorges National Park with stops at key viewpoints including the Alexandra Falls and the Black River Peak.\n\nThe afternoon takes us to Le Morne Brabant — the iconic mountain and UNESCO World Heritage Site. Learn about its powerful history as a symbol of freedom. The tour concludes with a sunset stop on the beach.',
    'published',
    'EUR',
    110.00,
    true,
    2,
    'West Coast & Dolphins Tour — Guided Driving Tour | Tropigo',
    'West Coast guided tour with dolphin watching, Black River Gorges, Le Morne Brabant. Hotel pickup, boat trip, experienced local driver included.'
  ),
  (
    '44444444-0000-0000-0000-000000000004'::uuid,
    'trip',
    'east-coast-leisure',
    'East Coast & Île aux Cerfs Tour',
    'Crystal-clear lagoons, island paradise and the charming East',
    'A relaxed day exploring the stunning East Coast — visit a traditional village, enjoy the turquoise waters of Trou d''Eau Douce, spend time on the idyllic Île aux Cerfs, and discover the charm of Flacq.',
    'A laid-back tour of the scenic East Coast, known for its pristine beaches, luxury resorts, and the famous Île aux Cerfs.\n\nWe start with a drive through the charming village of Trou d''Eau Douce before taking a boat to Île aux Cerfs for beach time and optional water sports.\n\nOn the way back, we stop at the Grand River South East viewpoint and pass through the bustling Flacq Market — the largest open-air market in Mauritius (on Wednesdays and Sundays).',
    'published',
    'EUR',
    85.00,
    false,
    3,
    'East Coast & Île aux Cerfs Tour — Guided Driving Tour | Tropigo',
    'East Coast guided tour including Île aux Cerfs, Trou d''Eau Douce, Flacq Market. Hotel pickup, boat transfer, experienced driver included.'
  ),
  (
    '44444444-0000-0000-0000-000000000005'::uuid,
    'trip',
    'cultural-heritage-tour',
    'Cultural Heritage Tour',
    'A journey through Mauritius'' diverse cultural tapestry',
    'Immerse yourself in the multicultural soul of Mauritius — visit temples, churches, mosques, colonial estates, and taste Creole cuisine in this rich cultural driving tour.',
    'Mauritius is one of the most culturally diverse islands on Earth. This tour takes you on a journey through the traditions, faiths, and flavors that define the island.\n\nWe visit Grand Bassin (Ganga Talao), the sacred Hindu lake, and the magnificent Mahaadyane Temple. Then on to the Sookhee Temple in Port Louis.\n\nExperience the bustling Central Market in Port Louis — a sensory explosion of spices, fruits, and street food. Lunch at a Creole restaurant where you''ll try rougaille, dholl puri, and fresh seafood.\n\nThe afternoon includes stops at the Eureka Creole House, the Alexandria Falls, and a rum distillery for a guided tasting.',
    'published',
    'EUR',
    105.00,
    true,
    4,
    'Cultural Heritage Tour — Guided Driving Tour | Tropigo',
    'Cultural heritage guided tour of Mauritius: temples, markets, Creole cuisine, colonial history. Hotel pickup, lunch, tastings, experienced driver included.'
  ),
  (
    '44444444-0000-0000-0000-000000000006'::uuid,
    'trip',
    'sunset-gastronomic-tour',
    'Sunset & Gastronomic Tour',
    'A culinary journey ending with a golden Indian Ocean sunset',
    'An evening tour for food lovers — visit local food markets, taste Mauritian street food, enjoy a cooking demonstration, and watch the sunset from a breathtaking coastal viewpoint.',
    'Perfect for those who love to eat! This tour focuses on the incredible flavors of Mauritius.\n\nWe begin at a local food market where your guide introduces you to tropical fruits, exotic spices, and fresh produce. Then it''s time for a hands-on Creole cooking demonstration.\n\nAs the golden hour approaches, we drive to a scenic coastal viewpoint — your private spot to watch the sun melt into the Indian Ocean. The tour ends with a visit to a beachside bar for a locally crafted cocktail.',
    'published',
    'EUR',
    80.00,
    false,
    5,
    'Sunset & Gastronomic Tour — Evening Food Tour | Tropigo',
    'Evening food and sunset tour of Mauritius: markets, cooking demo, Creole cuisine, sunset viewpoint. Hotel pickup, tastings, experienced driver included.'
  )
ON CONFLICT DO NOTHING;

-- ---- TRIPS EXTENSION DATA ----

-- South Island Full-Day Tour
INSERT INTO public.trips (product_id, trip_type, duration_minutes, vehicle_type, max_passengers, pickup_included, pickup_location, pickup_time, dropoff_location, dropoff_included, included_items, excluded_items, highlights, itinerary, important_notes, destination_id, difficulty_level, min_participants)
SELECT
  '44444444-0000-0000-0000-000000000001'::uuid,
  'south',
  600,  -- 10 hours
  'minivan',
  6,
  true,
  'Hotel lobby or any hotel in your region',
  '07:30',
  'Same as pickup',
  true,
  '{"Hotel pickup and dropoff","Professional English-speaking driver","Air-conditioned vehicle","Lunch at local restaurant","All entrance fees","Mineral water"}',
  '{"Alcoholic beverages","Personal expenses","Travel insurance","Optional activities","Gratuities"}',
  '{"Sacred Grand Bassin (Ganga Talao) lake","Black River Gorges viewpoints","100m Chamarel Waterfall","Seven Colored Earths geological wonder","Chamarel Rhumerie tasting","Scenic village drives","Sugar cane landscapes"}',
  '[
    {"time": "07:30", "title": "Hotel Pickup", "description": "Your driver collects you from your hotel lobby. Refreshed vehicle, bottled water ready.", "duration_minutes": 15},
    {"time": "08:30", "title": "Grand Bassin (Ganga Talao)", "description": "Visit the sacred crater lake, Hindu temples, and giant statues. A spiritual heart of Mauritius.", "duration_minutes": 60, "photo_url": "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80"},
    {"time": "10:00", "title": "Black River Gorges National Park", "description": "Scenic drive through the national park with stops at key viewpoints. Lush tropical forest and endemic bird species.", "duration_minutes": 45},
    {"time": "11:00", "title": "Chamarel Waterfall", "description": "View the tallest waterfall in Mauritius (100m) from the panoramic viewpoint. Spectacular year-round.", "duration_minutes": 30, "photo_url": "https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=800&q=80"},
    {"time": "12:30", "title": "Lunch at Local Restaurant", "description": "Included lunch featuring Creole cuisine: rougaille, fresh fish, rice, and tropical fruits.", "duration_minutes": 60},
    {"time": "14:00", "title": "Seven Colored Earths", "description": "Explore the unique geological formation of seven distinct colored sand dunes. A natural mystery.", "duration_minutes": 45, "photo_url": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80"},
    {"time": "15:00", "title": "Chamarel Rhumerie (Optional)", "description": "Visit the artisanal rum distillery. Tasting of 5 rums available (optional, not included in price).", "duration_minutes": 30},
    {"time": "16:30", "title": "Return to Hotel", "description": "Scenic drive back with a final sunset stop. Dropoff at your hotel.", "duration_minutes": 90}
  ]',
  'Wear comfortable walking shoes and bring sunscreen. The tour involves moderate walking on uneven terrain. Vegetarian lunch options available — please advise dietary requirements at booking.',
  d.id,
  'moderate',
  1
FROM public.destinations d WHERE d.slug = 'le-morne'
ON CONFLICT DO NOTHING;

-- North Island Classic Tour
INSERT INTO public.trips (product_id, trip_type, duration_minutes, vehicle_type, max_passengers, pickup_included, pickup_location, pickup_time, dropoff_location, dropoff_included, included_items, excluded_items, highlights, itinerary, important_notes, destination_id, difficulty_level, min_participants)
SELECT
  '44444444-0000-0000-0000-000000000002'::uuid,
  'north',
  480,  -- 8 hours
  'minivan',
  6,
  true,
  'Hotel lobby or any hotel in your region',
  '08:30',
  'Same as pickup',
  true,
  '{"Hotel pickup and dropoff","Professional English-speaking driver","Air-conditioned vehicle","Entrance to Pamplemousses Garden","Mineral water"}',
  '{"Lunch (available to purchase in Grand Baie)","Alcoholic beverages","Personal expenses","Boat trips","Gratuities"}',
  '{"Pamplemousses Botanical Garden","Giant Victoria amazonica water lilies","Cap Malheureux red church","Grand Baie free time","Coin de Mire island views","Scenic coastal drive"}',
  '[
    {"time": "08:30", "title": "Hotel Pickup", "description": "Pickup from your hotel in a comfortable air-conditioned vehicle.", "duration_minutes": 15},
    {"time": "09:30", "title": "Pamplemousses Botanical Garden", "description": "Explore the oldest botanical garden in the Southern Hemisphere. See giant water lilies, spice garden, and tropical palms.", "duration_minutes": 90, "photo_url": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80"},
    {"time": "11:30", "title": "Cap Malheureux & Red Church", "description": "Visit the iconic red-roofed Notre Dame Auxiliatrice church with panoramic views of Coin de Mire island.", "duration_minutes": 30, "photo_url": "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80"},
    {"time": "12:30", "title": "Grand Baie — Free Time", "description": "Enjoy free time in Grand Baie for lunch, shopping, and beach relaxation. Your driver recommends the best local restaurants.", "duration_minutes": 120},
    {"time": "15:00", "title": "Scenic Coastal Drive", "description": "Return drive along the picturesque northern coastline with photo stops.", "duration_minutes": 60},
    {"time": "16:00", "title": "Return to Hotel", "description": "Dropoff at your hotel.", "duration_minutes": 30}
  ]',
  'This tour is suitable for all ages and fitness levels. Bring a hat and sunscreen for the outdoor portions. Comfortable walking shoes recommended for the garden.',
  d.id,
  'easy',
  1
FROM public.destinations d WHERE d.slug = 'grand-baie'
ON CONFLICT DO NOTHING;

-- West Coast & Dolphins Tour
INSERT INTO public.trips (product_id, trip_type, duration_minutes, vehicle_type, max_passengers, pickup_included, pickup_location, pickup_time, dropoff_location, dropoff_included, included_items, excluded_items, highlights, itinerary, important_notes, destination_id, difficulty_level, min_participants)
SELECT
  '44444444-0000-0000-0000-000000000003'::uuid,
  'west',
  660,  -- 11 hours
  'minivan',
  6,
  true,
  'Hotel lobby or any hotel in your region',
  '06:00',
  'Same as pickup',
  true,
  '{"Early hotel pickup","Professional English-speaking driver","Air-conditioned vehicle","Dolphin watching boat trip","Snorkeling equipment","Lunch at beach restaurant","All entrance fees","Mineral water"}',
  '{"Swim-with-dolphins upgrade (optional, extra cost)","Alcoholic beverages","Personal expenses","Gratuities"}',
  '{"Dolphin watching in the wild","Black River Gorges National Park","Alexandra Falls viewpoint","Le Morne Brabant UNESCO site","Beach sunset","Scenic west coast drive"}',
  '[
    {"time": "06:00", "title": "Early Hotel Pickup", "description": "Early departure to catch the morning dolphin activity. Coffee and snacks provided.", "duration_minutes": 15},
    {"time": "06:45", "title": "Tamarin Bay — Dolphin Watching", "description": "Board a traditional boat for a dolphin watching trip. Spot spinner dolphins in their natural habitat. Option to swim (additional cost).", "duration_minutes": 90, "photo_url": "https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=800&q=80"},
    {"time": "09:00", "title": "Black River Gorges National Park", "description": "Drive through the largest remaining tropical forest on Mauritius. Multiple viewpoint stops.", "duration_minutes": 60},
    {"time": "10:30", "title": "Alexandra Falls", "description": "Short walk to a hidden waterfall in the Black River Gorges. Beautiful and rarely visited.", "duration_minutes": 30},
    {"time": "12:00", "title": "Beach Lunch", "description": "Lunch at a beachside restaurant featuring fresh seafood and Creole specialties.", "duration_minutes": 60},
    {"time": "13:30", "title": "Le Morne Brabant", "description": "Visit the iconic mountain — a UNESCO World Heritage Site symbolizing freedom and resistance. Learn its powerful history.", "duration_minutes": 60, "photo_url": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80"},
    {"time": "16:30", "title": "Sunset Beach Stop", "description": "Watch the spectacular West Coast sunset from a private beach spot.", "duration_minutes": 45},
    {"time": "17:30", "title": "Return to Hotel", "description": "Dropoff at your hotel.", "duration_minutes": 60}
  ]',
  'Very early start (6:00 AM). The dolphin boat departs regardless of dolphin sightings — while sightings are very common (90%+), they are wild animals. Bring swimwear, towel, and sunscreen. Motion sickness medication recommended for the boat trip.',
  d.id,
  'moderate',
  1
FROM public.destinations d WHERE d.slug = 'le-morne'
ON CONFLICT DO NOTHING;

-- East Coast & Île aux Cerfs Tour
INSERT INTO public.trips (product_id, trip_type, duration_minutes, vehicle_type, max_passengers, pickup_included, pickup_location, pickup_time, dropoff_location, dropoff_included, included_items, excluded_items, highlights, itinerary, important_notes, destination_id, difficulty_level, min_participants)
SELECT
  '44444444-0000-0000-0000-000000000004'::uuid,
  'east',
  540,  -- 9 hours
  'minivan',
  6,
  true,
  'Hotel lobby or any hotel in your region',
  '08:00',
  'Same as pickup',
  true,
  '{"Hotel pickup and dropoff","Professional English-speaking driver","Air-conditioned vehicle","Boat transfer to Île aux Cerfs","Beach time","Mineral water"}',
  '{"Lunch","Water sports on Île aux Cerfs (extra cost)","Alcoholic beverages","Personal expenses","Gratuities"}',
  '{"Trou d''Eau Douce village","Île aux Cerfs pristine beach","Crystal-clear lagoon","Flacq Market (Wed & Sun)","Grand River South East viewpoint","East Coast scenic drive"}',
  '[
    {"time": "08:00", "title": "Hotel Pickup", "description": "Morning pickup from your hotel.", "duration_minutes": 15},
    {"time": "09:00", "title": "Trou d''Eau Douce", "description": "Charming fishing village with stunning lagoon views. Board the boat to Île aux Cerfs.", "duration_minutes": 30, "photo_url": "https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=800&q=80"},
    {"time": "09:30", "title": "Île aux Cerfs — Free Time", "description": "Enjoy the pristine white-sand beach and turquoise lagoon. Optional water sports available: parasailing, tubing, glass-bottom boat (at extra cost).", "duration_minutes": 180, "photo_url": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80"},
    {"time": "13:00", "title": "Lunch Break", "description": "Free time for lunch in Trou d''Eau Douce. Your driver recommends the best local restaurants.", "duration_minutes": 60},
    {"time": "14:30", "title": "East Coast Scenic Drive", "description": "Drive along the beautiful eastern coastline with stops at viewpoints.", "duration_minutes": 60},
    {"time": "15:30", "title": "Flacq Market (Wed & Sun)", "description": "Visit the largest open-air market in Mauritius. Spices, textiles, fresh produce, and local crafts.", "duration_minutes": 45},
    {"time": "16:30", "title": "Return to Hotel", "description": "Dropoff at your hotel.", "duration_minutes": 60}
  ]',
  'Bring beachwear, towel, sunscreen, and cash for optional water sports. The Flacq Market is most vibrant on Wednesdays and Sundays. Boat transfer to Île aux Cerfs is weather dependent.',
  d.id,
  'easy',
  1
FROM public.destinations d WHERE d.slug = 'ile-aux-cerfs'
ON CONFLICT DO NOTHING;

-- Cultural Heritage Tour
INSERT INTO public.trips (product_id, trip_type, duration_minutes, vehicle_type, max_passengers, pickup_included, pickup_location, pickup_time, dropoff_location, dropoff_included, included_items, excluded_items, highlights, itinerary, important_notes, destination_id, difficulty_level, min_participants)
SELECT
  '44444444-0000-0000-0000-000000000005'::uuid,
  'cultural',
  600,  -- 10 hours
  'minivan',
  6,
  true,
  'Hotel lobby or any hotel in your region',
  '08:00',
  'Same as pickup',
  true,
  '{"Hotel pickup and dropoff","Professional English-speaking driver","Air-conditioned vehicle","Creole lunch at restaurant","Market tour","Rum tasting","All entrance fees","Mineral water"}',
  '{"Alcoholic beverages beyond rum tasting","Personal shopping","Gratuities","Optional activities"}',
  '{"Grand Bassin Hindu temples","Port Louis Central Market","Creole cooking demo","Eureka Creole House","Rum distillery tasting","Multicultural heritage sites"}',
  '[
    {"time": "08:00", "title": "Hotel Pickup", "description": "Morning pickup from your hotel.", "duration_minutes": 15},
    {"time": "09:00", "title": "Grand Bassin (Ganga Talao)", "description": "Visit the sacred Hindu lake and the magnificent Mahaadyane Temple. Learn about the Indo-Mauritian heritage.", "duration_minutes": 60, "photo_url": "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80"},
    {"time": "10:30", "title": "Port Louis Central Market", "description": "Explore the vibrant open-air market — spices, tropical fruits, fresh fish, and Mauritian street food. A sensory explosion.", "duration_minutes": 60},
    {"time": "12:00", "title": "Creole Lunch", "description": "Authentic Creole lunch at a local restaurant. Try rougaille, dholl puri, fresh seafood, and tropical desserts.", "duration_minutes": 60},
    {"time": "13:30", "title": "Eureka Creole House", "description": "Visit a beautifully restored 18th-century Creole colonial house with gardens and waterfall.", "duration_minutes": 45, "photo_url": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80"},
    {"time": "14:30", "title": "Rum Distillery & Tasting", "description": "Guided visit of an artisanal rum distillery. Tasting of 5 different rums included.", "duration_minutes": 45},
    {"time": "16:00", "title": "Return to Hotel", "description": "Scenic drive back with final photo stops.", "duration_minutes": 60}
  ]',
  'Dress modestly when visiting temples (covered shoulders and knees). The market can be crowded — keep valuables secure. Vegetarian and halal lunch options available on request.',
  d.id,
  'easy',
  1
FROM public.destinations d WHERE d.slug = 'grand-baie'
ON CONFLICT DO NOTHING;

-- Sunset & Gastronomic Tour
INSERT INTO public.trips (product_id, trip_type, duration_minutes, vehicle_type, max_passengers, pickup_included, pickup_location, pickup_time, dropoff_location, dropoff_included, included_items, excluded_items, highlights, itinerary, important_notes, destination_id, difficulty_level, min_participants)
SELECT
  '44444444-0000-0000-0000-000000000006'::uuid,
  'custom',
  300,  -- 5 hours (evening tour)
  'sedan',
  4,
  true,
  'Hotel lobby or any hotel in your region',
  '15:00',
  'Same as pickup',
  true,
  '{"Hotel pickup and dropoff","Professional English-speaking driver","Air-conditioned vehicle","Food market tasting","Cooking demonstration","Local cocktail","All food tastings"}',
  '{"Alcoholic beverages beyond included cocktail","Additional drinks","Personal expenses","Gratuities"}',
  '{"Local food market tour","Creole cooking demonstration","Mauritian street food tasting","Sunset coastal viewpoint","Beachside cocktail","Evening island atmosphere"}',
  '[
    {"time": "15:00", "title": "Hotel Pickup", "description": "Afternoon pickup from your hotel. A relaxed start to your culinary adventure.", "duration_minutes": 15},
    {"time": "15:30", "title": "Local Food Market", "description": "Explore a local market with your guide. Taste tropical fruits, learn about Mauritian spices, and sample fresh juices.", "duration_minutes": 60, "photo_url": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80"},
    {"time": "16:30", "title": "Creole Cooking Demo", "description": "Hands-on cooking session — learn to make dholl puri and rougaille from a local home cook.", "duration_minutes": 60},
    {"time": "17:30", "title": "Street Food Tasting", "description": "Sample the best Mauritian street food: gateaux piment, samosas, fresh coconuts, and alouda.", "duration_minutes": 30},
    {"time": "18:00", "title": "Sunset Viewpoint & Cocktail", "description": "Watch the sun set over the Indian Ocean from a secret local spot. Enjoy a handcrafted Mauritian cocktail.", "duration_minutes": 45, "photo_url": "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80"},
    {"time": "19:00", "title": "Return to Hotel", "description": "Dropoff at your hotel.", "duration_minutes": 30}
  ]',
  'This tour involves significant food tasting — please inform us of any allergies or dietary restrictions at booking. Not recommended for those with limited mobility as the market involves walking on uneven surfaces.',
  d.id,
  'easy',
  2
FROM public.destinations d WHERE d.slug = 'grand-baie'
ON CONFLICT DO NOTHING;

-- ---- PRODUCT DESTINATIONS ----

INSERT INTO public.product_destinations (product_id, destination_id)
SELECT '44444444-0000-0000-0000-000000000001'::uuid, id FROM public.destinations WHERE slug = 'le-morne'
ON CONFLICT DO NOTHING;

INSERT INTO public.product_destinations (product_id, destination_id)
SELECT '44444444-0000-0000-0000-000000000002'::uuid, id FROM public.destinations WHERE slug = 'grand-baie'
ON CONFLICT DO NOTHING;

INSERT INTO public.product_destinations (product_id, destination_id)
SELECT '44444444-0000-0000-0000-000000000003'::uuid, id FROM public.destinations WHERE slug = 'le-morne'
ON CONFLICT DO NOTHING;

INSERT INTO public.product_destinations (product_id, destination_id)
SELECT '44444444-0000-0000-0000-000000000004'::uuid, id FROM public.destinations WHERE slug = 'ile-aux-cerfs'
ON CONFLICT DO NOTHING;

INSERT INTO public.product_destinations (product_id, destination_id)
SELECT '44444444-0000-0000-0000-000000000005'::uuid, id FROM public.destinations WHERE slug = 'grand-baie'
ON CONFLICT DO NOTHING;

INSERT INTO public.product_destinations (product_id, destination_id)
SELECT '44444444-0000-0000-0000-000000000006'::uuid, id FROM public.destinations WHERE slug = 'grand-baie'
ON CONFLICT DO NOTHING;

-- ---- TRIP MEDIA ----

INSERT INTO public.product_media (product_id, url, alt, is_cover, sort_order) VALUES
  -- South Island Full-Day Tour
  ('44444444-0000-0000-0000-000000000001'::uuid, 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1600&q=80', 'South Island Mauritius landscape', true, 0),
  ('44444444-0000-0000-0000-000000000001'::uuid, 'https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=1200&q=80', 'Chamarel Seven Colored Earths', false, 1),
  ('44444444-0000-0000-0000-000000000001'::uuid, 'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=1200&q=80', 'South coast dramatic cliffs', false, 2),

  -- North Island Classic Tour
  ('44444444-0000-0000-0000-000000000002'::uuid, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1600&q=80', 'Grand Baie coastline', true, 0),
  ('44444444-0000-0000-0000-000000000002'::uuid, 'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=1200&q=80', 'Pamplemousses Garden', false, 1),

  -- West Coast & Dolphins Tour
  ('44444444-0000-0000-0000-000000000003'::uuid, 'https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=1600&q=80', 'West coast sunset', true, 0),
  ('44444444-0000-0000-0000-000000000003'::uuid, 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1200&q=80', 'Le Morne Brabant mountain', false, 1),

  -- East Coast & Île aux Cerfs Tour
  ('44444444-0000-0000-0000-000000000004'::uuid, 'https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=1600&q=80', 'Île aux Cerfs lagoon', true, 0),
  ('44444444-0000-0000-0000-000000000004'::uuid, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80', 'East coast beach', false, 1),

  -- Cultural Heritage Tour
  ('44444444-0000-0000-0000-000000000005'::uuid, 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=1600&q=80', 'Grand Bassin temple', true, 0),
  ('44444444-0000-0000-0000-000000000005'::uuid, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80', 'Port Louis market spices', false, 1),

  -- Sunset & Gastronomic Tour
  ('44444444-0000-0000-0000-000000000006'::uuid, 'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=1600&q=80', 'Mauritian sunset', true, 0),
  ('44444444-0000-0000-0000-000000000006'::uuid, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80', 'Mauritian street food', false, 1);

-- ---- AVAILABILITY RULES FOR TRIPS ----

-- All trips available daily with standard booking rules
INSERT INTO public.availability_rules (product_id, rule_type, days_of_week, min_advance_hours, max_advance_days) VALUES
  ('44444444-0000-0000-0000-000000000001'::uuid, 'schedule', '{0,1,2,3,4,5,6}', 24, 90),
  ('44444444-0000-0000-0000-000000000002'::uuid, 'schedule', '{0,1,2,3,4,5,6}', 24, 90),
  ('44444444-0000-0000-0000-000000000003'::uuid, 'schedule', '{0,1,2,3,4,5,6}', 24, 90),
  ('44444444-0000-0000-0000-000000000004'::uuid, 'schedule', '{0,1,2,3,4,5,6}', 24, 90),
  ('44444444-0000-0000-0000-000000000005'::uuid, 'schedule', '{0,1,2,3,4,5,6}', 24, 90),
  ('44444444-0000-0000-0000-000000000006'::uuid, 'schedule', '{0,1,2,3,4,5,6}', 24, 90);

-- ---- SINGLE DROP-OFF TRIPS ----

INSERT INTO public.products (id, product_type, slug, title, subtitle, summary, description, status, base_currency, base_price, featured, position) VALUES
  (
    '44444444-0000-0000-0000-000000000007'::uuid,
    'trip',
    'casela-dropoff',
    'Casela Wildlife Park Drop-off',
    'Hotel pickup and drop-off to Casela',
    'Convenient round-trip transfer from your hotel to Casela Wildlife Park. Your driver picks you up at your hotel and drops you at the entrance. Return pickup can be arranged at a time you choose.',
    'A simple, reliable round-trip transfer to Casela Wildlife Park. No guided tour — just comfortable, punctual transport so you can explore Casela at your own pace.\n\nYour driver will pick you up from your hotel lobby at the agreed time and drop you at the Casela entrance. For the return journey, simply message or call your driver when you''re ready to leave.\n\nVehicle is air-conditioned with complimentary bottled water. Child seats available on request.',
    'published',
    'EUR',
    35.00,
    false,
    10
  ),
  (
    '44444444-0000-0000-0000-000000000008'::uuid,
    'trip',
    'la-vanille-dropoff',
    'La Vanille Nature Park Drop-off',
    'Hotel transfer to La Vanille Nature Park',
    'Round-trip transfer from your hotel to La Vanille Nature Park (Crocodile Park). Comfortable transport, flexible return timing.',
    'Easy round-trip transfer to La Vanille Nature Park in Rivière des Anguilles. Famous for its crocodile farm, giant tortoises, and nature trails.\n\nYour driver picks you up at your hotel and drops you at the park entrance. Return pickup is flexible — just call or WhatsApp when you''re ready to leave.',
    'published',
    'EUR',
    30.00,
    false,
    11
  ),
  (
    '44444444-0000-0000-0000-000000000009'::uuid,
    'trip',
    'seven-colored-earths-dropoff',
    'Seven Colored Earths Drop-off',
    'Direct transfer to Chamarel Seven Colored Earths',
    'Round-trip transfer to the Seven Colored Earths and Chamarel Waterfall viewpoint. Ideal if you want to explore at your own pace.',
    'Direct transport to the Seven Colored Earths and Chamarel area. Your driver takes you to the main entrance, then waits for your signal when you''re ready to return.\n\nGreat for visitors who prefer independence — see the geological wonder, waterfall viewpoint, and Chamarel village on your own schedule.',
    'published',
    'EUR',
    40.00,
    false,
    12
  )
ON CONFLICT DO NOTHING;

-- Casela Drop-off
INSERT INTO public.trips (product_id, trip_mode, trip_type, duration_minutes, vehicle_type, max_passengers, pickup_included, pickup_location, pickup_time, dropoff_location, dropoff_included, included_items, excluded_items, highlights, itinerary, important_notes, destination_id, difficulty_level, min_participants)
SELECT
  '44444444-0000-0000-0000-000000000007'::uuid,
  'single_dropoff',
  'custom',
  60,
  'sedan',
  4,
  true,
  'Hotel lobby or any hotel in your region',
  '08:00',
  'Casela Wildlife Park, Cascavelle',
  true,
  '{"Hotel pickup and drop-off","Air-conditioned vehicle","Bottled water","Flexible return time","Child seat on request"}',
  '{"Casela entrance fees","Food and drinks","Personal expenses","Activities inside the park","Gratuities"}',
  '{"Door-to-door service","Flexible return timing","No entrance fees included — explore at your own pace","Air-conditioned comfort"}',
  '[]',
  'Casela entrance tickets must be purchased separately (available at the gate or online). Please allow a full day for your visit. Child seats available on request — specify age at booking.',
  d.id,
  'easy',
  1
FROM public.destinations d WHERE d.slug = 'grand-baie'
ON CONFLICT DO NOTHING;

-- La Vanille Drop-off
INSERT INTO public.trips (product_id, trip_mode, trip_type, duration_minutes, vehicle_type, max_passengers, pickup_included, pickup_location, pickup_time, dropoff_location, dropoff_included, included_items, excluded_items, highlights, itinerary, important_notes, destination_id, difficulty_level, min_participants)
SELECT
  '44444444-0000-0000-0000-000000000008'::uuid,
  'single_dropoff',
  'south',
  50,
  'sedan',
  4,
  true,
  'Hotel lobby or any hotel in your region',
  '09:00',
  'La Vanille Nature Park, Rivière des Anguilles',
  true,
  '{"Hotel pickup and drop-off","Air-conditioned vehicle","Bottled water","Flexible return time"}',
  '{"Park entrance fees","Food and drinks","Personal expenses","Gratuities"}',
  '{"Crocodile farm visit","Giant tortoise encounter","Nature trails","Flexible return timing"}',
  '[]',
  'Park entrance tickets must be purchased separately. Allow 2-3 hours for the park visit. The park is open daily. Child seats available on request.',
  d.id,
  'easy',
  1
FROM public.destinations d WHERE d.slug = 'le-morne'
ON CONFLICT DO NOTHING;

-- Seven Colored Earths Drop-off
INSERT INTO public.trips (product_id, trip_mode, trip_type, duration_minutes, vehicle_type, max_passengers, pickup_included, pickup_location, pickup_time, dropoff_location, dropoff_included, included_items, excluded_items, highlights, itinerary, important_notes, destination_id, difficulty_level, min_participants)
SELECT
  '44444444-0000-0000-0000-000000000009'::uuid,
  'single_dropoff',
  'south',
  75,
  'sedan',
  4,
  true,
  'Hotel lobby or any hotel in your region',
  '08:30',
  'Seven Colored Earths, Chamarel',
  true,
  '{"Hotel pickup and drop-off","Air-conditioned vehicle","Bottled water","Flexible return time"}',
  '{"Entrance fees to Seven Colored Earths","Food and drinks","Personal expenses","Gratuities"}',
  '{"Seven Colored Earths viewpoint","Chamarel Waterfall viewpoint","Chamarel village","Flexible return timing"}',
  '[]',
  'Entrance fees to the Seven Colored Earths are not included and must be purchased at the gate. The drive to Chamarel is scenic but winding — motion sickness medication recommended if needed.',
  d.id,
  'easy',
  1
FROM public.destinations d WHERE d.slug = 'le-morne'
ON CONFLICT DO NOTHING;

-- Media for single dropoff trips
INSERT INTO public.product_media (product_id, url, alt, is_cover, sort_order) VALUES
  ('44444444-0000-0000-0000-000000000007'::uuid, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1600&q=80', 'Casela Wildlife Park entrance', true, 0),
  ('44444444-0000-0000-0000-000000000008'::uuid, 'https://images.unsplash.com/photo-1560275619-4cc5fa59d3ae?w=1600&q=80', 'La Vanille crocodile park', true, 0),
  ('44444444-0000-0000-0000-000000000009'::uuid, 'https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=1600&q=80', 'Seven Colored Earths Chamarel', true, 0);

-- Destinations for single dropoff trips
INSERT INTO public.product_destinations (product_id, destination_id)
SELECT '44444444-0000-0000-0000-000000000007'::uuid, id FROM public.destinations WHERE slug = 'grand-baie'
ON CONFLICT DO NOTHING;

INSERT INTO public.product_destinations (product_id, destination_id)
SELECT '44444444-0000-0000-0000-000000000008'::uuid, id FROM public.destinations WHERE slug = 'le-morne'
ON CONFLICT DO NOTHING;

INSERT INTO public.product_destinations (product_id, destination_id)
SELECT '44444444-0000-0000-0000-000000000009'::uuid, id FROM public.destinations WHERE slug = 'le-morne'
ON CONFLICT DO NOTHING;

-- Availability for single dropoff trips (shorter advance booking)
INSERT INTO public.availability_rules (product_id, rule_type, days_of_week, min_advance_hours, max_advance_days) VALUES
  ('44444444-0000-0000-0000-000000000007'::uuid, 'schedule', '{0,1,2,3,4,5,6}', 12, 60),
  ('44444444-0000-0000-0000-000000000008'::uuid, 'schedule', '{0,1,2,3,4,5,6}', 12, 60),
  ('44444444-0000-0000-0000-000000000009'::uuid, 'schedule', '{0,1,2,3,4,5,6}', 12, 60);

-- ---- UPDATED PACKAGE TO USE TRIPS ----

-- Update the existing package to include a trip instead of activities
-- Add the South Island trip to the package
INSERT INTO public.package_items (package_id, product_id, sort_order, is_optional, is_default_selected, quantity) VALUES
  ('33333333-0000-0000-0000-000000000005'::uuid, '44444444-0000-0000-0000-000000000001'::uuid, 0, false, true, 1)
ON CONFLICT DO NOTHING;
