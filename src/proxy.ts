import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, decryptSession } from "@/lib/session";

// Next.js 16 renamed Middleware → Proxy (same purpose, now Node.js runtime).
// This is an OPTIMISTIC check only: it reads the session cookie to redirect
// quickly. The authoritative gate lives in the DAL (requireAdmin), used by the
// dashboard layout, pages, and every server action.
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isLogin = pathname === "/admin/login";
  const session = await decryptSession(req.cookies.get(SESSION_COOKIE)?.value);

  // Unauthenticated trying to reach any admin page except login → to login.
  if (!session && !isLogin) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
  // Already authenticated and hitting the login page → to dashboard.
  if (session && isLogin) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  // Only run on admin routes — the public site is untouched.
  matcher: ["/admin", "/admin/:path*"],
};
