-- Create checkout_data table in Supabase for tracking completed orders and checkouts
-- This table stores completed order information for analytics and order tracking

CREATE TABLE IF NOT EXISTS checkout_data (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_info JSONB NOT NULL,
  cart_items JSONB NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount > 0),
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'card', 'upi', 'bank_transfer', 'other')),
  order_number TEXT NOT NULL UNIQUE,
  user_session TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_checkout_data_session ON checkout_data(user_session);
CREATE INDEX IF NOT EXISTS idx_checkout_data_created_at ON checkout_data(created_at);
CREATE INDEX IF NOT EXISTS idx_checkout_data_order_number ON checkout_data(order_number);
CREATE INDEX IF NOT EXISTS idx_checkout_data_payment_method ON checkout_data(payment_method);

-- Enable Row Level Security (RLS)
ALTER TABLE checkout_data ENABLE ROW LEVEL SECURITY;

-- Create RLS policy - Allow all operations (for checkout functionality)
CREATE POLICY "Allow all operations on checkout_data" ON checkout_data
  FOR ALL USING (true) WITH CHECK (true);

-- Add comments for documentation
COMMENT ON TABLE checkout_data IS 'Stores completed order information for analytics and tracking';
COMMENT ON COLUMN checkout_data.customer_info IS 'JSON object containing customer contact information';
COMMENT ON COLUMN checkout_data.cart_items IS 'JSON array of cart items included in the order';
COMMENT ON COLUMN checkout_data.order_number IS 'Unique order identifier for tracking';
COMMENT ON COLUMN checkout_data.user_session IS 'Session identifier for analytics correlation';
