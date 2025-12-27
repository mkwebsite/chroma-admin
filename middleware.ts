import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for route protection and redirects
 * Runs on the edge before the request is completed
 */

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get auth token from cookies (adjust cookie name as needed)
  const token = request.cookies.get('auth-token')?.value;
  const isAuthenticated = !!token;

  // Define protected routes - all routes that require authentication
  const protectedRoutes = [
    '/', // Home page (dashboard)
    '/admin', // All admin routes
    '/dashboard',
    '/profile',
    '/calendar',
    '/roles',
    '/form-elements',
    '/basic-tables',
    '/blank',
    '/line-chart',
    '/bar-chart',
    '/alerts',
    '/avatars',
    '/badge',
    '/buttons',
    '/images',
    '/videos',
    '/modals',
  ];
  
  // Auth routes that should redirect authenticated users away
  const authRoutes = ['/auth/signin', '/auth/signup', '/signin', '/signup'];

  // Check if current route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Check if current route is an auth route
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  );

  // Redirect unauthenticated users from protected routes to signin
  if (isProtectedRoute && !isAuthenticated) {
    const signInUrl = new URL('/auth/signin', request.url);
    signInUrl.searchParams.set('returnUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Redirect authenticated users away from auth pages to home/dashboard
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
}

/**
 * Configure which routes the middleware should run on
 * Use matcher to optimize performance by excluding static files
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

