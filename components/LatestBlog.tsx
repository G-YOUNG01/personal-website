"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export interface PostItem {
  id: number;
  title: string;
  slug: string;
  content: string;
  tags: string[] | null;
  createdAt: Date;
}

interface LatestBlogProps {
  posts: PostItem[];
}

export default function LatestBlog({ posts }: LatestBlogProps) {
  const list = posts.slice(0, 2);

  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-10"
      >
        <h2 className="text-3xl font-bold tracking-tight">最新博客</h2>
        <Link href="/blog" className="text-sm font-medium text-primary-light hover:underline">
          查看全部文章 →
        </Link>
      </motion.div>

      {list.length === 0 ? (
        <div className="card p-10 text-center text-muted">暂无文章，敬请期待</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {list.map((post, i) => {
            const date = new Date(post.createdAt).toLocaleDateString("zh-CN");
            const summary = post.content.replace(/<[^>]*>/g, "").slice(0, 80);
            return (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link href={`/blog/${post.slug}`} className="card p-6 block h-full group">
                  <div className="flex items-center gap-2 mb-3 text-sm text-muted">
                    <span className="font-mono text-primary-light font-semibold">
                      # {post.slug.split("-").slice(0, 2).join("-")}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-muted" />
                    <span>{date}</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary-light transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted mb-4 line-clamp-2">{summary}...</p>
                  <span className="text-sm font-medium text-primary-light group-hover:underline">
                    阅读全文 →
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}
