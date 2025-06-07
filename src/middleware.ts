import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Add paths that don't require authentication
const publicPaths = [
  "/auth/signin",
  "/auth/signup",
  "/api/auth/signin",
  "/api/auth/signup",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path is public
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // Get the token from the cookies
  const token = request.cookies.get("token");

  // If the path is public and user is logged in, redirect to dashboard
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If the path is private and user is not logged in, redirect to signin
  if (!isPublicPath && !token) {
    const signInUrl = new URL("/auth/signin", request.url);
    // Store the current path to redirect back after login
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

// Configure the paths that trigger the middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     */
    "/((?!_next/static|_next/image|favicon.ico|images).*)",
  ],
};
