import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Public routes that don't need authentication
    const publicRoutes = ['/auth/login', '/auth/signup', '/auth/forgot-password', '/', '/privacy', '/terms'];
    
    // Routes that need authentication but not onboarding completion
    const authOnlyRoutes = ['/onboarding'];

    // If accessing public routes, allow
    if (publicRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.next();
    }

    // If not authenticated and trying to access protected route
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }

    // If accessing onboarding route, allow (authenticated users can access)
    if (authOnlyRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.next();
    }

    // For all other protected routes, check onboarding completion
    // This will be handled by the dashboard layout component
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        
        // Allow public routes
        const publicRoutes = ['/auth/login', '/auth/signup', '/auth/forgot-password', '/', '/privacy', '/terms'];
        if (publicRoutes.some(route => pathname.startsWith(route))) {
          return true;
        }

        // Require token for all other routes
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)',
  ],
};
