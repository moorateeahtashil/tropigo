-- CMS + Booking foundation (editable-first)
-- Assumes set_updated_at() and is_admin() exist from previous migrations.

-- 1) navigation_items (flattened, covers main/utility/footer if desired)
create table if not exists public.navigation_items (
  id uuid primary key default gen_random_uuid(),
  area text not null default 'main', -- e.g., 'main' | 'utility' | 'footer'
  parent_id uuid references public.navigation_items(id) on delete cascade,
  label text not null,
  href text not null,
  external boolean not null default false,
  position int not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists navigation_items_area_pos on public.navigation_items(area, position);
create trigger navigation_items_set_updated_at before update on public.navigation_items
for each row execute procedure set_updated_at();
alter table public.navigation_items enable row level security;
create policy "public read nav items" on public.navigation_items for select using (visible = true);
create policy "admin ins nav items" on public.navigation_items for insert to authenticated with check (is_admin());
create policy "admin upd nav items" on public.navigation_items for update to authenticated using (is_admin()) with check (is_admin());
create policy "admin del nav items" on public.navigation_items for delete to authenticated using (is_admin());

-- 2) footer_groups (keyed collections of links/blocks)
create table if not exists public.footer_groups (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  title text not null,
  items jsonb not null default '[]'::jsonb, -- array of {label, href}
  position int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists footer_groups_pos on public.footer_groups(position);
create trigger footer_groups_set_updated_at before update on public.footer_groups
for each row execute procedure set_updated_at();
alter table public.footer_groups enable row level security;
create policy "public read footer groups" on public.footer_groups for select using (published = true);
create policy "admin ins footer groups" on public.footer_groups for insert to authenticated with check (is_admin());
create policy "admin upd footer groups" on public.footer_groups for update to authenticated using (is_admin()) with check (is_admin());
create policy "admin del footer groups" on public.footer_groups for delete to authenticated using (is_admin());

-- 3) activity_categories (taxonomy for tours)
create table if not exists public.activity_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  icon_url text,
  image_url text,
  position int not null default 0,
  published boolean not null default false,
  seo_title text,
  seo_description text,
  seo_image_url text,
  canonical_url text,
  noindex boolean not null default false,
  structured_data jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists activity_categories_pos on public.activity_categories(position);
create trigger activity_categories_set_updated_at before update on public.activity_categories
for each row execute procedure set_updated_at();
alter table public.activity_categories enable row level security;
create policy "public read activity_categories" on public.activity_categories for select using (published = true);
create policy "admin ins activity_categories" on public.activity_categories for insert to authenticated with check (is_admin());
create policy "admin upd activity_categories" on public.activity_categories for update to authenticated using (is_admin()) with check (is_admin());
create policy "admin del activity_categories" on public.activity_categories for delete to authenticated using (is_admin());

-- join: tours <-> activity_categories
create table if not exists public.tours_activity_categories (
  tour_id uuid not null references public.tours(id) on delete cascade,
  category_id uuid not null references public.activity_categories(id) on delete cascade,
  primary key (tour_id, category_id)
);
alter table public.tours_activity_categories enable row level security;
create policy "public read tours_activity_categories" on public.tours_activity_categories for select using (true);
create policy "admin ins tours_activity_categories" on public.tours_activity_categories for insert to authenticated with check (is_admin());
create policy "admin del tours_activity_categories" on public.tours_activity_categories for delete to authenticated using (is_admin());

-- 4) tour_images (ordered gallery per tour)
create table if not exists public.tour_images (
  id uuid primary key default gen_random_uuid(),
  tour_id uuid not null references public.tours(id) on delete cascade,
  image_url text not null,
  alt text,
  position int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists tour_images_tour_pos on public.tour_images(tour_id, position);
create trigger tour_images_set_updated_at before update on public.tour_images
for each row execute procedure set_updated_at();
alter table public.tour_images enable row level security;
create policy "public read tour_images" on public.tour_images for select using (true);
create policy "admin ins tour_images" on public.tour_images for insert to authenticated with check (is_admin());
create policy "admin upd tour_images" on public.tour_images for update to authenticated using (is_admin()) with check (is_admin());
create policy "admin del tour_images" on public.tour_images for delete to authenticated using (is_admin());

-- 5) availability_slots (inventory for tours)
create table if not exists public.availability_slots (
  id uuid primary key default gen_random_uuid(),
  tour_id uuid not null references public.tours(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  capacity int not null check (capacity >= 0),
  reserved int not null default 0 check (reserved >= 0),
  price numeric(12,2) not null check (price >= 0),
  currency text not null default 'MUR',
  is_active boolean not null default true,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint availability_time_valid check (ends_at > starts_at)
);
create index if not exists availability_tour_time on public.availability_slots(tour_id, starts_at, ends_at);
create trigger availability_slots_set_updated_at before update on public.availability_slots
for each row execute procedure set_updated_at();
alter table public.availability_slots enable row level security;
-- Public read-only for active slots to allow SSR list/render; booking still validated on server
create policy "public read availability" on public.availability_slots for select using (is_active = true);
create policy "admin ins availability" on public.availability_slots for insert to authenticated with check (is_admin());
create policy "admin upd availability" on public.availability_slots for update to authenticated using (is_admin()) with check (is_admin());
create policy "admin del availability" on public.availability_slots for delete to authenticated using (is_admin());

-- 6) static_pages (general CMS pages)
create table if not exists public.static_pages (
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
create index if not exists static_pages_pos on public.static_pages(position);
create trigger static_pages_set_updated_at before update on public.static_pages
for each row execute procedure set_updated_at();
alter table public.static_pages enable row level security;
create policy "public read static pages" on public.static_pages for select using (published = true);
create policy "admin ins static pages" on public.static_pages for insert to authenticated with check (is_admin());
create policy "admin upd static pages" on public.static_pages for update to authenticated using (is_admin()) with check (is_admin());
create policy "admin del static pages" on public.static_pages for delete to authenticated using (is_admin());

-- 7) contact_settings (singleton-ish)
create table if not exists public.contact_settings (
  id uuid primary key default gen_random_uuid(),
  emails text[],
  phones text[],
  whatsapp text,
  address jsonb,
  hours jsonb,
  published boolean not null default false,
  is_singleton boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint contact_settings_singleton unique (is_singleton)
);
create trigger contact_settings_set_updated_at before update on public.contact_settings
for each row execute procedure set_updated_at();
alter table public.contact_settings enable row level security;
create policy "public read contact settings" on public.contact_settings for select using (published = true);
create policy "admin ins contact settings" on public.contact_settings for insert to authenticated with check (is_admin());
create policy "admin upd contact settings" on public.contact_settings for update to authenticated using (is_admin()) with check (is_admin());
create policy "admin del contact settings" on public.contact_settings for delete to authenticated using (is_admin());

