-- =============================================
-- MIGRACIÓN: SOPORTE MULTI-EVENTO (Boda, Civil, Brunch)
-- OBJETIVO: Agregar columnas JSONB para configuración flexible
-- FECHA: 2026-01-30
-- =============================================

-- 1. Agregar configuración de eventos al PROYECTO
-- Estructura esperada: { "multi_event": true, "events": [{id: "main", label: "Boda"}, {id: "brunch", label: "Brunch"}] }
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS events_config JSONB DEFAULT '{}'::jsonb;

-- 2. Agregar respuestas detalladas a los INVITADOS
-- Estructura esperada: { "main": "confirmed", "brunch": "declined" }
ALTER TABLE guests 
ADD COLUMN IF NOT EXISTS rsvp_answers JSONB DEFAULT '{}'::jsonb;

-- 3. Comentarios explicativos
COMMENT ON COLUMN projects.events_config IS 'Configuración de eventos múltiples (JSONB). Define si es multi-día y qué eventos hay.';
COMMENT ON COLUMN guests.rsvp_answers IS 'Respuestas detalladas de asistencia por sub-evento (JSONB).';

-- 4. Verificación
SELECT 'Columnas agregadas exitosamente' as status;
