// dish-drop-client/src/middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  // ✅ টোকেন চেক করুন - কুকি থেকে
  const token = request.cookies.get('token')?.value;
  
  // ✅ অথবা Authorization হেডার থেকে (যদি থাকে)
  const authHeader = request.headers.get('authorization');
  const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
  
  // ✅ যেকোনো একটি থেকে টোকেন নিন
  const finalToken = token || headerToken;
  
  const { pathname } = request.nextUrl;

  console.log('🔍 Middleware running:', pathname);
  console.log('🔑 Token from cookie:', token ? '✅' : '❌');
  console.log('🔑 Token from header:', headerToken ? '✅' : '❌');
  console.log('🔑 Final token:', finalToken ? '✅' : '❌');

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

  // ==================== AUTH PAGES ====================
  const isAuthPage = pathname === '/login' || pathname === '/register';

  // ==================== IF TOKEN EXISTS ====================
  if (finalToken) {
    try {
      // Decode token to get role
      const decoded = JSON.parse(atob(finalToken.split('.')[1]));
      const userRole = decoded.role || 'user';
      
      console.log('👤 User role:', userRole);

      // If on login/register, redirect based on role
      if (isAuthPage) {
        const redirectUrl = userRole === 'admin' ? '/admin' : '/dashboard';
        console.log(`🔑 Redirecting to ${redirectUrl} from:`, pathname);
        return NextResponse.redirect(new URL(redirectUrl, request.url));
      }

      // ✅ Allow access to protected routes
      return NextResponse.next();

    } catch (error) {
      console.error('❌ Token decode error:', error);
      // Invalid token - clear cookie and redirect to login
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('token');
      return response;
    }
  }

  // ==================== NO TOKEN ====================
  // Redirect to login if trying to access protected route
  if (!finalToken && !isPublicRoute && !isAuthPage) {
    console.log('🔒 Redirecting to login from:', pathname);
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};