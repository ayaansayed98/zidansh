-- Create customers table in Supabase for customer management
CREATE TABLE IF NOT EXISTS customers (
  id BIGSERIAL PRIMARY KEY,
  phone_number TEXT NOT NULL,
  email_address TEXT NOT NULL,
  order_number TEXT NOT NULL,
  type_of_clothes TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  payment_amount DECIMAL(10,2) NOT NULL,
  type_of_payment TEXT NOT NULL CHECK (type_of_payment IN ('cash', 'card', 'upi', 'bank_transfer', 'other')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add RLS (Row Level Security) policies
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert customers (for the form submission)
DROP POLICY IF EXISTS "Allow public to insert customers" ON customers;
CREATE POLICY "Allow public to insert customers" ON customers
  FOR INSERT WITH CHECK (true);

-- Allow authenticated users to view and update customers
DROP POLICY IF EXISTS "Allow authenticated to view customers" ON customers;
CREATE POLICY "Allow authenticated to view customers" ON customers
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated to update customers" ON customers;
CREATE POLICY "Allow authenticated to update customers" ON customers
  FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated to delete customers" ON customers;
CREATE POLICY "Allow authenticated to delete customers" ON customers
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_customers_phone_number ON customers(phone_number);
CREATE INDEX IF NOT EXISTS idx_customers_email_address ON customers(email_address);
CREATE INDEX IF NOT EXISTS idx_customers_order_number ON customers(order_number);
CREATE INDEX IF NOT EXISTS idx_customers_created_at ON customers(created_at);

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_customers_updated_at ON customers;
CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
