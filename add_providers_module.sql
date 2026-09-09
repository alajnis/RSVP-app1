-- Módulo de Solicitud de Presupuestos a Proveedores
-- Ejecutar una sola vez en Supabase (SQL Editor) o vía docker-entrypoint-initdb.d en un entorno nuevo.

-- TABLA PROVEEDORES (ABM global, independiente de los proyectos)
create table if not exists providers (
  id          text primary key default gen_random_uuid()::text,
  name        text not null,
  category    text not null,
  emails      text[] not null default '{}',
  is_active   boolean not null default true,
  created_at  timestamptz default now()
);

create index if not exists idx_providers_category on providers(category);
create index if not exists idx_providers_is_active on providers(is_active);

-- TABLA LOG DE SOLICITUDES DE PRESUPUESTO (historial por proyecto)
create table if not exists budget_requests_log (
  id           text primary key default gen_random_uuid()::text,
  project_id   uuid references projects(id) on delete cascade,
  provider_id  text references providers(id) on delete cascade,
  category     text,
  created_at   timestamptz default now()
);

create index if not exists idx_budget_requests_log_project_id on budget_requests_log(project_id);
create index if not exists idx_budget_requests_log_provider_id on budget_requests_log(provider_id);

-- POLÍTICAS DE SEGURIDAD (RLS) - mismo criterio que el resto de las tablas del proyecto
alter table providers enable row level security;
alter table budget_requests_log enable row level security;

create policy "Enable all access for anon" on providers for all using (true) with check (true);
create policy "Enable all access for anon" on budget_requests_log for all using (true) with check (true);

-- Permisos para roles
GRANT ALL ON providers TO anon, authenticated, service_role;
GRANT ALL ON budget_requests_log TO anon, authenticated, service_role;
