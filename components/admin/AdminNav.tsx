"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "概览" },
  { href: "/admin/posts", label: "文章" },
  { href: "/admin/timelines", label: "时间线" },
  { href: "/admin/profile", label: "简介" },
];

export default function AdminNav({ username, csrfToken }: { username: string; csrfToken: string }) {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="w-full">
        <div className="mx-auto mt-2 max-w-[1280px] rounded-full border glass-nav-pill px-6 py-3">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <Link href="/admin" className="flex items-center gap-2.5 font-bold text-lg shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icon.svg" alt="G-YOUNG" className="w-6 h-6" />
              <span className="text-gradient">管理后台</span>
            </Link>
            <nav className="flex items-center gap-1 flex-wrap">
              {links.map((l) => {
                const active =
                  l.href === "/admin" ? pathname === "/admin" : pathname.startsWith(l.href);
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      active
                        ? "bg-blue-500/10 text-primary-light"
                        : "text-muted hover:text-foreground"
                    }`}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </nav>
            <div className="flex-1" />
            <span className="text-sm text-muted hidden sm:inline">{username}</span>
            <Link href="/" target="_blank" className="btn-outline !py-1.5 !px-3 text-sm">
              返回
            </Link>
            <form action="/api/auth/logout" method="POST">
              <input type="hidden" name="csrfToken" value={csrfToken} />
              <button type="submit" className="btn-outline !py-1.5 !px-3 text-sm">
                退出
              </button>
            </form>
          </div>
        </div>
      </div>
    </nav>
  );
}
