-- Fase 4 — Projetos e formação de equipes.

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  modality text not null default 'remoto',
  published boolean not null default false,
  created_by uuid not null references profiles (id) on delete cascade,
  institution_id uuid references institutions (id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists project_roles (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects (id) on delete cascade,
  title text not null,
  description text,
  spots integer not null default 1 check (spots > 0),
  skill_names text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists project_applications (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects (id) on delete cascade,
  role_id uuid references project_roles (id) on delete set null,
  user_id uuid not null references profiles (id) on delete cascade,
  status text not null default 'interested' check (status in ('interested', 'invited', 'accepted', 'rejected')),
  created_at timestamptz not null default now(),
  unique (project_id, user_id)
);

alter table projects enable row level security;
alter table project_roles enable row level security;
alter table project_applications enable row level security;

create policy "projects_select_published_or_owned" on projects for select to authenticated using (published = true or created_by = auth.uid());
create policy "projects_insert_authenticated" on projects for insert to authenticated with check (created_by = auth.uid());
create policy "projects_update_owned" on projects for update to authenticated using (created_by = auth.uid()) with check (created_by = auth.uid());
create policy "projects_delete_owned" on projects for delete to authenticated using (created_by = auth.uid());

create policy "project_roles_select_visible" on project_roles for select to authenticated using (exists (select 1 from projects where id = project_id and (published = true or created_by = auth.uid())));
create policy "project_roles_insert_owner" on project_roles for insert to authenticated with check (exists (select 1 from projects where id = project_id and created_by = auth.uid()));

create policy "project_applications_select_own" on project_applications for select to authenticated using (user_id = auth.uid() or exists (select 1 from projects where id = project_id and created_by = auth.uid()));
create policy "project_applications_insert_own" on project_applications for insert to authenticated with check (user_id = auth.uid());