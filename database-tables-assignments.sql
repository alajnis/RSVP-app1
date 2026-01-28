-- ============================================
-- TABLAS FALTANTES PARA WEDDING.HTML
-- ============================================
-- wedding.html requiere las tablas: tables, guests (actualizada), assignments

-- 1. TABLA: tables (Mesas del evento)
-- ============================================
DROP TABLE IF EXISTS public.tables CASCADE;

CREATE TABLE public.tables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    capacity INTEGER NOT NULL DEFAULT 10,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_tables_project_id ON public.tables(project_id);

-- RLS para tables
ALTER TABLE public.tables ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous select on tables"
    ON public.tables FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anonymous insert on tables"
    ON public.tables FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anonymous update on tables"
    ON public.tables FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Allow anonymous delete on tables"
    ON public.tables FOR DELETE TO anon USING (true);

-- 2. TABLA: assignments (Asignaciones de invitados a mesas)
-- ============================================
DROP TABLE IF EXISTS public.assignments CASCADE;

CREATE TABLE public.assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    guest_id UUID NOT NULL REFERENCES public.guests(id) ON DELETE CASCADE,
    table_id UUID NOT NULL REFERENCES public.tables(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Un invitado solo puede estar asignado a una mesa por proyecto
    UNIQUE(project_id, guest_id)
);

CREATE INDEX idx_assignments_project_id ON public.assignments(project_id);
CREATE INDEX idx_assignments_guest_id ON public.assignments(guest_id);
CREATE INDEX idx_assignments_table_id ON public.assignments(table_id);

-- RLS para assignments
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous select on assignments"
    ON public.assignments FOR SELECT TO anon USING (true);

CREATE POLICY "Allow anonymous insert on assignments"
    ON public.assignments FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Allow anonymous update on assignments"
    ON public.assignments FOR UPDATE TO anon USING (true) WITH CHECK (true);

CREATE POLICY "Allow anonymous delete on assignments"
    ON public.assignments FOR DELETE TO anon USING (true);

-- 3. ACTUALIZAR TABLA: guests (añadir project_id)
-- ============================================
-- La tabla guests ya existe pero necesita project_id para relacionarse con projects

ALTER TABLE public.guests ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_guests_project_id ON public.guests(project_id);

-- ============================================
-- DATOS DE EJEMPLO (OPCIONAL)
-- ============================================
-- Puedes descomentar esto si quieres datos de prueba

-- Insertar mesas de ejemplo para el primer proyecto
-- INSERT INTO public.tables (project_id, name, capacity)
-- SELECT id, 'Mesa ' || num, 10
-- FROM public.projects, generate_series(1, 5) AS num
-- LIMIT 5;

-- ============================================
-- FINALIZADO
-- ============================================
COMMENT ON TABLE public.tables IS 'Mesas del evento';
COMMENT ON TABLE public.assignments IS 'Asignaciones de invitados a mesas';
