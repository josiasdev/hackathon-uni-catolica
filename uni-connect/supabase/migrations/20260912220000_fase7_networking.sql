-- Fase 7 — Networking: conexões entre pessoas.

create table if not exists connections (
  id uuid primary key default gen_random_uuid(),
  requester_id uuid not null references profiles (id) on delete cascade,
  addressee_id uuid not null references profiles (id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (requester_id <> addressee_id),
  unique (requester_id, addressee_id)
);

alter table connections enable row level security;

create policy "connections_select_participant" on connections for select to authenticated
  using (requester_id = auth.uid() or addressee_id = auth.uid());

create policy "connections_insert_requester" on connections for insert to authenticated
  with check (requester_id = auth.uid());

create policy "connections_update_addressee" on connections for update to authenticated
  using (addressee_id = auth.uid()) with check (addressee_id = auth.uid());

create policy "connections_delete_participant" on connections for delete to authenticated
  using (requester_id = auth.uid() or addressee_id = auth.uid());