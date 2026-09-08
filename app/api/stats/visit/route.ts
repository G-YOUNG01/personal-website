import { NextResponse } from "next/server";
import { z } from "zod";
import { sql, and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { pageViews, visitorViews, dailyStats } from "@/lib/db/schema";

const bodySchema = z.object({
  path: z.string().min(1).max(500),
  visitorId: z.string().min(1).max(64),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { path, visitorId } = bodySchema.parse(body);

    const now = new Date();
    const today = now.toISOString().slice(0, 10); // YYYY-MM-DD

    // 1) 总浏览 +1（upsert）
    await db
      .insert(pageViews)
      .values({ path, views: 1, uniqueViews: 0, updatedAt: now })
      .onConflictDoUpdate({
        target: pageViews.path,
        set: { views: sql`${pageViews.views} + 1`, updatedAt: now },
      });

    // 2) 独立访客去重
    const existing = await db
      .select()
      .from(visitorViews)
      .where(and(eq(visitorViews.path, path), eq(visitorViews.visitorId, visitorId)))
      .get();

    const isNewVisitor = !existing;
    if (isNewVisitor) {
      await db.insert(visitorViews).values({ path, visitorId });
      await db
        .update(pageViews)
        .set({ uniqueViews: sql`${pageViews.uniqueViews} + 1`, updatedAt: now })
        .where(eq(pageViews.path, path));
    }

    // 3) 每日统计：当天 PV +1，新访客 UV +1
    await db
      .insert(dailyStats)
      .values({ date: today, pv: 1, uv: isNewVisitor ? 1 : 0 })
      .onConflictDoUpdate({
        target: dailyStats.date,
        set: {
          pv: sql`${dailyStats.pv} + 1`,
          uv: isNewVisitor ? sql`${dailyStats.uv} + 1` : dailyStats.uv,
        },
      });

    const row = await db.select().from(pageViews).where(eq(pageViews.path, path)).get();
    return NextResponse.json({
      views: row?.views ?? 0,
      uniqueViews: row?.uniqueViews ?? 0,
    });
  } catch {
    return NextResponse.json({ error: "invalid request" }, { status: 400 });
  }
}
