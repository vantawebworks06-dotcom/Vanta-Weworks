-- The public "anyone can insert" policy on contact_submissions predates
-- the user_id column added for the customer dashboard. Without a check,
-- an authenticated visitor could set user_id to someone else's id via a
-- direct API call, making their submission appear on another user's
-- dashboard. Replace the policy so user_id must be null (anonymous) or
-- exactly the caller's own id.

drop policy if exists "Anyone can submit the contact form" on public.contact_submissions;

create policy "Anyone can submit the contact form"
  on public.contact_submissions for insert
  to anon, authenticated
  with check (user_id is null or user_id = auth.uid());
