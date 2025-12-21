-- Customer Reviews Table Schema
-- This table stores customer reviews for products

CREATE TABLE IF NOT EXISTS product_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id INTEGER NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255),
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  images TEXT[], -- Array of image URLs or base64 strings
  verified_purchase BOOLEAN DEFAULT FALSE,
  helpful_count INTEGER DEFAULT 0,
  is_approved BOOLEAN DEFAULT TRUE, -- Set to FALSE if moderation is needed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_id ON product_reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_product_reviews_rating ON product_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_product_reviews_created_at ON product_reviews(created_at);
CREATE INDEX IF NOT EXISTS idx_product_reviews_approved ON product_reviews(is_approved);

-- Comments for the table structure:
-- id: Unique identifier for each review
-- product_id: Foreign key to the products table
-- customer_name: Name of the customer (can be anonymous)
-- customer_email: Email of the customer (optional)
-- rating: Star rating from 1 to 5
-- title: Review title/summary
-- description: Detailed review text
-- images: Array of image URLs or base64 encoded images
-- verified_purchase: Whether the customer actually purchased the product
-- helpful_count: Number of users who found this review helpful
-- is_approved: Whether the review is approved for display (for moderation)
-- created_at: When the review was submitted
-- updated_at: When the review was last modified

-- Sample data for testing
INSERT INTO product_reviews (product_id, customer_name, customer_email, rating, title, description, images, verified_purchase)
VALUES 
  (1, 'Priya Sharma', 'priya@email.com', 5, 'Excellent Quality!', 'The fabric is amazing and the fit is perfect. Very happy with this purchase', 
   ARRAY['/reviews/img1.jpg', '/reviews/img2.jpg'], TRUE),
  (1, 'Anjali Patel', 'anjali@email.com', 4, 'Good Product', 'Nice quality is good but the color is slightly different from the picture. Overall satisfied', 
   ARRAY['/reviews/img3.jpg'], TRUE),
  (2, 'Neha Gupta', 'neha@email.com', 5, 'Beautiful Design', 'Love the embroidery and the fabric quality. Perfect for special occasions', 
   ARRAY['/reviews/img4.jpg'], TRUE);
