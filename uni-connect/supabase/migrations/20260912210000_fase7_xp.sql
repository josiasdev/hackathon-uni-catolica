-- Progressão: XP rastreável por ações da trajetória.

create table if not exists user_progress (
  user_id uuid primary key references profiles (id) on delete cascade,
  xp integer not null default 0 check (xp >= 0),
  updated_at timestamptz not null default now()
);

create table if not exists xp_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  amount integer not null check (amount > 0),
  reason text not null,
  source_type text not null,
  source_id uuid not null,
  created_at timestamptz not null default now(),
  unique (user_id, source_type, source_id)
);

alter table user_progress enable row level security;
alter table xp_transactions enable row level security;
create policy "user_progress_select_own" on user_progress for select to authenticated using (user_id = auth.uid());
create policy "xp_transactions_select_own" on xp_transactions for select to authenticated using (user_id = auth.uid());

create or replace function award_xp(points integer, xp_reason text, xp_source_type text, xp_source_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare inserted_count integer;
begin
  if points <= 0 or auth.uid() is null then raise exception 'Invalid XP award'; end if;
  insert into public.xp_transactions (user_id, amount, reason, source_type, source_id)
  values (auth.uid(), points, xp_reason, xp_source_type, xp_source_id)
  on conflict (user_id, source_type, source_id) do nothing;
  get diagnostics inserted_count = row_count;
  if inserted_count = 1 then
    insert into public.user_progress (user_id, xp) values (auth.uid(), points)
    on conflict (user_id) do update set xp = user_progress.xp + excluded.xp, updated_at = now();
  end if;
end;
$$;

grant execute on function award_xp(integer, text, text, uuid) to authenticated;