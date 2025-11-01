import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define public routes (no authentication required)
const publicRoutes = [
  '/login',
  '/forgot-password',
  '/reset-password',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow .txt files for license verification
  if (pathname.endsWith('.txt')) {
    return NextResponse.next();
  }
  
  // Check if it's a public route
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  );

  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // For all other routes, let client-side authentication handle it
  // The ProtectedRoute component and useAuth hook will handle redirects
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
