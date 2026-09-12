-- Fase 7 — Mentorias entre estudantes e egressos/profissionais.

create table if not exists mentor_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references profiles (id) on delete cascade,
  headline text not null,
  expertise text[] not null default '{}',
  availability text,
  accepting_requests boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists mentorship_requests (
  id uuid primary key default gen_random_uuid(),
  mentor_id uuid not null references mentor_profiles (id) on delete cascade,
  mentee_id uuid not null references profiles (id) on delete cascade,
  message text,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined', 'completed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (mentor_id <> mentee_id),
  unique (mentor_id, mentee_id)
);

alter table mentor_profiles enable row level security;
alter table mentorship_requests enable row level security;

create policy "mentor_profiles_select_authenticated" on mentor_profiles for select to authenticated using (true);
create policy "mentor_profiles_insert_own" on mentor_profiles for insert to authenticated with check (user_id = auth.uid());
create policy "mentor_profiles_update_own" on mentor_profiles for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "mentorship_requests_select_participant" on mentorship_requests for select to authenticated using (mentee_id = auth.uid() or exists (select 1 from mentor_profiles where id = mentor_id and user_id = auth.uid()));
create policy "mentorship_requests_insert_mentee" on mentorship_requests for insert to authenticated with check (mentee_id = auth.uid());
create policy "mentorship_requests_update_mentor" on mentorship_requests for update to authenticated using (exists (select 1 from mentor_profiles where id = mentor_id and user_id = auth.uid())) with check (exists (select 1 from mentor_profiles where id = mentor_id and user_id = auth.uid()));