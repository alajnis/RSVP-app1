-- Agrega quién (qué casilla de Gmail) generó cada solicitud de presupuesto a
-- proveedores, para poder armar un log de uso general ("quién y cuántas veces
-- usó el módulo"), visible solo para admin desde el Dashboard.

alter table budget_requests_log add column if not exists sender_key text;

create index if not exists idx_budget_requests_log_sender_key on budget_requests_log(sender_key);
