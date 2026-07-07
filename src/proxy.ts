import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/src/lib/auth/jwt";
import { canViewUsers, getHomePathForRole } from "@/src/lib/auth/roles";
import type { Role } from "@/src/lib/auth/types";

const PUBLIC_PATHS = ["/login"];

function getHomePath(role: Role): string {
  return getHomePathForRole(role);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;
  const isPublicPath = PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );

  if (isPublicPath) {
    if (session && pathname === "/login") {
      return NextResponse.redirect(
        new URL(getHomePath(session.role), request.url),
      );
    }

    return NextResponse.next();
  }

  if (!session) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/" && !canViewUsers(session.role)) {
    return NextResponse.redirect(new URL("/finance", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
