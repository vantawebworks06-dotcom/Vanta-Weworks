-- Associate submissions with the signed-in user who made them (nullable --
-- anonymous submissions from visitors who aren't logged in remain fully
-- supported), and let a user read back their own rows. This is what
-- powers the customer-facing /dashboard: a signed-in visitor sees their
-- own inquiries, AI Visualizer concepts, and project leads.

alter table public.contact_submissions
  add column if not exists user_id uuid references auth.users (id) on delete set null;

alter table public.leads
  add column if not exists user_id uuid references auth.users (id) on delete set null;

alter table public.visualization_requests
  add column if not exists user_id uuid references auth.users (id) on delete set null;

create index if not exists contact_submissions_user_id_idx on public.contact_submissions (user_id);
create index if not exists leads_user_id_idx on public.leads (user_id);
create index if not exists visualization_requests_user_id_idx on public.visualization_requests (user_id);

create policy "Users can view their own contact submissions"
  on public.contact_submissions for select
  using (auth.uid() = user_id);

create policy "Users can view their own leads"
  on public.leads for select
  using (auth.uid() = user_id);

create policy "Users can view their own visualization requests"
  on public.visualization_requests for select
  using (auth.uid() = user_id);
