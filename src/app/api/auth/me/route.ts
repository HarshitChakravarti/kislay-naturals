import { NextRequest, NextResponse } from 'next/server'
import { validateToken, extractTokenFromRequest, standardizeUserData, createAuthErrorResponse, createAuthSuccessResponse } from '@/lib/auth/tokenValidation'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const token = extractTokenFromRequest(request);

    if (!token) {
      console.log('No token found in request');
      const errorResponse = createAuthErrorResponse('Not authorized to access this route');
      return NextResponse.json(errorResponse, { 
        status: 401,
        headers: errorResponse.headers
      });
    }

    console.log('Token found, validating...');

    // Temporary development bypass - remove in production
    if (process.env.NODE_ENV === 'development' && process.env.BYPASS_AUTH === 'true') {
      console.log('Development mode: Bypassing authentication');
      const mockUser = {
        _id: 'dev-user-123',
        username: 'dev-admin',
        name: 'Development Admin',
        email: 'admin@example.com',
        role: 'admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      return NextResponse.json(
        { success: true, user: mockUser }, 
        { 
          status: 200, 
          headers: { 'Cache-Control': 'no-store, max-age=0' }
        }
      );
    }

    // Use standardized token validation
    const validationResult = await validateToken(token);
    
    if (!validationResult.isValid) {
      console.log('Token validation failed in /api/auth/me:', validationResult.error);
      console.log('Token provided:', token ? `${token.substring(0, 20)}...` : 'none');
      
      // Clear invalid token cookie
      const response = NextResponse.json(
        createAuthErrorResponse('Invalid or expired token'), 
        { status: 401, headers: createAuthErrorResponse('Invalid or expired token').headers }
      );
      
      response.cookies.set('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: new Date(0),
        path: '/',
      });
      
      return response;
    }

    // Standardize user data format
    const standardizedUser = standardizeUserData(validationResult.user);
    const successResponse = createAuthSuccessResponse(standardizedUser);

    return NextResponse.json(
      { success: true, user: standardizedUser }, 
      { 
        status: 200, 
        headers: successResponse.headers 
      }
    );
  } catch (error) {
    console.error('Error in /api/auth/me:', error);
    
    const errorResponse = createAuthErrorResponse('Authentication service unavailable');
    const response = NextResponse.json(errorResponse, { 
      status: 401, 
      headers: errorResponse.headers 
    });
    
    // Clear token on error
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(0),
      path: '/',
    });
    
    return response;
  }
}
