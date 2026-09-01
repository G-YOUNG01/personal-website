import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { requireAdminApi, csrfValid } from "@/lib/admin-api";

const updateSchema = z.object({
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

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = await db
    .select()
    .from(posts)
    .where(eq(posts.id, Number(id)))
    .get();
  // 公开接口：草稿不可见（与博客详情页行为一致）
  if (!row || !row.published) {
    return NextResponse.json({ error: "文章不存在" }, { status: 404 });
  }
  return NextResponse.json(row);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.unauthorized;

  const { id } = await params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "请求体格式错误" }, { status: 400 });
  }
  if (!csrfValid(auth.session, body as { csrfToken?: unknown })) {
    return NextResponse.json({ error: "CSRF 校验失败" }, { status: 403 });
  }

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "输入格式错误" },
      { status: 400 },
    );
  }
  const { title, slug, content, coverImage, tags, published } = parsed.data;

  const target = await db
    .select({ id: posts.id })
    .from(posts)
    .where(eq(posts.id, Number(id)))
    .get();
  if (!target) {
    return NextResponse.json({ error: "文章不存在" }, { status: 404 });
  }

  // slug 唯一性检查（排除自身）
  const dup = await db.select({ id: posts.id }).from(posts).where(eq(posts.slug, slug)).get();
  if (dup && dup.id !== target.id) {
    return NextResponse.json({ error: "slug 已存在，请换一个" }, { status: 409 });
  }

  const row = await db
    .update(posts)
    .set({
      title,
      slug,
      content,
      coverImage: coverImage || null,
      tags,
      published,
      updatedAt: new Date(),
    })
    .where(eq(posts.id, target.id))
    .returning()
    .get();

  return NextResponse.json(row);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.unauthorized;

  const { id } = await params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "请求体格式错误" }, { status: 400 });
  }
  if (!csrfValid(auth.session, body as { csrfToken?: unknown })) {
    return NextResponse.json({ error: "CSRF 校验失败" }, { status: 403 });
  }

  const target = await db
    .select({ id: posts.id })
    .from(posts)
    .where(eq(posts.id, Number(id)))
    .get();
  if (!target) {
    return NextResponse.json({ error: "文章不存在" }, { status: 404 });
  }

  await db.delete(posts).where(eq(posts.id, target.id));
  return NextResponse.json({ success: true });
}
