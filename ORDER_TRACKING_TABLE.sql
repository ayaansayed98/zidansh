-- Create order_tracking_requests table in Supabase for tracking order tracking requests
CREATE TABLE order_tracking_requests (
  id BIGSERIAL PRIMARY KEY,
  order_number TEXT NOT NULL,
  phone_number TEXT,
  email_address TEXT,
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  ip_address INET,
  user_agent TEXT,
  session_id TEXT,
  status TEXT DEFAULT 'requested' CHECK (status IN ('requested', 'found', 'not_found', 'error')),
  response_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add RLS (Row Level Security) policies
ALTER TABLE order_tracking_requests ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert order tracking requests (for form submissions)
CREATE POLICY "Allow public to insert order tracking requests" ON order_tracking_requests
  FOR INSERT WITH CHECK (true);

-- Allow authenticated users to view order tracking requests (for customer service)
CREATE POLICY "Allow authenticated to view order tracking requests" ON order_tracking_requests
  FOR SELECT USING (auth.role() = 'authenticated');

-- Allow authenticated users to update order tracking requests (for status updates)
CREATE POLICY "Allow authenticated to update order tracking requests" ON order_tracking_requests
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create indexes for performance
CREATE INDEX idx_order_tracking_requests_order_number ON order_tracking_requests(order_number);
CREATE INDEX idx_order_tracking_requests_phone_number ON order_tracking_requests(phone_number);
CREATE INDEX idx_order_tracking_requests_email_address ON order_tracking_requests(email_address);
CREATE INDEX idx_order_tracking_requests_requested_at ON order_tracking_requests(requested_at);
