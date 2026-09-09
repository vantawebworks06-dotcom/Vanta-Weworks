-- Portfolio / case study items. Publicly readable when published;
-- only admins can create, edit, or delete. `cover_image_path` stores a path
-- within the 'media' storage bucket (created in a later migration).

create table if not exists public.portfolio_items (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text,
  content text,
  cover_image_path text,
  client_name text,
  project_url text,
  is_published boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.portfolio_items is 'Portfolio/case-study items; public read when published, admin-managed.';

create index if not exists portfolio_items_display_order_idx
  on public.portfolio_items (display_order);

create trigger set_portfolio_items_updated_at
  before update on public.portfolio_items
  for each row execute function public.set_updated_at();

alter table public.portfolio_items enable row level security;

create policy "Published portfolio items are viewable by everyone"
  on public.portfolio_items for select
  using (is_published = true or public.is_admin());

create policy "Admins can insert portfolio items"
  on public.portfolio_items for insert
  with check (public.is_admin());

create policy "Admins can update portfolio items"
  on public.portfolio_items for update
  using (public.is_admin());

create policy "Admins can delete portfolio items"
  on public.portfolio_items for delete
  using (public.is_admin());
