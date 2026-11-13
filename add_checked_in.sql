-- Registra si/cuándo se escaneó el QR de un invitado en la entrada del
-- evento (control de acceso), para poder mostrar un contador de recepción
-- (ej. 11/190) y marcar en el listado de invitados quién ingresó o no.
alter table guests add column if not exists checked_in_at timestamptz;
