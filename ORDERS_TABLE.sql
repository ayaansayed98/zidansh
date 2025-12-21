-- Create orders table for storing order information and tracking links
CREATE TABLE orders (
  id BIGSERIAL PRIMARY KEY,
  order_id TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  customer_address TEXT,
  order_items JSONB NOT NULL, -- Store cart items as JSON
  total_amount DECIMAL(10,2) NOT NULL,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  order_status TEXT DEFAULT 'processing' CHECK (order_status IN ('processing', 'shipped', 'delivered', 'cancelled')),
  tracking_link TEXT, -- Manually entered by admin after getting from delivery partner
  tracking_updated_at TIMESTAMP WITH TIME ZONE,
  tracking_updated_by TEXT, -- Admin who updated the tracking
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add RLS (Row Level Security) policies
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert orders (for checkout process)
CREATE POLICY "Allow public to insert orders" ON orders
  FOR INSERT WITH CHECK (true);

-- Allow authenticated users to view orders (for admin dashboard)
CREATE POLICY "Allow authenticated to view orders" ON orders
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to update orders (for admin to add tracking links)
CREATE POLICY "Allow authenticated to update orders" ON orders
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create indexes for performance
CREATE INDEX idx_orders_order_id ON orders(order_id);
CREATE INDEX idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX idx_orders_customer_email ON orders(customer_email);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_order_status ON orders(order_status);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_orders_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_orders_updated_at_column();
