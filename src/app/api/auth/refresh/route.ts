import { NextRequest, NextResponse } from 'next/server'
import { validateToken, extractTokenFromRequest, standardizeUserData, createAuthErrorResponse, createAuthSuccessResponse } from '@/lib/auth/tokenValidation'
import { supabase } from '@/lib/supabase'
import { rateLimit } from '@/lib/middleware/rateLimit'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Only apply rate limiting in production to prevent resource exhaustion
    if (process.env.NODE_ENV === 'production') {
      const rateLimitResult = rateLimit(request, 50, 60 * 1000); // 50 requests per minute
      if (!rateLimitResult.success) {
        return NextResponse.json(
          { success: false, message: rateLimitResult.message },
          { status: 429, headers: { 'Retry-After': rateLimitResult.retryAfter?.toString() || '60' } }
        );
      }
    }

    const token = extractTokenFromRequest(request);

    if (!token) {
      const errorResponse = createAuthErrorResponse('No token provided for refresh');
      return NextResponse.json(errorResponse, { 
        status: 401,
        headers: errorResponse.headers
      });
    }

    // Validate the current token
    const validationResult = await validateToken(token);
    
    if (!validationResult.isValid) {
      console.log('Token refresh failed - invalid token:', validationResult.error);
      
      const errorResponse = createAuthErrorResponse('Invalid or expired token');
      const response = NextResponse.json(errorResponse, { 
        status: 401, 
        headers: errorResponse.headers 
      });
      
      // Clear invalid token
      response.cookies.set('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        expires: new Date(0),
        path: '/',
      });
      
      return response;
    }

    // For now, we'll return the same token since Supabase handles refresh automatically
    // In the future, we could implement actual token refresh logic here
    const standardizedUser = standardizeUserData(validationResult.user);
    const successResponse = createAuthSuccessResponse(standardizedUser);

    return NextResponse.json(
      { 
        success: true, 
        user: standardizedUser,
        token: token, // Return the same token for now
        refreshed: true
      }, 
      { 
        status: 200, 
        headers: successResponse.headers 
      }
    );
  } catch (error) {
    console.error('Error in token refresh:', error);
    
    const errorResponse = createAuthErrorResponse('Token refresh failed');
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
