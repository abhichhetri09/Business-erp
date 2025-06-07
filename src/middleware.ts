import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "@/lib/jwt";

// Add paths that don't require authentication
const publicPaths = [
  "/auth/signin",
  "/auth/signup",
  "/api/auth/signin",
  "/api/auth/signup",
];

// API routes that should never redirect
const apiRoutes = ["/api/"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Never redirect API routes to HTML pages
  const isApiRoute = apiRoutes.some((route) => pathname.startsWith(route));

  // Check if the path is public
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // Get the token from the cookies
  const token = request.cookies.get("token");

  // For API routes, handle token verification without redirects
  if (isApiRoute) {
    // If the route requires authentication and no token is present
    if (!isPublicPath && !token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // If token is present, verify it
    if (token) {
      try {
        const { payload } = await verifyJWT(token.value);

        if (!payload.sub) {
          return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        // Add user info to request headers for route handlers
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set("X-User-Id", payload.sub);
        requestHeaders.set("X-User-Role", payload.role as string);

        return NextResponse.next({
          request: {
            headers: requestHeaders,
          },
        });
      } catch (error) {
        console.error("API middleware error:", error);
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
    }

    // Public API route without token
    return NextResponse.next();
  }

  // Handle non-API routes with redirects
  if (isPublicPath && token && !isApiRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!isPublicPath && !token && !isApiRoute) {
    const signInUrl = new URL("/auth/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (!isPublicPath && token) {
    try {
      const { payload } = await verifyJWT(token.value);

      if (!payload.sub) {
        return redirectToSignIn(request);
      }

      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("X-User-Id", payload.sub);
      requestHeaders.set("X-User-Role", payload.role as string);

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      console.error("Middleware error:", error);
      return redirectToSignIn(request);
    }
  }

  return NextResponse.next();
}

function redirectToSignIn(request: NextRequest) {
  const signInUrl = new URL("/auth/signin", request.url);
  signInUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);
  return NextResponse.redirect(signInUrl);
}

// Configure the paths that trigger the middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
