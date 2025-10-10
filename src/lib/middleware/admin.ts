import { NextRequest, NextResponse } from 'next/server'
import { validateToken, extractTokenFromRequest, isAdminUser, createAuthErrorResponse } from '../auth/tokenValidation'

export interface AdminRequest extends NextRequest {
  user?: { id: string; email: string | null | undefined; role?: string; [key: string]: unknown }
}

export async function authenticateAdmin(request: NextRequest) {
  try {
    const token = extractTokenFromRequest(request);
    if (!token) return null;

    // Use standardized token validation
    const validationResult = await validateToken(token);
    
    if (!validationResult.isValid) {
      console.log('Admin authentication failed:', validationResult.error);
      return null;
    }

    // Check if user exists and has admin role using standardized function
    if (!validationResult.user || !isAdminUser(validationResult.user)) {
      console.log('User does not have admin role');
      return null;
    }

    return { 
      id: validationResult.user.id, 
      email: validationResult.user.email, 
      role: validationResult.user.role 
    };
  } catch (error) {
    console.error('Admin authentication error:', error);
    return null;
  }
}

export function withAdminAuth(handler: (request: AdminRequest) => Promise<NextResponse>) {
  return async (request: NextRequest): Promise<NextResponse> => {
    const user = await authenticateAdmin(request)
    if (!user) {
      const errorResponse = createAuthErrorResponse('Admin authentication required');
      return NextResponse.json(errorResponse, { 
        status: 401,
        headers: errorResponse.headers
      });
    }
    
    const adminRequest = request as AdminRequest
    adminRequest.user = user
    return handler(adminRequest)
  }
}

export function withAdminAuthDynamic(handler: (request: AdminRequest, context: any) => Promise<NextResponse>) {
  return async (request: NextRequest, context: any): Promise<NextResponse> => {
    const user = await authenticateAdmin(request)
    if (!user) {
      const errorResponse = createAuthErrorResponse('Admin authentication required');
      return NextResponse.json(errorResponse, { 
        status: 401,
        headers: errorResponse.headers
      });
    }
    
    const adminRequest = request as AdminRequest
    adminRequest.user = user
    return handler(adminRequest, context)
  }
}
