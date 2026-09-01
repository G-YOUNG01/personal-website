import { NextResponse } from "next/server";
import { z } from "zod";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { requireAdminApi, csrfValid } from "@/lib/admin-api";

const postSchema = z.object({
  title: z.string().min(1, "标题不能为空").max(200),
  slug: z
    .string()
    .min(1, "slug 不能为空")
    .max(200)
    .regex(/^[a-z0-9-]+$/, "slug 只能包含小写字母、数字和连字符"),
  content: z.string(),
  coverImage: z.string().optional().or(z.literal("")),
  tags: z.array(z.string()).default([]),
  published: z.boolean().default(false),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  // 管理端传 ?all=1 返回全部（含草稿），需登录；公开接口默认只返回已发布
  const all = searchParams.get("all") === "1";
  if (all) {
    const auth = await requireAdminApi();
    if (!auth.ok) return auth.unauthorized;
  }
  const rows = all
    ? await db.select().from(posts).orderBy(desc(posts.createdAt)).all()
    : await db
        .select()
        .from(posts)
        .where(eq(posts.published, true))
        .orderBy(desc(posts.createdAt))
        .all();
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
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

  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "输入格式错误" },
      { status: 400 },
    );
  }
  const { title, slug, content, coverImage, tags, published } = parsed.data;

  // slug 唯一性检查
  const exists = await db.select({ id: posts.id }).from(posts).where(eq(posts.slug, slug)).get();
  if (exists) {
    return NextResponse.json({ error: "slug 已存在，请换一个" }, { status: 409 });
  }

  const row = await db
    .insert(posts)
    .values({
      title,
      slug,
      content,
      coverImage: coverImage || null,
      tags,
      published,
    })
    .returning()
    .get();

  return NextResponse.json(row, { status: 201 });
}
