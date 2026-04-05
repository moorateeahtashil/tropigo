-- Create a public assets bucket for images
create schema if not exists storage;
insert into storage.buckets (id, name, public)
values ('assets','assets', true)
on conflict (id) do nothing;

