import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoose';
import { User } from '@/lib/models/User';
import { authenticateUser } from '@/lib/middleware/auth';

export async function GET(request: NextRequest) {
  try {
    // Check if there's a token first
    const token = request.cookies.get('auth_token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Authenticate user
    const user = await authenticateUser(request);
    
    if (!user) {
      // Clear invalid token
      const response = NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      );
      
      // Clear the auth token cookie
      response.cookies.set('auth_token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: new Date(0),
        path: '/'
      });
      
      return response;
    }

    await connectToDatabase();
    
    // Get user data from database
    const userData = await User.findById(user.userId);
    
    if (!userData) {
      // Clear invalid token if user doesn't exist
      const response = NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
      
      response.cookies.set('auth_token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: new Date(0),
        path: '/'
      });
      
      return response;
    }

    return NextResponse.json(
      { 
        success: true,
        user: {
          _id: userData._id,
          username: userData.username,
          email: userData.email,
          createdAt: userData.createdAt,
          updatedAt: userData.updatedAt,
        }
      },
      { 
        status: 200,
        headers: {
          'Cache-Control': 'no-store, max-age=0',
        }
      }
    );
  } catch (error) {
    console.error('Error in /api/auth/me:', error);
    
    // Clear any potentially corrupted token on error
    const response = NextResponse.json(
      { success: false, message: 'Internal server error' },
      { 
        status: 500,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    );
    
    response.cookies.set('auth_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(0),
      path: '/'
    });
    
    return response;
  }
}
