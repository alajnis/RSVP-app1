-- Log de acciones destructivas por proyecto (borrado de invitados, reset de datos, etc).
-- Permite reconstruir, ante un reclamo como "desaparecieron los invitados de tal boda",
-- qué se borró, cuándo y desde qué rol (admin/couple).

create table if not exists activity_log (
    id uuid primary key default gen_random_uuid(),
    project_id uuid not null references projects(id) on delete cascade,
    action text not null,           -- ej: 'delete_guest', 'delete_all_guests', 'reset_project_data'
    actor_role text,                -- 'admin' o 'couple'
    detail jsonb,                   -- info puntual: cuántos invitados, nombre del invitado, etc.
    created_at timestamptz not null default now()
);

create index if not exists idx_activity_log_project_id on activity_log(project_id);
create index if not exists idx_activity_log_created_at on activity_log(created_at desc);

alter table activity_log enable row level security;

drop policy if exists "activity_log_all_access" on activity_log;
create policy "activity_log_all_access" on activity_log for all using (true) with check (true);
