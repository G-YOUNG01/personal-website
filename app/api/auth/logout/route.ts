import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { getSession } from "@/lib/auth/session";

// 重定向基准地址：优先用 SITE_URL，避免反代环境下 request.url 被解析为内部地址（localhost:3000）
function loginRedirect(request: Request) {
  return NextResponse.redirect(new URL("/workspace/login", env.SITE_URL || request.url), {
    status: 303,
  });
}

export async function POST(request: Request) {
  const session = await getSession();

  if (!session.isAdmin) {
    return loginRedirect(request);
  }

  // 校验 CSRF token，防止跨站请求伪造
  const formData = await request.formData();
  const csrfToken = formData.get("csrfToken");
  if (!csrfToken || csrfToken !== session.csrfToken) {
    return NextResponse.json({ error: "CSRF 校验失败" }, { status: 403 });
  }

  session.destroy();
  return loginRedirect(request);
}
