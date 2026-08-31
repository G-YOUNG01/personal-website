import Link from "next/link";
import { db } from "@/lib/db";
import { posts, timelines, profile } from "@/lib/db/schema";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { eq, count } from "drizzle-orm";

export default async function AdminPage() {
  const session = await getSession();
  if (!session.isAdmin) {
    redirect("/admin/login");
  }

  const postCount = await db.select({ count: count() }).from(posts).get();
  const timelineCount = await db.select({ count: count() }).from(timelines).get();
  const profileData = await db.select().from(profile).where(eq(profile.id, 1)).get();

  const stats = [
    { label: "博客文章", value: postCount?.count || 0, icon: "📝" },
    { label: "时间线事件", value: timelineCount?.count || 0, icon: "📅" },
    { label: "个人简介", value: profileData ? "已配置" : "未配置", icon: "👤" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            <span className="text-gradient">管理后台</span>
          </h1>
          <p className="text-muted">欢迎回来，{session.username}</p>
        </div>
        <form action="/api/auth/logout" method="POST">
          <input type="hidden" name="csrfToken" value={session.csrfToken || ""} />
          <button type="submit" className="btn-outline text-sm">
            退出登录
          </button>
        </form>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        {stats.map((stat) => (
          <div key={stat.label} className="card p-6">
            <div className="text-3xl mb-3">{stat.icon}</div>
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
            <div className="text-muted text-sm">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* 快捷操作 */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4">快捷操作</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            type="button"
            disabled
            title="内容管理功能开发中"
            className="btn-primary text-center text-sm opacity-40 cursor-not-allowed"
          >
            新建文章（开发中）
          </button>
          <button
            type="button"
            disabled
            title="内容管理功能开发中"
            className="btn-outline text-center text-sm opacity-40 cursor-not-allowed"
          >
            添加时间线（开发中）
          </button>
          <button
            type="button"
            disabled
            title="内容管理功能开发中"
            className="btn-outline text-center text-sm opacity-40 cursor-not-allowed"
          >
            编辑简介（开发中）
          </button>
          <Link href="/" target="_blank" className="btn-outline text-center text-sm">
            查看网站
          </Link>
        </div>
        <p className="mt-4 text-sm text-muted">
          内容管理（文章 / 时间线 / 简介的增删改）功能正在开发中，当前仅支持数据展示与登录管理。
        </p>
      </div>

      <div className="mt-8 text-center text-sm text-muted">
        <p>提示：内容更新后无需重新部署，实时生效</p>
      </div>
    </div>
  );
}
