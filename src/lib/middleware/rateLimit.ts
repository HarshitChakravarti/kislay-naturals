import { NextRequest, NextResponse } from 'next/server';

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

export function rateLimit(
  request: NextRequest,
  limit: number = 5,
  windowMs: number = 15 * 60 * 1000 // 15 minutes
) {
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'unknown';
  const now = Date.now();
  const key = `rate_limit:${ip}`;

  // Clean up expired entries
  if (store[key] && store[key].resetTime < now) {
    delete store[key];
  }

  // Initialize or get current rate limit data
  if (!store[key]) {
    store[key] = {
      count: 0,
      resetTime: now + windowMs,
    };
  }

  // Increment count
  store[key].count++;

  // Check if limit exceeded
  if (store[key].count > limit) {
    return {
      success: false,
      message: 'Too many requests. Please try again later.',
      retryAfter: Math.ceil((store[key].resetTime - now) / 1000),
    };
  }

  return { success: true };
}

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach(key => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, 60 * 1000); // Clean up every minute 