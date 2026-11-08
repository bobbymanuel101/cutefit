-- Run this once in Supabase (SQL Editor) so each person's CuteFit data is saved online
-- and follows them to another phone. Row Level Security makes sure every user can only
-- ever read and change their own row. Deleting an account deletes its row too.

create table if not exists public.user_data (
  user_id uuid primary key references auth.users (id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_data enable row level security;

create policy "Users read their own data"
  on public.user_data for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users insert their own data"
  on public.user_data for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users update their own data"
  on public.user_data for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users delete their own data"
  on public.user_data for delete to authenticated
  using ((select auth.uid()) = user_id);
