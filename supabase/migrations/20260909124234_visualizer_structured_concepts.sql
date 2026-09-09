-- Extend the AI Visualizer schema to support structured website concepts
-- (theme + sections, rendered live by React preview components) alongside
-- the original image-based flow, plus the fuller lead form (budget/timeline).
-- All additions are nullable/defaulted, so existing rows are unaffected.

alter table public.visualization_requests
  add column if not exists business_name text,
  add column if not exists config jsonb,
  add column if not exists edit_count integer not null default 0;

comment on column public.visualization_requests.config is 'Current structured WebsiteConcept JSON (theme + sections) for this session, validated server-side against the Zod schema before being stored.';
comment on column public.visualization_requests.edit_count is 'Number of AI edit requests applied to this session, for basic abuse visibility.';

alter table public.leads
  add column if not exists budget_range text,
  add column if not exists timeline text;
