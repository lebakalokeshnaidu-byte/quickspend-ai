-- QuickSpend AI — Supabase schema
-- Run this in the Supabase SQL editor (or `supabase db push`) on a fresh project.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

create type classification_label as enum (
  'Planned Grocery',
  'Impulse Buy',
  'Junk/Snack',
  'Recurring Staple',
  'Household Need',
  'Unclear'
);

create type import_job_status as enum ('pending', 'processing', 'completed', 'failed');

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

-- Mirrors Supabase auth.users; extend with app-specific profile fields here.
create table if not exists public.users (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  display_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.platforms (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  color text not null default '#9b5cff',
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now()
);

create table if not exists public.import_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users (id) on delete cascade,
  platform_id uuid references public.platforms (id) on delete set null,
  file_name text not null,
  file_url text,
  status import_job_status not null default 'pending',
  error_message text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users (id) on delete cascade,
  platform_id uuid not null references public.platforms (id) on delete restrict,
  import_job_id uuid references public.import_jobs (id) on delete set null,
  ordered_at timestamptz not null default now(),
  total_amount numeric(10, 2) not null default 0,
  item_count integer not null default 0,
  is_late_night boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  category_id uuid references public.categories (id) on delete set null,
  name text not null,
  classification classification_label not null default 'Unclear',
  unit_price numeric(10, 2) not null default 0,
  quantity integer not null default 1,
  confidence numeric(3, 2),
  created_at timestamptz not null default now()
);

create table if not exists public.recurring_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users (id) on delete cascade,
  platform_id uuid not null references public.platforms (id) on delete cascade,
  item_name text not null,
  category_id uuid references public.categories (id) on delete set null,
  frequency_days integer not null,
  avg_price numeric(10, 2) not null,
  times_ordered integer not null default 1,
  last_ordered_at timestamptz not null,
  next_expected_at date,
  updated_at timestamptz not null default now(),
  unique (user_id, platform_id, item_name)
);

-- ---------------------------------------------------------------------------
-- Indexes
-- ---------------------------------------------------------------------------

create index if not exists idx_orders_user_ordered_at on public.orders (user_id, ordered_at desc);
create index if not exists idx_orders_platform on public.orders (platform_id);
create index if not exists idx_order_items_order on public.order_items (order_id);
create index if not exists idx_order_items_name on public.order_items (name);
create index if not exists idx_import_jobs_user on public.import_jobs (user_id, created_at desc);
create index if not exists idx_recurring_items_user on public.recurring_items (user_id);

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------
-- Reference data (platforms, categories) is public read. User-owned tables
-- are scoped to auth.uid(). API routes in this MVP use the service-role key
-- and bypass RLS by design — enable these policies once end-user auth (e.g.
-- Supabase Auth) is wired into the app.

alter table public.platforms enable row level security;
alter table public.categories enable row level security;
alter table public.users enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.recurring_items enable row level security;
alter table public.import_jobs enable row level security;

create policy "Platforms are publicly readable" on public.platforms for select using (true);
create policy "Categories are publicly readable" on public.categories for select using (true);

create policy "Users manage their own profile" on public.users
  for all using (auth.uid() = id) with check (auth.uid() = id);

create policy "Users manage their own orders" on public.orders
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage their own order items" on public.order_items
  for all using (
    exists (select 1 from public.orders o where o.id = order_items.order_id and o.user_id = auth.uid())
  )
  with check (
    exists (select 1 from public.orders o where o.id = order_items.order_id and o.user_id = auth.uid())
  );

create policy "Users manage their own recurring items" on public.recurring_items
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage their own import jobs" on public.import_jobs
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Seed reference data
-- ---------------------------------------------------------------------------

insert into public.platforms (slug, name, color) values
  ('blinkit', 'Blinkit', '#ffcc33'),
  ('zepto', 'Zepto', '#9b5cff'),
  ('instamart', 'Instamart', '#ff7a59'),
  ('bigbasket', 'BigBasket', '#5fd870')
on conflict (slug) do nothing;

insert into public.categories (name) values
  ('Dairy & Bakery'),
  ('Snacks & Namkeen'),
  ('Beverages'),
  ('Ice Cream & Desserts'),
  ('Personal Care'),
  ('Household Essentials'),
  ('Fruits & Vegetables'),
  ('Staples & Atta'),
  ('Instant & Frozen Food'),
  ('Baby Care')
on conflict (name) do nothing;
