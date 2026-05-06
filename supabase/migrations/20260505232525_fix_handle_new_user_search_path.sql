-- Fix advisor 0011 (function_search_path_mutable) on public.handle_new_user.
-- Without an explicit search_path, the SECURITY DEFINER trigger fails with
-- "relation \"profiles\" does not exist" during /signup, breaking auth.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
begin
  insert into public.profiles (id, display_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'commuter')
  )
  on conflict (id) do nothing;
  return new;
exception
  when others then
    raise warning 'handle_new_user failed for %: %', new.id, sqlerrm;
    return new;  -- never block auth signup
end;
$$;

-- Advisors 0028/0029: stop anon/authenticated from RPC-calling this internal function.
-- Triggers on auth.users still fire because they run as the table owner, not the caller.
revoke execute on function public.handle_new_user() from anon, authenticated, public;
