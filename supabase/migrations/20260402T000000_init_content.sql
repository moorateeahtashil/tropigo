-- Enable required extensions
create extension if not exists "pgcrypto";

-- Utility: updated_at trigger
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Conventions: all tables have id uuid, created_at, updated_at

-- 1) site_settings (singleton)
create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  brand_name text,
  logo_url text,
  default_locale text default 'en',
  currency text default 'MUR',
  contact_email text,
  phone text,
  address jsonb,
  socials jsonb,
  ga4_id text,
  meta jsonb,
  seo_title_template text,
  default_meta_description text,
  default_og_image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  is_singleton boolean not null default true,
  constraint site_settings_singleton_unique unique (is_singleton)
);
create trigger site_settings_set_updated_at before update on public.site_settings
for each row execute procedure set_updated_at();

-- 2) navigation
create table if not exists public.navigation_menus (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  label text not null,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger navigation_menus_set_updated_at before update on public.navigation_menus
for each row execute procedure set_updated_at();

create table if not exists public.navigation_links (
  id uuid primary key default gen_random_uuid(),
  menu_id uuid not null references public.navigation_menus(id) on delete cascade,
  parent_id uuid references public.navigation_links(id) on delete cascade,
  label text not null,
  href text not null,
  link_type text not null default 'internal' check (link_type in ('internal','external','anchor')),
  page_ref_type text check (page_ref_type in ('destination','activity','tour','legal','custom')),
  page_ref_id uuid,
  position int not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists navigation_links_menu_pos on public.navigation_links(menu_id, position);
create index if not exists navigation_links_parent on public.navigation_links(parent_id);
create trigger navigation_links_set_updated_at before update on public.navigation_links
for each row execute procedure set_updated_at();

-- 3) footer blocks
create table if not exists public.footer_blocks (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  title text not null,
  content jsonb not null default '[]'::jsonb,
  position int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger footer_blocks_set_updated_at before update on public.footer_blocks
for each row execute procedure set_updated_at();

-- 4) homepage sections
create table if not exists public.homepage_sections (
  id uuid primary key default gen_random_uuid(),
  section_type text not null check (section_type in ('hero','badges','regions','experiences','features','testimonials','faqs','promo','cta','custom')),
  title text,
  subtitle text,
  data jsonb not null default '{}'::jsonb,
  position int not null default 0,
  published boolean not null default false,
  start_at timestamptz,
  end_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists homepage_sections_pos on public.homepage_sections(position);
create trigger homepage_sections_set_updated_at before update on public.homepage_sections
for each row execute procedure set_updated_at();

-- 5) destinations
create table if not exists public.destinations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  summary text,
  body text,
  hero_image_url text,
  gallery_urls text[],
  region text,
  lat numeric,
  lng numeric,
  featured boolean not null default false,
  position int not null default 0,
  seo_title text,
  seo_description text,
  seo_image_url text,
  canonical_url text,
  noindex boolean not null default false,
  structured_data jsonb,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists destinations_featured_pos on public.destinations(featured, position);
create trigger destinations_set_updated_at before update on public.destinations
for each row execute procedure set_updated_at();

-- 6) activities
create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  icon_url text,
  image_url text,
  seo_title text,
  seo_description text,
  seo_image_url text,
  canonical_url text,
  noindex boolean not null default false,
  structured_data jsonb,
  published boolean not null default false,
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists activities_pos on public.activities(position);
create trigger activities_set_updated_at before update on public.activities
for each row execute procedure set_updated_at();

-- 7) tours
create table if not exists public.tours (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  destination_id uuid references public.destinations(id) on delete set null,
  summary text,
  description text,
  duration text,
  difficulty text,
  price_from numeric(12,2),
  currency text default 'MUR',
  hero_image_url text,
  gallery_urls text[],
  is_active boolean not null default true,
  featured boolean not null default false,
  position int not null default 0,
  seo_title text,
  seo_description text,
  seo_image_url text,
  canonical_url text,
  noindex boolean not null default false,
  structured_data jsonb,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists tours_featured_pos on public.tours(featured, position);
create trigger tours_set_updated_at before update on public.tours
for each row execute procedure set_updated_at();

create table if not exists public.tours_activities (
  tour_id uuid not null references public.tours(id) on delete cascade,
  activity_id uuid not null references public.activities(id) on delete cascade,
  primary key (tour_id, activity_id)
);

-- 8) testimonials
create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  author_location text,
  quote text not null,
  rating int check (rating between 1 and 5),
  photo_url text,
  related_tour_id uuid references public.tours(id) on delete set null,
  related_destination_id uuid references public.destinations(id) on delete set null,
  published boolean not null default false,
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists testimonials_pos on public.testimonials(position);
create trigger testimonials_set_updated_at before update on public.testimonials
for each row execute procedure set_updated_at();

-- 9) faqs
create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  category text,
  question text not null,
  answer text not null,
  position int not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists faqs_pos on public.faqs(position);
