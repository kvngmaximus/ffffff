create extension if not exists pgcrypto;

create type stock_status as enum ('in_stock','low_stock','out_of_stock');

create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  user_type text not null default 'customer',
  status text not null default 'active',
  phone text,
  address text,
  is_verified boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  image_url text,
  created_at timestamptz default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  sku text unique,
  name text not null,
  description text,
  price numeric(10,2) not null,
  category_id uuid not null references public.categories(id) on delete restrict,
  rating numeric(3,2),
  review_count integer default 0,
  stock_status stock_status not null default 'in_stock',
  discount_percent integer default 0,
  best_seller boolean default false,
  is_new boolean default false,
  sizes text[],
  tags text[],
  image_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at
before update on public.products
for each row execute function public.set_updated_at();

create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  position integer default 0,
  created_at timestamptz default now()
);

create table if not exists public.wishlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz default now(),
  unique(user_id, product_id)
);

create table if not exists public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'active',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create or replace function public.set_cart_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_carts_updated_at on public.carts;
create trigger trg_carts_updated_at
before update on public.carts
for each row execute function public.set_cart_updated_at();

create unique index if not exists carts_one_active_per_user on public.carts(user_id) where status = 'active';

create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  quantity integer not null default 1,
  price_at_add numeric(10,2),
  created_at timestamptz default now(),
  unique(cart_id, product_id)
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  cart_id uuid references public.carts(id) on delete set null,
  status text not null default 'pending',
  total numeric(10,2) not null default 0,
  currency text not null default 'USD',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create or replace function public.set_order_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_orders_updated_at on public.orders;
create trigger trg_orders_updated_at
before update on public.orders
for each row execute function public.set_order_updated_at();

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  provider text not null default 'flutterwave',
  status text not null,
  amount numeric(10,2) not null,
  currency text not null default 'USD',
  reference text,
  meta jsonb,
  created_at timestamptz default now()
);

alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.wishlists enable row level security;
alter table public.carts enable row level security;
alter table public.cart_items enable row level security;
alter table public.orders enable row level security;
alter table public.payments enable row level security;
alter table public.profiles enable row level security;

create policy "Public read categories" on public.categories for select using (true);
create policy "Public read products" on public.products for select using (true);
create policy "Public read product images" on public.product_images for select using (true);

create policy "Own profile read" on public.profiles for select using (auth.uid() = user_id);
create policy "Own profile upsert" on public.profiles for insert with check (auth.uid() = user_id);
create policy "Own profile update" on public.profiles for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Admin profile read all" on public.profiles for select using (exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.user_type = 'admin'));
create policy "Admin profile update all" on public.profiles for update using (exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.user_type = 'admin'));

create policy "Wishlist read own" on public.wishlists for select using (auth.uid() = user_id);
create policy "Wishlist insert own" on public.wishlists for insert with check (auth.uid() = user_id);
create policy "Wishlist delete own" on public.wishlists for delete using (auth.uid() = user_id);
create policy "Admin wishlist all" on public.wishlists for all using (exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.user_type = 'admin'));

create policy "Carts read own" on public.carts for select using (auth.uid() = user_id);
create policy "Carts insert own" on public.carts for insert with check (auth.uid() = user_id);
create policy "Carts update own" on public.carts for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Carts delete own" on public.carts for delete using (auth.uid() = user_id);
create policy "Admin carts all" on public.carts for all using (exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.user_type = 'admin'));

create policy "Cart items read own" on public.cart_items
for select using (exists (select 1 from public.carts c where c.id = cart_id and c.user_id = auth.uid()));
create policy "Cart items insert own" on public.cart_items
for insert with check (exists (select 1 from public.carts c where c.id = cart_id and c.user_id = auth.uid()));
create policy "Cart items update own" on public.cart_items
for update using (exists (select 1 from public.carts c where c.id = cart_id and c.user_id = auth.uid()))
with check (exists (select 1 from public.carts c where c.id = cart_id and c.user_id = auth.uid()));
create policy "Cart items delete own" on public.cart_items
for delete using (exists (select 1 from public.carts c where c.id = cart_id and c.user_id = auth.uid()));
create policy "Admin cart items all" on public.cart_items for all using (exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.user_type = 'admin'));

create policy "Orders read own" on public.orders for select using (auth.uid() = user_id);
create policy "Orders insert own" on public.orders for insert with check (auth.uid() = user_id);
create policy "Orders update own" on public.orders for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Admin orders all" on public.orders for all using (exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.user_type = 'admin'));

create policy "Payments read own" on public.payments
for select using (exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()));
create policy "Payments insert own" on public.payments
for insert with check (exists (select 1 from public.orders o where o.id = order_id and o.user_id = auth.uid()));
create policy "Admin payments all" on public.payments for all using (exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.user_type = 'admin'));

