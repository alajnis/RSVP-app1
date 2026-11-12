-- Permite cerrar el link de RSVP de un evento corporativo (dejan de poder
-- darse de alta nuevos invitados) sin afectar el link de escaneo de QR en
-- la entrada, que debe seguir funcionando siempre.
alter table projects add column if not exists rsvp_closed boolean not null default false;
