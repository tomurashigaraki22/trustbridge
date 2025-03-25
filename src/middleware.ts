import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth-token') || request.headers.get('authorization');
  const isAuthPage = request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register';

  // If trying to access dashboard without auth, redirect to login
  if (!authToken && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If authenticated user tries to access login/register, redirect to dashboard
  if (authToken && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register']
};