-- Fase 5 — Eventos e inscrições.

create table if not exists events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  event_type text not null default 'workshop',
  starts_at timestamptz not null,
  ends_at timestamptz,
  modality text not null default 'presencial',
  location text,
  published boolean not null default false,
  created_by uuid not null references profiles (id) on delete cascade,
  institution_id uuid references institutions (id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists event_registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events (id) on delete cascade,
  user_id uuid not null references profiles (id) on delete cascade,
  status text not null default 'registered' check (status in ('registered', 'attended', 'cancelled')),
  registered_at timestamptz not null default now(),
  checked_in_at timestamptz,
  unique (event_id, user_id)
);

alter table events enable row level security;
alter table event_registrations enable row level security;

create policy "events_select_published_or_owned" on events for select to authenticated using (published = true or created_by = auth.uid());
create policy "events_insert_authenticated" on events for insert to authenticated with check (created_by = auth.uid());
create policy "events_update_owned" on events for update to authenticated using (created_by = auth.uid()) with check (created_by = auth.uid());
create policy "events_delete_owned" on events for delete to authenticated using (created_by = auth.uid());

create policy "event_registrations_select_own" on event_registrations for select to authenticated using (user_id = auth.uid() or exists (select 1 from events where id = event_id and created_by = auth.uid()));
create policy "event_registrations_insert_own" on event_registrations for insert to authenticated with check (user_id = auth.uid());
create policy "event_registrations_update_own" on event_registrations for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());