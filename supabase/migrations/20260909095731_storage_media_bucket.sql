-- Public storage bucket for blog/portfolio images and other site media.
-- Anyone can view files; only admins can upload, replace, or delete them.

insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

create policy "Media files are publicly viewable"
  on storage.objects for select
  using (bucket_id = 'media');

create policy "Admins can upload media files"
  on storage.objects for insert
  with check (bucket_id = 'media' and public.is_admin());

create policy "Admins can update media files"
  on storage.objects for update
  using (bucket_id = 'media' and public.is_admin());

create policy "Admins can delete media files"
  on storage.objects for delete
  using (bucket_id = 'media' and public.is_admin());
