import { NextResponse, type NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, type SessionData } from "@/lib/auth/config";

export async function proxy(request: NextRequest) {
  const response = NextResponse.next();
  // Next.js RequestCookies 与 iron-session CookieStore 运行时兼容，类型断言绕过
  const session = await getIronSession<SessionData>(request.cookies as never, sessionOptions);

  if (!session.isAdmin) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
