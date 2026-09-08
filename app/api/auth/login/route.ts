import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import {
  getSession,
  checkLoginRateLimit,
  resetLoginRateLimit,
  generateCsrfToken,
} from "@/lib/auth/session";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { z } from "zod";

const loginSchema = z.object({
  username: z.string().min(1).max(100),
  password: z.string().min(1).max(200),
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

    // 从数据库查询用户（常量时间比较：先查用户，再统一错误信息）
    const user = await db.select().from(users).where(eq(users.username, username)).get();

    // 无论用户名不存在还是密码错误，都返回统一错误信息，防止用户枚举
    if (!user) {
      // 即使用户不存在，也执行一次 bcrypt 比较以保持响应时间一致（防时序攻击）
      await bcrypt.compare(
        password,
        "$2b$10$invalidhashinvalidhashinvalidhashinvalidhashinvalidhashinvali",
      );
      return NextResponse.json({ error: "用户名或密码错误" }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "用户名或密码错误" }, { status: 401 });
    }

    // 登录成功，创建 session
    const session = await getSession();
    session.isAdmin = true;
    session.userId = user.id;
    session.username = user.username;
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
