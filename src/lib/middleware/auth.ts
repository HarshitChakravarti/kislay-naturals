import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, JWTPayload } from '../jwt';
import { connectToDatabase } from '../mongoose';
import { User } from '../models/User';

export interface AuthenticatedRequest extends NextRequest {
  user?: JWTPayload;
}

export async function authenticateUser(request: NextRequest): Promise<JWTPayload | null> {
  try {
    // Get token from cookie or Authorization header
    const token = request.cookies.get('auth_token')?.value || 
                  request.headers.get('authorization')?.replace('Bearer ', '');

    if (!token) {
      return null;
    }

    // Basic token format validation
    if (typeof token !== 'string' || token.trim() === '') {
      console.log('Invalid token format');
      return null;
    }

    // Verify the token
    let payload: JWTPayload;
    try {
      payload = verifyToken(token);
    } catch (tokenError) {
      console.log('Token verification failed:', tokenError);
      return null;
    }
    
    // Verify user still exists in database
    await connectToDatabase();
    const user = await User.findById(payload.userId).select('-password');
    
    if (!user) {
      console.log('User not found in database');
      return null;
    }

    return payload;
  } catch (error) {
    console.error('Authentication error:', error);
    return null;
  }
}

export function requireAuth(handler: (request: AuthenticatedRequest) => Promise<NextResponse>) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const user = await authenticateUser(request);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      );
    }

    const authenticatedRequest = request as AuthenticatedRequest;
    authenticatedRequest.user = user;
    
    return handler(authenticatedRequest);
  };
} 