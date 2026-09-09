-- Blog posts. Publicly readable when published; only admins can create,
-- edit, or delete. `cover_image_path` stores a path within the 'media'
-- storage bucket (created in a later migration).

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references public.profiles (id) on delete set null,
  slug text not null unique,
  title text not null,
  excerpt text,
  content text not null,
  cover_image_path text,
  is_published boolean not null default false,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.posts is 'Blog posts; public read when published, admin-managed.';

create index if not exists posts_published_at_idx
  on public.posts (published_at desc);

create trigger set_posts_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

alter table public.posts enable row level security;

create policy "Published posts are viewable by everyone"
  on public.posts for select
  using (is_published = true or public.is_admin());

create policy "Admins can insert posts"
  on public.posts for insert
  with check (public.is_admin());

create policy "Admins can update posts"
  on public.posts for update
  using (public.is_admin());

create policy "Admins can delete posts"
  on public.posts for delete
  using (public.is_admin());
