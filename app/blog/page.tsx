import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";

export const metadata: Metadata = {
  title: "博客",
  description: "技术文章、学习笔记与项目复盘",
};

export default async function BlogPage() {
  const publishedPosts = await db
    .select()
    .from(posts)
    .where(eq(posts.published, true))
    .orderBy(desc(posts.createdAt))
    .all();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-3">
          <span className="text-gradient">博客</span>
        </h1>
        <p className="text-muted">技术文章、学习笔记与项目复盘</p>
      </div>

      {publishedPosts.length === 0 ? (
        <div className="text-center py-20 text-muted">
          <p className="text-lg">暂无文章</p>
          <p className="text-sm mt-2">敬请期待</p>
        </div>
      ) : (
        <div className="space-y-6">
          {publishedPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="card p-6 block hover:border-primary transition-all group"
            >
              <div className="flex items-center gap-3 mb-2 text-sm text-muted">
                <time>{new Date(post.createdAt.getTime() * 1000).toLocaleDateString("zh-CN")}</time>
                {post.tags && post.tags.length > 0 && (
                  <div className="flex gap-1.5">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="tag !py-0 !px-2 !text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <h2 className="text-xl font-semibold mb-2 group-hover:text-primary-light transition-colors">
                {post.title}
              </h2>
              <p className="text-muted text-sm line-clamp-2">
                {post.content.replace(/<[^>]*>/g, "").slice(0, 150)}...
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
