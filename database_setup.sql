-- =====================================================
-- Database Setup for Sign Up and Sign In Forms
-- =====================================================
-- This script sets up all necessary tables for user authentication
-- Run this in your Supabase SQL editor or PostgreSQL database

-- =====================================================
-- 1. USERS TABLE
-- =====================================================
-- Create users table in Supabase for user account registrations
CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  phone_number TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  email_address TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_token TEXT,
  otp_code TEXT,
  otp_expires_at TIMESTAMP WITH TIME ZONE,
  last_signin_at TIMESTAMP WITH TIME ZONE,
  signin_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'banned')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add RLS (Row Level Security) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert user registrations (for signup)
DROP POLICY IF EXISTS "Allow public to insert users" ON users;
CREATE POLICY "Allow public to insert users" ON users
  FOR INSERT WITH CHECK (true);

-- Allow users to view and update their own data
DROP POLICY IF EXISTS "Allow users to view own data" ON users;
CREATE POLICY "Allow users to view own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text OR auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow users to update own data" ON users;
CREATE POLICY "Allow users to update own data" ON users
  FOR UPDATE USING (auth.uid()::text = id::text OR auth.role() = 'authenticated');

-- Allow authenticated users to view all users (for admin purposes)
DROP POLICY IF EXISTS "Allow authenticated to view all users" ON users;
CREATE POLICY "Allow authenticated to view all users" ON users
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_phone_number ON users(phone_number);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email_address ON users(email_address);

-- =====================================================
-- 2. SIGNIN TRACKING TABLE
-- =====================================================
-- Create signin_tracking table in Supabase for tracking sign-in attempts
CREATE TABLE IF NOT EXISTS signin_tracking (
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
DROP POLICY IF EXISTS "Allow public to insert signin tracking" ON signin_tracking;
CREATE POLICY "Allow public to insert signin tracking" ON signin_tracking
  FOR INSERT WITH CHECK (true);

-- Allow authenticated users to view signin tracking (for customer service)
DROP POLICY IF EXISTS "Allow authenticated to view signin tracking" ON signin_tracking;
CREATE POLICY "Allow authenticated to view signin tracking" ON signin_tracking
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_signin_tracking_phone_number ON signin_tracking(phone_number);
CREATE INDEX IF NOT EXISTS idx_signin_tracking_attempted_at ON signin_tracking(attempted_at);
CREATE INDEX IF NOT EXISTS idx_signin_tracking_success ON signin_tracking(success);

-- =====================================================
-- 3. ORDER TRACKING REQUESTS TABLE (if needed)
-- =====================================================
CREATE TABLE IF NOT EXISTS order_tracking_requests (
  id BIGSERIAL PRIMARY KEY,
  order_number TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  email_address TEXT,
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  ip_address INET,
  user_agent TEXT,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add RLS policies for order tracking
ALTER TABLE order_tracking_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public to insert order tracking requests" ON order_tracking_requests;
CREATE POLICY "Allow public to insert order tracking requests" ON order_tracking_requests
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated to view order tracking requests" ON order_tracking_requests;
CREATE POLICY "Allow authenticated to view order tracking requests" ON order_tracking_requests
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_order_tracking_requests_order_number ON order_tracking_requests(order_number);
CREATE INDEX IF NOT EXISTS idx_order_tracking_requests_phone_number ON order_tracking_requests(phone_number);

-- =====================================================
-- 4. BULK ORDERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS bulk_orders (
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
DROP POLICY IF EXISTS "Allow public to insert bulk orders" ON bulk_orders;
CREATE POLICY "Allow public to insert bulk orders" ON bulk_orders
  FOR INSERT WITH CHECK (true);

-- Allow authenticated users to view and update bulk orders
DROP POLICY IF EXISTS "Allow authenticated to view bulk orders" ON bulk_orders;
CREATE POLICY "Allow authenticated to view bulk orders" ON bulk_orders
  FOR SELECT USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Allow authenticated to update bulk orders" ON bulk_orders;
CREATE POLICY "Allow authenticated to update bulk orders" ON bulk_orders
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_bulk_orders_created_at ON bulk_orders(created_at);
CREATE INDEX IF NOT EXISTS idx_bulk_orders_status ON bulk_orders(status);

-- =====================================================
-- 5. UTILITY FUNCTIONS
-- =====================================================
-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for users table
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for bulk_orders table
DROP TRIGGER IF EXISTS update_bulk_orders_updated_at ON bulk_orders;
CREATE TRIGGER update_bulk_orders_updated_at
  BEFORE UPDATE ON bulk_orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 6. SAMPLE DATA (Optional - for testing)
-- =====================================================
-- Insert sample user (password: 'password123' hashed)
-- Note: In production, use proper password hashing
INSERT INTO users (username, phone_number, password_hash, is_verified)
VALUES
  ('testuser', '9876543210', '$2b$10$example.hash.here', true)
ON CONFLICT (username) DO NOTHING;

-- =====================================================
-- SETUP COMPLETE
-- =====================================================
-- To use this database:
-- 1. Copy this entire script
-- 2. Go to your Supabase dashboard
-- 3. Navigate to SQL Editor
-- 4. Paste and run this script
-- 5. Your database is now ready for sign up and sign in forms!
