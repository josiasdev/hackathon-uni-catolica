-- ============================================================
-- UniConnect — Schema inicial (Fase 0)
-- Execute no SQL Editor do Supabase após criar o projeto.
-- ============================================================

-- Habilitar extensão para busca aproximada (context.md §3.9)
create extension if not exists pg_trgm;

-- ============================================================
-- ENUMs
-- ============================================================

create type user_role as enum ('aluno', 'egresso', 'empresa', 'instituicao');

-- ============================================================
-- TABELAS
-- ============================================================

-- Perfis: espelha auth.users e adiciona dados do domínio
create table profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  role        user_role not null default 'aluno',
  full_name   text not null,
  avatar_url  text,
  bio         text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Instituições (universidades/faculdades parceiras)
create table institutions (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  logo_url    text,
  website     text,
  created_at  timestamptz not null default now()
);

-- Vínculo do perfil com instituição (aluno/egresso pertence a uma instituição)
alter table profiles
  add column institution_id uuid references institutions(id) on delete set null;

-- Cursos oferecidos por instituições
create table courses (
  id              uuid primary key default gen_random_uuid(),
  institution_id  uuid not null references institutions(id) on delete cascade,
  name            text not null,
  description     text,
  area            text,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now()
);

-- Competências / skills
create table skills (
  id    uuid primary key default gen_random_uuid(),
  name  text not null unique,
  slug  text not null unique
);

-- ============================================================
-- ÍNDICES
-- ============================================================

-- Busca aproximada por nome de skill (pg_trgm)
create index idx_skills_name_trgm on skills using gin (name gin_trgm_ops);

-- Busca por nome de instituição
create index idx_institutions_name on institutions using gin (name gin_trgm_ops);

-- ============================================================
-- RLS (Row Level Security)
-- ============================================================

alter table profiles enable row level security;
alter table institutions enable row level security;
alter table courses enable row level security;
alter table skills enable row level security;

-- Profiles: o usuário lê/edita seu próprio perfil
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

-- Institutions: leitura pública
create policy "Public can view institutions"
  on institutions for select
  using (true);

-- Courses: leitura pública
create policy "Public can view courses"
  on courses for select
  using (true);

-- Skills: leitura pública
create policy "Public can view skills"
  on skills for select
  using (true);

-- ============================================================
-- TRIGGER: auto-criar profile ao registrar usuário
-- ============================================================

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
