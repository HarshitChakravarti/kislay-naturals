import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import { User } from '@/lib/models/User';
import { rateLimit } from '@/lib/middleware/rateLimit';
import { generateCSRFToken, validateCSRFToken } from '@/lib/middleware/csrf';
import { generateToken } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = rateLimit(request, 5, 15 * 60 * 1000); // 5 requests per 15 minutes
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { success: false, message: rateLimitResult.message },
        { 
          status: 429,
          headers: {
            'Retry-After': rateLimitResult.retryAfter?.toString() || '900'
          }
        }
      );
    }

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { username, email, password, csrfToken } = body;

    // CSRF validation
    const sessionId = request.headers.get('x-session-id') || 'default';
    if (!validateCSRFToken(sessionId, csrfToken)) {
      return NextResponse.json(
        { success: false, message: 'Invalid CSRF token' },
        { status: 403 }
      );
    }

    // Validation
    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Username, email, and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Please enter a valid email address' },
        { status: 400 }
      );
    }

    // Username validation
    const usernameRegex = /^[a-zA-Z0-9_]{3,30}$/;
    if (!usernameRegex.test(username)) {
      return NextResponse.json(
        { success: false, message: 'Username can only contain letters, numbers, and underscores (3-30 characters)' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check for existing user
    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { username: username.toLowerCase() }
      ]
    });

    if (existingUser) {
      if (existingUser.email.toLowerCase() === email.toLowerCase()) {
        return NextResponse.json(
          { success: false, message: 'An account with this email already exists' },
          { status: 409 }
        );
      } else {
        return NextResponse.json(
          { success: false, message: 'Username is already taken' },
          { status: 409 }
        );
      }
    }

    // Create new user
    const newUser = new User({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password, // Will be hashed by the pre-save hook
    });

    await newUser.save();

    // Generate JWT token
    const token = generateToken({
      userId: newUser._id.toString(),
      username: newUser.username,
      email: newUser.email,
    });

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        message: 'User registered successfully',
        user: {
          _id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          createdAt: newUser.createdAt,
          updatedAt: newUser.updatedAt,
        }
      },
      { status: 201 }
    );

    // Set secure cookie
    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Signup error:', error);
    
    // Handle Mongoose validation errors
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, message: 'Validation error: ' + error.message },
        { status: 400 }
      );
    }

    // Handle duplicate key errors
    if (error instanceof Error && error.name === 'MongoServerError') {
      const mongoError = error as { code?: number; keyPattern?: Record<string, unknown> };
      if (mongoError.code === 11000 && mongoError.keyPattern) {
        const field = Object.keys(mongoError.keyPattern)[0];
        return NextResponse.json(
          { success: false, message: `${field} is already taken` },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { success: false, message: 'An error occurred during registration' },
      { status: 500 }
    );
  }
}

// Generate CSRF token for signup form
export async function GET(request: NextRequest) {
  const sessionId = request.headers.get('x-session-id') || 'default';
  const csrfToken = generateCSRFToken(sessionId);
  
  return NextResponse.json({ csrfToken });
} 