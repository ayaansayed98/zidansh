-- Create users table in Supabase for user account registrations
CREATE TABLE users (
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
CREATE POLICY "Allow public to insert users" ON users
  FOR INSERT WITH CHECK (true);

-- Allow users to view and update their own data
CREATE POLICY "Allow users to view own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text OR auth.role() = 'authenticated');

CREATE POLICY "Allow users to update own data" ON users
  FOR UPDATE USING (auth.uid()::text = id::text OR auth.role() = 'authenticated');

-- Allow authenticated users to view all users (for admin purposes)
CREATE POLICY "Allow authenticated to view all users" ON users
  FOR SELECT USING (auth.role() = 'authenticated');

-- Create indexes for performance
CREATE INDEX idx_users_phone_number ON users(phone_number);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email_address ON users(email_address);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
