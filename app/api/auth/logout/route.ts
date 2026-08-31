import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";

export async function POST(request: Request) {
  const session = await getSession();

  if (!session.isAdmin) {
    return NextResponse.json({ error: "未登录" }, { status: 401 });
  }

  // 校验 CSRF token，防止跨站请求伪造
  const formData = await request.formData();
  const csrfToken = formData.get("csrfToken");
  if (!csrfToken || csrfToken !== session.csrfToken) {
    return NextResponse.json({ error: "CSRF 校验失败" }, { status: 403 });
  }

  session.destroy();
  return NextResponse.json({ success: true });
}
