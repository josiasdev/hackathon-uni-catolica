-- ============================================================
-- UniConnect — Schema Fase 0 + 1 + 2 + 3 (MVP completo)
-- Execute no SQL Editor do Supabase após criar o projeto.
-- ============================================================

create extension if not exists pg_trgm;

-- ============================================================
-- ENUMs
-- ============================================================

create type user_role as enum ('aluno', 'egresso', 'empresa', 'instituicao');

create type source_type as enum (
  'curso', 'certificacao', 'projeto', 'evento', 'selecao', 'experiencia', 'manual'
);

create type enrollment_status as enum ('matriculado', 'em_andamento', 'concluido', 'cancelado');

create type opportunity_type as enum (
  'emprego', 'estagio', 'trainee', 'freelance', 'bolsa', 'pesquisa',
  'extensao', 'monitoria', 'projeto', 'voluntariado', 'intercambio',
  'hackathon', 'selecao', 'outro'
);

create type opportunity_modality as enum ('presencial', 'remoto', 'hibrido');

create type application_status as enum ('candidatado', 'em_analise', 'aprovado', 'reprovado', 'desistiu');

-- ============================================================
-- TABELAS — Fase 0
-- ============================================================

create table institutions (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  logo_url    text,
  website     text,
  created_at  timestamptz not null default now()
);

create table courses (
  id              uuid primary key default gen_random_uuid(),
  institution_id  uuid not null references institutions(id) on delete cascade,
  name            text not null,
  description     text,
  area            text,
  workload_hours  smallint check (workload_hours > 0),
  is_active       boolean not null default true,
  created_at      timestamptz not null default now()
);

