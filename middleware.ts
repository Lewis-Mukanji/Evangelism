import { NextRequest, NextResponse } from "next/server";
export function middleware(request: NextRequest) {
  const protectedPath = ["/dashboard", "/admin", "/supervisor", "/journey"].some(path => request.nextUrl.pathname.startsWith(path));
  if (protectedPath && !request.cookies.get("followhim_session")) return NextResponse.redirect(new URL("/login", request.url));
  return NextResponse.next();
}
export const config = { matcher: ["/dashboard/:path*", "/admin/:path*", "/supervisor/:path*", "/journey/:path*"] };
