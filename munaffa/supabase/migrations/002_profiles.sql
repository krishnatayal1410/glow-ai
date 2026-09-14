create table if not exists public.profiles(
 id uuid primary key references auth.users(id) on delete cascade,
 display_name text,
 default_mode text not null default 'customer' check(default_mode in('customer','owner','manager','staff')),
 business_type text check(business_type is null or business_type in('restaurant','cafe','qsr','hotel-fb')),
 staff_role text check(staff_role is null or staff_role in('pos','waiter','kitchen','stock')),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
drop policy if exists profile_self_read on public.profiles;
drop policy if exists profile_self_insert on public.profiles;
drop policy if exists profile_self_update on public.profiles;
create policy profile_self_read on public.profiles for select using(id=auth.uid());
create policy profile_self_insert on public.profiles for insert with check(id=auth.uid());
create policy profile_self_update on public.profiles for update using(id=auth.uid()) with check(id=auth.uid());
