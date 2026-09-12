-- Fase 2 — Academia: cursos publicados e matrículas.

create table if not exists courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  workload_hours integer check (workload_hours is null or workload_hours > 0),
  published boolean not null default false,
  created_by uuid not null references profiles (id) on delete cascade,
  institution_id uuid references institutions (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists course_enrollments (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses (id) on delete cascade,
  user_id uuid not null references profiles (id) on delete cascade,
  status text not null default 'enrolled' check (status in ('enrolled', 'completed')),
  enrolled_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (course_id, user_id)
);

alter table courses enable row level security;
alter table course_enrollments enable row level security;

create policy "courses_select_published_or_owned"
  on courses for select
  to authenticated
  using (published = true or created_by = auth.uid());

create policy "courses_insert_institution"
  on courses for insert
  to authenticated
  with check (
    created_by = auth.uid()
    and exists (select 1 from profiles where id = auth.uid() and role = 'instituicao')
  );

create policy "courses_update_owned"
  on courses for update
  to authenticated
  using (created_by = auth.uid())
  with check (created_by = auth.uid());

create policy "courses_delete_owned"
  on courses for delete
  to authenticated
  using (created_by = auth.uid());

create policy "course_enrollments_select_own"
  on course_enrollments for select
  to authenticated
  using (user_id = auth.uid());

create policy "course_enrollments_insert_own"
  on course_enrollments for insert
  to authenticated
  with check (user_id = auth.uid());

create policy "course_enrollments_update_own"
  on course_enrollments for update
  to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());