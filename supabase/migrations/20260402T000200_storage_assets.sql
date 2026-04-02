-- Create a public assets bucket for images
create schema if not exists storage;
insert into storage.buckets (id, name, public)
values ('assets','assets', true)
on conflict (id) do nothing;

-- RLS policies for storage.objects
alter table storage.objects enable row level security;

-- Public can read from public buckets
create policy "Public read assets" on storage.objects
for select using ( bucket_id = 'assets' );

-- Authenticated users can upload to assets
create policy "Authenticated upload assets" on storage.objects
for insert to authenticated
with check ( bucket_id = 'assets' );

-- Authenticated users can update/delete their own objects
create policy "Authenticated update own assets" on storage.objects
for update to authenticated
using ( bucket_id = 'assets' and (owner = auth.uid()) )
with check ( bucket_id = 'assets' and (owner = auth.uid()) );

create policy "Authenticated delete own assets" on storage.objects
for delete to authenticated
using ( bucket_id = 'assets' and (owner = auth.uid()) );

