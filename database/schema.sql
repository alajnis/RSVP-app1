-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- TABLES: tables
create table public.tables (
    id uuid not null default uuid_generate_v4(),
    event_id uuid not null, -- Assuming there is an events table, FK would be: references public.events(id)
    name text not null,
    capacity integer not null check (capacity >= 1),
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),
    
    constraint tables_pkey primary key (id),
    constraint tables_event_id_name_key unique (event_id, name)
);

-- TABLES: seat_assignments
create table public.seat_assignments (
    id uuid not null default uuid_generate_v4(),
    table_id uuid not null references public.tables(id) on delete cascade,
    rsvp_id uuid not null, -- Assuming there is an rsvps table, FK would be: references public.rsvps(id)
    guests_assigned integer not null check (guests_assigned >= 1),
    created_at timestamp with time zone not null default now(),

    constraint seat_assignments_pkey primary key (id),
    constraint seat_assignments_rsvp_id_key unique (rsvp_id) -- One table per RSVP
);

-- RLS POLICIES
alter table public.tables enable row level security;
alter table public.seat_assignments enable row level security;

-- Policies for 'tables'
-- Assuming authenticated users can view tables (for guests to see their seat? or just admins?)
-- For now, let's assume public read (or authenticated read) and admin write.

create policy "Enable read access for all users" on public.tables
    for select using (true);

create policy "Enable insert for authenticated users only" on public.tables
    for insert with check (auth.role() = 'authenticated');

create policy "Enable update for authenticated users only" on public.tables
    for update using (auth.role() = 'authenticated');

create policy "Enable delete for authenticated users only" on public.tables
    for delete using (auth.role() = 'authenticated');

-- Policies for 'seat_assignments'
create policy "Enable read access for all users" on public.seat_assignments
    for select using (true);

create policy "Enable insert for authenticated users only" on public.seat_assignments
    for insert with check (auth.role() = 'authenticated');

create policy "Enable update for authenticated users only" on public.seat_assignments
    for update using (auth.role() = 'authenticated');

create policy "Enable delete for authenticated users only" on public.seat_assignments
    for delete using (auth.role() = 'authenticated');

-- Indexes for performance
create index idx_tables_event_id on public.tables(event_id);
create index idx_seat_assignments_table_id on public.seat_assignments(table_id);
create index idx_seat_assignments_rsvp_id on public.seat_assignments(rsvp_id);
