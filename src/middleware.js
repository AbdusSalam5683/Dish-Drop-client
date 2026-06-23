// dish-drop-client/src/middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  // Get token from cookies
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  console.log('🔍 Middleware running:', pathname);
  console.log('🔑 Token exists:', token ? '✅' : '❌');

  // ==================== PUBLIC ROUTES ====================
  const publicRoutes = ['/', '/login', '/register', '/browse-recipes'];
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith('/recipe/')
  );

  // ==================== AUTH CHECK ====================
  // If trying to access protected route without token
  if (!token && !isPublicRoute) {
    console.log('🔒 Redirecting to login from:', pathname);
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ==================== ADMIN ROUTES ====================
  // For admin routes, we'll check role on client side
  // But we can still protect the route
  if (pathname.startsWith('/admin')) {
    // We'll let the client-side adminGuard handle role check
    // But redirect to login if no token
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // ==================== DASHBOARD ROUTES ====================
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.next();
  }

  // ==================== API ROUTES ====================
  // Skip middleware for API routes
  if (pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

// ==================== CONFIG ====================
export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};