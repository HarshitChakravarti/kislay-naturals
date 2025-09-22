# Testing Configuration Setup

## Environment Variables Needed

Create a `.env.local` file in your project root with these variables:

```env
# Razorpay Configuration (Test Mode)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_test_key_id
RAZORPAY_KEY_ID=rzp_test_your_test_key_id
RAZORPAY_KEY_SECRET=your_test_key_secret

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# App Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
```

## Testing Scenarios

### 1. Without Payment Gateway (Current State)
- Form validation works
- Payment button shows error about missing Razorpay configuration
- Order creation is blocked

### 2. With Mock Payment Gateway
- Form validation works
- Razorpay modal opens (test mode)
- Payment can be simulated
- Order gets created in database

### 3. With Real Payment Gateway
- Full end-to-end testing
- Real payment processing
- Order confirmation and tracking
