-- Development seed data for content model

insert into public.site_settings (brand_name, logo_url, default_locale, currency, contact_email, phone, socials, seo_title_template, default_meta_description)
values ('Tropigo', '/logo.svg', 'en', 'MUR', 'hello@tropigo.example', '+230 5555 5555', '{"instagram":"https://instagram.com/tropigo"}', '%s | Tropigo', 'Curated villas and experiences in Mauritius')
on conflict do nothing;

-- Menus
insert into public.navigation_menus (key, label) values
('main','Main Navigation'),
('footer','Footer Navigation')
on conflict do nothing;

-- Links (main)
with menu as (select id from public.navigation_menus where key='main')
insert into public.navigation_links (menu_id, label, href, position, visible)
select id, 'Villas', '/villas', 1, true from menu
union all select id, 'Experiences', '/experiences', 2, true from menu
union all select id, 'Destinations', '/destinations', 3, true from menu
union all select id, 'About', '/about', 4, true from menu;

-- Footer blocks
insert into public.footer_blocks (key, title, content, position, published) values
('company','Company','[{"label":"About","href":"/about"},{"label":"Team","href":"/team"}]',1,true),
('explore','Explore','[{"label":"Villas","href":"/villas"},{"label":"Experiences","href":"/experiences"}]',2,true),
('support','Support','[{"label":"Help Center","href":"/help"},{"label":"Contact","href":"/contact"}]',3,true)
on conflict do nothing;

-- Destinations
insert into public.destinations (name, slug, summary, hero_image_url, featured, position, published)
values
('Le Morne','le-morne','Dramatic mountain and lagoon views.','https://lh3.googleusercontent.com/aida-public/AB6AXuDE...', true, 1, true),
('Belle Mare','belle-mare','Eastern lagoon beaches and luxury retreats.','https://lh3.googleusercontent.com/aida-public/AB6AXuCf...', true, 2, true)
on conflict do nothing;

-- Activities
insert into public.activities (name, slug, description, image_url, published, position)
values
('Snorkeling','snorkeling','Reef snorkeling in crystal waters.','https://lh3.googleusercontent.com/aida-public/AB6AXuDq...', true, 1),
('Deep Sea Fishing','deep-sea-fishing','Charter a boat for marlin.','https://lh3.googleusercontent.com/aida-public/AB6AXuDq...2', true, 2)
on conflict do nothing;

-- Tours
with d as (select id from public.destinations where slug='le-morne')
insert into public.tours (name, slug, destination_id, summary, duration, price_from, currency, hero_image_url, is_active, featured, position, published)
select 'Le Morne Lagoon Cruise','le-morne-lagoon-cruise', id,'Private catamaran cruise with snorkeling.','Half day', 18000,'MUR','https://lh3.googleusercontent.com/aida-public/AB6AXuDE...3', true, true, 1, true from d
on conflict do nothing;

-- Tour activities join
with t as (select id from public.tours where slug='le-morne-lagoon-cruise'),
     a as (select id from public.activities where slug='snorkeling')
insert into public.tours_activities (tour_id, activity_id)
select t.id, a.id from t, a
on conflict do nothing;

-- Testimonials
insert into public.testimonials (author_name, author_location, quote, rating, published, position)
values ('Sophie L.','Paris, FR','The most seamless island trip we ever had!',5,true,1)
on conflict do nothing;

-- FAQs
insert into public.faqs (category, question, answer, position, published)
values ('General','Do you offer airport transfers?','Yes, we can arrange private transfers to your villa or hotel.',1,true)
on conflict do nothing;

-- Legal
insert into public.legal_pages (title, slug, content, published, position)
values ('Privacy Policy','privacy-policy','# Privacy Policy\nYour privacy matters to us.',true,1)
on conflict do nothing;

-- Badges
insert into public.badges (label, description, context, position, published)
values ('Top 1% Global Villas','Hand-vetted selection','sitewide',1,true)
on conflict do nothing;

-- Promo banners
insert into public.promo_banners (title, body, cta_label, cta_url, placement, active, priority)
values ('Summer Offer','Save on select villas this season.','Explore','/villas','sitewide_top',true,10)
on conflict do nothing;

-- Contact profiles
insert into public.contact_profiles (label, emails, phones, published)
values ('primary', array['hello@tropigo.example'], array['+230 5555 5555'], true)
on conflict do nothing;

