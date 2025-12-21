-- Create product_interactions table in Supabase for tracking user product interactions
-- This table tracks how users interact with products (views, cart adds, wishlist adds, etc.)

CREATE TABLE IF NOT EXISTS product_interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_name TEXT NOT NULL,
  product_brand TEXT NOT NULL,
  product_price DECIMAL(10,2) NOT NULL,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('view', 'cart_add', 'wishlist_add', 'search', 'purchase')),
  user_session TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_product_interactions_session ON product_interactions(user_session);
CREATE INDEX IF NOT EXISTS idx_product_interactions_type ON product_interactions(interaction_type);
CREATE INDEX IF NOT EXISTS idx_product_interactions_created_at ON product_interactions(created_at);
CREATE INDEX IF NOT EXISTS idx_product_interactions_product_name ON product_interactions(product_name);

-- Enable Row Level Security (RLS)
ALTER TABLE product_interactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policy - Allow all operations (for analytics tracking)
CREATE POLICY "Allow all operations on product_interactions" ON product_interactions
  FOR ALL USING (true) WITH CHECK (true);

-- Add comments for documentation
COMMENT ON TABLE product_interactions IS 'Tracks user interactions with products for analytics';
COMMENT ON COLUMN product_interactions.interaction_type IS 'Type of interaction: view, cart_add, wishlist_add, search, or purchase';
COMMENT ON COLUMN product_interactions.user_session IS 'Unique session identifier for tracking user behavior';
