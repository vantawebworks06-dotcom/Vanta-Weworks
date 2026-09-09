-- Client testimonials. Public read when published; only admins can manage.
--
-- is_placeholder flags illustrative example testimonials seeded before real
-- client feedback exists. The front end renders a visible "Example" badge
-- on these rows -- they are never presented as genuine endorsements.
-- Replace or delete via the admin dashboard once real testimonials exist.

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  client_name text not null,
  client_title text,
  company text,
  quote text not null,
  rating integer not null default 5 check (rating between 1 and 5),
  avatar_url text,
  is_published boolean not null default true,
  is_placeholder boolean not null default false,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.testimonials is 'Client testimonials; public read when published, admin-managed.';
comment on column public.testimonials.is_placeholder is 'True for illustrative example testimonials seeded before real client feedback exists. The front end renders an "Example" badge on these rows.';

create index if not exists testimonials_display_order_idx
  on public.testimonials (display_order);

create trigger set_testimonials_updated_at
  before update on public.testimonials
  for each row execute function public.set_updated_at();

alter table public.testimonials enable row level security;

create policy "Published testimonials are viewable by everyone"
  on public.testimonials for select
  using (is_published = true or public.is_admin());

create policy "Admins can insert testimonials"
  on public.testimonials for insert
  with check (public.is_admin());

create policy "Admins can update testimonials"
  on public.testimonials for update
  using (public.is_admin());

create policy "Admins can delete testimonials"
  on public.testimonials for delete
  using (public.is_admin());

insert into public.testimonials
  (client_name, client_title, company, quote, rating, is_published, is_placeholder, display_order)
values
  (
    'Example Client',
    'Owner',
    'Example Concept Business',
    'This is a placeholder testimonial demonstrating the layout and tone of a real client quote. Replace it with genuine client feedback once available.',
    5,
    true,
    true,
    1
  ),
  (
    'Example Client',
    'Marketing Director',
    'Example Concept Business',
    'Placeholder testimonial text showing how a longer client quote will wrap and display within this card layout.',
    5,
    true,
    true,
    2
  ),
  (
    'Example Client',
    'Founder',
    'Example Concept Business',
    'Another placeholder entry so the testimonial carousel/grid can be previewed with multiple cards before real reviews are collected.',
    4,
    true,
    true,
    3
  );
