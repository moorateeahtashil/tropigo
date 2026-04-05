create type if not exists enquiry_status as enum ('new','responded','archived');
create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  phone text,
  message text,
  tour_id uuid references public.tours(id) on delete set null,
  status enquiry_status not null default 'new',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger enquiries_updated before update on public.enquiries
for each row execute procedure set_updated_at();
alter table public.enquiries enable row level security;
create policy "public create enquiry" on public.enquiries for insert to anon, authenticated with check (true);
create policy "admin read enquiries" on public.enquiries for select to authenticated using (is_admin());
create policy "admin upd enquiries" on public.enquiries for update to authenticated using (is_admin()) with check (is_admin());
