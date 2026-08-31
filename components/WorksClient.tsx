"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import RepoCard from "@/components/RepoCard";
import type { GitHubRepo } from "@/lib/github";

interface WorksClientProps {
  repos: GitHubRepo[];
}

type SortKey = "updated" | "stars" | "name";

export default function WorksClient({ repos }: WorksClientProps) {
  const [sortKey, setSortKey] = useState<SortKey>("updated");
  const [search, setSearch] = useState("");

  const filteredRepos = useMemo(() => {
    let result = [...repos];

    // 关键词筛选
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          (r.description && r.description.toLowerCase().includes(q)) ||
          (r.language && r.language.toLowerCase().includes(q)),
      );
    }

    // 排序
    result.sort((a, b) => {
      if (sortKey === "stars") return b.stargazers_count - a.stargazers_count;
      if (sortKey === "name") return a.name.localeCompare(b.name);
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });

    return result;
  }, [repos, sortKey, search]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <h1 className="text-4xl font-bold mb-3">
          <span className="text-gradient">作品集</span>
        </h1>
        <p className="text-muted">来自 GitHub 的开源项目，实时同步更新</p>
      </motion.div>

      {/* 工具栏 */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="搜索项目..."
          aria-label="搜索项目"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-4 py-3"
        />
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as SortKey)}
          aria-label="排序方式"
          className="px-4 py-3 cursor-pointer"
        >
          <option value="updated">最近更新</option>
          <option value="stars">Star 数</option>
          <option value="name">名称</option>
        </select>
      </div>

      {/* 项目网格 */}
      {filteredRepos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRepos.map((repo, index) => (
            <RepoCard key={repo.id} repo={repo} index={index} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-muted">
          <p className="text-lg">没有找到匹配的项目</p>
          <p className="text-sm mt-2">试试其他关键词</p>
        </div>
      )}

      <div className="mt-10 text-center">
        <a
          href="https://github.com/G-YOUNG01"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline inline-block"
        >
          在 GitHub 上查看全部 →
        </a>
      </div>
    </div>
  );
}
