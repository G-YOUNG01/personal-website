"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

interface NavItem {
  href: string;
  labelKey: keyof ReturnType<typeof useLanguage>["t"]["workspace"];
  icon: string;
}

const contentGroup: NavItem[] = [
  { href: "/workspace", labelKey: "overview", icon: "📊" },
  { href: "/workspace/posts", labelKey: "posts", icon: "📝" },
  { href: "/workspace/timelines", labelKey: "timelines", icon: "📅" },
  { href: "/workspace/profile", labelKey: "profile", icon: "👤" },
];

const dataGroup: NavItem[] = [
  { href: "/workspace/analytics", labelKey: "analytics", icon: "📈" },
  { href: "/workspace/github", labelKey: "github", icon: "🐙" },
  { href: "/workspace/todos", labelKey: "todos", icon: "✅" },
];

const systemGroup: NavItem[] = [
  { href: "/workspace/system", labelKey: "system", icon: "⚙️" },
  { href: "/workspace/server", labelKey: "server", icon: "🖥️" },
];

export default function WorkspaceSidebar({
  username,
  csrfToken,
}: {
  username: string;
  csrfToken: string;
}) {
  const pathname = usePathname();
  const { t, lang, toggle } = useLanguage();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 点击外部关闭菜单
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const isActive = (href: string) => {
    if (href === "/workspace") return pathname === "/workspace";
    return pathname.startsWith(href);
  };

  const renderGroup = (items: NavItem[]) =>
    items.map((item) => (
      <Link
        key={item.href}
        href={item.href}
        onClick={() => {
          setMobileOpen(false);
          setMenuOpen(false);
        }}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
          isActive(item.href)
            ? "bg-blue-500/15 text-primary-light shadow-sm"
            : "text-muted hover:text-foreground hover:bg-white/50 dark:hover:bg-white/5"
        }`}
      >
        <span className="text-base flex-none">{item.icon}</span>
        <span className="truncate">{t.workspace[item.labelKey]}</span>
      </Link>
    ));

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <Link
        href="/workspace"
        className="flex items-center gap-2.5 px-4 py-5 border-b border-white/20 dark:border-white/10"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/icon.svg" alt="G-YOUNG" className="w-8 h-8 flex-none" />
        <div className="flex flex-col min-w-0">
          <span className="text-gradient font-bold text-base leading-tight">G-YOUNG</span>
          <span className="text-[11px] text-muted truncate">{t.workspace.title}</span>
        </div>
      </Link>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        <div className="space-y-1">{renderGroup(contentGroup)}</div>
        <div className="space-y-1">{renderGroup(dataGroup)}</div>
        <div className="space-y-1">{renderGroup(systemGroup)}</div>
      </nav>

      {/* Bottom: avatar + popover menu */}
      <div className="relative border-t border-white/20 dark:border-white/10 p-3" ref={menuRef}>
        {/* Popover menu (opens upward) */}
        {menuOpen && (
          <div className="absolute bottom-full left-3 right-3 mb-2 glass-card rounded-2xl p-1.5 shadow-xl border border-white/30 dark:border-white/10 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
            {/* 账号设置 */}
            <Link
              href="/workspace/account"
              onClick={() => {
                setMenuOpen(false);
                setMobileOpen(false);
              }}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-muted hover:text-foreground hover:bg-white/50 dark:hover:bg-white/5 transition-all"
            >
              <span className="text-base">🔐</span>
              <span>{t.workspace.account}</span>
            </Link>

            {/* 中英文切换 */}
            <button
              onClick={() => {
                toggle();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-muted hover:text-foreground hover:bg-white/50 dark:hover:bg-white/5 transition-all"
            >
              <span className="text-base">🌐</span>
              <span className="flex-1 text-left">
                {lang === "zh" ? "切换为 English" : "Switch to 中文"}
              </span>
              <span className="text-xs text-muted">{lang === "zh" ? "EN" : "中"}</span>
            </button>

            {/* 返回网站 */}
            <Link
              href="/"
              target="_blank"
              onClick={() => {
                setMenuOpen(false);
                setMobileOpen(false);
              }}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-muted hover:text-foreground hover:bg-white/50 dark:hover:bg-white/5 transition-all"
            >
              <span className="text-base">🏠</span>
              <span>{t.workspace.backToSite}</span>
              <span className="ml-auto text-xs opacity-50">↗</span>
            </Link>

            {/* 分隔线 */}
            <div className="h-px bg-white/20 dark:bg-white/10 my-1" />

            {/* 退出登录 */}
            <form action="/api/auth/logout" method="POST">
              <input type="hidden" name="csrfToken" value={csrfToken} />
              <button
                type="submit"
                className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-all"
              >
                <span className="text-base">🚪</span>
                <span>{t.workspace.logout}</span>
              </button>
            </form>
          </div>
        )}

        {/* Avatar button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-xl transition-all ${
            menuOpen ? "bg-white/50 dark:bg-white/10" : "hover:bg-white/40 dark:hover:bg-white/5"
          }`}
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold flex-none shadow-md">
            {username.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1 text-left">
            <div className="text-sm font-medium truncate">{username}</div>
            <div className="text-[11px] text-muted">管理员</div>
          </div>
          <svg
            className={`w-4 h-4 text-muted flex-none transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-[60] lg:hidden w-10 h-10 rounded-xl glass-card flex items-center justify-center"
        aria-label="菜单"
      >
        <span className="text-lg">{mobileOpen ? "✕" : "☰"}</span>
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-[260px] z-50 glass-sidebar transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
