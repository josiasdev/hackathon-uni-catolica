-- Fase 1 — Perfil acadêmico: dados que alimentam a trajetória do usuário.

alter table profiles
  add column if not exists bio text,
  add column if not exists course text,
  add column if not exists semester integer check (semester between 1 and 20),
  add column if not exists avatar_url text;

create table if not exists user_skills (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  skill_id uuid not null references skills (id) on delete cascade,
  origin_type text not null default 'manual',
  origin_id uuid,
  created_at timestamptz not null default now(),
  unique (user_id, skill_id)
);

create table if not exists trajectory_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  type text not null,
  title text not null,
  description text,
  occurred_at timestamptz not null default now(),
  origin_id uuid,
  created_at timestamptz not null default now()
);

alter table user_skills enable row level security;
alter table trajectory_events enable row level security;

create policy "user_skills_select_own"
  on user_skills for select
  to authenticated
  using (auth.uid() = user_id);

create policy "user_skills_insert_own"
  on user_skills for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "user_skills_delete_own"
  on user_skills for delete
  to authenticated
  using (auth.uid() = user_id);

create policy "trajectory_events_select_own"
  on trajectory_events for select
  to authenticated
  using (auth.uid() = user_id);

create policy "trajectory_events_insert_own"
  on trajectory_events for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "skills_insert_authenticated"
  on skills for insert
  to authenticated
  with check (length(trim(name)) between 2 and 80);