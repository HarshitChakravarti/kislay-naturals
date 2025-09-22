# Kislay Naturals Database Setup Guide

This guide will help you set up the complete database schema for your Kislay Naturals application in Supabase.

## 📋 Overview

Your application requires the following tables:
- **products** - Product catalog with ratings and reviews
- **orders** - Customer orders with payment information
- **order_items** - Individual items within orders
- **reviews** - Product reviews and ratings
- **user_profiles** - Additional user profile data

## 🚀 Quick Setup (Recommended)

### Option 1: Complete Setup with Sample Data
Run the complete schema file in your Supabase SQL Editor:

```sql
-- Copy and paste the entire contents of supabase-schema.sql
```

This includes:
- All table definitions
- Indexes for performance
- Functions and triggers
- Row Level Security (RLS) policies
- Sample product data

### Option 2: Step-by-Step Setup

#### Step 1: Create Tables
```sql
-- Copy and paste the contents of supabase-tables-only.sql
```

#### Step 2: Add Functions and Policies
```sql
-- Copy and paste the contents of supabase-functions-and-policies.sql
```

## 📊 Table Structure Details

### Products Table
- **Primary Key**: `id` (UUID)
- **Key Fields**: `name`, `price`, `image`, `category`, `in_stock`
- **Rating System**: `avg_rating`, `num_reviews` (auto-calculated)
- **Features**: Slug for SEO, JSONB for multiple images, badges

### Orders Table
- **Primary Key**: `id` (UUID)
- **Foreign Keys**: `user_id` → `auth.users(id)`
- **Pricing**: `items_price`, `tax_price`, `shipping_price`, `total_price`
- **Payment**: Razorpay integration fields
- **Shipping**: Address fields and JSONB for flexibility
- **Status**: Order tracking with timestamps

### Order Items Table
- **Primary Key**: `id` (UUID)
- **Foreign Keys**: `order_id` → `orders(id)`, `product_id` → `products(id)`
- **Fields**: Product snapshot at time of order

### Reviews Table
- **Primary Key**: `id` (UUID)
- **Foreign Keys**: `product_id` → `products(id)`, `user_id` → `auth.users(id)`
- **Constraints**: Unique per product+email, rating 1-5
- **Auto-updates**: Product rating averages

### User Profiles Table
- **Primary Key**: `id` (UUID) → `auth.users(id)`
- **Fields**: Additional profile data beyond Supabase Auth
- **Features**: JSONB for flexible address and preferences

## 🔒 Security Features

### Row Level Security (RLS)
- **Products**: Public read, admin write
- **Orders**: Users see own orders, admins see all
- **Reviews**: Public read, users manage own, admins manage all
- **User Profiles**: Users manage own profile

### Data Validation
- Price constraints (≥ 0)
- Rating constraints (1-5)
- Quantity constraints (> 0)
- Email format validation
- Unique constraints where appropriate

## ⚡ Performance Optimizations

### Indexes Created
- Category, stock status, rating, price filters
- User ID, email, status lookups
- Created date sorting
- Foreign key relationships

### Auto-Update Features
- `updated_at` timestamps
- Product rating calculations
- Review count updates

## 🔧 Admin Features

### User Management
- Role-based access control
- Admin can manage all data
- Users can only access their own data

### Order Management
- Status tracking (created → paid → shipped → delivered)
- Payment integration (Razorpay)
- Shipping information storage

### Product Management
- Category organization
- Stock management
- Image handling (single + multiple)
- SEO-friendly slugs

## 📝 API Compatibility

The schema is designed to work with your existing API routes:

- `/api/products/*` - Product CRUD operations
- `/api/orders/*` - Order management
- `/api/reviews/*` - Review system
- `/api/auth/*` - User authentication (uses Supabase Auth)

## 🧪 Testing

After setup, you can test the schema by:

1. **Creating a test product**:
```sql
INSERT INTO products (name, price, image, category) 
VALUES ('Test Product', 19.99, '/test.jpg', 'Test Category');
```

2. **Creating a test order**:
```sql
INSERT INTO orders (user_id, total_price, order_status) 
VALUES ('your-user-id', 19.99, 'created');
```

3. **Adding a test review**:
```sql
INSERT INTO reviews (product_id, name, email, rating, comment) 
VALUES ('product-id', 'Test User', 'test@example.com', 5, 'Great product!');
```

## 🚨 Important Notes

1. **Supabase Auth Integration**: The schema references `auth.users` table which is managed by Supabase Auth
2. **Razorpay Integration**: Payment fields are included for Razorpay integration
3. **Legacy Compatibility**: Some fields maintain compatibility with existing code
4. **JSONB Fields**: Used for flexible data storage (images, addresses, preferences)
5. **UUID Primary Keys**: All tables use UUIDs for better distributed system compatibility

## 🔄 Migration from Existing Data

If you have existing data, you may need to:

1. Export your current data
2. Transform it to match the new schema
3. Import it using Supabase's import tools
4. Update any hardcoded references to old field names

## 📞 Support

If you encounter any issues during setup:

1. Check the Supabase logs for error messages
2. Verify all foreign key references exist
3. Ensure RLS policies are correctly applied
4. Test with sample data first

The schema is designed to be robust and production-ready for your Kislay Naturals application!