-- 8) coupons (private; validated server-side)
create type if not exists discount_type as enum ('percent','fixed');
create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  description text,
  discount_kind discount_type not null,
  discount_value numeric(12,2) not null check (discount_value >= 0),
  currency text,
  starts_at timestamptz,
  ends_at timestamptz,
  active boolean not null default false,
  max_redemptions int,
  per_user_limit int,
  min_subtotal numeric(12,2),
  applicable_tour_id uuid references public.tours(id) on delete set null,
  applicable_destination_id uuid references public.destinations(id) on delete set null,
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger coupons_set_updated_at before update on public.coupons
for each row execute procedure set_updated_at();
alter table public.coupons enable row level security;
-- By default, do not expose coupons publicly
create policy "admin read coupons" on public.coupons for select to authenticated using (is_admin());
create policy "admin ins coupons" on public.coupons for insert to authenticated with check (is_admin());
create policy "admin upd coupons" on public.coupons for update to authenticated using (is_admin()) with check (is_admin());
create policy "admin del coupons" on public.coupons for delete to authenticated using (is_admin());

-- 9) profiles (linked to auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  country text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger profiles_set_updated_at before update on public.profiles
for each row execute procedure set_updated_at();
alter table public.profiles enable row level security;
create policy "owner read profile" on public.profiles for select using (auth.uid() = id);
create policy "owner update profile" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "admin read profiles" on public.profiles for select to authenticated using (is_admin());

-- 10) bookings and booking_items
create type if not exists booking_status as enum ('pending','reserved','confirmed','canceled','failed','expired');
create type if not exists payment_status as enum ('unpaid','authorized','paid','refunded','partially_refunded');

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  booking_ref text not null unique,
  status booking_status not null default 'pending',
  payment_status payment_status not null default 'unpaid',
  currency text not null default 'MUR',
  subtotal_amount numeric(12,2) not null default 0,
  discount_amount numeric(12,2) not null default 0,
  total_amount numeric(12,2) not null default 0,
  coupon_code text,
  customer_email text not null,
  customer_name text,
  customer_phone text,
  notes text,
  idempotency_key text unique,
  source text, -- e.g. 'web'
  user_agent text,
  ip_address text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists bookings_user on public.bookings(user_id, created_at desc);
create trigger bookings_set_updated_at before update on public.bookings
for each row execute procedure set_updated_at();
alter table public.bookings enable row level security;
-- Owner can read their own bookings
create policy "owner read bookings" on public.bookings for select using (auth.uid() = user_id);
-- Owner can create bookings for themselves (user_id must match)
create policy "owner insert bookings" on public.bookings for insert to authenticated with check (auth.uid() = user_id);
-- Owner may update limited fields? Keep admin-only updates for now
create policy "admin read bookings" on public.bookings for select to authenticated using (is_admin());
create policy "admin ins bookings" on public.bookings for insert to authenticated with check (is_admin());
create policy "admin upd bookings" on public.bookings for update to authenticated using (is_admin()) with check (is_admin());
create policy "admin del bookings" on public.bookings for delete to authenticated using (is_admin());

create table if not exists public.booking_items (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  tour_id uuid references public.tours(id) on delete set null,
  title text not null, -- snapshot of tour name
  starts_at timestamptz,
  ends_at timestamptz,
  guests int,
  quantity int not null default 1 check (quantity > 0),
  unit_price numeric(12,2) not null default 0,
  subtotal numeric(12,2) not null default 0,
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists booking_items_booking on public.booking_items(booking_id);
create trigger booking_items_set_updated_at before update on public.booking_items
for each row execute procedure set_updated_at();
alter table public.booking_items enable row level security;
-- Owner can read items of their booking
create policy "owner read booking_items" on public.booking_items for select using (
  exists (select 1 from public.bookings b where b.id = booking_id and b.user_id = auth.uid())
);
-- Admin full access
create policy "admin read booking_items" on public.booking_items for select to authenticated using (is_admin());
create policy "admin ins booking_items" on public.booking_items for insert to authenticated with check (is_admin());
create policy "admin upd booking_items" on public.booking_items for update to authenticated using (is_admin()) with check (is_admin());
create policy "admin del booking_items" on public.booking_items for delete to authenticated using (is_admin());

