-- Fase 3 — Oportunidades, compatibilidade e candidaturas.

create table if not exists opportunities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  opportunity_type text not null default 'estagio',
  modality text not null default 'remoto',
  location text,
  published boolean not null default false,
  created_by uuid not null references profiles (id) on delete cascade,
  institution_id uuid references institutions (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists opportunity_skills (
  opportunity_id uuid not null references opportunities (id) on delete cascade,
  skill_id uuid not null references skills (id) on delete cascade,
  primary key (opportunity_id, skill_id)
);

create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  opportunity_id uuid not null references opportunities (id) on delete cascade,
  user_id uuid not null references profiles (id) on delete cascade,
  status text not null default 'submitted' check (status in ('submitted', 'reviewing', 'accepted', 'rejected')),
  created_at timestamptz not null default now(),
  unique (opportunity_id, user_id)
);

alter table opportunities enable row level security;
alter table opportunity_skills enable row level security;
alter table applications enable row level security;

create policy "opportunities_select_published_or_owned"
  on opportunities for select to authenticated
  using (published = true or created_by = auth.uid());

create policy "opportunities_insert_company_or_institution"
  on opportunities for insert to authenticated
  with check (
    created_by = auth.uid()
    and exists (select 1 from profiles where id = auth.uid() and role in ('empresa', 'instituicao'))
  );

create policy "opportunities_update_owned"
  on opportunities for update to authenticated
  using (created_by = auth.uid()) with check (created_by = auth.uid());

create policy "opportunities_delete_owned"
  on opportunities for delete to authenticated
  using (created_by = auth.uid());

create policy "opportunity_skills_select_published_or_owned"
  on opportunity_skills for select to authenticated
  using (exists (select 1 from opportunities where id = opportunity_id and (published = true or created_by = auth.uid())));

create policy "opportunity_skills_insert_owner"
  on opportunity_skills for insert to authenticated
  with check (exists (select 1 from opportunities where id = opportunity_id and created_by = auth.uid()));

create policy "applications_select_own"
  on applications for select to authenticated
  using (user_id = auth.uid());

create policy "applications_insert_own"
  on applications for insert to authenticated
  with check (user_id = auth.uid());