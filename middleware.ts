import { NextResponse, type NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, type SessionData } from "@/lib/auth/config";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 登录页本身不需要认证，直接放行
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // 检查管理员 session
  const session = await getIronSession<SessionData>(request.cookies as never, sessionOptions);

  if (!session.isAdmin) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
