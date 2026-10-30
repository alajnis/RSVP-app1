-- Mueve las claves administrativas de login.html (hoy hardcodeadas como
-- strings fijos en el código: 'admin', 'usuario') a la base de datos, para
-- que puedan cambiarse desde la propia app sin pedirle a Claude que edite
-- código cada vez que alguien del equipo se va o hay que rotar un acceso.
--
-- code_key: identificador estable e interno (no cambia nunca, se usa para
--           saber "cuál" código es, independientemente de su clave actual).
-- code_value: la palabra que la persona efectivamente escribe para entrar.
--             Esta es la que se puede cambiar libremente desde el panel.
-- role: 'maestro' (acceso a Gestión de Accesos + todo lo de admin) o
--       'admin' (todo salvo Gestión de Accesos -- admin/usuario hoy).
create table if not exists access_codes (
    id         uuid primary key default gen_random_uuid(),
    code_key   text not null unique,
    code_value text not null,
    role       text not null check (role in ('maestro', 'admin')),
    updated_at timestamptz not null default now()
);

alter table access_codes enable row level security;

drop policy if exists "access_codes_all_access" on access_codes;
create policy "access_codes_all_access" on access_codes for all using (true) with check (true);

-- Seed inicial: mismos valores que ya existían hardcodeados, más el código
-- "maestro" nuevo (clave inicial "maestro" -- cambiarla desde el panel de
-- Gestión de Accesos apenas esté disponible).
insert into access_codes (code_key, code_value, role) values
    ('admin', 'admin', 'admin'),
    ('usuario', 'usuario', 'admin'),
    ('maestro', 'maestro', 'maestro')
on conflict (code_key) do nothing;
