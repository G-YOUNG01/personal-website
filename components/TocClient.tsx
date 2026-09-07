"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/toc";

interface TocClientProps {
  items: TocItem[];
}

/** 目录：点击锚点跳转，滚动时高亮当前章节 */
export default function TocClient({ items }: TocClientProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const headings = items
      .map((it) => document.getElementById(it.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 },
    );
    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav className="card p-4 mb-8" aria-label="文章目录">
      <div className="text-sm font-semibold mb-3 flex items-center gap-2">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 10h16M4 14h10M4 18h10"
          />
        </svg>
        目录
      </div>
      <ul className="space-y-1.5 text-sm">
        {items.map((item) => (
          <li key={item.id} style={{ paddingLeft: item.level === 3 ? "1rem" : 0 }}>
            <a
              href={`#${item.id}`}
              className={`block py-0.5 rounded hover:text-primary-light transition-colors ${
                activeId === item.id ? "text-primary-light font-medium" : "text-muted"
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
