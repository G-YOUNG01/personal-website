import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import sanitizeHtml from "sanitize-html";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { desc, eq } from "drizzle-orm";
import { env } from "@/lib/env";
import { extractToc } from "@/lib/toc";
import TocClient from "@/components/TocClient";
import ViewCounter from "@/components/ViewCounter";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await db.select().from(posts).where(eq(posts.slug, slug)).get();

  if (!post) {
    return { title: "文章未找到" };
  }

  return {
    title: post.title,
    description: post.content.replace(/<[^>]*>/g, "").slice(0, 160),
    openGraph: {
      title: post.title,
      description: post.content.replace(/<[^>]*>/g, "").slice(0, 160),
      url: `${env.SITE_URL}/blog/${post.slug}`,
      type: "article",
    },
  };
}

// sanitize-html 白名单，放行 Shiki 代码块的 class 和 style
const sanitizeOptions: sanitizeHtml.IOptions = {
  allowedTags: [
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "p",
    "a",
    "ul",
    "ol",
    "li",
    "blockquote",
    "code",
    "pre",
    "img",
    "hr",
    "br",
    "strong",
    "em",
    "del",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
    "span",
    "div",
  ],
  allowedAttributes: {
    a: ["href", "title", "target", "rel"],
    img: ["src", "alt", "title", "width", "height"],
    code: ["class"],
    span: ["class", "style"],
    pre: ["class"],
    div: ["class"],
  },
  allowedSchemes: ["http", "https", "mailto"],
};

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await db.select().from(posts).where(eq(posts.slug, slug)).get();

  if (!post || !post.published) {
    notFound();
  }

  const cleanContent = sanitizeHtml(post.content, sanitizeOptions);
  const { html: contentWithToc, toc } = extractToc(cleanContent);

  // 上一篇 / 下一篇（按发布时间相邻）
  const allPublished = await db
    .select({ id: posts.id, title: posts.title, slug: posts.slug })
    .from(posts)
    .where(eq(posts.published, true))
    .orderBy(desc(posts.createdAt))
    .all();
  const idx = allPublished.findIndex((p) => p.id === post.id);
  const prevPost = idx > 0 ? allPublished[idx - 1] : null;
  const nextPost = idx >= 0 && idx < allPublished.length - 1 ? allPublished[idx + 1] : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { "@type": "Person", name: "G-YOUNG" },
    url: `${env.SITE_URL}/blog/${post.slug}`,
  };

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4 text-sm text-muted">
          <time>{post.createdAt.toLocaleDateString("zh-CN")}</time>
          {post.tags && post.tags.length > 0 && (
            <div className="flex gap-1.5">
              {post.tags.map((tag) => (
                <span key={tag} className="tag !py-0 !px-2 !text-xs">
                  {tag}
                </span>
              ))}
            </div>
          )}
          <ViewCounter
            path={`/blog/${post.slug}`}
            className="ml-auto flex items-center gap-1 text-xs text-muted"
          />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-4">{post.title}</h1>
      </header>

      {toc.length > 0 && <TocClient items={toc} />}

      <div className="prose-content" dangerouslySetInnerHTML={{ __html: contentWithToc }} />

      {/* 上一篇 / 下一篇 */}
      {(prevPost || nextPost) && (
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {prevPost ? (
            <Link
              href={`/blog/${prevPost.slug}`}
              className="card p-4 block group hover:border-primary transition-all"
            >
              <span className="text-xs text-muted">← 上一篇</span>
              <div className="mt-1 font-medium group-hover:text-primary-light transition-colors line-clamp-1">
                {prevPost.title}
              </div>
            </Link>
          ) : (
            <span className="hidden sm:block" />
          )}
          {nextPost && (
            <Link
              href={`/blog/${nextPost.slug}`}
              className="card p-4 block group text-right hover:border-primary transition-all"
            >
              <span className="text-xs text-muted">下一篇 →</span>
              <div className="mt-1 font-medium group-hover:text-primary-light transition-colors line-clamp-1">
                {nextPost.title}
              </div>
            </Link>
          )}
        </div>
      )}

      <div className="mt-10 pt-8 border-t border-border">
        <Link href="/blog" className="text-primary-light hover:underline">
          ← 返回博客列表
        </Link>
      </div>
    </article>
  );
}