create table profiles (
  id              uuid primary key references auth.users(id) on delete cascade,
  role            user_role not null default 'aluno',
  full_name       text not null,
  avatar_url      text,
  bio             text,
  institution_id  uuid references institutions(id) on delete set null,
  course_id       uuid references courses(id) on delete set null,
  semester        smallint check (semester >= 1 and semester <= 20),
  enrollment_year smallint check (enrollment_year >= 1900 and enrollment_year <= 2100),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table skills (
  id    uuid primary key default gen_random_uuid(),
  name  text not null unique,
  slug  text not null unique
);

-- ============================================================
-- TABELAS — Fase 1
-- ============================================================

create table user_skills (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references profiles(id) on delete cascade,
  skill_id      uuid not null references skills(id) on delete cascade,
  source_type   source_type not null default 'manual',
  source_id     uuid,
  acquired_at   timestamptz not null default now(),
  unique(user_id, skill_id, source_type, source_id)
);

create table trajectory_events (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references profiles(id) on delete cascade,
  type          text not null,
  title         text not null,
  description   text,
  date          date not null default current_date,
  source_type   source_type,
  source_id     uuid,
  metadata      jsonb default '{}',
  created_at    timestamptz not null default now()
);

create table achievements (
  id            uuid primary key default gen_random_uuid(),
  name          text not null unique,
  description   text not null,
  icon          text,
  category      text,
  criteria      jsonb not null default '{}',
  created_at    timestamptz not null default now()
);

create table user_achievements (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references profiles(id) on delete cascade,
  achievement_id  uuid not null references achievements(id) on delete cascade,
  unlocked_at     timestamptz not null default now(),
  unique(user_id, achievement_id)
);

-- ============================================================
-- TABELAS — Fase 2: Academia
-- ============================================================

create table learning_tracks (
  id              uuid primary key default gen_random_uuid(),
  institution_id  uuid not null references institutions(id) on delete cascade,
  name            text not null,
  description     text,
  area            text,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now()
);

create table track_courses (
  id            uuid primary key default gen_random_uuid(),
  track_id      uuid not null references learning_tracks(id) on delete cascade,
  course_id     uuid not null references courses(id) on delete cascade,
  position      smallint not null default 0,
  unique(track_id, course_id)
);

create table course_skills (
  id          uuid primary key default gen_random_uuid(),
  course_id   uuid not null references courses(id) on delete cascade,
  skill_id    uuid not null references skills(id) on delete cascade,
  unique(course_id, skill_id)
);

create table enrollments (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references profiles(id) on delete cascade,
  course_id     uuid not null references courses(id) on delete cascade,
  track_id      uuid references learning_tracks(id) on delete set null,
  status        enrollment_status not null default 'matriculado',
  enrolled_at   timestamptz not null default now(),
  completed_at  timestamptz,
  unique(user_id, course_id)
);

create table certifications (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references profiles(id) on delete cascade,
  course_id         uuid not null references courses(id) on delete cascade,
  enrollment_id     uuid not null references enrollments(id) on delete cascade,
  verification_code text not null unique,
  issued_at         timestamptz not null default now(),
  workload_hours    smallint
);

-- ============================================================
-- TABELAS — Fase 3: Oportunidades, busca e compatibilidade
-- ============================================================

-- Oportunidades (vagas, estágios, bolsas, etc.)
create table opportunities (
  id                uuid primary key default gen_random_uuid(),
  publisher_id      uuid not null references profiles(id) on delete cascade,
  institution_id    uuid references institutions(id) on delete set null,
  title             text not null,
  description       text,
  type              opportunity_type not null default 'outro',
  modality          opportunity_modality not null default 'presencial',
  location          text,
  workload_hours    smallint check (workload_hours > 0),
  compensation      text,
  is_active         boolean not null default true,
  created_at        timestamptz not null default now()
);

-- Competências exigidas pela oportunidade
create table opportunity_skills (
  id              uuid primary key default gen_random_uuid(),
  opportunity_id  uuid not null references opportunities(id) on delete cascade,
  skill_id        uuid not null references skills(id) on delete cascade,
  unique(opportunity_id, skill_id)
);

-- Candidaturas
create table applications (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references profiles(id) on delete cascade,
  opportunity_id  uuid not null references opportunities(id) on delete cascade,
  status          application_status not null default 'candidatado',
  message         text,
  applied_at      timestamptz not null default now(),
  unique(user_id, opportunity_id)
);

-- ============================================================
-- ÍNDICES
-- ============================================================

create index idx_skills_name_trgm on skills using gin (name gin_trgm_ops);
create index idx_institutions_name on institutions using gin (name gin_trgm_ops);
create index idx_user_skills_user on user_skills(user_id);
create index idx_user_skills_skill on user_skills(skill_id);
create index idx_trajectory_events_user on trajectory_events(user_id);
create index idx_trajectory_events_date on trajectory_events(user_id, date desc);
create index idx_user_achievements_user on user_achievements(user_id);
create index idx_learning_tracks_institution on learning_tracks(institution_id);
create index idx_track_courses_track on track_courses(track_id);
create index idx_track_courses_course on track_courses(course_id);
create index idx_enrollments_user on enrollments(user_id);
create index idx_enrollments_course on enrollments(course_id);
create index idx_certifications_user on certifications(user_id);
create index idx_certifications_verification on certifications(verification_code);
create index idx_opportunities_publisher on opportunities(publisher_id);
create index idx_opportunities_type on opportunities(type);
create index idx_opportunities_modality on opportunities(modality);
create index idx_opportunities_title_trgm on opportunities using gin (title gin_trgm_ops);
create index idx_opportunity_skills_opportunity on opportunity_skills(opportunity_id);
create index idx_opportunity_skills_skill on opportunity_skills(skill_id);
create index idx_applications_user on applications(user_id);
create index idx_applications_opportunity on applications(opportunity_id);

-- ============================================================
-- RLS (Row Level Security)
-- ============================================================

alter table profiles enable row level security;
alter table institutions enable row level security;
alter table courses enable row level security;
alter table skills enable row level security;
alter table user_skills enable row level security;
alter table trajectory_events enable row level security;
alter table achievements enable row level security;
alter table user_achievements enable row level security;
alter table learning_tracks enable row level security;
alter table track_courses enable row level security;
alter table course_skills enable row level security;
alter table enrollments enable row level security;
alter table certifications enable row level security;
alter table opportunities enable row level security;
alter table opportunity_skills enable row level security;
alter table applications enable row level security;

-- Profiles
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

-- Institutions: leitura pública
create policy "Public can view institutions" on institutions for select using (true);

-- Courses: leitura pública
create policy "Public can view courses" on courses for select using (true);

-- Skills: leitura pública
create policy "Public can view skills" on skills for select using (true);

-- User skills
create policy "Users can view own skills" on user_skills for select using (auth.uid() = user_id);
create policy "Users can insert own skills" on user_skills for insert with check (auth.uid() = user_id);
create policy "Users can delete own skills" on user_skills for delete using (auth.uid() = user_id);

-- Trajectory events
create policy "Users can view own trajectory" on trajectory_events for select using (auth.uid() = user_id);
create policy "Users can insert own trajectory" on trajectory_events for insert with check (auth.uid() = user_id);
create policy "Users can delete own trajectory" on trajectory_events for delete using (auth.uid() = user_id);

-- Achievements: leitura pública
create policy "Public can view achievements" on achievements for select using (true);

-- User achievements
create policy "Users can view own achievements" on user_achievements for select using (auth.uid() = user_id);
create policy "Users can insert own achievements" on user_achievements for insert with check (auth.uid() = user_id);

-- Learning tracks: leitura pública
create policy "Public can view learning tracks" on learning_tracks for select using (true);

-- Track courses: leitura pública
create policy "Public can view track courses" on track_courses for select using (true);

-- Course skills: leitura pública
create policy "Public can view course skills" on course_skills for select using (true);

-- Enrollments
create policy "Users can view own enrollments" on enrollments for select using (auth.uid() = user_id);
create policy "Users can insert own enrollments" on enrollments for insert with check (auth.uid() = user_id);
create policy "Users can update own enrollments" on enrollments for update using (auth.uid() = user_id);

-- Certifications
create policy "Users can view own certifications" on certifications for select using (auth.uid() = user_id);
create policy "Public can verify certifications" on certifications for select using (true);

-- Opportunities: leitura pública
create policy "Public can view opportunities" on opportunities for select using (true);
create policy "Publishers can manage own opportunities" on opportunities for all using (auth.uid() = publisher_id);

-- Opportunity skills: leitura pública
create policy "Public can view opportunity skills" on opportunity_skills for select using (true);

-- Applications
create policy "Users can view own applications" on applications for select using (auth.uid() = user_id);
create policy "Users can insert own applications" on applications for insert with check (auth.uid() = user_id);
create policy "Users can update own applications" on applications for update using (auth.uid() = user_id);
create policy "Publishers can view applications for their opportunities"
  on applications for select using (
    exists (
      select 1 from opportunities
      where opportunities.id = applications.opportunity_id
        and opportunities.publisher_id = auth.uid()
    )
  );

-- ============================================================
-- FUNCTIONS
-- ============================================================

-- Auto-criar profile ao registrar usuário
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.email),
    coalesce((new.raw_user_meta_data ->> 'role')::user_role, 'aluno')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- Gerar código de verificação único para certificação
