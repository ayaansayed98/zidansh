-- Create signin_tracking table in Supabase for tracking sign-in attempts
CREATE TABLE signin_tracking (
  id BIGSERIAL PRIMARY KEY,
  phone_number TEXT NOT NULL,
  attempted_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  ip_address INET,
  user_agent TEXT,
  session_id TEXT,
  success BOOLEAN NOT NULL DEFAULT FALSE,
  failure_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add RLS (Row Level Security) policies
ALTER TABLE signin_tracking ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert signin tracking (for form submissions)
CREATE POLICY "Allow public to insert signin tracking" ON signin_tracking
  FOR INSERT WITH CHECK (true);

-- Allow authenticated users to view signin tracking (for customer service)
CREATE POLICY "Allow authenticated to view signin tracking" ON signin_tracking
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create indexes for performance
CREATE INDEX idx_signin_tracking_phone_number ON signin_tracking(phone_number);
CREATE INDEX idx_signin_tracking_attempted_at ON signin_tracking(attempted_at);
CREATE INDEX idx_signin_tracking_success ON signin_tracking(success);
