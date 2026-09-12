-- Conquistas básicas derivadas de ações reais da trajetória.

create table if not exists achievements (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  title text not null,
  description text not null,
  xp_reward integer not null default 0 check (xp_reward >= 0),
  created_at timestamptz not null default now()
);

create table if not exists user_achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  achievement_id uuid not null references achievements (id) on delete cascade,
  unlocked_at timestamptz not null default now(),
  unique (user_id, achievement_id)
);

insert into achievements (key, title, description, xp_reward) values
  ('profile_complete', 'Perfil completo', 'Você apresentou sua formação e sua história.', 25),
  ('first_skill', 'Primeira competência', 'Você começou a construir seu repertório.', 10),
  ('first_course', 'Primeiro curso concluído', 'Você transformou aprendizado em uma conquista.', 100)
on conflict (key) do update set title = excluded.title, description = excluded.description, xp_reward = excluded.xp_reward;

alter table achievements enable row level security;
alter table user_achievements enable row level security;
create policy "achievements_select_authenticated" on achievements for select to authenticated using (true);
create policy "user_achievements_select_own" on user_achievements for select to authenticated using (user_id = auth.uid());
create policy "user_achievements_insert_own" on user_achievements for insert to authenticated with check (user_id = auth.uid());