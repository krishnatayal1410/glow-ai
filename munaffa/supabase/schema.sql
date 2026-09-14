create extension if not exists pgcrypto;

create table if not exists public.restaurants(
 id uuid primary key default gen_random_uuid(),
 name text not null,
 created_at timestamptz not null default now()
);
create table if not exists public.outlets(
 id uuid primary key default gen_random_uuid(),
 restaurant_id uuid not null references public.restaurants(id) on delete cascade,
 name text not null,
 timezone text not null default 'Asia/Kolkata',
 created_at timestamptz not null default now()
);
create table if not exists public.memberships(
 user_id uuid not null references auth.users(id) on delete cascade,
 restaurant_id uuid not null references public.restaurants(id) on delete cascade,
 role text not null check(role in('owner','manager','cashier','waiter','kitchen','stock','hq')),
 primary key(user_id,restaurant_id)
);
create table if not exists public.tables(
 id uuid primary key default gen_random_uuid(),outlet_id uuid not null references public.outlets(id) on delete cascade,
 code text not null,status text not null default 'free',guests integer not null default 0,unique(outlet_id,code)
);
create table if not exists public.orders(
 id uuid primary key default gen_random_uuid(),outlet_id uuid not null references public.outlets(id) on delete cascade,
 table_id uuid references public.tables(id),guest_id uuid,source text not null,status text not null default 'placed',discount numeric(12,2) not null default 0,payment_status text not null default 'unpaid',created_at timestamptz not null default now()
);
create table if not exists public.order_items(
 id uuid primary key default gen_random_uuid(),order_id uuid not null references public.orders(id) on delete cascade,
 menu_item_id text not null,name text not null,qty numeric(12,3) not null,unit_price numeric(12,2) not null,station text,status text not null default 'new',recipe_snapshot jsonb not null default '{}'::jsonb,cost_snapshot jsonb not null default '{}'::jsonb
);
create table if not exists public.ingredients(
 id uuid primary key default gen_random_uuid(),outlet_id uuid not null references public.outlets(id) on delete cascade,
 slug text not null,name text not null,unit text not null,on_hand numeric(14,3) not null default 0,average_unit_cost numeric(14,6) not null default 0,unique(outlet_id,slug)
);
create table if not exists public.stock_movements(
 id uuid primary key default gen_random_uuid(),outlet_id uuid not null references public.outlets(id) on delete cascade,
 ingredient_id uuid not null references public.ingredients(id),order_id uuid references public.orders(id),order_item_id uuid references public.order_items(id),qty numeric(14,3) not null,reason text not null,metadata jsonb not null default '{}'::jsonb,created_at timestamptz not null default now()
);
create table if not exists public.payments(
 id uuid primary key default gen_random_uuid(),order_id uuid not null references public.orders(id),amount numeric(12,2) not null,fee numeric(12,2) not null default 0,method text not null,status text not null default 'captured',created_at timestamptz not null default now()
);
create table if not exists public.waste(
 id uuid primary key default gen_random_uuid(),outlet_id uuid not null references public.outlets(id),ingredient_id uuid not null references public.ingredients(id),qty numeric(14,3) not null,cost numeric(12,2) not null,reason text not null,created_at timestamptz not null default now()
);
create table if not exists public.restaurant_events(
 id bigint generated always as identity primary key,outlet_id uuid not null references public.outlets(id) on delete cascade,
 event_type text not null,entity_type text not null,entity_id text,payload jsonb not null default '{}'::jsonb,created_at timestamptz not null default now()
);

alter table public.restaurants enable row level security;
alter table public.outlets enable row level security;
alter table public.memberships enable row level security;
alter table public.tables enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.ingredients enable row level security;
alter table public.stock_movements enable row level security;
alter table public.payments enable row level security;
alter table public.waste enable row level security;
alter table public.restaurant_events enable row level security;

create or replace function public.can_access_restaurant(rid uuid) returns boolean language sql stable security definer set search_path=public as $$select exists(select 1 from memberships m where m.restaurant_id=rid and m.user_id=auth.uid())$$;
create policy restaurant_member_read on public.restaurants for select using(public.can_access_restaurant(id));
create policy outlet_member_all on public.outlets for all using(public.can_access_restaurant(restaurant_id)) with check(public.can_access_restaurant(restaurant_id));
create policy membership_self_read on public.memberships for select using(user_id=auth.uid());
create policy table_member_all on public.tables for all using(exists(select 1 from outlets o where o.id=tables.outlet_id and public.can_access_restaurant(o.restaurant_id))) with check(exists(select 1 from outlets o where o.id=tables.outlet_id and public.can_access_restaurant(o.restaurant_id)));
create policy order_member_all on public.orders for all using(exists(select 1 from outlets o where o.id=orders.outlet_id and public.can_access_restaurant(o.restaurant_id))) with check(exists(select 1 from outlets o where o.id=orders.outlet_id and public.can_access_restaurant(o.restaurant_id)));
create policy item_member_all on public.order_items for all using(exists(select 1 from orders ord join outlets o on o.id=ord.outlet_id where ord.id=order_items.order_id and public.can_access_restaurant(o.restaurant_id))) with check(exists(select 1 from orders ord join outlets o on o.id=ord.outlet_id where ord.id=order_items.order_id and public.can_access_restaurant(o.restaurant_id)));
create policy ingredient_member_all on public.ingredients for all using(exists(select 1 from outlets o where o.id=ingredients.outlet_id and public.can_access_restaurant(o.restaurant_id))) with check(exists(select 1 from outlets o where o.id=ingredients.outlet_id and public.can_access_restaurant(o.restaurant_id)));
create policy movement_member_all on public.stock_movements for all using(exists(select 1 from outlets o where o.id=stock_movements.outlet_id and public.can_access_restaurant(o.restaurant_id))) with check(exists(select 1 from outlets o where o.id=stock_movements.outlet_id and public.can_access_restaurant(o.restaurant_id)));
create policy payment_member_read on public.payments for select using(exists(select 1 from orders ord join outlets o on o.id=ord.outlet_id where ord.id=payments.order_id and public.can_access_restaurant(o.restaurant_id)));
create policy waste_member_all on public.waste for all using(exists(select 1 from outlets o where o.id=waste.outlet_id and public.can_access_restaurant(o.restaurant_id))) with check(exists(select 1 from outlets o where o.id=waste.outlet_id and public.can_access_restaurant(o.restaurant_id)));
create policy event_member_read on public.restaurant_events for select using(exists(select 1 from outlets o where o.id=restaurant_events.outlet_id and public.can_access_restaurant(o.restaurant_id)));
