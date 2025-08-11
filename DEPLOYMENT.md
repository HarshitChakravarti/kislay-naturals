`# Deployment Guide

## Environment Variables Required for Vercel Deployment

Before deploying to Vercel, make sure to set the following environment variables in your Vercel dashboard:

### Required Environment Variables:

1. **MONGODB_URI** - Your MongoDB connection string
   ```
   mongodb+srv://username:password@cluster.mongodb.net/database_name
   ```

2. **MONGODB_DB** - Your MongoDB database name
   ```
   kislay_naturals
   ```

3. **JWT_SECRET** - A secure secret key for JWT token generation
   ```
   your-super-secret-jwt-key-here
   ```

4. **RAZORPAY_KEY_ID** - Your Razorpay key ID (for payment processing)

5. **RAZORPAY_KEY_SECRET** - Your Razorpay key secret

6. **NEXT_PUBLIC_RAZORPAY_KEY_ID** - Your Razorpay key ID for client-side usage

## Setting Environment Variables in Vercel:

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable with its corresponding value
5. Make sure to set them for all environments (Production, Preview, Development)

## Build Fixes Applied:

- Moved environment variable checks from module level to function level to prevent build-time errors
- Updated `src/lib/mongoose.ts`, `src/lib/mongodb.ts`, and `src/lib/jwt.ts`
- Created `vercel.json` configuration file

## Deployment Command:

After setting up environment variables, your deployment should work with:
```bash
vercel --prod
```
