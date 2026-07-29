-- TABLA MURAL: Mensajes de invitados para los novios
create table if not exists public.mural_messages (
  id            text primary key default gen_random_uuid()::text,
  project_id    uuid references public.projects(id) on delete cascade,
  guest_id      uuid references public.guests(id) on delete set null,
  guest_name    text not null,
  message       varchar(200) not null,
  created_at    timestamptz default now()
);

-- Habilitar RLS y política pública (igual que el resto del proyecto)
alter table public.mural_messages enable row level security;
create policy "Enable all access for anon"
  on public.mural_messages for all
  using (true) with check (true);

-- Permisos para roles
grant all on public.mural_messages to anon, authenticated, service_role;

-- Índice para performance
create index if not exists idx_mural_project_id
  on public.mural_messages(project_id);