create trigger faqs_set_updated_at before update on public.faqs
for each row execute procedure set_updated_at();

-- 10) legal pages
create table if not exists public.legal_pages (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  content text not null,
  position int not null default 0,
  seo_title text,
  seo_description text,
  seo_image_url text,
  canonical_url text,
  noindex boolean not null default false,
  structured_data jsonb,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists legal_pages_pos on public.legal_pages(position);
create trigger legal_pages_set_updated_at before update on public.legal_pages
for each row execute procedure set_updated_at();

-- 11) badges
create table if not exists public.badges (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  description text,
  icon_url text,
  context text not null check (context in ('sitewide','homepage','tour','destination')),
  position int not null default 0,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger badges_set_updated_at before update on public.badges
for each row execute procedure set_updated_at();

-- 12) promo banners
create table if not exists public.promo_banners (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text,
  cta_label text,
  cta_url text,
  placement text not null check (placement in ('sitewide_top','homepage_hero','footer','inline')),
  start_at timestamptz,
  end_at timestamptz,
  active boolean not null default false,
  background jsonb,
  priority int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists promo_banners_active on public.promo_banners(active, priority);
create trigger promo_banners_set_updated_at before update on public.promo_banners
for each row execute procedure set_updated_at();

-- 13) contact profiles
create table if not exists public.contact_profiles (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  emails text[],
  phones text[],
  whatsapp text,
  address jsonb,
  hours jsonb,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger contact_profiles_set_updated_at before update on public.contact_profiles
for each row execute procedure set_updated_at();

-- RLS: enable on all content tables
alter table public.site_settings enable row level security;
alter table public.navigation_menus enable row level security;
alter table public.navigation_links enable row level security;
alter table public.footer_blocks enable row level security;
alter table public.homepage_sections enable row level security;
alter table public.destinations enable row level security;
alter table public.activities enable row level security;
alter table public.tours enable row level security;
alter table public.tours_activities enable row level security;
alter table public.testimonials enable row level security;
alter table public.faqs enable row level security;
alter table public.legal_pages enable row level security;
alter table public.badges enable row level security;
alter table public.promo_banners enable row level security;
alter table public.contact_profiles enable row level security;

-- Policies: public read of published content (or visible/active)

-- site_settings: readable by anyone (non-sensitive config)
create policy "public read site_settings" on public.site_settings
for select using (true);

-- navigation
create policy "public read menus" on public.navigation_menus
for select using (true);
create policy "public read visible links" on public.navigation_links
for select using (visible = true);

-- footer_blocks
create policy "public read footer blocks" on public.footer_blocks
for select using (published = true);

-- homepage_sections (windowed)
create policy "public read homepage sections" on public.homepage_sections
for select using (
  published = true and (start_at is null or start_at <= now()) and (end_at is null or end_at >= now())
);

-- destinations, activities, tours, testimonials, faqs, legal_pages, badges
create policy "public read destinations" on public.destinations for select using (published = true);
create policy "public read activities" on public.activities for select using (published = true);
create policy "public read tours" on public.tours for select using (published = true and is_active = true);
create policy "public read testimonials" on public.testimonials for select using (published = true);
create policy "public read faqs" on public.faqs for select using (published = true);
create policy "public read legal_pages" on public.legal_pages for select using (published = true);
create policy "public read badges" on public.badges for select using (published = true);

-- promo_banners
create policy "public read active promos" on public.promo_banners
for select using (
  active = true and (start_at is null or start_at <= now()) and (end_at is null or end_at >= now())
);

-- contact_profiles
create policy "public read contact" on public.contact_profiles for select using (published = true);

-- join table: allow reads if referenced tour is published (simplify: allow select)
create policy "public read tour activities" on public.tours_activities for select using (true);

-- Admin CRUD: authenticated with JWT claim role = 'admin' or is_admin = true
-- Helper expression reused in policies
create or replace function is_admin() returns boolean as $$
  select coalesce((auth.jwt() ->> 'role') = 'admin', false) or coalesce((auth.jwt() ->> 'is_admin')::boolean, false);
$$ language sql stable;

-- Grant admin CRUD on all content tables
do $$
declare t record;
begin
  for t in (
    select unnest(array[
      'site_settings', 'navigation_menus', 'navigation_links', 'footer_blocks', 'homepage_sections',
      'destinations', 'activities', 'tours', 'tours_activities', 'testimonials', 'faqs', 'legal_pages',
      'badges', 'promo_banners', 'contact_profiles'
    ]) as name
  ) loop
    execute format('create policy admin_ins_%1$s on public.%1$s for insert to authenticated with check (is_admin());', t.name);
    execute format('create policy admin_upd_%1$s on public.%1$s for update to authenticated using (is_admin()) with check (is_admin());', t.name);
    execute format('create policy admin_del_%1$s on public.%1$s for delete to authenticated using (is_admin());', t.name);
  end loop;
end$$;

