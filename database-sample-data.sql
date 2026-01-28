-- ============================================
-- DATOS DE EJEMPLO PARA TESTING
-- ============================================
-- Ejecuta este script DESPUÉS de database-schema.sql

-- ============================================
-- Insertar invitados de ejemplo
-- ============================================
INSERT INTO public.guests (first_name, last_name, email, phone, table_number, seat_number, dietary_restrictions, plus_one, confirmed) VALUES
('María', 'García', 'maria.garcia@email.com', '+54 11 1234-5678', 1, 1, 'Vegetariana', false, true),
('Juan', 'Pérez', 'juan.perez@email.com', '+54 11 2345-6789', 1, 2, null, true, true),
('Ana', 'Martínez', 'ana.martinez@email.com', '+54 11 3456-7890', 1, 3, 'Sin gluten', false, false),
('Carlos', 'López', 'carlos.lopez@email.com', '+54 11 4567-8901', 2, 1, null, false, true),
('Laura', 'Rodríguez', 'laura.rodriguez@email.com', '+54 11 5678-9012', 2, 2, 'Vegana', true, false),
('Diego', 'Fernández', 'diego.fernandez@email.com', '+54 11 6789-0123', 2, 3, null, false, true),
('Sofía', 'González', 'sofia.gonzalez@email.com', '+54 11 7890-1234', 3, 1, 'Sin lactosa', false, false),
('Pablo', 'Sánchez', 'pablo.sanchez@email.com', '+54 11 8901-2345', 3, 2, null, true, true),
('Valentina', 'Romero', 'valentina.romero@email.com', '+54 11 9012-3456', 3, 3, null, false, true),
('Martín', 'Torres', 'martin.torres@email.com', '+54 11 0123-4567', 4, 1, 'Vegetariano', false, false);

-- ============================================
-- Insertar algunas respuestas RSVP de ejemplo
-- ============================================
-- Nota: Necesitas los IDs de los invitados, así que primero los obtenemos

DO $$
DECLARE
    maria_id UUID;
    carlos_id UUID;
    pablo_id UUID;
BEGIN
    -- Obtener IDs de algunos invitados
    SELECT id INTO maria_id FROM public.guests WHERE first_name = 'María' AND last_name = 'García';
    SELECT id INTO carlos_id FROM public.guests WHERE first_name = 'Carlos' AND last_name = 'López';
    SELECT id INTO pablo_id FROM public.guests WHERE first_name = 'Pablo' AND last_name = 'Sánchez';
    
    -- Insertar respuestas RSVP
    INSERT INTO public.rsvp_responses (guest_id, attending, plus_one_name, dietary_restrictions, song_request, message)
    VALUES 
        (maria_id, true, null, 'Vegetariana', 'Despacito - Luis Fonsi', '¡Felicidades! No puedo esperar para celebrar con ustedes.'),
        (carlos_id, true, null, null, 'Bohemian Rhapsody - Queen', 'Va a ser una noche increíble!'),
        (pablo_id, true, 'Lucía Díaz', null, 'Perfect - Ed Sheeran', 'Confirmo asistencia con mi pareja. ¡Gracias por la invitación!');
END $$;

-- ============================================
-- ✅ Verificación
-- ============================================
-- Ejecuta estas consultas para verificar que todo se insertó correctamente

-- Ver todos los invitados
SELECT 
    first_name, 
    last_name, 
    email, 
    table_number, 
    seat_number, 
    confirmed 
FROM public.guests 
ORDER BY last_name;

-- Ver todas las respuestas RSVP con info del invitado
SELECT 
    g.first_name,
    g.last_name,
    r.attending,
    r.plus_one_name,
    r.song_request,
    r.message
FROM public.rsvp_responses r
JOIN public.guests g ON r.guest_id = g.id
ORDER BY r.response_date DESC;

-- Contar invitados confirmados
SELECT 
    confirmed,
    COUNT(*) as total
FROM public.guests
GROUP BY confirmed;
