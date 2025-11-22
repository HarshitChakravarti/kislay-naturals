import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { validateToken, extractTokenFromRequest, isAdminUser, validateAdminRole, getUserRole } from './lib/auth/tokenValidation';

// Define the routes that require authentication
const protectedRoutes = ['/account', '/admin'];
const authRoutes = ['/login', '/register'];

// Define public routes that should never be processed by middleware
// These routes are accessible to everyone, including Googlebot
const publicRoutes = [
  '/',
  '/products',
  '/about',
  '/blog',
  '/recipes',
  '/contact-us',
  '/privacy-policy',
  '/terms-and-conditions',
  '/refund-policy',
  '/order-success',
  '/payment-success',
  '/checkout',
  '/subscribe',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files (images, fonts, CSS, JS, etc.)
  const staticFileExtensions = ['.ico', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.css', '.js', '.woff', '.woff2', '.ttf', '.eot', '.json', '.xml'];
  const hasStaticExtension = staticFileExtensions.some(ext => pathname.toLowerCase().endsWith(ext));
  if (hasStaticExtension) {
    return NextResponse.next();
  }

  // Early return for public routes - no authentication checks needed
  // This prevents any potential redirect loops for Googlebot and other crawlers
  const isPublicRoute = publicRoutes.some(route => {
    // Exact match for root or exact path match
    if (route === '/' && pathname === '/') return true;
    // Check if pathname starts with the public route (handles /products, /products/123, etc.)
    return pathname === route || pathname.startsWith(`${route}/`);
  });

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAdminRoute = pathname.startsWith('/admin');
  const isAccountRoute = pathname.startsWith('/account');

  if (isProtectedRoute) {
    const token = extractTokenFromRequest(request);
    
    // If there's no token, redirect to login
    if (!token) {
      console.log('No token found, redirecting to login');
      return redirectToLogin(request);
    }

    // Use standardized token validation
    const validationResult = await validateToken(token);
    
    if (!validationResult.isValid) {
      console.log('Middleware token validation failed:', validationResult.error);
      return redirectToLogin(request);
    }

    // Enhanced role-based access control
    const userRole = getUserRole(validationResult.user);
    console.log(`User role: ${userRole}, accessing: ${pathname}`);

    // For admin routes, perform explicit admin role validation
    if (isAdminRoute) {
      const adminValidation = validateAdminRole(validationResult.user);
      
      if (!adminValidation.isValid) {
        console.log(`Admin access denied: ${adminValidation.error}`);
        // Redirect non-admin users to home with a message
        const homeUrl = new URL('/', request.url);
        homeUrl.searchParams.set('error', 'admin_access_denied');
        return NextResponse.redirect(homeUrl);
      }
      
      console.log('Admin access granted');
    }

    // For account routes, ensure user is authenticated (any role)
    if (isAccountRoute) {
      console.log('Account access granted for user');
    }

    // If token is valid and role checks pass, proceed
    return NextResponse.next();
  }

  // For all other routes (like auth routes), allow access
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
     * - static file extensions (.ico, .png, .jpg, etc.)
     * 
     * Note: Next.js matcher doesn't support capturing groups, so we use
     * a simpler pattern and handle static files in the middleware function itself
     */
    '/((?!api|_next/static|_next/image|favicon\\.ico).*)',
  ],
};
