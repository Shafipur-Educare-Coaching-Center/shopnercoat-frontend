import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get('accessToken')?.value;
  const userRole = request.cookies.get('userRole')?.value;

  const isAuthenticated = Boolean(accessToken);

  // 1. Guest / Auth Routes (/login, /register, /auth/*)
  const isAuthRoute =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname.startsWith('/auth/');

  if (isAuthRoute) {
    if (isAuthenticated) {
      // Authenticated users cannot visit login/register; redirect to their dashboard
      const targetDashboard =
        userRole === 'ADMIN' ? '/dashboard/admin' : '/dashboard/student';
      return NextResponse.redirect(new URL(targetDashboard, request.url));
    }
    // Unauthenticated visitors are allowed
    return NextResponse.next();
  }

  // 2. Dashboard Protected Routes (/dashboard, /dashboard/*)
  if (pathname.startsWith('/dashboard')) {
    if (!isAuthenticated) {
      // Unauthenticated users attempting to access dashboard; redirect to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Role-based Access Guards
    if (pathname.startsWith('/dashboard/admin') && userRole !== 'ADMIN') {
      // Non-admin trying to access admin dashboard
      return NextResponse.redirect(new URL('/dashboard/student', request.url));
    }

    if (pathname.startsWith('/dashboard/student') && userRole === 'ADMIN') {
      // Admin navigating to student dashboard -> redirect to admin dashboard
      return NextResponse.redirect(new URL('/dashboard/admin', request.url));
    }

    if (pathname === '/dashboard') {
      // Base /dashboard route redirect to role-specific dashboard
      const targetDashboard =
        userRole === 'ADMIN' ? '/dashboard/admin' : '/dashboard/student';
      return NextResponse.redirect(new URL(targetDashboard, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login',
    '/register',
    '/auth/:path*',
    '/dashboard/:path*',
    '/dashboard',
  ],
};
