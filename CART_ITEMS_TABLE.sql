-- Create cart_items table in Supabase for tracking user shopping carts
-- This table stores items added to cart by users for analytics and persistence

CREATE TABLE IF NOT EXISTS cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_name TEXT NOT NULL,
  product_brand TEXT NOT NULL,
  product_price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  user_session TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_cart_items_session ON cart_items(user_session);
CREATE INDEX IF NOT EXISTS idx_cart_items_created_at ON cart_items(created_at);
CREATE INDEX IF NOT EXISTS idx_cart_items_product_name ON cart_items(product_name);

-- Enable Row Level Security (RLS)
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Create RLS policy - Allow all operations (for cart functionality)
CREATE POLICY "Allow all operations on cart_items" ON cart_items
  FOR ALL USING (true) WITH CHECK (true);

-- Add comments for documentation
COMMENT ON TABLE cart_items IS 'Stores items in user shopping carts for analytics and persistence';
COMMENT ON COLUMN cart_items.user_session IS 'Unique session identifier for tracking user cart';
COMMENT ON COLUMN cart_items.quantity IS 'Quantity of the product in cart';
