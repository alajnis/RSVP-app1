-- ============================================================
-- Carga de preguntas personalizadas para Maca & Lea.
-- ============================================================
-- NO SE EJECUTÓ. Preparado para correr manualmente (o desde el
-- dashboard una vez cargada la UI) después de aplicar
-- add_custom_questions.sql.
--
-- project_id confirmado contra la base real (vía REST API de
-- Supabase, filtrando por wedding_date=2027-02-13):
--   id:        1ed9c95e-65c5-4c92-ac51-3b7c7f539bf1
--   bride_name: Maca
--   groom_name: Lea
--   couple_name: Maca & Lea
--   wedding_date: 2027-02-13
--
-- Requiere que la extensión pgcrypto (o pgcrypto-equivalente) esté
-- disponible para gen_random_uuid(), igual que el resto del esquema.

insert into custom_questions (project_id, question_text, question_type, options, required, sort_order)
values
    (
        '1ed9c95e-65c5-4c92-ac51-3b7c7f539bf1',
        'Tu género Musical preferido',
        'select',
        '["90s", "Cumbia", "Rock", "Electrónica", "Lentos", "Cachengue"]'::jsonb,
        true,
        0
    ),
    (
        '1ed9c95e-65c5-4c92-ac51-3b7c7f539bf1',
        'Elegí un color',
        'select',
        '["Amarillo", "Azul", "Verde", "Rojo"]'::jsonb,
        true,
        1
    );
