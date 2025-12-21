-- Button clicks tracking table
CREATE TABLE IF NOT EXISTS button_clicks (
    id SERIAL PRIMARY KEY,
    button_name VARCHAR(255) NOT NULL,
    button_location VARCHAR(255), -- e.g., 'header', 'hero', 'product_card', 'cart'
    page_url VARCHAR(500),
    user_session VARCHAR(255),
    user_agent TEXT,
    ip_address INET,
    device_type VARCHAR(50), -- 'mobile', 'tablet', 'desktop'
    screen_resolution VARCHAR(20),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_button_clicks_button_name ON button_clicks(button_name);
CREATE INDEX IF NOT EXISTS idx_button_clicks_timestamp ON button_clicks(timestamp);
CREATE INDEX IF NOT EXISTS idx_button_clicks_device_type ON button_clicks(device_type);
CREATE INDEX IF NOT EXISTS idx_button_clicks_user_session ON button_clicks(user_session);
