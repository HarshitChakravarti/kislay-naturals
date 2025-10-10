import { NextRequest, NextResponse } from 'next/server'
import { validateToken, extractTokenFromRequest, standardizeUserData, createAuthErrorResponse, createAuthSuccessResponse } from '@/lib/auth/tokenValidation'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const token = extractTokenFromRequest(request);

    if (!token) {
      const errorResponse = createAuthErrorResponse('No token provided for validation');
      return NextResponse.json(errorResponse, { 
        status: 401,
        headers: errorResponse.headers
      });
    }

    // Use standardized token validation
    const validationResult = await validateToken(token);
    
    if (!validationResult.isValid) {
      console.log('Token validation failed in /api/auth/validate:', validationResult.error);
      
      const errorResponse = createAuthErrorResponse('Invalid or expired token');
      const response = NextResponse.json(errorResponse, { 
        status: 401, 
        headers: errorResponse.headers 
      });
      
      // Clear invalid token cookie
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
      { 
        success: true, 
        user: standardizedUser,
        validated: true,
        timestamp: new Date().toISOString()
      }, 
      { 
        status: 200, 
        headers: successResponse.headers 
      }
    );
  } catch (error) {
    console.error('Error in /api/auth/validate:', error);
    
    const errorResponse = createAuthErrorResponse('Token validation service unavailable');
    const response = NextResponse.json(errorResponse, { 
      status: 500, 
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
