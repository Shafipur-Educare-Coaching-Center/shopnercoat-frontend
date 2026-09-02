import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const accessToken = request.cookies.get('accessToken')?.value;
  const userRole = request.cookies.get('userRole')?.value;
  const verifiedToken = request.cookies.get('verifiedToken')?.value;
  const pendingMobile = request.cookies.get('pendingMobile')?.value;

  const isAuthenticated = Boolean(accessToken);

  // 1. Guest / Auth routes: /login, /register, /auth/*
  const isAuthRoute =
    pathname === '/login' ||
    pathname === '/register' ||
    pathname.startsWith('/auth/');

  if (isAuthRoute) {
    if (isAuthenticated) {
      // Logged in users cannot visit login/register; redirect to their dashboard
      const targetDashboard =
        userRole === 'ADMIN' ? '/dashboard/admin' : '/dashboard/student';
      return NextResponse.redirect(new URL(targetDashboard, request.url));
    }
    return NextResponse.next();
  }

  // 2. Route Guard for /verify-otp
  if (pathname === '/verify-otp') {
    if (isAuthenticated) {
      const targetDashboard =
        userRole === 'ADMIN' ? '/dashboard/admin' : '/dashboard/student';
      return NextResponse.redirect(new URL(targetDashboard, request.url));
    }
    // If no pending mobile registration session, redirect to register
    if (!pendingMobile && !verifiedToken) {
      return NextResponse.redirect(new URL('/register', request.url));
    }
    return NextResponse.next();
  }

  // 3. Route Guard for /complete-profile
  if (pathname === '/complete-profile') {
    // Requires either a fresh verifiedToken from OTP verification OR an active student session
    const hasProfilePermission = Boolean(verifiedToken || accessToken);
    if (!hasProfilePermission) {
      return NextResponse.redirect(new URL('/register', request.url));
    }
    return NextResponse.next();
  }

  // 4. Protected Dashboard Routes: /dashboard, /dashboard/*
  if (pathname.startsWith('/dashboard')) {
    if (!isAuthenticated) {
      // Unauthenticated visitor trying to access dashboard -> redirect to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Role-based Access Guards
    if (pathname.startsWith('/dashboard/admin') && userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard/student', request.url));
    }

    if (pathname.startsWith('/dashboard/student') && userRole === 'ADMIN') {
      return NextResponse.redirect(new URL('/dashboard/admin', request.url));
    }

    if (pathname === '/dashboard') {
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
    '/verify-otp',
    '/complete-profile',
    '/auth/:path*',
    '/dashboard/:path*',
    '/dashboard',
  ],
};
