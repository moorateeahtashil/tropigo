-- Extend contact settings
alter table public.contact_settings
  add column if not exists map_url text,
  add column if not exists whatsapp_cta text;

-- Blog / Travel Guide
create table if not exists public.blog_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  position int not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger blog_categories_updated before update on public.blog_categories
for each row execute procedure set_updated_at();
alter table public.blog_categories enable row level security;
create policy "public read blog_categories" on public.blog_categories for select using (published = true);
create policy "admin crud blog_categories" on public.blog_categories for all to authenticated using (is_admin()) with check (is_admin());

create table if not exists public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text,
  cover_image_url text,
  category_id uuid references public.blog_categories(id) on delete set null,
  seo_title text,
  seo_description text,
  seo_image_url text,
  canonical_url text,
  noindex boolean not null default false,
  published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger blog_posts_updated before update on public.blog_posts
for each row execute procedure set_updated_at();
alter table public.blog_posts enable row level security;
create policy "public read blog_posts" on public.blog_posts for select using (published = true);
create policy "admin crud blog_posts" on public.blog_posts for all to authenticated using (is_admin()) with check (is_admin());

create table if not exists public.blog_post_related (
  post_id uuid not null references public.blog_posts(id) on delete cascade,
  related_id uuid not null references public.blog_posts(id) on delete cascade,
  primary key (post_id, related_id)
);
alter table public.blog_post_related enable row level security;
create policy "public read blog_post_related" on public.blog_post_related for select using (true);
create policy "admin mod blog_post_related" on public.blog_post_related for all to authenticated using (is_admin()) with check (is_admin());

