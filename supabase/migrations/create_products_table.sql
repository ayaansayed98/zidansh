-- Re-create the table to include ALL product details from the CSV
-- We drop the table first to ensure the schema is updated cleanly
drop table if exists product_variations;

create table product_variations (
  variation_id text primary key,
  product_id integer not null,
  product_name text,
  brand text,
  cloth_type text,
  sku text not null unique,
  size text,
  price numeric,
  original_price numeric,
  stock integer default 0,
  low_stock_threshold integer default 5,
  is_active boolean default true,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
alter table product_variations enable row level security;

-- Create a permissive policy to allow public read/write for the import script
-- (In production, restrict "Using" and "With Check" to authenticated users only)
create policy "Allow public access"
  on product_variations
  for all
  to public
  using (true)
  with check (true);
