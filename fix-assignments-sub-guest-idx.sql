-- ============================================
-- FIX: Agregar sub_guest_idx a la tabla assignments
-- ============================================
-- Problema: La tabla assignments no tiene la columna sub_guest_idx,
-- por lo que no se puede distinguir entre integrantes de una misma invitación
-- al asignarlos a mesas.

-- 1. Agregar la columna sub_guest_idx si no existe
ALTER TABLE public.assignments ADD COLUMN IF NOT EXISTS sub_guest_idx INTEGER;

-- 2. Eliminar el constraint UNIQUE viejo que no incluye sub_guest_idx
-- (Puede tener nombre auto-generado, intentamos con varios nombres posibles)
DO $$
BEGIN
    -- Intentar eliminar por nombre posible
    IF EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'assignments_project_id_guest_id_key' 
        AND conrelid = 'public.assignments'::regclass
    ) THEN
        ALTER TABLE public.assignments DROP CONSTRAINT assignments_project_id_guest_id_key;
        RAISE NOTICE 'Dropped constraint: assignments_project_id_guest_id_key';
    END IF;
    
    -- También intentar otros posibles nombres
    IF EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'unique_project_guest' 
        AND conrelid = 'public.assignments'::regclass
    ) THEN
        ALTER TABLE public.assignments DROP CONSTRAINT unique_project_guest;
        RAISE NOTICE 'Dropped constraint: unique_project_guest';
    END IF;
END $$;

-- 3. Agregar nuevo constraint UNIQUE que incluye sub_guest_idx
-- Esto permite que un mismo guest_id tenga múltiples asignaciones (una por integrante)
ALTER TABLE public.assignments 
ADD CONSTRAINT assignments_project_guest_subidx_unique 
UNIQUE (project_id, guest_id, sub_guest_idx);

-- 4. Verificar que todo está correcto
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'assignments' 
ORDER BY ordinal_position;
