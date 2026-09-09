-- Fix an overly-strict guard from the profiles migration: prevent_role_escalation()
-- was blocking ALL role changes made outside of an authenticated RLS session
-- (auth.uid() is null) -- including a superuser/service-role UPDATE run
-- directly from the Supabase SQL Editor, which is the documented way to
-- bootstrap the very first admin account. The trigger silently reverted
-- `role` back to its old value with no visible error, making it look like
-- the UPDATE had no effect.
--
-- The fix: only block the change when there IS an authenticated user
-- context (auth.uid() is not null) and that user isn't already an admin --
-- i.e. block a logged-in user from self-promoting via the public API/RLS
-- path, but allow a direct database-level UPDATE (SQL Editor, service_role)
-- to set role freely, same as any other superuser DB operation.

create or replace function public.prevent_role_escalation()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.role is distinct from old.role
     and auth.uid() is not null
     and not public.is_admin() then
    new.role = old.role;
  end if;
  return new;
end;
$$;
