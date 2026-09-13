-- Munaffa v2: consumer discovery, onboarding, reservations, loyalty and richer outlet metadata.
-- Run after ../schema.sql on an existing project.

alter table public.profiles add column if not exists default_mode text default 'customer';
alter table public.profiles add column if not exists preferences jsonb not null default '{}'::jsonb;
alter table public.profiles add column if not exists updated_at timestamptz not null default now();

alter table public.outlets add column if not exists venue_type text not null default 'restaurant' check (venue_type in ('restaurant','cafe','hotel','cloud_kitchen','food_court'));
alter table public.outlets add column if not exists latitude double precision;
alter table public.outlets add column if not exists longitude double precision;
alter table public.outlets add column if not exists public_listing boolean not null default false;
alter table public.outlets add column if not exists rating numeric(3,2) default 0;
alter table public.outlets add column if not exists review_count int not null default 0;
alter table public.outlets add column if not exists cost_for_two numeric(12,2);
alter table public.outlets add column if not exists hero_image text;
alter table public.outlets add column if not exists cuisines text[] not null default '{}';
alter table public.outlets add column if not exists tags text[] not null default '{}';
alter table public.outlets add column if not exists direct_ordering boolean not null default true;
alter table public.outlets add column if not exists booking_enabled boolean not null default true;
alter table public.outlets add column if not exists ordering_mode text not null default 'hybrid' check(ordering_mode in('hybrid','waiter_confirm','browse_only','direct'));

create table if not exists public.reservations(
  id uuid primary key default gen_random_uuid(),
  outlet_id uuid not null references public.outlets(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  customer_name text not null,
  customer_phone text,
  party_size int not null check(party_size between 1 and 50),
  reserved_at timestamptz not null,
  status text not null default 'confirmed' check(status in('requested','confirmed','seated','completed','cancelled','no_show')),
  source text not null default 'munaffa',
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists public.favorites(
  user_id uuid not null references auth.users(id) on delete cascade,
  outlet_id uuid not null references public.outlets(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(user_id,outlet_id)
);

create table if not exists public.loyalty_accounts(
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  points int not null default 0,
  tier text not null default 'member',
  lifetime_spend numeric(14,2) not null default 0,
  updated_at timestamptz not null default now(),
  unique(user_id,restaurant_id)
);

create table if not exists public.service_requests(
  id uuid primary key default gen_random_uuid(),
  outlet_id uuid not null references public.outlets(id) on delete cascade,
  table_id uuid references public.restaurant_tables(id) on delete set null,
  order_id uuid references public.orders(id) on delete set null,
  request_type text not null check(request_type in('water','waiter','bill','cutlery','plate','cleaning','other')),
  status text not null default 'new' check(status in('new','accepted','completed','cancelled')),
  assigned_to uuid references auth.users(id),
  requested_at timestamptz not null default now(),
  accepted_at timestamptz,
  completed_at timestamptz
);

create table if not exists public.payment_events(
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id) on delete set null,
  outlet_id uuid not null references public.outlets(id) on delete cascade,
  provider text not null,
  provider_ref text,
  amount numeric(12,2) not null,
  status text not null check(status in('created','authorized','captured','failed','refunded')),
  payment_method text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.restaurant_subscriptions(
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  plan text not null check(plan in('launch','growth','profit','scale')),
  status text not null default 'trialing' check(status in('trialing','active','past_due','cancelled')),
  amount_monthly numeric(12,2),
  provider_customer_ref text,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  unique(restaurant_id)
);

create table if not exists public.staff_shifts(
  id uuid primary key default gen_random_uuid(),
  outlet_id uuid not null references public.outlets(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  starts_at timestamptz not null,
  ends_at timestamptz,
  status text not null default 'scheduled' check(status in('scheduled','clocked_in','break','clocked_out','cancelled')),
  created_at timestamptz not null default now()
);

alter table public.reservations enable row level security;
alter table public.favorites enable row level security;
alter table public.loyalty_accounts enable row level security;
alter table public.service_requests enable row level security;
alter table public.payment_events enable row level security;
alter table public.restaurant_subscriptions enable row level security;
alter table public.staff_shifts enable row level security;

-- Public discovery exposes only outlets that explicitly opted into listing.
drop policy if exists "public listed outlets" on public.outlets;
create policy "public listed outlets" on public.outlets for select to anon,authenticated using(public_listing=true or exists(select 1 from memberships m where m.outlet_id=id and m.user_id=auth.uid() and m.active));

create policy "reservation owner create" on public.reservations for insert to authenticated with check(user_id=auth.uid());
create policy "reservation owner read" on public.reservations for select to authenticated using(user_id=auth.uid() or exists(select 1 from outlets o where o.id=outlet_id and public.is_restaurant_member(o.restaurant_id)));
create policy "reservation restaurant manage" on public.reservations for update to authenticated using(exists(select 1 from outlets o where o.id=outlet_id and public.can_manage_restaurant(o.restaurant_id)));

create policy "favorites self" on public.favorites for all to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy "loyalty self read" on public.loyalty_accounts for select to authenticated using(user_id=auth.uid() or public.is_restaurant_member(restaurant_id));
create policy "service public create" on public.service_requests for insert to anon,authenticated with check(true);
create policy "service outlet members" on public.service_requests for select to authenticated using(exists(select 1 from outlets o where o.id=outlet_id and public.is_restaurant_member(o.restaurant_id)));
create policy "service outlet update" on public.service_requests for update to authenticated using(exists(select 1 from outlets o where o.id=outlet_id and public.is_restaurant_member(o.restaurant_id)));
create policy "payments outlet members" on public.payment_events for select to authenticated using(exists(select 1 from outlets o where o.id=outlet_id and public.is_restaurant_member(o.restaurant_id)));
create policy "subscriptions managers" on public.restaurant_subscriptions for select to authenticated using(public.can_manage_restaurant(restaurant_id));
create policy "shift self or managers" on public.staff_shifts for select to authenticated using(user_id=auth.uid() or exists(select 1 from outlets o where o.id=outlet_id and public.can_manage_restaurant(o.restaurant_id)));
create policy "shift managers manage" on public.staff_shifts for all to authenticated using(exists(select 1 from outlets o where o.id=outlet_id and public.can_manage_restaurant(o.restaurant_id))) with check(exists(select 1 from outlets o where o.id=outlet_id and public.can_manage_restaurant(o.restaurant_id)));

create index if not exists outlets_public_geo_idx on public.outlets(public_listing,venue_type,latitude,longitude);
create index if not exists reservations_outlet_time_idx on public.reservations(outlet_id,reserved_at);
create index if not exists service_requests_outlet_status_idx on public.service_requests(outlet_id,status,requested_at desc);
create index if not exists staff_shifts_outlet_start_idx on public.staff_shifts(outlet_id,starts_at desc);
