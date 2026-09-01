import Link from "next/link";
import { redirect } from "next/navigation";
import { desc, eq, count } from "drizzle-orm";
import { db } from "@/lib/db";
import { posts, timelines, profile } from "@/lib/db/schema";
import { getSession } from "@/lib/auth/session";
import AdminNav from "@/components/admin/AdminNav";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await getSession();
  if (!session.isAdmin) {
    redirect("/admin/login");
  }

  const [postCount, timelineCount, profileData, recentPosts] = await Promise.all([
    db.select({ count: count() }).from(posts).get(),
    db.select({ count: count() }).from(timelines).get(),
    db.select().from(profile).where(eq(profile.id, 1)).get(),
    db.select().from(posts).orderBy(desc(posts.updatedAt)).limit(5).all(),
  ]);

  const stats = [
    { label: "博客文章", value: postCount?.count || 0, icon: "📝", href: "/admin/posts" },
    { label: "时间线事件", value: timelineCount?.count || 0, icon: "📅", href: "/admin/timelines" },
    {
      label: "个人简介",
      value: profileData ? "已配置" : "未配置",
      icon: "👤",
      href: "/admin/profile",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <AdminNav username={session.username || ""} csrfToken={session.csrfToken || ""} />

      <div className="mb-5">
        <h1 className="text-2xl font-bold mb-1">概览</h1>
        <p className="text-muted text-sm">
          欢迎回来，{session.username}。在这里管理网站的全部内容，保存后前台实时生效。
        </p>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="card p-6 transition-transform hover:-translate-y-0.5"
          >
            <div className="text-3xl mb-3">{stat.icon}</div>
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
            <div className="text-muted text-sm">{stat.label} →</div>
          </Link>
        ))}
      </div>

      {/* 快捷操作 */}
      <div className="card p-6 mb-8">
        <h2 className="text-lg font-semibold mb-4">快捷操作</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link href="/admin/posts/new" className="btn-primary text-center text-sm">
            + 新建文章
          </Link>
          <Link href="/admin/timelines/new" className="btn-outline text-center text-sm">
            + 添加时间线
          </Link>
          <Link href="/admin/profile" className="btn-outline text-center text-sm">
            编辑简介
          </Link>
          <Link href="/" target="_blank" className="btn-outline text-center text-sm">
            查看网站
          </Link>
        </div>
      </div>

      {/* 最近文章 */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">最近更新</h2>
          <Link href="/admin/posts" className="text-sm text-primary-light hover:underline">
            全部文章 →
          </Link>
        </div>
        {recentPosts.length === 0 ? (
          <p className="text-sm text-muted">还没有文章，点击「新建文章」开始创作。</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {recentPosts.map((p) => (
              <li key={p.id} className="py-3 flex items-center gap-3">
                <span
                  className={`text-[11px] px-2 py-0.5 rounded-full flex-none ${
                    p.published
                      ? "bg-emerald-500/10 text-emerald-600"
                      : "bg-slate-500/10 text-slate-500"
                  }`}
                >
                  {p.published ? "已发布" : "草稿"}
                </span>
                <span className="font-medium truncate flex-1">{p.title}</span>
                <span className="text-muted text-xs hidden sm:inline">
                  {p.updatedAt ? new Date(p.updatedAt).toLocaleDateString("zh-CN") : "-"}
                </span>
                <Link
                  href={`/admin/posts/${p.id}/edit`}
                  className="text-sm text-blue-600 hover:underline flex-none"
                >
                  编辑
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
