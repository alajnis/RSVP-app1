-- ============================================
-- TABLA: projects (Casamientos/Eventos)
-- ============================================
-- Esta tabla almacena la información de cada casamiento/evento

-- Eliminar tabla si existe (para recrear limpia)
DROP TABLE IF EXISTS public.projects CASCADE;

-- Crear tabla projects
CREATE TABLE public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Información de la pareja
    bride_name TEXT NOT NULL,
    groom_name TEXT NOT NULL,
    couple_name TEXT NOT NULL, -- "María & Juan"
    
    -- Detalles del evento
    wedding_date DATE NOT NULL,
    venue TEXT,
    
    -- Metadatos
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para mejorar rendimiento
CREATE INDEX idx_projects_wedding_date ON public.projects(wedding_date);
CREATE INDEX idx_projects_couple_name ON public.projects(couple_name);

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_projects_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION update_projects_updated_at();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
-- Por ahora permitimos todo (anon puede leer/escribir)
-- En producción, deberías refinar estas políticas

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Política: Permitir SELECT a usuarios anónimos
CREATE POLICY "Allow anonymous select on projects"
    ON public.projects
    FOR SELECT
    TO anon
    USING (true);

-- Política: Permitir INSERT a usuarios anónimos
CREATE POLICY "Allow anonymous insert on projects"
    ON public.projects
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Política: Permitir UPDATE a usuarios anónimos
CREATE POLICY "Allow anonymous update on projects"
    ON public.projects
    FOR UPDATE
    TO anon
    USING (true)
    WITH CHECK (true);

-- Política: Permitir DELETE a usuarios anónimos
CREATE POLICY "Allow anonymous delete on projects"
    ON public.projects
    FOR DELETE
    TO anon
    USING (true);

-- ============================================
-- COMENTARIOS
-- ============================================
COMMENT ON TABLE public.projects IS 'Información de casamientos/eventos';
COMMENT ON COLUMN public.projects.id IS 'ID único del proyecto (UUID)';
COMMENT ON COLUMN public.projects.bride_name IS 'Nombre de la novia';
COMMENT ON COLUMN public.projects.groom_name IS 'Nombre del novio';
COMMENT ON COLUMN public.projects.couple_name IS 'Nombre de la pareja (ej: María & Juan)';
COMMENT ON COLUMN public.projects.wedding_date IS 'Fecha del casamiento';
COMMENT ON COLUMN public.projects.venue IS 'Lugar del evento (opcional)';

-- ============================================
-- FINALIZADO
-- ============================================
-- La tabla projects está lista para usar
