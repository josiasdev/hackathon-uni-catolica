-- Fase 6 — Processos seletivos e acompanhamento de etapas.

create table if not exists selections (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  published boolean not null default false,
  created_by uuid not null references profiles (id) on delete cascade,
  institution_id uuid references institutions (id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists selection_stages (
  id uuid primary key default gen_random_uuid(),
  selection_id uuid not null references selections (id) on delete cascade,
  title text not null,
  position integer not null check (position > 0),
  unique (selection_id, position)
);

create table if not exists selection_applications (
  id uuid primary key default gen_random_uuid(),
  selection_id uuid not null references selections (id) on delete cascade,
  user_id uuid not null references profiles (id) on delete cascade,
  current_stage_id uuid references selection_stages (id) on delete set null,
  status text not null default 'in_progress' check (status in ('in_progress', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  unique (selection_id, user_id)
);

alter table selections enable row level security;
alter table selection_stages enable row level security;
alter table selection_applications enable row level security;

create policy "selections_select_published_or_owned" on selections for select to authenticated using (published = true or created_by = auth.uid());
create policy "selections_insert_authenticated" on selections for insert to authenticated with check (created_by = auth.uid());
create policy "selections_update_owned" on selections for update to authenticated using (created_by = auth.uid()) with check (created_by = auth.uid());
create policy "selection_stages_select_visible" on selection_stages for select to authenticated using (exists (select 1 from selections where id = selection_id and (published = true or created_by = auth.uid())));
create policy "selection_stages_insert_owner" on selection_stages for insert to authenticated with check (exists (select 1 from selections where id = selection_id and created_by = auth.uid()));
create policy "selection_applications_select_own" on selection_applications for select to authenticated using (user_id = auth.uid() or exists (select 1 from selections where id = selection_id and created_by = auth.uid()));
create policy "selection_applications_insert_own" on selection_applications for insert to authenticated with check (user_id = auth.uid());