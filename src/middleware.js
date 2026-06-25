// dish-drop-client/src/middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  console.log('🔍 Middleware running:', pathname);
  console.log('🔑 Token exists:', token ? '✅' : '❌');

  // ==================== PUBLIC ROUTES ====================
  const publicRoutes = ['/', '/login', '/register', '/browse-recipes'];
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith('/recipe/')
  );

  // ==================== SKIP STATIC FILES ====================
  if (pathname.startsWith('/_next') || 
      pathname.startsWith('/api') || 
      pathname.includes('.')) {
    return NextResponse.next();
  }

  // ==================== AUTH CHECK ====================
  // Redirect to login if no token and not public
  if (!token && !isPublicRoute) {
    console.log('🔒 Redirecting to login from:', pathname);
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ==================== IF TOKEN EXISTS ====================
  if (token) {
    try {
      // Decode token to get role
      const decoded = JSON.parse(atob(token.split('.')[1]));
      const userRole = decoded.role || 'user';
      
      console.log('👤 User role:', userRole);

      // If on login/register, redirect based on role
      if (pathname === '/login' || pathname === '/register') {
        const redirectUrl = userRole === 'admin' ? '/admin' : '/dashboard';
        console.log(`🔑 Redirecting to ${redirectUrl} from:`, pathname);
        return NextResponse.redirect(new URL(redirectUrl, request.url));
      }

      // ⚠️ REMOVED: Admin/User dashboard redirect - এখন Layout এ handle করে
      // এই অংশটি বাদ দেওয়া হয়েছে কারণ Layout-এ ইতিমধ্যে Guard আছে

    } catch (error) {
      console.error('❌ Token decode error:', error);
      // Invalid token - clear cookie and redirect to login
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};