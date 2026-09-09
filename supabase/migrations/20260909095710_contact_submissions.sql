-- Contact form submissions. Anyone (including anonymous site visitors) can
-- submit one; only admins can read or manage them.

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  message text not null,
  is_handled boolean not null default false,
  created_at timestamptz not null default now()
);

comment on table public.contact_submissions is 'Public contact form submissions; admin-only read/manage.';

create index if not exists contact_submissions_created_at_idx
  on public.contact_submissions (created_at desc);

alter table public.contact_submissions enable row level security;

create policy "Anyone can submit the contact form"
  on public.contact_submissions for insert
  to anon, authenticated
  with check (true);

create policy "Admins can view contact submissions"
  on public.contact_submissions for select
  using (public.is_admin());

create policy "Admins can update contact submissions"
  on public.contact_submissions for update
  using (public.is_admin());

create policy "Admins can delete contact submissions"
  on public.contact_submissions for delete
  using (public.is_admin());
