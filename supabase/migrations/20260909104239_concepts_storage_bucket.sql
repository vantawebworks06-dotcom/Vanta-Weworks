-- Storage bucket for AI-generated concept images. Public read so the
-- visualizer result page can display the image via a public URL; writes
-- happen only from the server-side /api/visualize route via the
-- service_role key (which bypasses these RLS policies), so no public
-- insert policy is defined.

insert into storage.buckets (id, name, public)
values ('concepts', 'concepts', true)
on conflict (id) do nothing;

create policy "Concept images are publicly viewable"
  on storage.objects for select
  using (bucket_id = 'concepts');

create policy "Admins can delete concept images"
  on storage.objects for delete
  using (bucket_id = 'concepts' and public.is_admin());
