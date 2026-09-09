-- Módulo: Recordatorio automático a los novios cuando faltan <=45 días y >10% de
-- invitados sin responder. Ejecutar una sola vez en el SQL Editor de Supabase.

-- Emails de contacto de los novios (al menos uno se completa desde el ABM del casamiento)
alter table projects add column if not exists bride_email text;
alter table projects add column if not exists groom_email text;

-- Se dispara una única vez por casamiento; esta columna evita reenvíos
alter table projects add column if not exists rsvp_reminder_sent_at timestamptz;

create index if not exists idx_projects_rsvp_reminder_sent_at on projects(rsvp_reminder_sent_at);
