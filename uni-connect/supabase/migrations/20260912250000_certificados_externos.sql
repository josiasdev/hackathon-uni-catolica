-- Certificados externos e horas de experiência acumuladas.

create table if not exists external_certifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles (id) on delete cascade,
  title text not null,
  issuer text,
  workload_hours integer not null default 0 check (workload_hours >= 0),
  issued_at date,
  file_url text not null,
  created_at timestamptz not null default now()
);

insert into storage.buckets (id, name, public)
values ('certificates', 'certificates', false)
on conflict (id) do nothing;

alter table external_certifications enable row level security;
create policy "external_certifications_select_own" on external_certifications for select to authenticated using (user_id = auth.uid());
create policy "external_certifications_insert_own" on external_certifications for insert to authenticated with check (user_id = auth.uid());
create policy "external_certificates_insert_own_folder" on storage.objects for insert to authenticated with check (bucket_id = 'certificates' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "external_certificates_select_own_folder" on storage.objects for select to authenticated using (bucket_id = 'certificates' and (storage.foldername(name))[1] = auth.uid()::text);