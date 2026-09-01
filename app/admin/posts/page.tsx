import Link from "next/link";
import { redirect } from "next/navigation";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { getSession } from "@/lib/auth/session";
import AdminNav from "@/components/admin/AdminNav";
import AdminDeleteButton from "@/components/admin/AdminDeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  const session = await getSession();
  if (!session.isAdmin) redirect("/admin/login");

  const rows = await db.select().from(posts).orderBy(desc(posts.createdAt)).all();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <AdminNav username={session.username || ""} csrfToken={session.csrfToken || ""} />

      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold">文章管理</h1>
        <Link href="/admin/posts/new" className="btn-primary text-sm">
          + 新建文章
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="card p-10 text-center text-muted">
          还没有文章，点击右上角「新建文章」开始创作。
        </div>
      ) : (
        <div className="card overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-left text-muted">
                <th className="py-3 px-4 font-medium">标题</th>
                <th className="py-3 px-4 font-medium hidden md:table-cell">slug</th>
                <th className="py-3 px-4 font-medium">标签</th>
                <th className="py-3 px-4 font-medium">状态</th>
                <th className="py-3 px-4 font-medium hidden md:table-cell">更新时间</th>
                <th className="py-3 px-4 font-medium text-right">操作</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50/60">
                  <td className="py-3 px-4 font-medium max-w-[260px] truncate">{p.title}</td>
                  <td className="py-3 px-4 hidden md:table-cell text-muted font-mono text-xs">
                    {p.slug}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {p.tags?.slice(0, 3).map((t) => (
                        <span
                          key={t}
                          className="text-[11px] px-2 py-0.5 rounded-full bg-blue-500/10 text-primary-light"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    {p.published ? (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600">
                        已发布
                      </span>
                    ) : (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-500">
                        草稿
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell text-muted text-xs">
                    {p.updatedAt ? new Date(p.updatedAt).toLocaleDateString("zh-CN") : "-"}
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <Link
                      href={`/blog/${p.slug}`}
                      target="_blank"
                      className="px-3 py-1.5 rounded-lg text-sm text-muted hover:text-foreground transition-colors"
                    >
                      查看
                    </Link>
                    <Link
                      href={`/admin/posts/${p.id}/edit`}
                      className="px-3 py-1.5 rounded-lg text-sm text-blue-600 hover:bg-blue-50 transition-colors"
                    >
                      编辑
                    </Link>
                    <AdminDeleteButton
                      apiPath="/api/posts"
                      id={p.id}
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
