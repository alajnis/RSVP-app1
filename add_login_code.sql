-- =====================================================
-- MIGRACIÓN: Agregar login_code a tabla projects
-- Fecha: 2026-07-22
-- Motivo: Evitar colisión de claves cuando dos casamientos
--         tienen novio y novia con los mismos nombres.
-- =====================================================

ALTER TABLE projects ADD COLUMN IF NOT EXISTS login_code text;

-- Crear índice único para garantizar unicidad
CREATE UNIQUE INDEX IF NOT EXISTS projects_login_code_unique ON projects (login_code);

-- Rellenar login_code para proyectos existentes (retrocompatibilidad)
-- Genera el código base: lowercased bride+y+groom sin caracteres especiales
UPDATE projects
SET login_code = LOWER(
    REGEXP_REPLACE(bride_name, '[^a-zA-Z0-9]', '', 'g')
) || 'y' || LOWER(
    REGEXP_REPLACE(groom_name, '[^a-zA-Z0-9]', '', 'g')
)
WHERE login_code IS NULL
  AND bride_name IS NOT NULL
  AND groom_name IS NOT NULL;
