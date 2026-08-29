import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getSession, checkLoginRateLimit, resetLoginRateLimit, generateCsrfToken } from "@/lib/auth/session";
import { env } from "@/lib/env";
import { z } from "zod";

const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";

  // 登录限流
  const rateLimit = checkLoginRateLimit(ip);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "登录尝试过于频繁，请稍后再试" },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfter) } },
    );
  }

  try {
    const body = await request.json();
    const { username, password } = loginSchema.parse(body);

    // 验证用户名和密码
    if (username !== env.ADMIN_USERNAME) {
      return NextResponse.json({ error: "用户名或密码错误" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, env.ADMIN_PASSWORD_HASH);
    if (!isValid) {
      return NextResponse.json({ error: "用户名或密码错误" }, { status: 401 });
    }

    // 登录成功，创建 session
    const session = await getSession();
    session.isAdmin = true;
    session.username = username;
    session.csrfToken = generateCsrfToken();
    await session.save();

    resetLoginRateLimit(ip);

    return NextResponse.json({ success: true, csrfToken: session.csrfToken });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "输入格式错误" }, { status: 400 });
    }
    return NextResponse.json({ error: "登录失败" }, { status: 500 });
  }
}
