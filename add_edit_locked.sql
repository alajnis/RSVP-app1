-- Modo "solo visualización" para los novios, activable por el admin desde
-- el Dashboard, para cualquier tipo de evento (casamiento o corporativo).
-- Cuando está en true, los novios (acceso por código de invitación en
-- wedding.html) pueden ver todo pero no editar invitados, mesas ni
-- reubicarlos entre mesas. No afecta al admin ni al RSVP de los invitados.
alter table projects add column if not exists edit_locked boolean not null default false;