create table if not exists public.coupons (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  description text,
  discount_type text not null default 'percent',
  amount numeric(10,2) not null,
  max_uses integer,
  used_count integer default 0,
  active boolean default true,
  valid_from timestamptz,
  valid_to timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.coupons enable row level security;
create policy "Admin coupons all" on public.coupons for all using (exists (select 1 from public.profiles p where p.user_id = auth.uid() and p.user_type = 'admin'));
create policy "Public read active coupons" on public.coupons for select using (active = true);

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Public read product-images" on storage.objects
for select using (bucket_id = 'product-images');
create policy "Authenticated insert product-images" on storage.objects
for insert with check (bucket_id = 'product-images' and auth.role() = 'authenticated');
create policy "Authenticated update product-images" on storage.objects
for update using (bucket_id = 'product-images' and auth.role() = 'authenticated');
create policy "Authenticated delete product-images" on storage.objects
for delete using (bucket_id = 'product-images' and auth.role() = 'authenticated');

insert into public.categories (name, slug, image_url)
values
 ('Cleanser','cleanser',''),
 ('Moisturizer','moisturizer',''),
 ('Toner','toner',''),
 ('Brightening','brightening',''),
 ('Foundation','foundation',''),
 ('Sunscreen','sunscreen',''),
 ('Serum','serum','')
on conflict (slug) do nothing;

insert into public.products (sku,name,description,price,category_id,stock_status,discount_percent,best_seller,is_new,tags,image_url)
select 'SKU-SILK-001','SilkSkin Serum','Vitamin-rich serum designed to brighten and smooth skin.',48, id,'in_stock',20,true,true, array['Skincare','Serums','Vitamin C'],' '
from public.categories where slug='serum';

insert into public.products (sku,name,description,price,category_id,stock_status,discount_percent,best_seller,is_new,tags,image_url)
select 'SKU-FOUND-001','Smooth Foundation','Lightweight foundation for a soft-touch finish.',20, id,'in_stock',50,false,true, array['Makeup','Foundation'],' '
from public.categories where slug='foundation';

-- Extensions
create extension if not exists pgcrypto;

-- Categories
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  image_url text,
  created_at timestamp with time zone default now()
);
alter table public.categories enable row level security;
create policy "Public read categories" on public.categories
  for select using (true);

-- Products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  sku text,
  name text not null,
  description text,
  price numeric not null,
  discount_percent int,
  stock_status text check (stock_status in ('in_stock','low_stock','out_of_stock')),
  rating numeric,
  review_count int,
  image_url text,
  category_id uuid not null references public.categories(id) on delete set null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
alter table public.products enable row level security;
create policy "Public read products" on public.products
  for select using (true);

-- Product images
create table if not exists public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  position int default 0,
  created_at timestamp with time zone default now()
);
alter table public.product_images enable row level security;
create policy "Public read product_images" on public.product_images
  for select using (true);

-- Profiles
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique not null,
  full_name text,
  avatar_url text,
  user_type text, -- 'admin' | 'user'
  status text,
  created_at timestamp with time zone default now()
);
alter table public.profiles enable row level security;
create policy "Own profile read" on public.profiles
  for select using (user_id = auth.uid());
create policy "Own profile upsert" on public.profiles
  for insert with check (user_id = auth.uid());
create policy "Own profile update" on public.profiles
  for update using (user_id = auth.uid());

-- Wishlists
create table if not exists public.wishlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamp with time zone default now()
);
alter table public.wishlists enable row level security;
create policy "Own wishlist read" on public.wishlists
  for select using (user_id = auth.uid());
create policy "Own wishlist write" on public.wishlists
  for insert with check (user_id = auth.uid());
create policy "Own wishlist delete" on public.wishlists
  for delete using (user_id = auth.uid());

-- Carts
create table if not exists public.carts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  status text not null default 'active', -- active | completed | paid
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
alter table public.carts enable row level security;
create policy "Own carts read" on public.carts
  for select using (user_id = auth.uid());
create policy "Own carts write" on public.carts
  for insert with check (user_id = auth.uid());
create policy "Own carts update" on public.carts
  for update using (user_id = auth.uid());
create policy "Own carts delete" on public.carts
  for delete using (user_id = auth.uid());

-- Cart items
create table if not exists public.cart_items (
  id uuid primary key default gen_random_uuid(),
  cart_id uuid not null references public.carts(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  quantity int not null default 1,
  created_at timestamp with time zone default now()
);
alter table public.cart_items enable row level security;
create policy "Own cart_items read" on public.cart_items
  for select using (exists (select 1 from public.carts c where c.id = cart_items.cart_id and c.user_id = auth.uid()));
create policy "Own cart_items write" on public.cart_items
  for insert with check (exists (select 1 from public.carts c where c.id = cart_items.cart_id and c.user_id = auth.uid()));
create policy "Own cart_items update" on public.cart_items
  for update using (exists (select 1 from public.carts c where c.id = cart_items.cart_id and c.user_id = auth.uid()));
create policy "Own cart_items delete" on public.cart_items
  for delete using (exists (select 1 from public.carts c where c.id = cart_items.cart_id and c.user_id = auth.uid()));

-- Payments
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  amount numeric not null,
  status text not null, -- e.g., 'successful', 'failed'
  reference text,
  created_at timestamp with time zone default now()
);
alter table public.payments enable row level security;
create policy "Own payments read" on public.payments
  for select using (user_id = auth.uid());
