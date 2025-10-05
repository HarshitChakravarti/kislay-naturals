import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { supabase } from './lib/supabase';

// Define the routes that require authentication
const protectedRoutes = ['/account', '/admin'];
const authRoutes = ['/login', '/register'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('token')?.value;

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute) {
    // If there's no token, redirect to login
    if (!token) {
      return redirectToLogin(request);
    }

    // Verify the token using Supabase (Edge Runtime compatible)
    try {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (error || !user) {
        return redirectToLogin(request);
      }
      // If token is valid, proceed
      return NextResponse.next();
    } catch (error) {
      // If token is invalid, redirect to login
      console.error('Middleware token verification failed:', error);
      return redirectToLogin(request);
    }
  }

  return NextResponse.next();
}

function redirectToLogin(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('callbackUrl', pathname);
  
  // Clear the invalid cookie if it exists
  const response = NextResponse.redirect(loginUrl);
  response.cookies.delete('token');
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
