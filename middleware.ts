import { NextRequest, NextResponse } from "next/server";

// Define protected routes that require authentication
const protectedRoutes = ["/dashboard"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the requested path is a protected route
  const isProtectedRoute = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isProtectedRoute) {
    // Get the authentication token from the request cookies
    const token = request.cookies.get("token")?.value;

    // If there's no token, redirect to the login page
    if (!token) {
      const url = new URL("/login", request.url);
      // Add the original URL as a parameter to redirect back after login
      url.searchParams.set("callbackUrl", encodeURI(request.url));
      return NextResponse.redirect(url);
    }

    // Token exists, allow the request to proceed
    return NextResponse.next();
  }

  // For non-protected routes, allow the request to proceed
  return NextResponse.next();
}

// Configure the middleware to run only on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (e.g. robots.txt)
     * - api routes (handled separately)
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api).*)",
  ],
};
