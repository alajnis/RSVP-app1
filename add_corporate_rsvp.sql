-- ============================================================
-- Migración: soporte para RSVP de eventos corporativos
-- ============================================================
-- Reutiliza la tabla `projects` existente sin cambios (un evento
-- corporativo es simplemente otro registro en `projects`, usando
-- couple_name como nombre del evento y wedding_date como fecha).
--
-- Los invitados de un evento corporativo se crean directamente al
-- hacer RSVP (no hay carga previa) y no usan sub_guests/grupos: cada
-- persona es un registro individual en `guests`. Esta migración solo
-- agrega lo que falta en `guests` para ese flujo. Es re-ejecutable
-- (usa IF NOT EXISTS en todos lados) y no toca ninguna fila existente
-- de boda de forma destructiva.

-- 0) Tipo de evento, para que el dashboard pueda distinguir visualmente
--    un evento corporativo de un casamiento. Default 'wedding' para no
--    afectar ningún proyecto existente.
alter table projects add column if not exists event_type text not null default 'wedding';

-- 1) Empresa del invitado. Específico del flujo corporativo; no existe
--    hoy en el esquema de bodas.
alter table guests add column if not exists company text;

-- 2) Token de QR. DECISIÓN: el contenido del QR que se genera en
--    corporate-rsvp.html es directamente el `id` (uuid) del guest, no
--    un token separado -- es suficientemente único y evita tener que
--    sincronizar dos valores. Se agrega igual la columna `qr_token`
--    (nullable, sin uso obligatorio hoy) para poder en el futuro
--    invalidar/regenerar el QR de un invitado sin tener que cambiarle
--    el id (que tiene otras referencias, como `assignments.guest_id`).
alter table guests add column if not exists qr_token text;

-- 3) Evitar emails duplicados dentro del mismo evento: NO se implementa
--    como constraint de base de datos. Se verificó contra los datos
--    reales y hay casos legítimos de bodas con el mismo email repetido
--    a propósito entre dos invitados distintos (ej. una pareja que
--    comparte casilla de mail) -- forzar un índice único a nivel DB
--    rompería esos registros existentes. La validación de "email ya
--    usado en este evento" se hace en el código de corporate-rsvp.html
--    (un SELECT antes del INSERT), que es donde realmente importa para
--    el flujo nuevo, sin arriesgar los datos de bodas ya cargados.
