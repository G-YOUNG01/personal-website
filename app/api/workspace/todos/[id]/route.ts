import { NextResponse } from "next/server";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { todos } from "@/lib/db/schema";
import { requireAdminApi, csrfValid } from "@/lib/workspace-api";

const updateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  category: z.string().max(50).nullable().optional(),
  priority: z.enum(["low", "medium", "high"]).optional(),
  dueDate: z.string().nullable().optional(),
  note: z.string().max(2000).nullable().optional(),
  completed: z.boolean().optional(),
  sortOrder: z.number().optional(),
  csrfToken: z.string(),
});

// PATCH：更新待办
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await params;
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.unauthorized;

  try {
    const body = await request.json();
    if (!csrfValid(auth.session, body)) {
      return NextResponse.json({ error: "CSRF 校验失败" }, { status: 403 });
    }

    const data = updateSchema.parse(body);
    const id = parseInt(idStr, 10);
    if (isNaN(id)) return NextResponse.json({ error: "无效 ID" }, { status: 400 });

    const existing = await db.select().from(todos).where(eq(todos.id, id)).get();
    if (!existing) return NextResponse.json({ error: "待办不存在" }, { status: 404 });

    const updated = await db
      .update(todos)
      .set({
        ...(data.title !== undefined && { title: data.title }),
        ...(data.category !== undefined && { category: data.category }),
        ...(data.priority !== undefined && { priority: data.priority }),
        ...(data.dueDate !== undefined && {
          dueDate: data.dueDate ? new Date(data.dueDate) : null,
        }),
        ...(data.note !== undefined && { note: data.note }),
        ...(data.completed !== undefined && { completed: data.completed }),
        ...(data.sortOrder !== undefined && { sortOrder: data.sortOrder }),
        updatedAt: new Date(),
      })
      .where(eq(todos.id, id))
      .returning()
      .get();

    return NextResponse.json({ todo: updated });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "输入格式错误", details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: "更新失败" }, { status: 500 });
  }
}

// DELETE：删除待办
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id: idStr } = await params;
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.unauthorized;

  // CSRF 校验（DELETE 请求体可能为空，从 header 取 token）
  const csrfToken = request.headers.get("x-csrf-token") || "";
  if (!csrfValid(auth.session, { csrfToken })) {
    return NextResponse.json({ error: "CSRF 校验失败" }, { status: 403 });
  }

  const id = parseInt(idStr, 10);
  if (isNaN(id)) return NextResponse.json({ error: "无效 ID" }, { status: 400 });

  const existing = await db.select().from(todos).where(eq(todos.id, id)).get();
  if (!existing) return NextResponse.json({ error: "待办不存在" }, { status: 404 });

  await db.delete(todos).where(eq(todos.id, id));
  return NextResponse.json({ success: true });
}
