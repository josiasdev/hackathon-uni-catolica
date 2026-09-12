-- Fase 2 — Conclusão: competências, trajetória e certificação.

create table if not exists course_skills (
  course_id uuid not null references courses (id) on delete cascade,
  skill_id uuid not null references skills (id) on delete cascade,
  primary key (course_id, skill_id)
);

create table if not exists certifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  course_id uuid not null references courses (id) on delete cascade,
  verification_code text not null unique,
  issued_at timestamptz not null default now(),
  unique (user_id, course_id)
);

alter table course_skills enable row level security;
alter table certifications enable row level security;

create policy "course_skills_select_authenticated"
  on course_skills for select
  to authenticated
  using (exists (select 1 from courses where id = course_id and (published = true or created_by = auth.uid())));

create policy "course_skills_insert_course_owner"
  on course_skills for insert
  to authenticated
  with check (exists (select 1 from courses where id = course_id and created_by = auth.uid()));

create policy "certifications_select_own"
  on certifications for select
  to authenticated
  using (user_id = auth.uid());

create policy "certifications_insert_own"
  on certifications for insert
  to authenticated
  with check (user_id = auth.uid());