"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

interface RepoStatus {
  repoCount: number;
  totalStars: number;
  totalForks: number;
  languages: { name: string; count: number }[];
  recent: {
    name: string;
    description: string | null;
    language: string | null;
    stars: number;
    forks: number;
    updatedAt: string;
    url: string;
  }[];
}

export default function GithubPage() {
  const { t } = useLanguage();
  const [data, setData] = useState<RepoStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setLoading(true);
      fetch("/api/workspace/github")
        .then((r) => {
          if (!r.ok) throw new Error("请求失败");
          return r.json();
        })
        .then((res) => {
          setData(res);
          setError(null);
        })
        .catch((e) => setError(e.message || "加载失败"))
        .finally(() => setLoading(false));
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const maxLangCount = Math.max(...(data?.languages.map((l) => l.count) || [1]), 1);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">{t.workspace.github}</h1>
        <p className="text-muted text-sm">GitHub 仓库状态与语言分布</p>
      </div>

      {loading && <div className="card p-10 text-center text-muted">加载中...</div>}

      {error && (
        <div className="card p-10 text-center text-red-500">
          {error}
          <p className="text-sm text-muted mt-2">请检查 GITHUB_TOKEN 配置或网络连接</p>
        </div>
      )}

      {data && !loading && !error && (
        <>
          {/* 统计卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="card p-5">
              <div className="text-3xl mb-2">📦</div>
              <div className="text-3xl font-bold">{data.repoCount}</div>
              <div className="text-muted text-sm">公开仓库</div>
            </div>
            <div className="card p-5">
              <div className="text-3xl mb-2">⭐</div>
              <div className="text-3xl font-bold">{data.totalStars.toLocaleString()}</div>
              <div className="text-muted text-sm">总 Star 数</div>
            </div>
            <div className="card p-5">
              <div className="text-3xl mb-2">🍴</div>
              <div className="text-3xl font-bold">{data.totalForks.toLocaleString()}</div>
              <div className="text-muted text-sm">总 Fork 数</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 语言分布 */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold mb-4">语言分布</h2>
              <div className="space-y-3">
                {data.languages.map((lang) => (
                  <div key={lang.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{lang.name}</span>
                      <span className="text-muted">{lang.count} 个仓库</span>
                    </div>
                    <div className="h-2 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
                        style={{ width: `${(lang.count / maxLangCount) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 最近更新 */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold mb-4">最近更新的仓库</h2>
              <div className="space-y-3">
                {data.recent.map((repo) => (
                  <a
                    key={repo.name}
                    href={repo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3 rounded-xl hover:bg-white/50 dark:hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-primary-light">{repo.name}</span>
                      <span className="text-xs text-muted">
                        {new Date(repo.updatedAt).toLocaleDateString("zh-CN")}
                      </span>
                    </div>
                    {repo.description && (
                      <p className="text-sm text-muted line-clamp-1 mb-1">{repo.description}</p>
                    )}
                    <div className="flex items-center gap-3 text-xs text-muted">
                      {repo.language && <span>● {repo.language}</span>}
                      <span>⭐ {repo.stars}</span>
                      <span>🍴 {repo.forks}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
