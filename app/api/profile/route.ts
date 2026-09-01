import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { profile } from "@/lib/db/schema";
import { requireAdminApi, csrfValid } from "@/lib/admin-api";

const profileSchema = z.object({
  name: z.string().min(1, "名称不能为空").max(100),
  avatarUrl: z.string().optional().or(z.literal("")),
  bio: z.string().optional().or(z.literal("")),
  skills: z.array(z.string()).default([]),
  contacts: z.record(z.string(), z.string()).default({}),
});

export async function GET() {
  let row = await db.select().from(profile).where(eq(profile.id, 1)).get();
  if (!row) {
    // 未配置时返回空模板，前端可创建
    row = {
      id: 1,
      name: "",
      avatarUrl: null,
      bio: null,
      skills: [],
      contacts: {},
    };
  }
  return NextResponse.json(row);
}

export async function PUT(request: Request) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.unauthorized;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "请求体格式错误" }, { status: 400 });
  }
  if (!csrfValid(auth.session, body as { csrfToken?: unknown })) {
    return NextResponse.json({ error: "CSRF 校验失败" }, { status: 403 });
  }

  const parsed = profileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "输入格式错误" },
      { status: 400 },
    );
  }
  const { name, avatarUrl, bio, skills, contacts } = parsed.data;

  const exists = await db.select({ id: profile.id }).from(profile).where(eq(profile.id, 1)).get();
  if (exists) {
    const row = await db
      .update(profile)
      .set({
        name,
        avatarUrl: avatarUrl || null,
        bio: bio || null,
        skills,
        contacts,
      })
      .where(eq(profile.id, 1))
      .returning()
      .get();
    return NextResponse.json(row);
  }

  const row = await db
    .insert(profile)
    .values({ id: 1, name, avatarUrl: avatarUrl || null, bio: bio || null, skills, contacts })
    .returning()
    .get();
  return NextResponse.json(row, { status: 201 });
}