create policy "Own payments write" on public.payments
  for insert with check (user_id = auth.uid());
-- Admins can read all payments (for revenue)
create policy "Admin read all payments" on public.payments
  for select using (
    exists (
      select 1 from public.profiles p
      where p.user_id = auth.uid() and p.user_type = 'admin'
    )
  );

-- Addresses
create table if not exists public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  line1 text not null,
  city text not null,
  country text not null,
  created_at timestamp with time zone default now()
);
alter table public.addresses enable row level security;
create policy "Own addresses read" on public.addresses
  for select using (user_id = auth.uid());
create policy "Own addresses write" on public.addresses
  for insert with check (user_id = auth.uid());
create policy "Own addresses update" on public.addresses
  for update using (user_id = auth.uid());
create policy "Own addresses delete" on public.addresses
  for delete using (user_id = auth.uid());

-- Optional Orders (future)
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid(),
  total numeric not null,
  status text not null default 'pending',
  created_at timestamp with time zone default now()
);
alter table public.orders enable row level security;
create policy "Own orders read" on public.orders
  for select using (user_id = auth.uid());
create policy "Own orders write" on public.orders
  for insert with check (user_id = auth.uid());

-- Sample categories
insert into public.categories (name, slug, image_url) values
 ('Cleanser','cleanser','/images/aquaaura.png'),
 ('Moisturizer','moisturizer','/images/oceanmist.png'),
 ('Toner','toner','/images/collection.png'),
 ('Brightening','brightening','/images/collection2.png'),
 ('Foundation','foundation','/images/velvetrose.png'),
 ('Sunscreen','sunscreen','/images/arganglow.png'),
 ('Serum','serum','/images/silkskinserum.png')
on conflict do nothing;

-- Helper to get category id by slug
-- Example inserts for products (repeat pattern to add more)
insert into public.products (sku, name, description, price, discount_percent, stock_status, rating, review_count, image_url, category_id)
values
 ('GRFR85648HGJ','SilkSculpt Serum','Premium vitamin C serum.',35,50,'in_stock',4.9,245,'/images/silkskinserum.png',(select id from public.categories where slug='serum' limit 1)),
 ('GRFR85648HGK','SilkSkin Serum','Retinol serum.',48,20,'in_stock',4.9,245,'/images/silkskinserum.png',(select id from public.categories where slug='serum' limit 1)),
 ('ARG12345','Argan Glow','Argan oil for hair.',63,null,'in_stock',5.0,112,'/images/arganglow.png',(select id from public.categories where slug='sunscreen' limit 1)),
 ('EXA99887','Exaltata Kit','Complete body care kit.',45,10,'in_stock',5.0,87,'/images/Exaltata.jpeg',(select id from public.categories where slug='moisturizer' limit 1)),
 ('FOU65432','Smooth Foundation','Soft matte foundation.',20,50,'in_stock',4.9,321,'/images/velvetrose.png',(select id from public.categories where slug='foundation' limit 1)),
 ('CREM77881','Smooth Body Cream','Nourishing body cream.',30,50,'in_stock',5.0,140,'/images/smoothcream.png',(select id from public.categories where slug='moisturizer' limit 1)),
 ('AQAA11223','AquaAura Wellness','Hydration-first skincare.',30,50,'in_stock',4.8,90,'/images/aquaaura.png',(select id from public.categories where slug='moisturizer' limit 1)),
 ('VROS77665','Velvet Rose','Makeup essential.',10,50,'in_stock',4.9,210,'/images/velvetrose.png',(select id from public.categories where slug='foundation' limit 1)),
 ('HHAV88992','Herbal Haven','Botanical formulation.',10,50,'in_stock',5.0,124,'/images/herbalhaven.png',(select id from public.categories where slug='moisturizer' limit 1)),
 ('EBGL44772','Essence Body Gel','Light body gel.',30,50,'in_stock',4.8,88,'/images/essencebodygel.png',(select id from public.categories where slug='moisturizer' limit 1)),
 ('HYDL23444','HydraLuxe Serum','Luxe hydrating serum.',20,50,'in_stock',4.9,245,'/images/hydraluxe.png',(select id from public.categories where slug='serum' limit 1)),
 ('OCMS44577','OceanMist Moisturizer','Moisturizer for oily skin.',20,50,'in_stock',4.8,133,'/images/oceanmist.png',(select id from public.categories where slug='moisturizer' limit 1));

-- Example product images (optional)
insert into public.product_images (product_id, url, position)
select p.id, '/images/silkskinserum.png', 0 from public.products p where p.name = 'SilkSculpt Serum';