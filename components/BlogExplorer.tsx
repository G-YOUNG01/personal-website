"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import ViewCounter from "@/components/ViewCounter";

export interface BlogPostLite {
  id: number;
  title: string;
  slug: string;
  createdAt: string;
  tags: string[];
  excerpt: string;
}

interface BlogExplorerProps {
  posts: BlogPostLite[];
}

/** 博客列表：关键词搜索 + 标签筛选（客户端即时过滤） */
export default function BlogExplorer({ posts }: BlogExplorerProps) {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string>("全部");

  const allTags = useMemo(() => {
    const set = new Set<string>();
    for (const p of posts) for (const t of p.tags) set.add(t);
    return Array.from(set).sort((a, b) => a.localeCompare(b, "zh-CN"));
  }, [posts]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return posts.filter((p) => {
      if (activeTag !== "全部" && !p.tags.includes(activeTag)) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
      );
    });
  }, [posts, search, activeTag]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-3">
          <span className="text-gradient">博客</span>
        </h1>
        <p className="text-muted">技术文章、学习笔记与项目复盘</p>
      </div>

      {/* 搜索 + 标签 */}
      <div className="mb-8 space-y-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="搜索文章标题 / 内容 / 标签..."
          aria-label="搜索文章"
          className="w-full px-4 py-3"
        />
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveTag("全部")}
              className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                activeTag === "全部"
                  ? "bg-primary text-white"
                  : "bg-primary/10 text-primary-light hover:bg-primary/20"
              }`}
            >
              全部
            </button>
            {allTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveTag(tag)}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                  activeTag === tag
                    ? "bg-primary text-white"
                    : "bg-primary/10 text-primary-light hover:bg-primary/20"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-muted">
          <p className="text-lg">没有找到匹配的文章</p>
          <p className="text-sm mt-2">换个关键词或标签试试</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filtered.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.3) }}
            >
              <Link
                href={`/blog/${post.slug}`}
                className="card p-6 block hover:border-primary transition-all group"
              >
                <div className="flex items-center gap-3 mb-2 text-sm text-muted">
                  <time>{new Date(post.createdAt).toLocaleDateString("zh-CN")}</time>
                  {post.tags.length > 0 && (
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
                <h2 className="text-xl font-semibold mb-2 group-hover:text-primary-light transition-colors">
                  {post.title}
                </h2>
                <p className="text-muted text-sm line-clamp-2">{post.excerpt}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
