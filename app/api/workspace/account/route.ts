import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { eq, ne } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { requireAdminApi, csrfValid } from "@/lib/workspace-api";

const passwordSchema = z.object({
  type: z.literal("password"),
  oldPassword: z.string().min(1).max(200),
  newPassword: z.string().min(8).max(200),
  csrfToken: z.string(),
});

const usernameSchema = z.object({
  type: z.literal("username"),
  newUsername: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[a-zA-Z0-9_-]+$/, "用户名只能包含字母、数字、下划线和连字符"),
  csrfToken: z.string(),
});

const requestSchema = z.discriminatedUnion("type", [passwordSchema, usernameSchema]);

// PATCH：修改密码或用户名
export async function PATCH(request: Request) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.unauthorized;

  try {
    const body = await request.json();
    if (!csrfValid(auth.session, body)) {
      return NextResponse.json({ error: "CSRF 校验失败" }, { status: 403 });
    }

    const data = requestSchema.parse(body);
    const userId = auth.session.userId;
    if (!userId) return NextResponse.json({ error: "会话无效" }, { status: 401 });

    const currentUser = await db.select().from(users).where(eq(users.id, userId)).get();
    if (!currentUser) return NextResponse.json({ error: "用户不存在" }, { status: 404 });

    if (data.type === "password") {
      // 验证旧密码
      const oldValid = await bcrypt.compare(data.oldPassword, currentUser.passwordHash);
      if (!oldValid) {
        return NextResponse.json({ error: "旧密码错误" }, { status: 400 });
      }

      // 新密码不能与旧密码相同
      const sameAsOld = await bcrypt.compare(data.newPassword, currentUser.passwordHash);
      if (sameAsOld) {
        return NextResponse.json({ error: "新密码不能与旧密码相同" }, { status: 400 });
      }

      // 哈希新密码并更新
      const newHash = await bcrypt.hash(data.newPassword, 10);
      await db.update(users).set({ passwordHash: newHash }).where(eq(users.id, userId));

      return NextResponse.json({ success: true, message: "密码修改成功" });
    }

    // 修改用户名
    // 检查新用户名是否已被占用
    const existing = await db.select().from(users).where(ne(users.id, userId)).all();
    const conflict = existing.find(
      (u) => u.username.toLowerCase() === data.newUsername.toLowerCase(),
    );
    if (conflict) {
      return NextResponse.json({ error: "用户名已被占用" }, { status: 400 });
    }

    await db.update(users).set({ username: data.newUsername }).where(eq(users.id, userId));

    // 更新 session 中的用户名
    auth.session.username = data.newUsername;
    await auth.session.save();

    return NextResponse.json({
      success: true,
      message: "用户名修改成功",
      username: data.newUsername,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const msg = error.issues[0]?.message || "输入格式错误";
      return NextResponse.json({ error: msg, details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "操作失败" }, { status: 500 });
  }
}
