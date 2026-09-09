-- Extend portfolio_items with the fields the public Portfolio section and
-- project detail page need: industry, services provided, tech stack, and
-- measurable results. All additions are nullable/defaulted, so this is
-- backward compatible with any existing rows.

alter table public.portfolio_items
  add column if not exists industry text,
  add column if not exists services_provided text[] not null default '{}',
  add column if not exists technologies text[] not null default '{}',
  add column if not exists results text,
  add column if not exists is_placeholder boolean not null default false;

comment on column public.portfolio_items.services_provided is 'Service slugs delivered for this project, e.g. {website-design,seo-optimization}.';
comment on column public.portfolio_items.technologies is 'Technology names used to build the project, e.g. {Next.js,Supabase}.';
comment on column public.portfolio_items.results is 'Measurable outcome achieved for the client, where available.';
comment on column public.portfolio_items.is_placeholder is 'True for illustrative concept entries seeded before real client work exists. The front end renders an "Example" badge on these rows. Set to false (or delete the row) once replaced with a real project.';

-- Seed a few illustrative concept projects so the Portfolio page and
-- reusable project-detail layout aren't empty before real client work
-- exists. These are clearly fictional and flagged via is_placeholder,
-- which the UI surfaces as a visible "Example" badge -- they are never
-- presented as real clients. Replace or delete via the admin dashboard
-- once real projects are added.
insert into public.portfolio_items
  (slug, title, summary, content, client_name, industry, services_provided, technologies, results, is_published, is_placeholder, display_order)
values
  (
    'concept-logistics-co',
    'Concept: Regional Freight Brand',
    'An illustrative concept for a modern logistics company website with an integrated quote-request flow.',
    'This is a concept build demonstrating our approach for a logistics/freight business: a clean technical brand identity, a fast marketing site, and a streamlined quote-request flow designed to convert visitors into leads.',
    'Example Concept',
    'Logistics & Freight',
    array['website-design', 'website-development', 'seo-optimization'],
    array['Next.js', 'Tailwind CSS', 'Supabase'],
    'Illustrative example -- replace with a real client outcome.',
    true,
    true,
    1
  ),
  (
    'concept-dtc-skincare',
    'Concept: DTC Skincare Storefront',
    'An illustrative concept for a premium e-commerce storefront for a direct-to-consumer brand.',
    'This is a concept build demonstrating our e-commerce approach: a refined visual system, a fast product catalog, and a streamlined checkout designed for a premium consumer brand.',
    'Example Concept',
    'E-commerce / Beauty',
    array['ecommerce-websites', 'website-design'],
    array['Next.js', 'Stripe', 'Supabase'],
    'Illustrative example -- replace with a real client outcome.',
    true,
    true,
    2
  ),
  (
    'concept-professional-services',
    'Concept: Professional Services Firm',
    'An illustrative concept for a credibility-focused business website for a professional services firm.',
    'This is a concept build demonstrating our approach for a professional services business: clear service pages, credibility signals, and a simple consultation-request flow.',
    'Example Concept',
    'Professional Services',
    array['business-websites', 'seo-optimization'],
    array['Next.js', 'Tailwind CSS'],
    'Illustrative example -- replace with a real client outcome.',
    true,
    true,
    3
  )
on conflict (slug) do nothing;
