import { NextRequest, NextResponse } from "next/server";

const ACCESS_TOKEN_NAME =
  String(process.env.NEXT_PUBLIC_APP_NAME || "")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "") + ".user.token";

const LOGIN_PATH = "/auth/login";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ===== skip routes =====
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/auth/login") ||
    pathname.match(/\.(.*)$/)
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get(ACCESS_TOKEN_NAME)?.value;

  // ===== belum login =====
  if (!token) {
    const loginUrl = new URL(LOGIN_PATH, req.url);
    return NextResponse.redirect(loginUrl);
  }

  // ===== sudah login =====
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!auth/login).*)"],
};
