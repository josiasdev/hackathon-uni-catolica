-- Fase 0 — Fundação: extensões, tabelas base, trigger de novo usuário e RLS.

create extension if not exists pg_trgm;

create table institutions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  role text not null check (role in ('aluno', 'egresso', 'empresa', 'instituicao')),
  institution_id uuid references institutions (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table skills (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

-- updated_at automático em profiles
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profiles_updated_at
  before update on profiles
  for each row
  execute function set_updated_at();

-- cria profiles automaticamente ao registrar em auth.users
create or replace function handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    coalesce(new.raw_user_meta_data->>'role', 'aluno')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function handle_new_user();

-- RLS
alter table institutions enable row level security;
alter table profiles enable row level security;
alter table skills enable row level security;

create policy "institutions_select_authenticated"
  on institutions for select
  to authenticated
  using (true);

create policy "skills_select_authenticated"
  on skills for select
  to authenticated
  using (true);

create policy "profiles_select_authenticated"
  on profiles for select
  to authenticated
  using (true);

create policy "profiles_insert_own"
  on profiles for insert
  to authenticated
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id);
