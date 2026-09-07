"use client";

import { useEffect, useRef } from "react";

export interface GiscusProps {
  repo: string;
  repoId: string;
  category: string;
  categoryId: string;
  /** 讨论标识，用于区分不同页面/文章 */
  term: string;
}

/**
 * Giscus 评论区（基于 GitHub Discussions，零后端成本）。
 * 需要仓库开启 Discussions 且公开；配置项为空时不渲染并给出提示。
 */
export default function Giscus({ repo, repoId, category, categoryId, term }: GiscusProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!repoId || !categoryId) return;
    const container = ref.current;
    if (!container) return;

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    script.setAttribute("data-repo", repo);
    script.setAttribute("data-repo-id", repoId);
    script.setAttribute("data-category", category);
    script.setAttribute("data-category-id", categoryId);
    script.setAttribute("data-mapping", "specific");
    script.setAttribute("data-term", term);
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", "light");
    script.setAttribute("data-lang", "zh-CN");
    script.setAttribute("data-loading", "lazy");
    container.appendChild(script);

    return () => {
      container.innerHTML = "";
    };
  }, [repo, repoId, category, categoryId, term]);

  if (!repoId || !categoryId) {
    return (
      <div className="card p-6 text-center text-muted text-sm mt-16">
        评论区待配置：请先在 GitHub 仓库开启 Discussions，并在
        <a
          href="https://giscus.app/zh-CN"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-light hover:underline mx-1"
        >
          giscus.app
        </a>
        生成 repo-id / category-id 填入环境变量。
      </div>
    );
  }

  return (
    <div className="mt-16 pt-8 border-t border-border">
      <h2 className="text-xl font-semibold mb-6">评论</h2>
      <div ref={ref} />
    </div>
  );
}
