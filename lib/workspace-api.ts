import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";

/**
 * 后台写操作鉴权：返回统一结果，调用方按需使用 unauthorized 响应。
 */
export async function requireAdminApi() {
  const session = await getSession();
  if (!session.isAdmin) {
    return {
      ok: false as const,
      session: null as null,
      unauthorized: NextResponse.json({ error: "未授权" }, { status: 401 }),
    };
  }
  return { ok: true as const, session, unauthorized: null as null };
}

/** CSRF 校验：请求体中的 token 必须与会话中的一致 */
export function csrfValid(session: { csrfToken?: string }, body: { csrfToken?: unknown } | null) {
  const token = body && typeof body.csrfToken === "string" ? body.csrfToken : "";
  return token.length > 0 && token === session.csrfToken;
}
