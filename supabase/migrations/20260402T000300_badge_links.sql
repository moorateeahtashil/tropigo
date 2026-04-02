-- Link badges to destinations and activity categories
create table if not exists public.destination_badges (
  destination_id uuid not null references public.destinations(id) on delete cascade,
  badge_id uuid not null references public.badges(id) on delete cascade,
  primary key (destination_id, badge_id)
);
alter table public.destination_badges enable row level security;
create policy "public read dest badges" on public.destination_badges for select using (true);
create policy "admin ins dest badges" on public.destination_badges for insert to authenticated with check (is_admin());
create policy "admin del dest badges" on public.destination_badges for delete to authenticated using (is_admin());

create table if not exists public.activity_category_badges (
  category_id uuid not null references public.activity_categories(id) on delete cascade,
  badge_id uuid not null references public.badges(id) on delete cascade,
  primary key (category_id, badge_id)
);
alter table public.activity_category_badges enable row level security;
create policy "public read cat badges" on public.activity_category_badges for select using (true);
create policy "admin ins cat badges" on public.activity_category_badges for insert to authenticated with check (is_admin());
create policy "admin del cat badges" on public.activity_category_badges for delete to authenticated using (is_admin());

