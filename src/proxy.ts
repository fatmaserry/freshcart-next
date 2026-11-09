import { NextResponse, type NextRequest } from "next/server";
import { readSessionJwt } from "@/lib/auth/sessionJwt";

// Cart and wishlist stay public because guests keep theirs in the browser.
const protectedRoutes = ["/checkout", "/orders", "/profile"];
const guestOnlyRoutes = ["/login", "/register", "/forgot-password"];

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const sessionToken = await readSessionJwt(request);

  if (!sessionToken && protectedRoutes.some((r) => pathname.startsWith(r))) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", pathname + search);
    return NextResponse.redirect(url);
  }

  if (sessionToken && guestOnlyRoutes.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/checkout/:path*",
    "/orders/:path*",
    "/profile/:path*",
    "/login",
    "/register",
    "/forgot-password",
  ],
};
