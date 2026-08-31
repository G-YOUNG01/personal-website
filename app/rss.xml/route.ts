import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { env } from "@/lib/env";

export async function GET() {
  const publishedPosts = await db
    .select()
    .from(posts)
    .where(eq(posts.published, true))
    .orderBy(desc(posts.createdAt))
    .limit(20)
    .all();

  // 转义 CDATA 结束符，避免正文/标题中的 "]]>" 破坏 XML 结构
  const escapeCdata = (s: string) => s.replace(/\]\]>/g, "]]&gt;");

  const items = publishedPosts
    .map((post) => {
      const pubDate = post.createdAt.toUTCString();
      const description = post.content.replace(/<[^>]*>/g, "").slice(0, 300);
      return `    <item>
      <title><![CDATA[${escapeCdata(post.title)}]]></title>
      <link>${env.SITE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${env.SITE_URL}/blog/${post.slug}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${escapeCdata(description)}]]></description>
    </item>`;
    })
    .join("\n");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>G-YOUNG 的博客</title>
    <link>${env.SITE_URL}/blog</link>
    <description>AI 程序员的技术文章、学习笔记与项目复盘</description>
    <language>zh-CN</language>
    <atom:link href="${env.SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
