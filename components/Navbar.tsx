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
        scrolled ? "bg-background/85 backdrop-blur-md border-b border-border" : "bg-transparent"
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
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  isActive(item.href) ? "text-foreground bg-black/5" : "text-muted hover:text-foreground"
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

        {/* 移动端菜单 */}
        {mobileOpen && (
          <div className="md:hidden pb-6 pt-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-medium ${
                  isActive(item.href) ? "text-foreground bg-black/5" : "text-muted hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <a
              href="https://github.com/G-YOUNG01"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-4 py-3 text-sm text-muted hover:text-foreground"
            >
              GitHub ↗
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
