import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

const protectedRoutes = ['/account', '/admin'];

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

  const staticFileExtensions = ['.ico', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.css', '.js', '.woff', '.woff2', '.ttf', '.eot', '.json', '.xml'];
  if (staticFileExtensions.some(ext => pathname.toLowerCase().endsWith(ext))) {
    return NextResponse.next();
  }

  const { supabaseResponse, user } = await updateSession(request);

  const isPublicRoute = publicRoutes.some(route => {
    if (route === '/' && pathname === '/') return true;
    return pathname === route || pathname.startsWith(`${route}/`);
  });

  if (isPublicRoute) {
    return supabaseResponse;
  }

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAdminRoute = pathname.startsWith('/admin');

  if (isProtectedRoute) {
    if (!user) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }
    const role = user.user_metadata?.role;
    if (isAdminRoute && role !== 'admin') {
      const homeUrl = new URL('/', request.url);
      homeUrl.searchParams.set('error', 'admin_access_denied');
      return NextResponse.redirect(homeUrl);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon\\.ico).*)',
  ],
};
