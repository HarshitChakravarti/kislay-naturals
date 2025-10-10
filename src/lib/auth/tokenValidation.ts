import { NextRequest } from 'next/server';
import { supabase } from '../supabase';

export interface TokenValidationResult {
  isValid: boolean;
  user?: {
    id: string;
    email: string | null;
    role: string;
    metadata?: any;
  };
  error?: string;
  shouldRefresh?: boolean;
}

export interface StandardizedUser {
  _id: string;
  username: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Centralized token validation function used across all layers
 * This ensures consistent validation behavior in middleware, API routes, and client-side
 */
export async function validateToken(token: string): Promise<TokenValidationResult> {
  if (!token || typeof token !== 'string' || token.trim() === '') {
    return {
      isValid: false,
      error: 'No token provided'
    };
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error) {
      console.log('Supabase auth error:', error.message, error.status);
      return {
        isValid: false,
        error: `Token validation failed: ${error.message}`
      };
    }
    
    if (!user) {
      console.log('No user returned from Supabase');
      return {
        isValid: false,
        error: 'No user found for token'
      };
    }

    // Extract role from user metadata
    const role = (user.user_metadata as any)?.role || 'user';
    
    return {
      isValid: true,
      user: {
        id: user.id,
        email: user.email || null,
        role: role,
        metadata: user.user_metadata
      }
    };
  } catch (error) {
    console.error('Token validation error:', error);
    return {
      isValid: false,
      error: 'Token validation failed'
    };
  }
}

/**
 * Extract token from request (cookies or headers)
 */
export function extractTokenFromRequest(request: NextRequest): string | null {
  // Try cookie first
  const cookieToken = request.cookies.get('token')?.value;
  if (cookieToken) {
    return cookieToken;
  }

  // Try authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.replace('Bearer ', '');
  }

  return null;
}

/**
 * Standardize user data format across all layers
 */
export function standardizeUserData(user: any): StandardizedUser {
  return {
    _id: user.id,
    username: user.metadata?.username || user.metadata?.full_name || user.email?.split('@')[0] || 'User',
    name: user.metadata?.full_name || user.metadata?.name || user.email?.split('@')[0] || 'User',
    email: user.email || '',
    role: user.role || 'user',  // Use user.role directly since it's already extracted
    createdAt: user.created_at,
    updatedAt: user.updated_at
  };
}

/**
 * Check if user has admin role with enhanced validation
 */
export function isAdminUser(user: any): boolean {
  if (!user) return false;
  
  // Check role from multiple possible locations
  const role = user.role || user.user_metadata?.role || user.metadata?.role;
  
  return role === 'admin';
}

/**
 * Validate admin role with detailed error information
 */
export function validateAdminRole(user: any): { isValid: boolean; error?: string } {
  if (!user) {
    return { isValid: false, error: 'No user data provided' };
  }
  
  const role = user.role || user.user_metadata?.role || user.metadata?.role;
  
  if (!role) {
    return { isValid: false, error: 'No role found in user data' };
  }
  
  if (role !== 'admin') {
    return { isValid: false, error: `User role '${role}' is not admin` };
  }
  
  return { isValid: true };
}

/**
 * Get user role with fallback logic
 */
export function getUserRole(user: any): string {
  if (!user) return 'user';
  
  return user.role || user.user_metadata?.role || user.metadata?.role || 'user';
}

/**
 * Create standardized error response for authentication failures
 */
export function createAuthErrorResponse(message: string, status: number = 401) {
  return {
    success: false,
    message,
    status,
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  };
}

/**
 * Create standardized success response for authentication
 */
export function createAuthSuccessResponse(user: StandardizedUser) {
  return {
    success: true,
    user,
    headers: {
      'Cache-Control': 'no-store, max-age=0'
    }
  };
}
