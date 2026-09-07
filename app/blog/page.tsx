import type { Metadata } from "next";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import BlogExplorer, { type BlogPostLite } from "@/components/BlogExplorer";

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

  const lite: BlogPostLite[] = publishedPosts.map((post) => ({
    id: post.id,
    title: post.title,
    slug: post.slug,
    createdAt: post.createdAt.toISOString(),
    tags: post.tags ?? [],
    excerpt: post.content.replace(/<[^>]*>/g, "").slice(0, 150),
  }));

  return <BlogExplorer posts={lite} />;
}
