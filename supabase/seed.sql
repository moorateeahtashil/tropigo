-- =============================================================================
-- Tropigo full test seed
-- =============================================================================
-- Credentials
--   Admin : admin@tropigo.com  /  Admin1234!
--   User  : user@tropigo.com   /  User1234!
-- =============================================================================

-- -------------------------
-- Auth users
-- -------------------------
insert into auth.users (
  id, instance_id, aud, role,
  email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at
) values
(
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated',
  'admin@tropigo.com',
  extensions.crypt('Admin1234!', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"],"role":"admin","is_admin":true}'::jsonb,
  '{"full_name":"Tropigo Admin"}'::jsonb,
  now(), now()
),
(
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated',
  'user@tropigo.com',
  extensions.crypt('User1234!', extensions.gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}'::jsonb,
  '{"full_name":"Sophie Laurent"}'::jsonb,
  now(), now()
)
on conflict (id) do nothing;

insert into auth.identities (
  id, user_id, provider_id, provider, identity_data,
  last_sign_in_at, created_at, updated_at
) values
(
  '00000000-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000001',
  'admin@tropigo.com', 'email',
  '{"sub":"00000000-0000-0000-0000-000000000001","email":"admin@tropigo.com"}'::jsonb,
  now(), now(), now()
),
(
  '00000000-0000-0000-0000-000000000002',
  '00000000-0000-0000-0000-000000000002',
  'user@tropigo.com', 'email',
  '{"sub":"00000000-0000-0000-0000-000000000002","email":"user@tropigo.com"}'::jsonb,
  now(), now(), now()
)
on conflict (id) do nothing;

-- -------------------------
-- Profiles
-- -------------------------
insert into public.profiles (id, full_name, phone, country, is_admin) values
('00000000-0000-0000-0000-000000000001', 'Tropigo Admin', '+230 5000 0001', 'MU', true),
('00000000-0000-0000-0000-000000000002', 'Sophie Laurent',  '+33 6 12 34 56 78', 'FR', false)
on conflict (id) do nothing;

-- -------------------------
-- Site settings
-- -------------------------
insert into public.site_settings (
  brand_name, logo_url, default_locale, currency,
  contact_email, phone, socials,
  seo_title_template, default_meta_description, default_og_image_url
) values (
  'Tropigo', '/logo.svg', 'en', 'MUR',
  'hello@tropigo.mu', '+230 5800 1234',
  '{"instagram":"https://instagram.com/tropigo","facebook":"https://facebook.com/tropigo","tiktok":"https://tiktok.com/@tropigo"}'::jsonb,
  '%s | Tropigo',
  'Curated tours and experiences in Mauritius — book your island adventure with Tropigo.',
  '/og-default.jpg'
) on conflict do nothing;

-- -------------------------
-- Contact settings
-- -------------------------
insert into public.contact_settings (
  emails, phones, whatsapp, address, hours, published, map_url, whatsapp_cta
) values (
  array['hello@tropigo.mu','bookings@tropigo.mu'],
  array['+230 5800 1234','+230 5800 5678'],
  '+23058001234',
  '{"street":"Royal Road","city":"Grand Baie","island":"Mauritius","zip":"30517"}'::jsonb,
  '{"weekdays":"Mon–Fri 08:00–18:00","weekend":"Sat–Sun 09:00–15:00"}'::jsonb,
  true,
  'https://maps.google.com/?q=Grand+Baie+Mauritius',
  'Chat with us on WhatsApp'
) on conflict do nothing;

-- -------------------------
-- Navigation (legacy menus)
-- -------------------------
insert into public.navigation_menus (key, label) values
('main',   'Main Navigation'),
('footer', 'Footer Navigation')
on conflict do nothing;

with menu as (select id from public.navigation_menus where key = 'main')
insert into public.navigation_links (menu_id, label, href, position, visible)
select id, 'Experiences',   '/experiences',   1, true from menu union all
select id, 'Destinations',  '/destinations',  2, true from menu union all
select id, 'Blog',          '/blog',          3, true from menu union all
select id, 'About',         '/about',         4, true from menu union all
select id, 'Contact',       '/contact',       5, true from menu;

-- Modern navigation_items
insert into public.navigation_items (area, label, href, external, position, visible) values
('main',    'Experiences',  '/experiences',  false, 1, true),
('main',    'Destinations', '/destinations', false, 2, true),
('main',    'Blog',         '/blog',         false, 3, true),
('main',    'About',        '/about',        false, 4, true),
('main',    'Contact',      '/contact',      false, 5, true),
('utility', 'My Bookings',  '/account',      false, 1, true),
('footer',  'Privacy Policy','/legal/privacy-policy', false, 1, true),
('footer',  'Terms',        '/legal/terms-and-conditions', false, 2, true),
('footer',  'Cancellations','/legal/cancellation-policy',  false, 3, true);

-- -------------------------
-- Footer
-- -------------------------
insert into public.footer_blocks (key, title, content, position, published) values
('company', 'Company',
 '[{"label":"About","href":"/about"},{"label":"Team","href":"/team"},{"label":"Careers","href":"/careers"},{"label":"Press","href":"/press"}]'::jsonb,
 1, true),
('explore', 'Explore',
 '[{"label":"All Experiences","href":"/experiences"},{"label":"Destinations","href":"/destinations"},{"label":"Blog","href":"/blog"},{"label":"Gift Cards","href":"/gift-cards"}]'::jsonb,
 2, true),
('support', 'Support',
 '[{"label":"Help Center","href":"/help"},{"label":"Contact Us","href":"/contact"},{"label":"Cancellation Policy","href":"/legal/cancellation-policy"},{"label":"Safety","href":"/safety"}]'::jsonb,
 3, true)
on conflict do nothing;

insert into public.footer_groups (key, title, items, position, published) values
('company', 'Company',
 '[{"label":"About","href":"/about"},{"label":"Team","href":"/team"},{"label":"Press","href":"/press"}]'::jsonb,
 1, true),
('explore', 'Explore',
 '[{"label":"All Experiences","href":"/experiences"},{"label":"Destinations","href":"/destinations"},{"label":"Blog","href":"/blog"}]'::jsonb,
 2, true),
('legal',   'Legal',
 '[{"label":"Privacy Policy","href":"/legal/privacy-policy"},{"label":"Terms","href":"/legal/terms-and-conditions"},{"label":"Cancellations","href":"/legal/cancellation-policy"}]'::jsonb,
 3, true)
on conflict do nothing;

-- -------------------------
-- Badges
-- -------------------------
insert into public.badges (id, label, description, context, position, published) values
('b0000000-0000-0000-0000-000000000001', 'Top 1% Global Experiences', 'Hand-vetted by our local team',           'sitewide',  1, true),
('b0000000-0000-0000-0000-000000000002', 'Instant Confirmation',       'Booking confirmed within seconds',        'sitewide',  2, true),
('b0000000-0000-0000-0000-000000000003', 'Free Cancellation',          'Up to 24 h before departure',             'sitewide',  3, true),
('b0000000-0000-0000-0000-000000000004', 'Local Experts',              'Born and raised on the island',           'homepage',  1, true),
('b0000000-0000-0000-0000-000000000005', 'Eco Certified',              'Partners respect marine life & reefs',    'tour',      1, true)
on conflict (id) do nothing;

-- -------------------------
-- Promo banners
-- -------------------------
insert into public.promo_banners (title, body, cta_label, cta_url, placement, active, priority) values
('Early Summer Deal', 'Save 15 % on all catamaran cruises — book before 30 Apr.', 'Browse Cruises', '/experiences?cat=catamaran', 'sitewide_top', true, 10),
('New: Dolphin Watch at Dawn', 'Our most popular experience is back for the season.', 'Learn More', '/experiences/grand-baie-dolphin-watch', 'homepage_hero', true, 5)
on conflict do nothing;

-- -------------------------
-- Destinations
-- -------------------------
insert into public.destinations (
  id, name, slug, summary, body,
  hero_image_url, gallery_urls, region,
  lat, lng, featured, position, published
) values
(
  '10000000-0000-0000-0000-000000000001',
  'Le Morne', 'le-morne',
  'Dramatic basalt peak, turquoise lagoon and world-class kitesurfing beach.',
  '## Le Morne Brabant

Le Morne Brabant is a UNESCO World Heritage Site on the south-western tip of Mauritius. The iconic mountain rises steeply from the sea, surrounded by one of the longest white-sand beaches on the island.

The lagoon is a playground for water sports — snorkelling, kayaking and kitesurfing — while the mountain offers guided hikes with unforgettable panoramic views.',
  'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1600',
  array[
    'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800',
    'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=800'
  ],
  'South-West', -20.4500, 57.3200,
  true, 1, true
),
(
  '10000000-0000-0000-0000-000000000002',
  'Belle Mare', 'belle-mare',
  'The east coast''s finest stretch of powder sand, calm aquamarine waters and luxury resorts.',
  '## Belle Mare

Belle Mare is widely regarded as Mauritius''s most beautiful beach. The 9-km arc of white sand faces a calm lagoon protected by the outer reef, making it ideal for swimming, paddleboarding and glass-bottom boat rides year-round.',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600',
  array[
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'
  ],
  'East', -20.2020, 57.7780,
  true, 2, true
),
(
  '10000000-0000-0000-0000-000000000003',
  'Grand Baie', 'grand-baie',
  'The island''s vibrant north-coast hub — lively bay, boutique shopping, water sports and nightlife.',
  '## Grand Baie

Grand Baie is Mauritius''s main tourism village. The sheltered bay is dotted with charter boats, colourful fishing pirogues and water sports operators. It is the best departure point for dolphin-watching cruises, island hopping and deep-sea fishing.',
  'https://images.unsplash.com/photo-1590523278191-995cbcda646b?w=1600',
  array[
    'https://images.unsplash.com/photo-1590523278191-995cbcda646b?w=800'
  ],
  'North', -20.0130, 57.5820,
  true, 3, true
),
(
  '10000000-0000-0000-0000-000000000004',
  'Flic en Flac', 'flic-en-flac',
  'West-coast sunset beach famous for its colourful coral gardens and relaxed village atmosphere.',
  '## Flic en Flac

Flic en Flac offers some of the best shore diving and snorkelling on the island. The beach faces west, making it the top spot to watch the sun set over the lagoon. The nearby Casela Nature Parks adds safari and zip-line activities for non-beach days.',
  'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1600',
  array[
    'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800'
  ],
  'West', -20.2910, 57.3650,
  false, 4, true
)
on conflict (id) do nothing;

-- -------------------------
-- Activities
-- -------------------------
insert into public.activities (id, name, slug, description, published, position) values
('20000000-0000-0000-0000-000000000001', 'Snorkelling',       'snorkelling',       'Explore coral gardens teeming with tropical fish.', true, 1),
('20000000-0000-0000-0000-000000000002', 'Deep-Sea Fishing',  'deep-sea-fishing',  'Chase marlin, sailfish and tuna aboard a charter boat.', true, 2),
('20000000-0000-0000-0000-000000000003', 'Hiking',            'hiking',            'Guided mountain trails with panoramic ocean views.', true, 3),
('20000000-0000-0000-0000-000000000004', 'Dolphin Watching',  'dolphin-watching',  'Swim with wild spinner dolphins in the open ocean.', true, 4),
('20000000-0000-0000-0000-000000000005', 'Catamaran Cruise',  'catamaran-cruise',  'Sail the lagoon on a private catamaran with BBQ lunch.', true, 5),
('20000000-0000-0000-0000-000000000006', 'Kitesurfing',       'kitesurfing',       'Ride the legendary Le Morne trade winds.', true, 6),
('20000000-0000-0000-0000-000000000007', 'Glass-Bottom Boat', 'glass-bottom-boat', 'Peer through the hull at coral reefs and sea turtles.', true, 7)
on conflict (id) do nothing;

-- -------------------------
-- Activity categories
-- -------------------------
insert into public.activity_categories (id, name, slug, description, position, published) values
('c0000000-0000-0000-0000-000000000001', 'Water Sports',   'water-sports',   'Snorkelling, kitesurfing, kayaking and more.', 1, true),
('c0000000-0000-0000-0000-000000000002', 'Cruises',        'cruises',        'Catamaran and boat tours around the island.',  2, true),
('c0000000-0000-0000-0000-000000000003', 'Land & Hiking',  'land-hiking',    'Mountain trails, parks and nature reserves.',  3, true),
('c0000000-0000-0000-0000-000000000004', 'Wildlife',       'wildlife',       'Dolphins, turtles and exotic bird watching.',  4, true),
('c0000000-0000-0000-0000-000000000005', 'Fishing',        'fishing',        'Deep-sea and lagoon fishing charters.',        5, true)
on conflict (id) do nothing;

-- -------------------------
-- Tours
-- -------------------------
insert into public.tours (
  id, name, slug, destination_id, summary, description,
  duration, price_from, currency,
  hero_image_url, gallery_urls,
  transport, inclusions, exclusions, itinerary, notices,
  is_active, featured, position, published
) values
(
  '30000000-0000-0000-0000-000000000001',
  'Le Morne Lagoon Cruise',
  'le-morne-lagoon-cruise',
  '10000000-0000-0000-0000-000000000001',
  'Private catamaran cruise with snorkelling, BBQ lunch and open bar in the Le Morne lagoon.',
  '## About This Experience

Spend a half-day sailing the impossibly blue lagoon at the foot of Le Morne Brabant. Snorkel above vibrant coral gardens, enjoy a freshly grilled seafood BBQ and sip rum punch as you sail back to the beach.',
  'Half day (5 h)',
  18000, 'MUR',
  'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1600',
  array[
    'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800',
    'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=800'
  ],
  'Private catamaran — pickup from Le Morne beach',
  '["Catamaran cruise","Snorkelling equipment","BBQ seafood lunch","Open bar (rum punch, beer, soft drinks)","Professional guide","Life jackets"]'::jsonb,
  '["Hotel transfers","Gratuities","Personal travel insurance"]'::jsonb,
  '[{"time":"08:30","desc":"Meet at Le Morne beach pontoon"},{"time":"09:00","desc":"Depart by catamaran"},{"time":"10:00","desc":"Snorkelling stop 1 — coral garden"},{"time":"11:00","desc":"BBQ lunch on board"},{"time":"12:30","desc":"Snorkelling stop 2 — lagoon drift"},{"time":"13:30","desc":"Return to pontoon"}]'::jsonb,
  'Minimum age 6. Guests must be able to swim. Itinerary may vary with weather.',
  true, true, 1, true
),
(
  '30000000-0000-0000-0000-000000000002',
  'Le Morne Mountain Hike',
  'le-morne-mountain-hike',
  '10000000-0000-0000-0000-000000000001',
  'Guided ascent of the UNESCO-listed Le Morne Brabant with breathtaking 360° views.',
  '## About This Experience

Le Morne Brabant (556 m) is Mauritius''s most iconic peak. This guided hike follows a safe route through endemic forest to a viewpoint with panoramic views of the lagoon, the south-west coast and, on a clear day, Réunion Island.',
  'Half day (4 h)',
  9500, 'MUR',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600',
  array[
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800'
  ],
  'Minibus from Grand Baie included',
  '["Certified mountain guide","Minibus transfers","Hiking poles","Light snacks & water"]'::jsonb,
  '["Hiking boots (available to hire)","Personal travel insurance","Gratuities"]'::jsonb,
  '[{"time":"06:00","desc":"Pickup from Grand Baie hotels"},{"time":"08:00","desc":"Trail briefing at base"},{"time":"08:15","desc":"Begin ascent"},{"time":"10:30","desc":"Summit viewpoint & photos"},{"time":"11:30","desc":"Descent begins"},{"time":"13:00","desc":"Return transfers"}]'::jsonb,
  'Moderate fitness required. Not suitable for guests with knee or heart conditions. Bring sunscreen and a hat.',
  true, true, 2, true
),
(
  '30000000-0000-0000-0000-000000000003',
  'Belle Mare Snorkel & Swim',
  'belle-mare-snorkel-swim',
  '10000000-0000-0000-0000-000000000002',
  'Glass-bottom boat ride followed by guided snorkelling over the Belle Mare reef — perfect for beginners.',
  '## About This Experience

Discover the east coast''s pristine coral gardens without getting on a big boat. Our small-group glass-bottom boat takes you to the best reef spots, then you hop in with full snorkelling gear and a guide to explore at your own pace.',
  '3 hours',
  6500, 'MUR',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600',
  array[
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'
  ],
  'Glass-bottom boat from Belle Mare beach',
  '["Glass-bottom boat","Snorkelling equipment","Experienced marine guide","Refreshments"]'::jsonb,
  '["Hotel transfers","Gratuities"]'::jsonb,
  '[{"time":"09:00","desc":"Meet at Belle Mare beach"},{"time":"09:15","desc":"Glass-bottom boat departs"},{"time":"09:45","desc":"Reef snorkelling (60 min)"},{"time":"11:00","desc":"Return to beach"}]'::jsonb,
  'Suitable for non-swimmers with life jacket. Maximum 8 guests per group.',
  true, false, 3, true
),
(
  '30000000-0000-0000-0000-000000000004',
  'Grand Baie Dolphin Watch',
  'grand-baie-dolphin-watch',
  '10000000-0000-0000-0000-000000000003',
  'Early-morning speedboat excursion to swim with wild spinner dolphins in their natural habitat.',
  '## About This Experience

Leave Grand Baie at dawn on a speedboat to find wild spinner dolphins before the other boats arrive. You''ll have the chance to snorkel alongside them in open water — a genuinely unforgettable encounter. Returns to bay by 10:30.',
  '4 hours',
  12000, 'MUR',
  'https://images.unsplash.com/photo-1590523278191-995cbcda646b?w=1600',
  array[
    'https://images.unsplash.com/photo-1590523278191-995cbcda646b?w=800'
  ],
  'Speedboat from Grand Baie jetty',
  '["Speedboat","Snorkelling gear","Marine biologist guide","Light breakfast on board"]'::jsonb,
  '["Hotel transfers","Dolphin sightings are never guaranteed (nature)","Gratuities"]'::jsonb,
  '[{"time":"06:00","desc":"Depart Grand Baie jetty"},{"time":"06:45","desc":"Dolphin search area"},{"time":"07:00-09:00","desc":"Snorkelling with dolphins (weather permitting)"},{"time":"09:30","desc":"Return journey & breakfast"},{"time":"10:30","desc":"Arrive back at jetty"}]'::jsonb,
  'Departure time is fixed — please arrive 15 min early. Pregnant guests and children under 5 cannot snorkel in open water.',
  true, true, 4, true
),
(
  '30000000-0000-0000-0000-000000000005',
  'Flic en Flac Deep-Sea Fishing',
  'flic-en-flac-deep-sea-fishing',
  '10000000-0000-0000-0000-000000000004',
  'Full-day charter boat fishing for marlin, sailfish and yellowfin tuna in the Indian Ocean.',
  '## About This Experience

Mauritius is one of the world''s top big-game fishing destinations. Board our fully-equipped sportfishing vessel from Flic en Flac and head to the blue water where marlin and sailfish patrol year-round. All gear is provided and the experienced crew will put you on the fish.',
  'Full day (8 h)',
  85000, 'MUR',
  'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1600',
  array[
    'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800'
  ],
  'Private charter boat — departs Flic en Flac harbour',
  '["Private sportfishing boat (up to 6 guests)","All fishing equipment","Experienced captain & crew","Lunch & beverages","Catch & release or keep your catch"]'::jsonb,
  '["Fishing licence (included for locals, ask for visitors)","Gratuities","Hotel transfers"]'::jsonb,
  '[{"time":"06:30","desc":"Meet at Flic en Flac harbour"},{"time":"07:00","desc":"Depart to fishing grounds (~45 min)"},{"time":"08:00-14:00","desc":"Trolling & big-game fishing"},{"time":"14:30","desc":"Return to harbour"}]'::jsonb,
  'Seasickness patches recommended. Minimum group of 2 required. Private charters can be split across strangers — ask when booking.',
  true, false, 5, true
)
on conflict (id) do nothing;

-- -------------------------
-- Tour ↔ activities
-- -------------------------
insert into public.tours_activities (tour_id, activity_id) values
('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000001'), -- Lagoon Cruise + Snorkelling
('30000000-0000-0000-0000-000000000001', '20000000-0000-0000-0000-000000000005'), -- Lagoon Cruise + Catamaran
('30000000-0000-0000-0000-000000000002', '20000000-0000-0000-0000-000000000003'), -- Mountain Hike + Hiking
('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000001'), -- Belle Mare + Snorkelling
('30000000-0000-0000-0000-000000000003', '20000000-0000-0000-0000-000000000007'), -- Belle Mare + Glass-Bottom
('30000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000004'), -- Dolphin Watch + Dolphins
('30000000-0000-0000-0000-000000000004', '20000000-0000-0000-0000-000000000001'), -- Dolphin Watch + Snorkelling
('30000000-0000-0000-0000-000000000005', '20000000-0000-0000-0000-000000000002')  -- Deep-Sea Fishing
on conflict do nothing;

-- Tour ↔ activity categories
insert into public.tours_activity_categories (tour_id, category_id) values
('30000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000002'), -- Cruise
('30000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001'), -- Water Sports
('30000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000003'), -- Land & Hiking
('30000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000001'), -- Water Sports
('30000000-0000-0000-0000-000000000004', 'c0000000-0000-0000-0000-000000000004'), -- Wildlife
('30000000-0000-0000-0000-000000000005', 'c0000000-0000-0000-0000-000000000005')  -- Fishing
on conflict do nothing;

-- Tour images
insert into public.tour_images (tour_id, image_url, alt, position) values
('30000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800', 'Catamaran on Le Morne lagoon', 1),
('30000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=800', 'Snorkelling on the reef', 2),
('30000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800', 'Le Morne Brabant peak', 1),
('30000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800', 'Belle Mare beach', 1),
('30000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1590523278191-995cbcda646b?w=800', 'Spinner dolphins Grand Baie', 1),
('30000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800', 'Deep-sea fishing boat', 1);

-- Tour ↔ badges
insert into public.tour_badges (tour_id, badge_id) values
('30000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000005'), -- Eco Certified
('30000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000005')  -- Eco Certified
on conflict do nothing;

-- -------------------------
-- Availability slots (next 30 days)
-- -------------------------
insert into public.availability_slots (tour_id, starts_at, ends_at, capacity, reserved, price, currency, is_active) values
-- Le Morne Lagoon Cruise (half day, 09:00–14:00)
('30000000-0000-0000-0000-000000000001', now() + interval '2 days' + time '09:00', now() + interval '2 days' + time '14:00', 12, 3, 18000, 'MUR', true),
('30000000-0000-0000-0000-000000000001', now() + interval '4 days' + time '09:00', now() + interval '4 days' + time '14:00', 12, 0, 18000, 'MUR', true),
('30000000-0000-0000-0000-000000000001', now() + interval '7 days' + time '09:00', now() + interval '7 days' + time '14:00', 12, 8, 18000, 'MUR', true),
('30000000-0000-0000-0000-000000000001', now() + interval '9 days' + time '09:00', now() + interval '9 days' + time '14:00', 12, 0, 18000, 'MUR', true),
('30000000-0000-0000-0000-000000000001', now() + interval '14 days' + time '09:00', now() + interval '14 days' + time '14:00', 12, 2, 17000, 'MUR', true), -- sale
-- Le Morne Hike (06:00–13:00)
('30000000-0000-0000-0000-000000000002', now() + interval '3 days' + time '06:00', now() + interval '3 days' + time '13:00', 8, 0, 9500, 'MUR', true),
('30000000-0000-0000-0000-000000000002', now() + interval '6 days' + time '06:00', now() + interval '6 days' + time '13:00', 8, 5, 9500, 'MUR', true),
('30000000-0000-0000-0000-000000000002', now() + interval '10 days' + time '06:00', now() + interval '10 days' + time '13:00', 8, 0, 9500, 'MUR', true),
-- Belle Mare Snorkel (09:00–12:00)
('30000000-0000-0000-0000-000000000003', now() + interval '1 days' + time '09:00', now() + interval '1 days' + time '12:00', 8, 2, 6500, 'MUR', true),
('30000000-0000-0000-0000-000000000003', now() + interval '3 days' + time '09:00', now() + interval '3 days' + time '12:00', 8, 0, 6500, 'MUR', true),
('30000000-0000-0000-0000-000000000003', now() + interval '5 days' + time '09:00', now() + interval '5 days' + time '12:00', 8, 7, 6500, 'MUR', true),
('30000000-0000-0000-0000-000000000003', now() + interval '8 days' + time '09:00', now() + interval '8 days' + time '12:00', 8, 0, 6500, 'MUR', true),
-- Grand Baie Dolphins (06:00–10:30)
('30000000-0000-0000-0000-000000000004', now() + interval '2 days' + time '06:00', now() + interval '2 days' + time '10:30', 10, 4, 12000, 'MUR', true),
('30000000-0000-0000-0000-000000000004', now() + interval '5 days' + time '06:00', now() + interval '5 days' + time '10:30', 10, 0, 12000, 'MUR', true),
('30000000-0000-0000-0000-000000000004', now() + interval '9 days' + time '06:00', now() + interval '9 days' + time '10:30', 10, 1, 12000, 'MUR', true),
('30000000-0000-0000-0000-000000000004', now() + interval '12 days' + time '06:00', now() + interval '12 days' + time '10:30', 10, 0, 11000, 'MUR', true),
-- Deep-Sea Fishing (07:00–15:00) — small boat, 6 guests
('30000000-0000-0000-0000-000000000005', now() + interval '4 days' + time '07:00', now() + interval '4 days' + time '15:00', 6, 0, 85000, 'MUR', true),
('30000000-0000-0000-0000-000000000005', now() + interval '11 days' + time '07:00', now() + interval '11 days' + time '15:00', 6, 2, 85000, 'MUR', true),
('30000000-0000-0000-0000-000000000005', now() + interval '18 days' + time '07:00', now() + interval '18 days' + time '15:00', 6, 0, 85000, 'MUR', true);

-- -------------------------
-- Booking rules
-- -------------------------
-- Global default rule
insert into public.booking_rules (tour_id, min_lead_hours, max_lead_days, min_guests, max_guests, allow_same_day) values
(null, 12, 90, 1, null, false)
on conflict do nothing;

-- Dolphin watch: must book at least 1 day ahead (6 AM departure)
insert into public.booking_rules (tour_id, min_lead_hours, max_lead_days, min_guests, max_guests, allow_same_day) values
('30000000-0000-0000-0000-000000000004', 24, 60, 2, 10, false)
on conflict do nothing;

-- Fishing: private charter, min 2 guests
insert into public.booking_rules (tour_id, min_lead_hours, max_lead_days, min_guests, max_guests, allow_same_day) values
('30000000-0000-0000-0000-000000000005', 48, 60, 2, 6, false)
on conflict do nothing;

-- -------------------------
-- Pickup options
-- -------------------------
insert into public.tours_pickup_options (tour_id, label, surcharge, position, active) values
('30000000-0000-0000-0000-000000000001', 'Le Morne Beach (included)', 0,    1, true),
('30000000-0000-0000-0000-000000000001', 'Grand Baie hotels',         2500, 2, true),
('30000000-0000-0000-0000-000000000001', 'Port Louis area',           3000, 3, true),
('30000000-0000-0000-0000-000000000002', 'Grand Baie hotels',         0,    1, true),
('30000000-0000-0000-0000-000000000002', 'Port Louis area',           1500, 2, true),
('30000000-0000-0000-0000-000000000004', 'Grand Baie jetty (included)', 0,  1, true),
('30000000-0000-0000-0000-000000000004', 'Grand Baie hotels',         500,  2, true);

-- -------------------------
-- Coupons
-- -------------------------
insert into public.coupons (code, description, discount_kind, discount_value, currency, active, starts_at, ends_at, max_redemptions) values
('WELCOME10', '10 % off your first booking',   'percent', 10,   'MUR', true,  now(), now() + interval '1 year', 500),
('SUMMER20',  '20 % off during summer season', 'percent', 20,   'MUR', true,  now(), now() + interval '3 months', 100),
('FLAT500',   'Rs 500 off any experience',     'fixed',   500,  'MUR', true,  now(), now() + interval '6 months', null),
('HIKE15',    '15 % off any hike',             'percent', 15,   'MUR', true,  now(), now() + interval '6 months', 200)
on conflict do nothing;

-- Update HIKE15 to be tour-specific
update public.coupons
set applicable_tour_id = '30000000-0000-0000-0000-000000000002'
where code = 'HIKE15';

-- -------------------------
-- Testimonials
-- -------------------------
insert into public.testimonials (author_name, author_location, quote, rating, related_tour_id, published, position) values
('Sophie L.',    'Paris, FR',        'The lagoon cruise was the highlight of our honeymoon. Absolutely magical!', 5, '30000000-0000-0000-0000-000000000001', true, 1),
('Marcus T.',    'London, UK',       'Swimming with dolphins before breakfast — I still can''t believe it''s real. Tropigo made it seamless.', 5, '30000000-0000-0000-0000-000000000004', true, 2),
('Yuki H.',      'Tokyo, JP',        'The hike guide knew every plant by name. Reached the top in misty clouds — unforgettable.', 5, '30000000-0000-0000-0000-000000000002', true, 3),
('Amara N.',     'Johannesburg, ZA', 'Caught a 180 kg blue marlin on the fishing charter! Crew was brilliant.', 5, '30000000-0000-0000-0000-000000000005', true, 4),
('Claire & Tom', 'Sydney, AU',       'Belle Mare snorkel was perfect for our kids. Small group, patient guide, stunning reef.', 4, '30000000-0000-0000-0000-000000000003', true, 5),
('Diego R.',     'Madrid, ES',       'From booking to departure Tropigo was professional and responsive. Will definitely come back.', 5, null, true, 6)
on conflict do nothing;

-- -------------------------
-- FAQs
-- -------------------------
insert into public.faqs (category, question, answer, position, published) values
('Booking',    'How far in advance should I book?',
 'We recommend booking at least 48 hours ahead for most experiences, and 7+ days in advance during peak season (December–April). Availability is live on the site.',
 1, true),
('Booking',    'Can I book for a group?',
 'Yes — all our experiences can accommodate groups. For groups of 10 or more, contact us directly at hello@tropigo.mu for a custom quote.',
 2, true),
('Booking',    'What payment methods do you accept?',
 'We accept all major credit/debit cards. Payment is processed securely at checkout. For large charters we can arrange bank transfer — contact us.',
 3, true),
('Cancellation','What is your cancellation policy?',
 'Free cancellation up to 24 hours before your experience starts. Within 24 hours, a 50 % fee applies. No-shows are non-refundable.',
 4, true),
('Cancellation','What if the tour is cancelled by Tropigo?',
 'In the rare event we need to cancel due to weather or other safety reasons, you will receive a full refund or a free rebook — your choice.',
 5, true),
('On the Day', 'What should I bring?',
 'Sunscreen, a hat and comfortable clothing suited to the activity. For water activities, a swimsuit and towel. Snorkelling gear is always provided.',
 6, true),
('On the Day', 'Are airport transfers included?',
 'Transfers are not included by default but can be added as a pickup option at checkout for most tours, or arranged separately via our concierge service.',
 7, true),
('General',    'Are your experiences suitable for children?',
 'Many of our experiences welcome children (minimum ages vary by activity — check each listing). The Belle Mare Snorkel & Swim is our most family-friendly option.',
 8, true)
on conflict do nothing;

-- -------------------------
-- Legal pages
-- -------------------------
insert into public.legal_pages (title, slug, content, published, position) values
('Privacy Policy', 'privacy-policy',
 E'# Privacy Policy\n\nLast updated: April 2026\n\nTropigo ("we", "us") operates the Tropigo website and booking platform. This page informs you of our policies regarding the collection, use and disclosure of personal data.\n\n## Data We Collect\nWe collect information you provide directly, such as name, email, phone number and payment details when making a booking.\n\n## How We Use Data\nWe use your data to process bookings, send confirmation emails and improve our services. We do not sell your data to third parties.\n\n## Contact\nhello@tropigo.mu',
 true, 1),
('Terms & Conditions', 'terms-and-conditions',
 E'# Terms & Conditions\n\nLast updated: April 2026\n\nBy booking through Tropigo you agree to these terms. Tropigo acts as an agent connecting guests with licensed local operators. All activities carry inherent risk — guests participate at their own risk.\n\n## Liability\nTropigo is not liable for injury, loss or damage arising from participation in any activity.\n\n## Governing Law\nThese terms are governed by the laws of the Republic of Mauritius.',
 true, 2),
('Cancellation Policy', 'cancellation-policy',
 E'# Cancellation Policy\n\n- **More than 24 h before departure:** Full refund.\n- **6–24 h before departure:** 50 % refund.\n- **Less than 6 h / no-show:** No refund.\n\nTropigo-initiated cancellations (weather, safety): full refund or free rebook.\n\nRefunds are processed within 5–10 business days to the original payment method.',
 true, 3)
on conflict do nothing;

-- -------------------------
-- Blog categories & posts
-- -------------------------
insert into public.blog_categories (id, name, slug, description, position, published) values
('d0000000-0000-0000-0000-000000000001', 'Travel Guides',   'travel-guides',   'Island tips and itinerary inspiration.',      1, true),
('d0000000-0000-0000-0000-000000000002', 'Marine Life',     'marine-life',     'Dolphins, turtles and the reefs of Mauritius.',2, true),
('d0000000-0000-0000-0000-000000000003', 'Activities',      'activities',      'Deep dives into our favourite experiences.',   3, true)
on conflict (id) do nothing;

insert into public.blog_posts (title, slug, excerpt, content, cover_image_url, category_id, published, published_at) values
(
  '7 Reasons to Visit Mauritius in April',
  '7-reasons-to-visit-mauritius-in-april',
  'April is arguably the best month to visit — find out why the island is at its most spectacular.',
  E'# 7 Reasons to Visit Mauritius in April\n\n## 1. Perfect Weather\nApril sits right between the cyclone season (ending March) and the cooler austral winter. Temperatures hover around 27 °C with low humidity.\n\n## 2. Flat Seas\nThe trade winds ease in April, making catamaran cruises and snorkelling excursions especially smooth.\n\n## 3. Fewer Crowds\nEuropean school holidays are over and the peak Christmas rush is long past — you get the beaches largely to yourself.\n\n## 4. Dolphin Season\nSpinner dolphins are reliably sighted in the north in April before they head further offshore in winter.\n\n## 5. Hiking Conditions\nDryer trails mean better grip on the Le Morne ascent and less mud on the coastal paths.\n\n## 6. Lower Prices\nMany hotels and tour operators offer shoulder-season rates, giving you more for your budget.\n\n## 7. Blooming Flame Trees\nThe iconic flamboyant trees burst into orange-red bloom in April, lining every road with colour.',
  'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=1200',
  'd0000000-0000-0000-0000-000000000001',
  true, now() - interval '5 days'
),
(
  'Swimming With Spinner Dolphins: What to Expect',
  'swimming-with-spinner-dolphins-guide',
  'A calm morning, a fast boat and the ocean to yourself — here''s the real story of a dolphin swim.',
  E'# Swimming with Spinner Dolphins\n\nSpinner dolphins (*Stenella longirostris*) gather in the waters off the north-west coast of Mauritius every morning before heading to deeper water to feed at night.\n\n## Best Time to Go\nDepart before 07:00. The dolphins rest near the surface in the early morning and are more relaxed around snorkellers at this hour.\n\n## What Actually Happens\nYou will hear them before you see them — a chorus of clicks and whistles through your snorkel. They move fast; you cannot chase them. The trick is to float still and let them come to you.\n\n## Ethical Guidelines\nOur guide follows the Mauritius Marine Conservation Society guidelines: no touching, no chasing, no flash photography underwater.',
  'https://images.unsplash.com/photo-1590523278191-995cbcda646b?w=1200',
  'd0000000-0000-0000-0000-000000000002',
  true, now() - interval '12 days'
),
(
  'Le Morne Hike: Complete Trail Guide 2026',
  'le-morne-hike-trail-guide-2026',
  'Everything you need to know before you lace up your boots and tackle Mauritius''s most iconic peak.',
  E'# Le Morne Hike: Complete Trail Guide\n\n## The Route\nThe main trail starts at the car park on the south side of the peninsula. It is 3.8 km round trip with 450 m of elevation gain. Allow 3–4 hours.\n\n## Difficulty\nModerate. The first half is a gentle forest path; the final 30 minutes involves scrambling over loose basalt — trekking poles recommended.\n\n## What to Bring\n- 2 L of water per person\n- Sunscreen and hat\n- Sturdy shoes (not sandals)\n- Snacks\n\n## The Summit\nYou will not reach the true summit (access is restricted to protect nesting birds) but the guide will take you to the panoramic viewpoint at ~480 m — easily the best view on the island.',
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1200',
  'd0000000-0000-0000-0000-000000000003',
  true, now() - interval '20 days'
)
on conflict do nothing;

-- -------------------------
-- Static pages
-- -------------------------
insert into public.static_pages (title, slug, content, position, published) values
('About Tropigo', 'about',
 E'# About Tropigo\n\nTropigo was founded by a group of Mauritians passionate about sharing the best of their island with the world. We hand-pick every experience we offer — if it isn''t exceptional, it doesn''t go on the site.\n\n## Our Mission\nTo make it effortless to discover and book authentic, responsible experiences in Mauritius.\n\n## Our Team\nWe are a small team of local guides, travel specialists and tech people based in Grand Baie.',
 1, true),
('How It Works', 'how-it-works',
 E'# How It Works\n\n1. **Browse** — Explore curated experiences by destination, activity type or date.\n2. **Choose a slot** — Live availability, instant confirmation.\n3. **Book & pay securely** — All major cards accepted.\n4. **Get your voucher** — Emailed instantly, show it on your phone.\n5. **Enjoy!** — Meet your guide and have the best day of your trip.',
 2, true)
on conflict do nothing;

-- -------------------------
-- Homepage sections
-- -------------------------
insert into public.homepage_sections (section_type, title, subtitle, data, position, published) values
('hero',         'Your Island Adventure Starts Here',
  'Curated tours and experiences across Mauritius — book in seconds.',
  '{"cta_label":"Explore Experiences","cta_url":"/experiences","bg_image":"/hero-bg.jpg"}'::jsonb,
  1, true),
('badges',       null, null,
  '{"badge_ids":["b0000000-0000-0000-0000-000000000001","b0000000-0000-0000-0000-000000000002","b0000000-0000-0000-0000-000000000003"]}'::jsonb,
  2, true),
('regions',      'Explore by Destination', 'Choose your corner of the island.',
  '{}'::jsonb,
  3, true),
('experiences',  'Top Experiences', 'Hand-picked by our local team.',
  '{"tour_ids":["30000000-0000-0000-0000-000000000001","30000000-0000-0000-0000-000000000004","30000000-0000-0000-0000-000000000002"]}'::jsonb,
  4, true),
('testimonials', 'What Our Guests Say', null,
  '{}'::jsonb,
  5, true),
('faqs',         'Frequently Asked Questions', null,
  '{}'::jsonb,
  6, true),
('cta',          'Ready to Book?', 'Secure your spot today — free cancellation up to 24 h before.',
  '{"cta_label":"Browse All Experiences","cta_url":"/experiences"}'::jsonb,
  7, true)
on conflict do nothing;

-- -------------------------
-- Sample enquiry
-- -------------------------
insert into public.enquiries (name, email, phone, message, tour_id, status) values
(
  'James Okafor',
  'james.okafor@example.com',
  '+44 7911 123456',
  'Hi, I am visiting with my family of 4 (2 adults, 2 kids aged 8 & 11) in late April. Can you recommend the best combination of activities? We are staying near Grand Baie.',
  '30000000-0000-0000-0000-000000000004',
  'new'
)
on conflict do nothing;

-- -------------------------
-- Sample booking for test user
-- -------------------------
insert into public.bookings (
  id, user_id, booking_ref, status, payment_status, currency,
  subtotal_amount, discount_amount, total_amount,
  customer_email, customer_name, customer_phone,
  idempotency_key, source, payment_provider, payment_intent_id, paid_at
) values (
  'b0000001-0000-0000-0000-000000000001',
  '00000000-0000-0000-0000-000000000002',
  'TG-20260404-SEED01',
  'confirmed', 'paid', 'MUR',
  18000, 1800, 16200,
  'user@tropigo.com', 'Sophie Laurent', '+33 6 12 34 56 78',
  'idem-seed-001', 'web', 'mock', 'mock_pi_seed_001', now() - interval '1 day'
) on conflict do nothing;

insert into public.booking_items (
  booking_id, tour_id, title, starts_at, ends_at,
  guests, quantity, unit_price, subtotal
) values (
  'b0000001-0000-0000-0000-000000000001',
  '30000000-0000-0000-0000-000000000001',
  'Le Morne Lagoon Cruise',
  now() + interval '2 days' + time '09:00',
  now() + interval '2 days' + time '14:00',
  2, 2, 9000, 18000
) on conflict do nothing;
