-- Kislay Naturals Database Schema
-- This file contains all the required tables for the Kislay Naturals application

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PRODUCTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    original_price DECIMAL(10,2) CHECK (original_price >= 0),
    rating DECIMAL(3,2) DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
    num_reviews INTEGER DEFAULT 0 CHECK (num_reviews >= 0),
    avg_rating DECIMAL(3,2) DEFAULT 0 CHECK (avg_rating >= 0 AND avg_rating <= 5),
    image VARCHAR(500) NOT NULL,
    images JSONB DEFAULT '[]'::jsonb,
    badge VARCHAR(100),
    category VARCHAR(100),
    in_stock BOOLEAN DEFAULT true,
    slug VARCHAR(255) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for products
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock);
CREATE INDEX IF NOT EXISTS idx_products_rating ON products(avg_rating);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);

-- =============================================
-- ORDERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    user_name VARCHAR(255),
    user_email VARCHAR(255),
    user_mobile VARCHAR(20),
    
    -- Order items (for legacy compatibility)
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(255),
    unit_price DECIMAL(10,2),
    quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
    
    -- Pricing
    items_price DECIMAL(10,2) DEFAULT 0 CHECK (items_price >= 0),
    tax_price DECIMAL(10,2) DEFAULT 0 CHECK (tax_price >= 0),
    shipping_price DECIMAL(10,2) DEFAULT 0 CHECK (shipping_price >= 0),
    total_price DECIMAL(10,2) NOT NULL CHECK (total_price >= 0),
    total_amount DECIMAL(10,2) CHECK (total_amount >= 0), -- Legacy compatibility
    
    -- Shipping information
    shipping_street VARCHAR(255),
    shipping_city VARCHAR(100),
    shipping_state VARCHAR(100),
    shipping_zip VARCHAR(20),
    shipping_info JSONB,
    
    -- Payment information
    razorpay_payment_id VARCHAR(255),
    razorpay_order_id VARCHAR(255),
    razorpay_signature VARCHAR(500),
    payment_info JSONB,
    
    -- Order status and tracking
    status VARCHAR(50) DEFAULT 'created' CHECK (status IN ('created', 'paid', 'shipped', 'delivered', 'cancelled')),
    order_status VARCHAR(50) DEFAULT 'created' CHECK (order_status IN ('created', 'paid', 'processing', 'shipped', 'delivered', 'cancelled')),
    
    -- Timestamps
    paid_at TIMESTAMP WITH TIME ZONE,
    shipped_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Additional fields
    notes TEXT,
    payload JSONB -- For storing full order details as JSON
);

-- Create indexes for orders
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_email ON orders(user_email);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_paid_at ON orders(paid_at);
CREATE INDEX IF NOT EXISTS idx_orders_razorpay_payment_id ON orders(razorpay_payment_id);

-- =============================================
-- ORDER_ITEMS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    image VARCHAR(500),
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for order_items
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- =============================================
-- REVIEWS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for reviews
CREATE INDEX IF NOT EXISTS idx_reviews_product_id ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_email ON reviews(email);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at);

-- Create unique constraint to prevent duplicate reviews from same email for same product
CREATE UNIQUE INDEX IF NOT EXISTS idx_reviews_product_email_unique ON reviews(product_id, email);

-- =============================================
-- USERS PROFILES TABLE (Additional user data)
-- =============================================
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username VARCHAR(50) UNIQUE,
    full_name VARCHAR(255),
    phone VARCHAR(20),
    address JSONB,
    preferences JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for user_profiles
CREATE INDEX IF NOT EXISTS idx_user_profiles_username ON user_profiles(username);

-- =============================================
-- FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update product rating when reviews change
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the product's rating and review count
    UPDATE products 
    SET 
        num_reviews = (
            SELECT COUNT(*) 
            FROM reviews 
            WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)
        ),
        avg_rating = (
            SELECT COALESCE(AVG(rating), 0) 
            FROM reviews 
            WHERE product_id = COALESCE(NEW.product_id, OLD.product_id)
        )
    WHERE id = COALESCE(NEW.product_id, OLD.product_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Triggers for product rating updates
CREATE TRIGGER update_product_rating_on_review_insert
    AFTER INSERT ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_product_rating();

CREATE TRIGGER update_product_rating_on_review_update
    AFTER UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_product_rating();

CREATE TRIGGER update_product_rating_on_review_delete
    AFTER DELETE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_product_rating();

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Products: Public read access, admin write access
CREATE POLICY "Products are viewable by everyone" ON products
    FOR SELECT USING (true);

CREATE POLICY "Products are editable by admins" ON products
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Orders: Users can view their own orders, admins can view all
CREATE POLICY "Users can view their own orders" ON orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders" ON orders
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

CREATE POLICY "Users can create their own orders" ON orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can manage all orders" ON orders
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Order items: Same as orders
CREATE POLICY "Order items follow order access" ON order_items
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM orders 
            WHERE orders.id = order_items.order_id 
            AND (
                orders.user_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM auth.users 
                    WHERE auth.users.id = auth.uid() 
                    AND auth.users.raw_user_meta_data->>'role' = 'admin'
                )
            )
        )
    );

-- Reviews: Public read, users can manage their own, admins can manage all
CREATE POLICY "Reviews are viewable by everyone" ON reviews
    FOR SELECT USING (true);

CREATE POLICY "Users can create reviews" ON reviews
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own reviews" ON reviews
    FOR UPDATE USING (email = auth.jwt() ->> 'email');

CREATE POLICY "Users can delete their own reviews" ON reviews
    FOR DELETE USING (email = auth.jwt() ->> 'email');

CREATE POLICY "Admins can manage all reviews" ON reviews
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- User profiles: Users can manage their own profile
CREATE POLICY "Users can view their own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON user_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users 
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- =============================================
-- SAMPLE DATA (Optional - remove in production)
-- =============================================

-- Insert sample products
INSERT INTO products (name, description, price, original_price, image, category, in_stock, slug) VALUES
('Monk Fruit Sweetener', 'Natural zero-calorie sweetener made from monk fruit', 29.99, 34.99, '/monk-fruit.jpg', 'Sweeteners', true, 'monk-fruit-sweetener'),
('Stevia Extract', 'Pure stevia leaf extract, 100% natural', 24.99, 29.99, '/stevia.jpg', 'Sweeteners', true, 'stevia-extract'),
('Erythritol', 'Sugar alcohol sweetener, keto-friendly', 19.99, 24.99, '/erythritol.jpg', 'Sweeteners', true, 'erythritol'),
('Xylitol', 'Natural sugar alcohol from birch trees', 22.99, 27.99, '/xylitol.jpg', 'Sweeteners', true, 'xylitol'),
('Allulose', 'Rare sugar with minimal calories', 34.99, 39.99, '/allulose.jpg', 'Sweeteners', true, 'allulose')
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- COMMENTS
-- =============================================

COMMENT ON TABLE products IS 'Product catalog for Kislay Naturals';
COMMENT ON TABLE orders IS 'Customer orders with payment and shipping information';
COMMENT ON TABLE order_items IS 'Individual items within each order';
COMMENT ON TABLE reviews IS 'Product reviews and ratings from customers';
COMMENT ON TABLE user_profiles IS 'Additional user profile information beyond auth.users';

COMMENT ON COLUMN products.rating IS 'Legacy field - use avg_rating instead';
COMMENT ON COLUMN orders.payload IS 'Full order details stored as JSON for flexibility';
COMMENT ON COLUMN orders.total_amount IS 'Legacy field - use total_price instead';
COMMENT ON COLUMN reviews.email IS 'Email of reviewer for duplicate prevention';
