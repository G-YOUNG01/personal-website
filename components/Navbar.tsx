"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/works", label: "作品" },
  { href: "/blog", label: "博客" },
  { href: "/timeline", label: "时间线" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/30 backdrop-blur-2xl backdrop-saturate-200 border-b border-white/50 shadow-xl shadow-black/5"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-lg font-bold tracking-tight">
            G-YOUNG
          </Link>

          {/* 桌面导航 */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isActive(item.href)
                    ? "bg-white/60 text-foreground shadow-md shadow-black/5 border border-white/70"
                    : "text-muted hover:text-foreground hover:bg-white/40"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <a
              href="https://github.com/G-YOUNG01"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-3 text-sm font-medium text-muted hover:text-foreground transition-colors"
            >
              GitHub ↗
            </a>
          </div>

          {/* 移动端菜单按钮 */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="菜单"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* 移动端菜单 - 毛玻璃 */}
        {mobileOpen && (
          <div id="mobile-menu" className="md:hidden pb-6 pt-2 mt-2 mb-4 rounded-2xl bg-white/50 backdrop-blur-xl border border-white/40 shadow-xl">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-medium mx-2 ${
                  isActive(item.href) ? "bg-white/70 text-foreground" : "text-muted hover:text-foreground hover:bg-white/40"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <a
              href="https://github.com/G-YOUNG01"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-3 mx-2 text-sm text-muted hover:text-foreground"
            >
              GitHub ↗
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
