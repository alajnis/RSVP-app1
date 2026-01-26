-- DATOS DE PRUEBA (SEED DATA)
-- Ejecutar una sola vez en Supabase SQL Editor

-- 1. Crear Proyecto de Boda
insert into projects (id, bride_name, groom_name, couple_name, wedding_date, venue)
values 
  ('proj_sample_001', 'Lara', 'Ale', 'Lara & Ale', '2026-11-20', 'Palacio Sans Souci');

-- 2. Crear Mesas (Capacidad 8-10)
insert into tables (id, project_id, name, capacity)
values
  ('table_01', 'proj_sample_001', 'Mesa Principal', 10),
  ('table_02', 'proj_sample_001', 'Familia Novia', 10),
  ('table_03', 'proj_sample_001', 'Familia Novio', 10),
  ('table_04', 'proj_sample_001', 'Amigos Universidad', 8),
  ('table_05', 'proj_sample_001', 'Amigos Trabajo', 8),
  ('table_06', 'proj_sample_001', 'Primos', 8);

-- 3. Crear Invitados
-- Familia con Hijos
insert into guests (id, project_id, first_name, last_name, email, phone, guests_confirmed, rsvp_status, dietary, sub_guests)
values 
  ('guest_001', 'proj_sample_001', 'Ricardo', 'Lopez', 'ricardo@email.com', '1155550001', 4, 'Confirmed', 'None', 
   '[
      {"firstName": "Ricardo", "lastName": "Lopez", "status": "Confirmed", "dietary": "None"},
      {"firstName": "Ana", "lastName": "Maria", "status": "Confirmed", "dietary": "Vegetarian"},
      {"firstName": "Joaquin", "lastName": "Lopez", "status": "Confirmed", "dietary": "None"},
      {"firstName": "Sofia", "lastName": "Lopez", "status": "Confirmed", "dietary": "Celiac"}
    ]'::jsonb
  );

-- Pareja
insert into guests (id, project_id, first_name, last_name, email, phone, guests_confirmed, rsvp_status, dietary, sub_guests)
values 
  ('guest_002', 'proj_sample_001', 'Carlos', 'Gomez', 'carlos@email.com', '1155550002', 2, 'Pending', 'None', 
   '[
      {"firstName": "Carlos", "lastName": "Gomez", "status": "Pending", "dietary": "None"},
      {"firstName": "Fernanda", "lastName": "Ruiz", "status": "Pending", "dietary": "None"}
    ]'::jsonb
  );

-- Individual
insert into guests (id, project_id, first_name, last_name, email, phone, guests_confirmed, rsvp_status, dietary, sub_guests)
values 
  ('guest_003', 'proj_sample_001', 'Mariana', 'Vez', 'mariana@email.com', '1155550003', 1, 'Confirmed', 'Vegan', 
   '[
      {"firstName": "Mariana", "lastName": "Vez", "status": "Confirmed", "dietary": "Vegan"}
    ]'::jsonb
  );

-- Grupo Amigos (Confirmado parcial)
insert into guests (id, project_id, first_name, last_name, email, phone, guests_confirmed, rsvp_status, dietary, sub_guests)
values 
  ('guest_004', 'proj_sample_001', 'Juan', 'Perez', 'jp@email.com', '1155550004', 3, 'Confirmed', 'None', 
   '[
      {"firstName": "Juan", "lastName": "Perez", "status": "Confirmed", "dietary": "None"},
      {"firstName": "Lucia", "lastName": "Diaz", "status": "Declined", "dietary": "None"},
      {"firstName": "Marcos", "lastName": "Perez", "status": "Confirmed", "dietary": "None"}
    ]'::jsonb
  );

-- 4. Asignaciones (Assignments)
-- Asignamos a Ricardo y Ana Maria a la Mesa 02.
insert into assignments (id, project_id, table_id, rsvp_id, sub_guest_idx)
values
  ('asg_001', 'proj_sample_001', 'table_02', 'guest_001', 0), -- Ricardo
  ('asg_002', 'proj_sample_001', 'table_02', 'guest_001', 1); -- Ana

