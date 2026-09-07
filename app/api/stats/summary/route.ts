import { NextResponse } from "next/server";
import { desc, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { pageViews } from "@/lib/db/schema";

// 全站访问统计（总 PV / 独立访客 / 热门页面）
export async function GET() {
  const total = await db
    .select({
      views: sql<number>`coalesce(sum(${pageViews.views}), 0)`,
      uniqueViews: sql<number>`coalesce(sum(${pageViews.uniqueViews}), 0)`,
    })
    .from(pageViews)
    .get();

  const topPages = await db
    .select({ path: pageViews.path, views: pageViews.views })
    .from(pageViews)
    .orderBy(desc(pageViews.views))
    .limit(10)
    .all();

  return NextResponse.json({
    totalViews: total?.views ?? 0,
    totalUnique: total?.uniqueViews ?? 0,
    topPages,
  });
}
