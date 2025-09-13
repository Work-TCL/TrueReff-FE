import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export type MiddlewareFactory = (
  next: (request: NextRequest) => Promise<NextResponse> | NextResponse
) => (request: NextRequest) => Promise<NextResponse> | NextResponse;

export function stackMiddlewares(
  functions: MiddlewareFactory[] = [],
  index = 0
): (request: NextRequest) => Promise<NextResponse> | NextResponse {
  const current = functions[index];
  if (current) {
    const next = stackMiddlewares(functions, index + 1);
    return current(next);
  }
  return () => NextResponse.next();
}

// Helper function to check if a request matches a path
const match = (matcher: string[], request: NextRequest) =>
  matcher.some((path) => request.nextUrl.pathname.startsWith(path));

// Define public (non-authenticated) routes
const PUBLIC_ROUTES = [
  "/",
  "/vendor",
  "/aboutus",
  "/contact",
  "/help",
  "/login",
  "/register",
  "/email-verify",
  "/reset-password",
  "/forgot-password",
  "/send-otp",
  "/terms-condition",
  "/transaction-policy",
  "/privacy-policy",
];
const USER_PUBLIC_ROUTES = ["/store",'/product-detail'];
const routes = ["/dashboard","/wishlist","/terms-condition","/privacy-policy"];

const withAuthMiddleware: MiddlewareFactory = (next) => {
  return async (request: NextRequest) => {
    const { pathname } = request.nextUrl;
    const user:any = await getToken({req: request});
    const token =
      request.cookies.get("next-auth.session-token") ||
      request.cookies.get("__Secure-next-auth.session-token");
    // Skip middleware for Next.js API, static, and public files
    if (
      pathname.startsWith("/_next") || // Next.js internals
      pathname.startsWith("/api") || // API routes
      pathname.startsWith("/public") || // Public assets
      pathname.startsWith("/store") ||  // Allow store
      pathname.startsWith("/product-detail") ||   // Allow product detail
      pathname.startsWith("/creators")   // Allow creators
    ) {
      return next(request);
    }

    // Redirect Unauthenticated Users Trying to Access Protected Pages
    if (!token && !PUBLIC_ROUTES.includes(pathname)) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    // if(USER_PUBLIC_ROUTES.includes(pathname)){
    //   return NextResponse.redirect(new URL(pathname, request.url));
    // }
    // Redirect Authenticated Users Away from Auth 
    
    if(user?.creator && !pathname.startsWith("/creator-registration") && !routes.includes(pathname) && user?.creator?.status !== "APPROVED"){
      return NextResponse.redirect(new URL('/creator-registration', request.url));
    }
    if(user?.vendor && !pathname.startsWith("/vendor-register") && !routes.includes(pathname) && user?.vendor?.status !== "APPROVED"){
      return NextResponse.redirect(new URL('/vendor-register', request.url));
    }
    if (token && (pathname === "/" || match(["/login", "/register","/email-verify","/reset-password","/forgot-password","/send-otp"], request))) {
      return NextResponse.redirect(new URL(user?.type ? `/${user?.type}/dashboard`:`/dashboard`, request.url));
    }
    if(token && user?.type === "vendor" && user?.vendor?.status === "APPROVED" && (pathname.includes("/store/") && pathname.startsWith("/creator") || ["/creator-registration","/dashboard"].includes(pathname))){
        return NextResponse.redirect(new URL(`/${user?.type}/dashboard`, request.url));
    }

    if(token && user?.type === "creator" && user?.creator?.status === "APPROVED" && (pathname.startsWith("/vendor") || ['/vendor-register','/dashboard'].includes(pathname))){
        return NextResponse.redirect(new URL(`/${user?.type}/dashboard`, request.url));
    }

    return next(request);
  };
};

const middlewares = [withAuthMiddleware];

export default stackMiddlewares(middlewares);

export const config = {
    matcher: [
      '/((?!_next/static|_next/image|favicon.ico|manifest.json|service-worker.js|firebase-messaging-sw.js|icons|assets|web-app-manifest-192x192.png|web-app-manifest-512x512.png|api).*)',
    ],
  };
