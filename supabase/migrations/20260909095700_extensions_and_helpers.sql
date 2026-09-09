-- Extensions and shared helper functions used by later migrations.

create extension if not exists pgcrypto with schema extensions;

-- Returns true if the currently authenticated user (auth.uid()) has the
-- 'admin' role in public.profiles. Used across RLS policies so admin checks
-- stay in one place instead of being repeated in every policy definition.
-- Defined here (before public.profiles exists) as a forward declaration is
-- not possible in Postgres, so this function is created in the profiles
-- migration instead once the table it depends on exists. See 0002_profiles.

-- Generic trigger function: keeps an `updated_at` column current on UPDATE.
-- Any table that wants this behavior should have an `updated_at timestamptz`
-- column and a trigger: `before update ... execute function public.set_updated_at()`.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;
