-- ============================================
-- SCRIPT SQL PARA CREAR TABLAS EN SUPABASE
-- ============================================
-- Ejecuta este script en Supabase Studio → SQL Editor

-- ============================================
-- 1. Tabla: guests (Invitados)
-- ============================================
CREATE TABLE IF NOT EXISTS public.guests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    table_number INTEGER,
    seat_number INTEGER,
    dietary_restrictions TEXT,
    notes TEXT,
    plus_one BOOLEAN DEFAULT false,
    confirmed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. Tabla: rsvp_responses (Respuestas RSVP)
-- ============================================
CREATE TABLE IF NOT EXISTS public.rsvp_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    guest_id UUID REFERENCES public.guests(id) ON DELETE CASCADE,
    attending BOOLEAN NOT NULL,
    plus_one_name TEXT,
    dietary_restrictions TEXT,
    song_request TEXT,
    message TEXT,
    response_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 3. Índices para mejor performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_guests_last_name ON public.guests(last_name);
CREATE INDEX IF NOT EXISTS idx_guests_email ON public.guests(email);
CREATE INDEX IF NOT EXISTS idx_guests_table ON public.guests(table_number);
CREATE INDEX IF NOT EXISTS idx_rsvp_guest_id ON public.rsvp_responses(guest_id);

-- ============================================
-- 4. Trigger para actualizar updated_at automáticamente
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar trigger a guests
DROP TRIGGER IF EXISTS update_guests_updated_at ON public.guests;
CREATE TRIGGER update_guests_updated_at
    BEFORE UPDATE ON public.guests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Aplicar trigger a rsvp_responses
DROP TRIGGER IF EXISTS update_rsvp_responses_updated_at ON public.rsvp_responses;
CREATE TRIGGER update_rsvp_responses_updated_at
    BEFORE UPDATE ON public.rsvp_responses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 5. Habilitar Row Level Security (RLS)
-- ============================================
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvp_responses ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 6. Políticas de Seguridad (Permitir todo por ahora)
-- ============================================
-- Permitir lectura pública de invitados
DROP POLICY IF EXISTS "Allow public read access to guests" ON public.guests;
CREATE POLICY "Allow public read access to guests"
    ON public.guests FOR SELECT
    USING (true);

-- Permitir inserción y actualización de invitados (para admin)
DROP POLICY IF EXISTS "Allow insert and update to guests" ON public.guests;
CREATE POLICY "Allow insert and update to guests"
    ON public.guests FOR ALL
    USING (true);

-- Permitir lectura pública de respuestas RSVP
DROP POLICY IF EXISTS "Allow public read access to rsvp_responses" ON public.rsvp_responses;
CREATE POLICY "Allow public read access to rsvp_responses"
    ON public.rsvp_responses FOR SELECT
    USING (true);

-- Permitir inserción de respuestas RSVP
DROP POLICY IF EXISTS "Allow insert to rsvp_responses" ON public.rsvp_responses;
CREATE POLICY "Allow insert to rsvp_responses"
    ON public.rsvp_responses FOR INSERT
    WITH CHECK (true);

-- ============================================
-- NOTA: Estas políticas son muy permisivas.
-- En producción, deberías restringirlas según
-- tus necesidades de autenticación.
-- ============================================

-- ============================================
-- ✅ FIN DEL SCRIPT
-- ============================================
-- Después de ejecutar este script, ejecuta el script de datos de ejemplo
