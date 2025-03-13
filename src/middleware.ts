import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // ✅ Redirect Unauthenticated Users Trying to Access Protected Pages
    if (!token && pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // ✅ Redirect Authenticated Users Away from Login/Register Pages
    if (token && ["/login", "/register"].includes(pathname)) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // Check if user is authenticated
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"], // Define routes to protect
};
