-- Skema awal Kursus Data Analyst.
-- Jalankan sekali di Supabase: Dashboard > SQL Editor > New query > tempel isi file ini > Run.

create table public.item_state (
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  item_id text not null,
  completed_at timestamptz,
  quiz jsonb not null default '{}'::jsonb,     -- { "questions": [3, 7], "optionOrder": { "3": [2, 0, 1, 3] }, "answers": { "3": 1 }, "seen": [3, 7] }
  rubric jsonb not null default '{}'::jsonb,   -- { "0": true, "3": true }
  note text,
  link text,
  updated_at timestamptz not null default now(),
  primary key (user_id, item_id)
);

create table public.settings (
  user_id uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  display_name text,
  updated_at timestamptz not null default now()
);

alter table public.item_state enable row level security;
alter table public.settings enable row level security;

create policy "own item_state" on public.item_state
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "own settings" on public.settings
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
