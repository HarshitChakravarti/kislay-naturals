`# Deployment Guide

## Environment Variables Required for Vercel Deployment

Before deploying to Vercel, make sure to set the following environment variables in your Vercel dashboard:

### Required Environment Variables:

1. **NEXT_PUBLIC_SUPABASE_URL** – Your Supabase project URL
2. **NEXT_PUBLIC_SUPABASE_ANON_KEY** – Supabase anonymous client key
3. **JWT_SECRET** – A secure secret key for JWT token generation
4. **RAZORPAY_KEY_ID** – Razorpay key ID (server-side)
5. **RAZORPAY_KEY_SECRET** – Razorpay key secret (server-side)
6. **NEXT_PUBLIC_RAZORPAY_KEY_ID** – Razorpay key ID for client-side usage

## Setting Environment Variables in Vercel:

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable with its corresponding value
5. Make sure to set them for all environments (Production, Preview, Development)

## Build Fixes Applied:

- Moved environment variable checks from module level to function level to prevent build-time errors
- Updated `src/lib/jwt.ts` to read JWT_SECRET at runtime
- Created `vercel.json` configuration file

## Deployment Command:

After setting up environment variables, your deployment should work with:
```bash
vercel --prod
```
