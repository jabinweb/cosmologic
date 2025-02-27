import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from '@/lib/jwt';
import logger from '@/lib/logger';
import { prismaEdge } from '@/lib/prisma-edge';

// Paths that should bypass auth check
const publicPaths = [
  '/api/auth/google/callback',
  '/api/auth/signin',
  '/api/auth/me',
  '/_next',
  '/favicon.ico',
  '/images',
];

const protectedPaths = [
  '/dashboard/courses',
  '/dashboard/progress',
  '/dashboard/community'
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public paths to bypass
  if (publicPaths.some(path => pathname.startsWith(path))) {
    logger.debug(`Bypassing auth check for path: ${pathname}`);
    return NextResponse.next();
  }

  const token = request.cookies.get('token')?.value;
  logger.debug(`Auth check for path: ${pathname}`, { hasToken: !!token });

  try {
    if (token) {
      const payload = await verifyJWT(token);
      logger.debug(`Token verified for user: ${payload.email}`);

      // Redirect authenticated users away from auth pages
      if (pathname === '/auth/login' || pathname === '/auth/register') {
        logger.debug('Redirecting authenticated user to dashboard');
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }

      // Check subscription for protected paths
      if (protectedPaths.some(path => pathname.startsWith(path))) {
        try {
          const user = await verifyJWT(token);
          
          // Check subscription
          const subscription = await prismaEdge.subscription.findFirst({
            where: {
              userId: user.userId,
              status: 'ACTIVE',
              activatedAt: { not: null }
            }
          });

          if (!subscription) {
            return NextResponse.redirect(new URL('/pricing', request.url));
          }
        } catch (error) {
          return NextResponse.redirect(new URL('/login', request.url));
        }
      }

      // Allow access to protected routes
      return NextResponse.next();
    }

    // Handle unauthenticated requests to protected routes
    if (pathname.startsWith('/dashboard')) {
      logger.debug('Unauthorized access attempt to dashboard');
      const loginUrl = new URL('/auth/login', request.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Allow access to public routes
    return NextResponse.next();
  } catch (error) {
    logger.error('Auth middleware error', { error });
    
    // Clear invalid token and redirect to login
    const response = NextResponse.redirect(new URL('/auth/login', request.url));
    response.cookies.delete('token');
    return response;
  }
}

export const config = {
  matcher: [
    '/((?!api/auth/google/callback|_next/static|_next/image|favicon.ico).*)',
    '/api/:path*',
  ],
};
