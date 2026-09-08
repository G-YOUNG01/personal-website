import { NextResponse } from "next/server";
import { z } from "zod";
import { asc, desc, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { todos } from "@/lib/db/schema";
import { requireAdminApi, csrfValid } from "@/lib/workspace-api";

const createSchema = z.object({
  title: z.string().min(1).max(200),
  category: z.string().max(50).optional().nullable(),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
  dueDate: z.string().optional().nullable(),
  note: z.string().max(2000).optional().nullable(),
  csrfToken: z.string(),
});

// GET：待办列表
export async function GET() {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.unauthorized;

  const rows = await db
    .select()
    .from(todos)
    .orderBy(asc(todos.completed), asc(todos.sortOrder), desc(todos.createdAt))
    .all();

  return NextResponse.json({ todos: rows });
}

// POST：新建待办
export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.unauthorized;

  try {
    const body = await request.json();
    if (!csrfValid(auth.session, body)) {
      return NextResponse.json({ error: "CSRF 校验失败" }, { status: 403 });
    }

    const data = createSchema.parse(body);
    const maxSort = await db
      .select({ max: sql<number>`coalesce(max(${todos.sortOrder}), 0)` })
      .from(todos)
      .get();

    const inserted = await db
      .insert(todos)
      .values({
        title: data.title,
        category: data.category ?? null,
        priority: data.priority,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        note: data.note ?? null,
        sortOrder: (maxSort?.max ?? 0) + 1,
      })
      .returning()
      .get();

    return NextResponse.json({ todo: inserted });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "输入格式错误", details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "创建失败" }, { status: 500 });
  }
}
