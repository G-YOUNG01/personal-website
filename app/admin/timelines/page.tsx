import Link from "next/link";
import { redirect } from "next/navigation";
import { asc } from "drizzle-orm";
import { db } from "@/lib/db";
import { timelines } from "@/lib/db/schema";
import { getSession } from "@/lib/auth/session";
import AdminNav from "@/components/admin/AdminNav";
import AdminDeleteButton from "@/components/admin/AdminDeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminTimelinesPage() {
  const session = await getSession();
  if (!session.isAdmin) redirect("/admin/login");

  const rows = await db
    .select()
    .from(timelines)
    .orderBy(asc(timelines.sortOrder), asc(timelines.year))
    .all();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <AdminNav username={session.username || ""} csrfToken={session.csrfToken || ""} />

      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold">时间线管理</h1>
        <Link href="/admin/timelines/new" className="btn-primary text-sm">
          + 添加时间线
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="card p-10 text-center text-muted">还没有时间线记录，点击右上角添加。</div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-muted">
                <th className="py-3 px-4 font-medium w-16">排序</th>
                <th className="py-3 px-4 font-medium w-20">年份</th>
                <th className="py-3 px-4 font-medium">标题</th>
                <th className="py-3 px-4 font-medium hidden md:table-cell">描述</th>
                <th className="py-3 px-4 font-medium hidden sm:table-cell">图标</th>
                <th className="py-3 px-4 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((t) => (
                <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50/60">
                  <td className="py-3 px-4 text-muted text-xs">{t.sortOrder}</td>
                  <td className="py-3 px-4 font-semibold text-primary-light">{t.year}</td>
                  <td className="py-3 px-4 font-medium">{t.title}</td>
                  <td className="py-3 px-4 hidden md:table-cell text-muted text-xs max-w-[320px] truncate">
                    {t.description || "-"}
                  </td>
                  <td className="py-3 px-4 hidden sm:table-cell text-muted text-xs font-mono">
                    {t.iconType || "-"}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <Link
                      href={`/admin/timelines/${t.id}/edit`}
                      className="px-3 py-1.5 rounded-lg text-sm text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      编辑
                    </Link>
                    <AdminDeleteButton
                      apiPath="/api/timelines"
                      id={t.id}
                      csrfToken={session.csrfToken || ""}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
