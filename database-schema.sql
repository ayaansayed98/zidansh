-- Analytics Database Schema for Zidansh Website
-- This file contains SQL statements to create all necessary tables for the comprehensive analytics system

-- Monthly Audience Tracking Table
CREATE TABLE IF NOT EXISTS monthly_audience (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  audience INTEGER NOT NULL DEFAULT 0,
  unique_visitors INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Subscriber Analytics Table
CREATE TABLE IF NOT EXISTS subscriber_analytics (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  subscribers INTEGER NOT NULL DEFAULT 0,
  new_subscribers INTEGER NOT NULL DEFAULT 0,
  churned_subscribers INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audience Behavior Analysis Table
CREATE TABLE IF NOT EXISTS audience_behavior (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  new_viewers DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  casual_viewers DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  regular_viewers DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  total_sessions INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Device Type Analytics Table
CREATE TABLE IF NOT EXISTS device_analytics (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  tv_percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  mobile_percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  computer_percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  tablet_percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  tv_watch_hours DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  mobile_watch_hours DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  computer_watch_hours DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  tablet_watch_hours DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Age Demographics Table
CREATE TABLE IF NOT EXISTS age_demographics (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  age_13_17 DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  age_18_24 DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  age_25_34 DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  age_35_44 DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  age_45_54 DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  age_55_64 DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  age_65_plus DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  total_views INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Geography Analytics Table
CREATE TABLE IF NOT EXISTS geography_analytics (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  india_percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  iraq_percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  algeria_percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  usa_percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  uk_percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  others_percentage DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  total_views INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enhanced Traffic Analytics Table (extends existing)
CREATE TABLE IF NOT EXISTS traffic_analytics_extended (
  id SERIAL PRIMARY KEY,
  user_session VARCHAR(255) NOT NULL,
  page_url TEXT NOT NULL,
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  device_type VARCHAR(50),
  referrer TEXT,
  country VARCHAR(100),
  age_group VARCHAR(20),
  session_duration INTEGER DEFAULT 0,
  bounce_rate BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Real-time Analytics Events Table
CREATE TABLE IF NOT EXISTS analytics_events (
  id SERIAL PRIMARY KEY,
  event_type VARCHAR(100) NOT NULL,
  user_session VARCHAR(255) NOT NULL,
  event_data JSONB,
  timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  page_url TEXT,
  device_type VARCHAR(50),
  country VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Engagement Metrics Table
CREATE TABLE IF NOT EXISTS user_engagement (
  id SERIAL PRIMARY KEY,
  user_session VARCHAR(255) NOT NULL,
  session_start TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  session_end TIMESTAMP,
  pages_viewed INTEGER DEFAULT 0,
  time_spent_seconds INTEGER DEFAULT 0,
  interactions_count INTEGER DEFAULT 0,
  conversion_completed BOOLEAN DEFAULT false,
  device_type VARCHAR(50),
  country VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product Performance Analytics Table
CREATE TABLE IF NOT EXISTS product_performance (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL,
  product_name VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  views INTEGER NOT NULL DEFAULT 0,
  add_to_cart INTEGER NOT NULL DEFAULT 0,
  purchases INTEGER NOT NULL DEFAULT 0,
  revenue DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  conversion_rate DECIMAL(5,2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(product_id, date)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_monthly_audience_date ON monthly_audience(date);
CREATE INDEX IF NOT EXISTS idx_subscriber_analytics_date ON subscriber_analytics(date);
CREATE INDEX IF NOT EXISTS idx_audience_behavior_date ON audience_behavior(date);
CREATE INDEX IF NOT EXISTS idx_device_analytics_date ON device_analytics(date);
CREATE INDEX IF NOT EXISTS idx_age_demographics_date ON age_demographics(date);
CREATE INDEX IF NOT EXISTS idx_geography_analytics_date ON geography_analytics(date);
CREATE INDEX IF NOT EXISTS idx_traffic_analytics_session ON traffic_analytics_extended(user_session);
CREATE INDEX IF NOT EXISTS idx_traffic_analytics_timestamp ON traffic_analytics_extended(timestamp);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session ON analytics_events(user_session);
CREATE INDEX IF NOT EXISTS idx_analytics_events_timestamp ON analytics_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_user_engagement_session ON user_engagement(user_session);
CREATE INDEX IF NOT EXISTS idx_product_performance_product_date ON product_performance(product_id, date);

-- Create trigger functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at columns
CREATE TRIGGER update_monthly_audience_updated_at BEFORE UPDATE ON monthly_audience
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriber_analytics_updated_at BEFORE UPDATE ON subscriber_analytics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_audience_behavior_updated_at BEFORE UPDATE ON audience_behavior
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_device_analytics_updated_at BEFORE UPDATE ON device_analytics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_age_demographics_updated_at BEFORE UPDATE ON age_demographics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_geography_analytics_updated_at BEFORE UPDATE ON geography_analytics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_engagement_updated_at BEFORE UPDATE ON user_engagement
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_performance_updated_at BEFORE UPDATE ON product_performance
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for development/testing
INSERT INTO monthly_audience (date, audience, unique_visitors) VALUES 
  (CURRENT_DATE - INTERVAL '1 day', 12700, 8900),
  (CURRENT_DATE - INTERVAL '2 days', 12400, 8700),
  (CURRENT_DATE - INTERVAL '3 days', 12900, 9100)
ON CONFLICT (date) DO NOTHING;

INSERT INTO subscriber_analytics (date, subscribers, new_subscribers, churned_subscribers) VALUES 
  (CURRENT_DATE - INTERVAL '1 day', 2341, 45, 14),
  (CURRENT_DATE - INTERVAL '2 days', 2310, 38, 12),
  (CURRENT_DATE - INTERVAL '3 days', 2284, 52, 18)
ON CONFLICT (date) DO NOTHING;

INSERT INTO audience_behavior (date, new_viewers, casual_viewers, regular_viewers, total_sessions) VALUES 
  (CURRENT_DATE, 95.4, 4.4, 0.2, 12500)
ON CONFLICT (date) DO NOTHING;

INSERT INTO device_analytics (date, tv_percentage, mobile_percentage, computer_percentage, tablet_percentage,
  tv_watch_hours, mobile_watch_hours, computer_watch_hours, tablet_watch_hours) VALUES 
  (CURRENT_DATE, 54.4, 40.3, 2.8, 2.3, 1250.5, 925.3, 64.2, 52.8)
ON CONFLICT (date) DO NOTHING;

INSERT INTO age_demographics (date, age_13_17, age_18_24, age_25_34, age_35_44, age_45_54, age_55_64, age_65_plus, total_views) VALUES 
  (CURRENT_DATE, 2.1, 11.6, 36.1, 37.0, 11.6, 1.0, 0.6, 15000)
ON CONFLICT (date) DO NOTHING;

INSERT INTO geography_analytics (date, india_percentage, iraq_percentage, algeria_percentage, usa_percentage, uk_percentage, others_percentage, total_views) VALUES 
  (CURRENT_DATE, 85.6, 1.9, 0.7, 3.2, 2.1, 6.5, 15000)
ON CONFLICT (date) DO NOTHING;
