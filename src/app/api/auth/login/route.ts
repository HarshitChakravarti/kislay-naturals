import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import { User } from '@/lib/models/User';
import { rateLimit } from '@/lib/middleware/rateLimit';
import { validateCSRFToken, generateCSRFToken } from '@/lib/middleware/csrf';
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
    } catch (e) {
      return NextResponse.json(
        { success: false, message: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { emailOrUsername, password, csrfToken } = body;

    // CSRF validation
    const sessionId = request.headers.get('x-session-id') || 'default';
    if (!validateCSRFToken(sessionId, csrfToken)) {
      return NextResponse.json(
        { success: false, message: 'Invalid CSRF token' },
        { status: 403 }
      );
    }

    // Validation
    if (!emailOrUsername || !password) {
      return NextResponse.json(
        { success: false, message: 'Email/username and password are required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find user by email or username
    const user = await User.findOne({
      $or: [
        { email: emailOrUsername.toLowerCase() },
        { username: emailOrUsername.toLowerCase() }
      ]
    }).select('+password'); // Include password for comparison

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid email/username or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid email/username or password' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      username: user.username,
      email: user.email,
    });

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        }
      },
      { status: 200 }
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
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred during login' },
      { status: 500 }
    );
  }
}

// Generate CSRF token for login form
export async function GET(request: NextRequest) {
  const sessionId = request.headers.get('x-session-id') || 'default';
  const csrfToken = generateCSRFToken(sessionId);
  
  return NextResponse.json({ csrfToken });
}
