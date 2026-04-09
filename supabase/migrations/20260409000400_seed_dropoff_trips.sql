-- =============================================================
-- TROPIGO — SEED SINGLE DROP-OFF TRIPS
-- (Added after trip_mode column was created)
-- =============================================================

-- Drop-off products
INSERT INTO public.products (id, product_type, slug, title, subtitle, summary, description, status, base_currency, base_price, featured, position) VALUES
  ('44444444-0000-0000-0000-000000000007'::uuid, 'trip', 'casela-dropoff', 'Casela Wildlife Park Drop-off', 'Hotel pickup and drop-off to Casela', 'Convenient round-trip transfer from your hotel to Casela Wildlife Park. Your driver picks you up and drops you at the entrance. Flexible return timing.', 'A simple, reliable round-trip transfer to Casela Wildlife Park. No guided tour — just comfortable, punctual transport so you can explore Casela at your own pace.', 'published', 'EUR', 35.00, false, 10),
  ('44444444-0000-0000-0000-000000000008'::uuid, 'trip', 'la-vanille-dropoff', 'La Vanille Nature Park Drop-off', 'Hotel transfer to La Vanille Nature Park', 'Round-trip transfer from your hotel to La Vanille Nature Park (Crocodile Park). Comfortable transport, flexible return timing.', 'Easy round-trip transfer to La Vanille Nature Park. Famous for its crocodile farm, giant tortoises, and nature trails.', 'published', 'EUR', 30.00, false, 11),
  ('44444444-0000-0000-0000-000000000009'::uuid, 'trip', 'seven-colored-earths-dropoff', 'Seven Colored Earths Drop-off', 'Direct transfer to Chamarel Seven Colored Earths', 'Round-trip transfer to the Seven Colored Earths and Chamarel Waterfall viewpoint. Ideal if you want to explore at your own pace.', 'Direct transport to the Seven Colored Earths and Chamarel area. Your driver takes you to the main entrance, then waits for your signal when ready to return.', 'published', 'EUR', 40.00, false, 12)
ON CONFLICT DO NOTHING;

-- Drop-off trip data
INSERT INTO public.trips (product_id, trip_mode, trip_type, duration_minutes, vehicle_type, max_passengers, pickup_included, pickup_location, pickup_time, dropoff_location, dropoff_included, included_items, excluded_items, highlights, itinerary, important_notes, destination_id, difficulty_level, min_participants)
SELECT '44444444-0000-0000-0000-000000000007'::uuid, 'single_dropoff', 'custom', 60, 'sedan', 4, true, 'Hotel lobby or any hotel in your region', '08:00', 'Casela Wildlife Park, Cascavelle', true, '{"Hotel pickup and drop-off","Air-conditioned vehicle","Bottled water","Flexible return time","Child seat on request"}', '{"Casela entrance fees","Food and drinks","Personal expenses","Activities inside the park","Gratuities"}', '{"Door-to-door service","Flexible return timing","Explore at your own pace","Air-conditioned comfort"}', '[]', 'Casela entrance tickets must be purchased separately. Allow a full day for your visit. Child seats available on request.', d.id, 'easy', 1 FROM public.destinations d WHERE d.slug = 'grand-baie'
ON CONFLICT DO NOTHING;

INSERT INTO public.trips (product_id, trip_mode, trip_type, duration_minutes, vehicle_type, max_passengers, pickup_included, pickup_location, pickup_time, dropoff_location, dropoff_included, included_items, excluded_items, highlights, itinerary, important_notes, destination_id, difficulty_level, min_participants)
SELECT '44444444-0000-0000-0000-000000000008'::uuid, 'single_dropoff', 'south', 50, 'sedan', 4, true, 'Hotel lobby or any hotel in your region', '09:00', 'La Vanille Nature Park, Rivière des Anguilles', true, '{"Hotel pickup and drop-off","Air-conditioned vehicle","Bottled water","Flexible return time"}', '{"Park entrance fees","Food and drinks","Personal expenses","Gratuities"}', '{"Crocodile farm visit","Giant tortoise encounter","Nature trails","Flexible return timing"}', '[]', 'Park entrance tickets must be purchased separately. Allow 2-3 hours for the park visit.', d.id, 'easy', 1 FROM public.destinations d WHERE d.slug = 'le-morne'
ON CONFLICT DO NOTHING;

INSERT INTO public.trips (product_id, trip_mode, trip_type, duration_minutes, vehicle_type, max_passengers, pickup_included, pickup_location, pickup_time, dropoff_location, dropoff_included, included_items, excluded_items, highlights, itinerary, important_notes, destination_id, difficulty_level, min_participants)
SELECT '44444444-0000-0000-0000-000000000009'::uuid, 'single_dropoff', 'south', 75, 'sedan', 4, true, 'Hotel lobby or any hotel in your region', '08:30', 'Seven Colored Earths, Chamarel', true, '{"Hotel pickup and drop-off","Air-conditioned vehicle","Bottled water","Flexible return time"}', '{"Entrance fees","Food and drinks","Personal expenses","Gratuities"}', '{"Seven Colored Earths viewpoint","Chamarel Waterfall viewpoint","Chamarel village","Flexible return timing"}', '[]', 'Entrance fees not included. The drive to Chamarel is scenic but winding.', d.id, 'easy', 1 FROM public.destinations d WHERE d.slug = 'le-morne'
ON CONFLICT DO NOTHING;

-- Media
INSERT INTO public.product_media (product_id, url, alt, is_cover, sort_order) VALUES
  ('44444444-0000-0000-0000-000000000007'::uuid, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1600&q=80', 'Casela Wildlife Park entrance', true, 0),
  ('44444444-0000-0000-0000-000000000008'::uuid, 'https://images.unsplash.com/photo-1560275619-4cc5fa59d3ae?w=1600&q=80', 'La Vanille crocodile park', true, 0),
  ('44444444-0000-0000-0000-000000000009'::uuid, 'https://images.unsplash.com/photo-1559494007-9f5847c49d94?w=1600&q=80', 'Seven Colored Earths Chamarel', true, 0)
ON CONFLICT DO NOTHING;

-- Destinations
INSERT INTO public.product_destinations (product_id, destination_id) SELECT '44444444-0000-0000-0000-000000000007'::uuid, id FROM public.destinations WHERE slug = 'grand-baie' ON CONFLICT DO NOTHING;
INSERT INTO public.product_destinations (product_id, destination_id) SELECT '44444444-0000-0000-0000-000000000008'::uuid, id FROM public.destinations WHERE slug = 'le-morne' ON CONFLICT DO NOTHING;
INSERT INTO public.product_destinations (product_id, destination_id) SELECT '44444444-0000-0000-0000-000000000009'::uuid, id FROM public.destinations WHERE slug = 'le-morne' ON CONFLICT DO NOTHING;

-- Availability
INSERT INTO public.availability_rules (product_id, rule_type, days_of_week, min_advance_hours, max_advance_days) VALUES
  ('44444444-0000-0000-0000-000000000007'::uuid, 'schedule', '{0,1,2,3,4,5,6}', 12, 60),
  ('44444444-0000-0000-0000-000000000008'::uuid, 'schedule', '{0,1,2,3,4,5,6}', 12, 60),
  ('44444444-0000-0000-0000-000000000009'::uuid, 'schedule', '{0,1,2,3,4,5,6}', 12, 60);
