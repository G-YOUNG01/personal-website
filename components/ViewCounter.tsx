"use client";

import { useEffect, useState } from "react";

function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  try {
    const stored = localStorage.getItem("gv_visitor_id");
    if (stored) return stored;
    const id =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : `v-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem("gv_visitor_id", id);
    return id;
  } catch {
    return "";
  }
}

interface ViewCounterProps {
  path: string;
  className?: string;
}

/** 页面浏览量：加载时上报一次，展示累计浏览数 */
export default function ViewCounter({ path, className }: ViewCounterProps) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    const visitorId = getVisitorId();
    if (!visitorId) return;
    fetch("/api/stats/visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path, visitorId }),
    })
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled && typeof d.views === "number") setViews(d.views);
      })
      .catch(() => {
        /* 统计失败不影响页面 */
      });
    return () => {
      cancelled = true;
    };
  }, [path]);

  if (views === null) return <span className={className} />;

  return (
    <span className={className} title="浏览次数">
      <svg
        className="inline w-4 h-4 mr-1 -mt-0.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
        />
      </svg>
      {views.toLocaleString()}
    </span>
  );
}
