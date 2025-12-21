-- Newsletter Subscriptions Table
-- Stores email subscriptions for marketing newsletters

CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    subscription_source VARCHAR(100) DEFAULT 'website',
    ip_address INET,
    user_agent TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    unsubscribed_at TIMESTAMP WITH TIME ZONE,
    last_email_sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_email ON newsletter_subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_status ON newsletter_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscriptions_subscribed_at ON newsletter_subscriptions(subscribed_at);

-- Row Level Security (RLS) policies
ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone to insert (for public signup)
CREATE POLICY "Allow public newsletter signup" ON newsletter_subscriptions
    FOR INSERT
    WITH CHECK (true);

-- Policy to allow authenticated users to view their own subscriptions
CREATE POLICY "Users can view own newsletter subscriptions" ON newsletter_subscriptions
    FOR SELECT
    USING (auth.uid() IS NOT NULL);

-- Policy to allow service role to manage all subscriptions
CREATE POLICY "Service role can manage newsletter subscriptions" ON newsletter_subscriptions
    FOR ALL
    USING (auth.role() = 'service_role');

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_newsletter_subscription_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER trigger_update_newsletter_subscription_updated_at
    BEFORE UPDATE ON newsletter_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_newsletter_subscription_updated_at();

-- Function to check if email is already subscribed
CREATE OR REPLACE FUNCTION is_email_subscribed(check_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM newsletter_subscriptions
        WHERE email = check_email AND status = 'active'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON newsletter_subscriptions TO service_role;
GRANT SELECT, INSERT ON newsletter_subscriptions TO anon;
GRANT SELECT, UPDATE ON newsletter_subscriptions TO authenticated;
