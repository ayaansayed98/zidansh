-- Create bulk_orders table in Supabase
CREATE TABLE bulk_orders (
  id BIGSERIAL PRIMARY KEY,
  type TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  details TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add RLS (Row Level Security) policies
ALTER TABLE bulk_orders ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert bulk orders (for the form submission)
CREATE POLICY "Allow public to insert bulk orders" ON bulk_orders
  FOR INSERT WITH CHECK (true);

-- Allow authenticated users to view and update bulk orders
CREATE POLICY "Allow authenticated to view bulk orders" ON bulk_orders
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated to update bulk orders" ON bulk_orders
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_bulk_orders_updated_at
  BEFORE UPDATE ON bulk_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
