-- AI Website Idea Visualizer: request/result/lead tables.
--
-- These are written exclusively by trusted server-side API routes using the
-- service_role key (which bypasses RLS), never directly by a browser client
-- with the anon key. RLS below is therefore admin-read-only / no public
-- policies at all -- the anon key alone cannot read, insert, or modify
-- these rows, which keeps generation traffic (and its API cost) confined
-- to our own rate-limited/validated API routes.

create table if not exists public.visualization_requests (
  id uuid primary key default gen_random_uuid(),
  description text not null,
  industry text,
  style text,
  colors text,
  target_audience text,
  features text,
  prompt_used text,
  status text not null default 'pending' check (status in ('pending', 'completed', 'failed')),
  error_message text,
  created_at timestamptz not null default now()
);

comment on table public.visualization_requests is 'AI Website Idea Visualizer inputs and outcome; written only by the server-side /api/visualize route via the service_role key.';

create index if not exists visualization_requests_created_at_idx
  on public.visualization_requests (created_at desc);

alter table public.visualization_requests enable row level security;

create policy "Admins can view visualization requests"
  on public.visualization_requests for select
  using (public.is_admin());

create table if not exists public.generated_concepts (
  id uuid primary key default gen_random_uuid(),
  visualization_request_id uuid not null references public.visualization_requests (id) on delete cascade,
  image_path text not null,
  created_at timestamptz not null default now()
);

comment on table public.generated_concepts is 'Generated concept images (stored in the "concepts" storage bucket), one per successful visualization request.';
comment on column public.generated_concepts.image_path is 'Object path within the "concepts" storage bucket.';

create index if not exists generated_concepts_request_id_idx
  on public.generated_concepts (visualization_request_id);

alter table public.generated_concepts enable row level security;

create policy "Admins can view generated concepts"
  on public.generated_concepts for select
  using (public.is_admin());

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  business text,
  project_description text,
  visualization_request_id uuid references public.visualization_requests (id) on delete set null,
  is_handled boolean not null default false,
  created_at timestamptz not null default now()
);

comment on table public.leads is 'Leads captured after an AI Visualizer session, optionally linked back to the concept that prompted them; written only by the server-side /api/leads route via the service_role key.';

create index if not exists leads_created_at_idx
  on public.leads (created_at desc);

alter table public.leads enable row level security;

create policy "Admins can view leads"
  on public.leads for select
  using (public.is_admin());

create policy "Admins can update leads"
  on public.leads for update
  using (public.is_admin());
