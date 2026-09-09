-- Services offered by the business. Publicly readable when published;
-- only admins can create, edit, or delete.

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  icon text,
  display_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.services is 'Business services listing; public read when published, admin-managed.';

create index if not exists services_display_order_idx
  on public.services (display_order);

create trigger set_services_updated_at
  before update on public.services
  for each row execute function public.set_updated_at();

alter table public.services enable row level security;

create policy "Published services are viewable by everyone"
  on public.services for select
  using (is_published = true or public.is_admin());

create policy "Admins can insert services"
  on public.services for insert
  with check (public.is_admin());

create policy "Admins can update services"
  on public.services for update
  using (public.is_admin());

create policy "Admins can delete services"
  on public.services for delete
  using (public.is_admin());
