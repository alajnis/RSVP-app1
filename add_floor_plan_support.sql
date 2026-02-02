-- 1. Agregar columna floor_plan_url a projects
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS floor_plan_url TEXT;

-- 2. Crear bucket de storage 'floor_plans'
INSERT INTO storage.buckets (id, name, public)
VALUES ('floor_plans', 'floor_plans', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Políticas de seguridad para el bucket (Permitir acceso público y subida anónima para este MVP)
-- Ajustar según necesidades de seguridad más estrictas si fuera necesario
BEGIN;
  -- Borrar políticas previas si existen para evitar duplicados al re-correr
  DROP POLICY IF EXISTS "Public Access Floor Plans" ON storage.objects;
  DROP POLICY IF EXISTS "Anon Upload Floor Plans" ON storage.objects;
  DROP POLICY IF EXISTS "Anon Update Floor Plans" ON storage.objects;
  DROP POLICY IF EXISTS "Anon Delete Floor Plans" ON storage.objects;

  CREATE POLICY "Public Access Floor Plans" ON storage.objects FOR SELECT USING ( bucket_id = 'floor_plans' );
  CREATE POLICY "Anon Upload Floor Plans" ON storage.objects FOR INSERT WITH CHECK ( bucket_id = 'floor_plans' );
  CREATE POLICY "Anon Update Floor Plans" ON storage.objects FOR UPDATE WITH CHECK ( bucket_id = 'floor_plans' );
  CREATE POLICY "Anon Delete Floor Plans" ON storage.objects FOR DELETE USING ( bucket_id = 'floor_plans' );
COMMIT;
