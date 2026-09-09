-- FAQ items. Public read when published; only admins can manage.
-- Seeded with genuine, generally-true agency answers (not attributed to any
-- fictional person), so no placeholder flag is needed here -- content
-- should simply be reviewed/edited for accuracy before launch.

create table if not exists public.faq_items (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  category text,
  is_published boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.faq_items is 'Frequently asked questions; public read when published, admin-managed.';

create index if not exists faq_items_display_order_idx
  on public.faq_items (display_order);

create trigger set_faq_items_updated_at
  before update on public.faq_items
  for each row execute function public.set_updated_at();

alter table public.faq_items enable row level security;

create policy "Published FAQ items are viewable by everyone"
  on public.faq_items for select
  using (is_published = true or public.is_admin());

create policy "Admins can insert FAQ items"
  on public.faq_items for insert
  with check (public.is_admin());

create policy "Admins can update FAQ items"
  on public.faq_items for update
  using (public.is_admin());

create policy "Admins can delete FAQ items"
  on public.faq_items for delete
  using (public.is_admin());

insert into public.faq_items (question, answer, category, display_order)
values
  (
    'How long does it take to build a website?',
    'Most business websites take 2-4 weeks from kickoff to launch, depending on scope. Landing pages can move faster; e-commerce or custom web applications typically take longer. We provide a specific timeline estimate after discovery.',
    'Timeline',
    1
  ),
  (
    'How much does a website cost?',
    'Our packages start at $1,500 for a focused business site, with most professional sites falling in the $1,500-$3,500 range. E-commerce and custom applications are quoted based on scope. See our Pricing page for a full breakdown.',
    'Pricing',
    2
  ),
  (
    'Do you handle hosting and domains?',
    'Yes. We can set up and manage hosting and deployment for you, or work with hosting you already have. Domain registration is typically handled by the client, and we''re happy to guide you through it.',
    'Hosting',
    3
  ),
  (
    'Will my website work on mobile devices?',
    'Every site we build is fully responsive and tested across mobile, tablet, and desktop before launch -- it''s a core part of our process, not an add-on.',
    'Development',
    4
  ),
  (
    'Do you offer SEO?',
    'Yes. Every site includes on-page SEO fundamentals -- metadata, semantic structure, sitemaps, and performance optimization. Dedicated ongoing SEO campaigns are available separately for businesses that want active search growth.',
    'SEO',
    5
  ),
  (
    'What happens after my website launches?',
    'We offer ongoing website maintenance plans covering updates, monitoring, backups, and support. Our Professional and Premium packages include an initial post-launch support window as well.',
    'Maintenance',
    6
  ),
  (
    'How many revisions are included?',
    'Our Starter package includes 2 rounds of revisions and Professional includes 4. Additional revision rounds can be added if needed -- we''ll always flag this before it affects your timeline or budget.',
    'Revisions',
    7
  ),
  (
    'Can you build custom functionality beyond a template?',
    'Yes -- that''s what our Custom Web Applications service is for. Booking systems, portals, dashboards, and integrations with third-party tools are all things we build regularly.',
    'Custom Functionality',
    8
  );
