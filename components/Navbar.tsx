"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const navItems = [
  { href: "/", label: "首页" },
  { href: "/works", label: "作品集" },
  { href: "/blog", label: "技术博客" },
  { href: "/timeline", label: "成长时间线" },
  { href: "/#about", label: "关于我" },
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
    if (href === "/#about") return false;
    return pathname.startsWith(href);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-nav-scrolled" : "glass-nav"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-lg font-bold tracking-tight text-foreground">
            G-YOUNG
          </Link>

          {/* 桌面导航 */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(item.href)
                    ? "text-primary-light bg-blue-500/10"
                    : "text-muted hover:text-foreground hover:bg-white/60"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <a href="mailto:hello@gyoung.xyz" className="ml-3 btn-primary !py-2 !px-4 !text-sm">
              联系我
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
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* 移动端菜单 */}
        {mobileOpen && (
          <div
            id="mobile-menu"
            className="md:hidden pb-6 pt-2 mt-2 mb-4 rounded-2xl bg-white/85 backdrop-blur-xl border border-white/60 shadow-xl"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-medium mx-2 ${
                  isActive(item.href)
                    ? "bg-blue-500/10 text-primary-light"
                    : "text-muted hover:text-foreground hover:bg-white/60"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <a
              href="mailto:hello@gyoung.xyz"
              className="block px-4 py-3 mx-2 text-sm font-medium text-primary-light"
            >
              联系我
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
