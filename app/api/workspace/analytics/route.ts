import { NextResponse } from "next/server";
import { desc, gte } from "drizzle-orm";
import { db } from "@/lib/db";
import { dailyStats } from "@/lib/db/schema";
import { requireAdminApi } from "@/lib/workspace-api";

// 访客趋势：按天聚合 PV/UV，支持 ?days=7|30
export async function GET(request: Request) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.unauthorized;

  const { searchParams } = new URL(request.url);
  const days = Math.min(Math.max(parseInt(searchParams.get("days") || "7", 10) || 7, 1), 90);

  const since = new Date();
  since.setDate(since.getDate() - days + 1);
  since.setHours(0, 0, 0, 0);

  const rows = await db
    .select()
    .from(dailyStats)
    .where(gte(dailyStats.date, since.toISOString().slice(0, 10)))
    .orderBy(desc(dailyStats.date))
    .all();

  // 补齐缺失日期（PV/UV 为 0）
  const map = new Map(rows.map((r) => [r.date, r]));
  const result: { date: string; pv: number; uv: number }[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(since);
    d.setDate(d.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    const row = map.get(key);
    result.push({ date: key, pv: row?.pv ?? 0, uv: row?.uv ?? 0 });
  }

  const totalPv = result.reduce((s, r) => s + r.pv, 0);
  const totalUv = result.reduce((s, r) => s + r.uv, 0);

  return NextResponse.json({ days, data: result, totalPv, totalUv });
}
