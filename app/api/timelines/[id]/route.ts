import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { timelines } from "@/lib/db/schema";
import { requireAdminApi, csrfValid } from "@/lib/admin-api";

const updateSchema = z.object({
  slug: z
    .string()
    .min(1, "slug 不能为空")
    .max(200)
    .regex(/^[a-z0-9-]+$/, "slug 只能包含小写字母、数字和连字符"),
  year: z.coerce.number().int().min(1970).max(2200, "年份无效"),
  title: z.string().min(1, "标题不能为空").max(200),
  description: z.string().optional().or(z.literal("")),
  iconType: z.string().optional().or(z.literal("")),
  sortOrder: z.coerce.number().int().default(0),
});

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = await db
    .select()
    .from(timelines)
    .where(eq(timelines.id, Number(id)))
    .get();
  if (!row) {
    return NextResponse.json({ error: "时间线不存在" }, { status: 404 });
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
  const { slug, year, title, description, iconType, sortOrder } = parsed.data;

  const target = await db
    .select({ id: timelines.id })
    .from(timelines)
    .where(eq(timelines.id, Number(id)))
    .get();
  if (!target) {
    return NextResponse.json({ error: "时间线不存在" }, { status: 404 });
  }

  const dup = await db
    .select({ id: timelines.id })
    .from(timelines)
    .where(eq(timelines.slug, slug))
    .get();
  if (dup && dup.id !== target.id) {
    return NextResponse.json({ error: "slug 已存在，请换一个" }, { status: 409 });
  }

  const row = await db
    .update(timelines)
    .set({
      slug,
      year,
      title,
      description: description || null,
      iconType: iconType || null,
      sortOrder,
    })
    .where(eq(timelines.id, target.id))
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
    .select({ id: timelines.id })
    .from(timelines)
    .where(eq(timelines.id, Number(id)))
    .get();
  if (!target) {
    return NextResponse.json({ error: "时间线不存在" }, { status: 404 });
  }

  await db.delete(timelines).where(eq(timelines.id, target.id));
  return NextResponse.json({ success: true });
}