create or replace function generate_verification_code()
returns text as $$
declare
  chars text := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result text := '';
  i int;
begin
  for i in 1..12 loop
    result := result || chars[ceil(random() * length(chars))::int];
  end loop;
  return result;
end;
$$ language plpgsql;

-- Concluir curso
create or replace function complete_course(p_user_id uuid, p_course_id uuid)
returns void as $$
declare
  v_enrollment_id uuid;
  v_verification_code text;
  v_course_name text;
  v_workload smallint;
begin
  insert into enrollments (user_id, course_id, status, completed_at)
  values (p_user_id, p_course_id, 'concluido', now())
  on conflict (user_id, course_id) do update
    set status = 'concluido', completed_at = now()
  returning id into v_enrollment_id;

  select name, workload_hours into v_course_name, v_workload
  from courses where id = p_course_id;

  v_verification_code := generate_verification_code();

  insert into certifications (user_id, course_id, enrollment_id, verification_code, workload_hours)
  values (p_user_id, p_course_id, v_enrollment_id, v_verification_code, v_workload);

  insert into trajectory_events (user_id, type, title, description, source_type, source_id)
  values (p_user_id, 'curso', 'Curso concluído: ' || v_course_name, null, 'curso', p_course_id);

  insert into user_skills (user_id, skill_id, source_type, source_id)
  select p_user_id, cs.skill_id, 'curso', p_course_id
  from course_skills cs
  where cs.course_id = p_course_id
  on conflict do nothing;
