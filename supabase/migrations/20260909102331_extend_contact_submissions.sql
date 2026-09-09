-- Extend contact_submissions to capture full project-inquiry detail from
-- the public Contact page (which doubles as the site's quote-request
-- form — see project notes). All additions are nullable, so this is
-- backward compatible with any existing rows.

alter table public.contact_submissions
  add column if not exists company text,
  add column if not exists website_url text,
  add column if not exists service_interested text,
  add column if not exists budget_range text,
  add column if not exists preferred_timeline text;

comment on column public.contact_submissions.message is 'Project description provided by the visitor.';
comment on column public.contact_submissions.service_interested is 'Service slug the visitor selected, e.g. website-design.';
