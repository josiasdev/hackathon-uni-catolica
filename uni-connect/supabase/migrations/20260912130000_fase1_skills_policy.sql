-- Permite que usuários autenticados adicionem competências ao catálogo compartilhado.

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename = 'skills'
      and policyname = 'skills_insert_authenticated'
  ) then
    create policy "skills_insert_authenticated"
      on skills for insert
      to authenticated
      with check (length(trim(name)) between 2 and 80);
  end if;
end;
$$;