end;
$$ language plpgsql security definer;

-- Calcular compatibilidade entre usuário e oportunidade (0-100%)
create or replace function calculate_compatibility(p_user_id uuid, p_opportunity_id uuid)
returns integer as $$
declare
  v_required integer;
  v_matched integer;
begin
  -- Contar skills exigidas pela oportunidade
  select count(*) into v_required
  from opportunity_skills
  where opportunity_id = p_opportunity_id;

  if v_required = 0 then
    return 100;
  end if;

  -- Contar skills que o usuário possui
  select count(*) into v_matched
  from opportunity_skills os
  inner join user_skills us on us.skill_id = os.skill_id
  where os.opportunity_id = p_opportunity_id
    and us.user_id = p_user_id;

  return round((v_matched::numeric / v_required::numeric) * 100)::integer;
end;
$$ language plpgsql security definer;

-- Busca unificada com pg_trgm (tolerância a erro de digitação)
create or replace function unified_search(p_query text)
returns table (
  entity_type text,
  entity_id uuid,
  entity_name text,
  entity_description text,
  relevance real
) as $$
begin
  return query
  -- Cursos
  select
    'curso'::text as entity_type,
    c.id as entity_id,
    c.name as entity_name,
    c.description as entity_description,
    similarity(c.name, p_query) as relevance
  from courses c
  where c.is_active and c.name % p_query

  union all

  -- Skills
  select
    'skill'::text,
    s.id,
    s.name,
    null::text,
    similarity(s.name, p_query)
  from skills s
  where s.name % p_query

  union all

  -- Oportunidades
  select
    'oportunidade'::text,
    o.id,
    o.title,
    o.description,
    similarity(o.title, p_query)
  from opportunities o
  where o.is_active and o.title % p_query

  order by relevance desc
  limit 20;
end;
$$ language plpgsql security definer;

-- ============================================================
-- SEED: conquistas iniciais
-- ============================================================

insert into achievements (name, description, icon, category, criteria) values
  ('Primeiro Passo', 'Completou seu perfil pela primeira vez', 'User', 'perfil', '{"type": "profile_complete"}'),
  ('Primeiro Curso', 'Concluiu seu primeiro curso', 'GraduationCap', 'academia', '{"type": "course_complete", "count": 1}'),
  ('Colecionador', 'Possui 5 ou mais competências', 'Award', 'competencias', '{"type": "skill_count", "min": 5}'),
  ('Iniciante', 'Desbloqueou 3 conquistas', 'Trophy', 'geral', '{"type": "achievement_count", "min": 3}'),
  ('Trajetória', 'Possui 5 ou mais eventos na trajetória', 'Route', 'trajetoria', '{"type": "trajectory_count", "min": 5}'),
  ('Poliglota Tech', 'Possui competências em 3 ou mais áreas', 'Layers', 'competencias', '{"type": "skill_categories", "min": 3}'),
  ('Candidato', 'Candidatou-se a uma oportunidade', 'Send', 'oportunidades', '{"type": "application_count", "min": 1}'),
  ('Proativo', 'Candidatou-se a 3 ou mais oportunidades', 'Rocket', 'oportunidades', '{"type": "application_count", "min": 3}');
