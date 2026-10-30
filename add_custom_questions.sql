-- ============================================================
-- Migración: preguntas personalizadas del RSVP (genérico, por proyecto)
-- ============================================================
-- Hasta ahora, cuando un casamiento pedía preguntas especiales en el RSVP
-- (ej. talle de calzado, día de llegada, tema musical para Marcella & Gonza)
-- se hardcodeaba un flag `isMarcelloGonzaWedding` en index2.html/wedding.html
-- que detectaba ESE casamiento puntual por nombre/fecha. Esta migración
-- agrega una tabla genérica para que cualquier casamiento pueda definir sus
-- propias preguntas desde el dashboard, sin tocar código.
--
-- Las RESPUESTAS no se guardan acá: siguen el mismo patrón que ya usa el
-- proyecto para shoe_size/arrival_day/song_request -- se guardan dentro del
-- JSON `sub_guests` de cada invitado (tabla `guests`), bajo una clave nueva
-- `sub_guests[i].custom_answers = { [question_id]: respuesta }`. Esta tabla
-- solo guarda la DEFINICIÓN de las preguntas por proyecto.

create table if not exists public.custom_questions (
    id            uuid primary key default gen_random_uuid(),
    project_id    uuid not null references public.projects(id) on delete cascade,
    question_text text not null,
    question_type text not null check (question_type in ('select', 'text')),
    options       jsonb,
    required      boolean not null default true,
    sort_order    integer not null default 0,
    created_at    timestamptz not null default now()
);

-- Índice para la query típica: traer las preguntas de un proyecto ordenadas
create index if not exists idx_custom_questions_project_id
    on public.custom_questions(project_id);

-- RLS: mismo criterio que el resto de las tablas de este proyecto (acceso
-- total vía anon key, sin restricciones a nivel DB -- la seguridad real la
-- da el login code / rol que maneja la app).
alter table public.custom_questions enable row level security;

create policy "Enable all access for anon"
    on public.custom_questions for all
    using (true) with check (true);

-- Permisos para roles
grant all on public.custom_questions to anon, authenticated, service_role;

comment on table public.custom_questions is 'Preguntas personalizadas configurables por proyecto para el RSVP (select o texto libre). Las respuestas viven en guests.sub_guests[i].custom_answers, no acá.';
comment on column public.custom_questions.options is 'Array JSON de strings con las opciones, solo para question_type = select. Null/irrelevante para type = text.';
comment on column public.custom_questions.sort_order is 'Orden de aparición en el formulario de RSVP (ascendente).';
