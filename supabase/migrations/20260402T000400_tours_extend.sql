-- Extend tours with richer content fields
alter table public.tours
  add column if not exists transport text,
  add column if not exists inclusions jsonb,
  add column if not exists exclusions jsonb,
  add column if not exists itinerary jsonb,
  add column if not exists notices text,
  add column if not exists sale_active boolean not null default false,
  add column if not exists sale_price numeric(12,2);

-- Link badges to tours
create table if not exists public.tour_badges (
  tour_id uuid not null references public.tours(id) on delete cascade,
  badge_id uuid not null references public.badges(id) on delete cascade,
  primary key (tour_id, badge_id)
);
alter table public.tour_badges enable row level security;
create policy "public read tour badges" on public.tour_badges for select using (true);
create policy "admin ins tour badges" on public.tour_badges for insert to authenticated with check (is_admin());
create policy "admin del tour badges" on public.tour_badges for delete to authenticated using (is_admin());

