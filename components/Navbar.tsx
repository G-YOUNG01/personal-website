"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useLanguage } from "@/components/LanguageProvider";

export default function Navbar() {
  const pathname = usePathname();
  const { t, lang, setLang } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { href: "/", label: t.nav.home },
    { href: "/works", label: t.nav.works },
    { href: "/blog", label: t.nav.blog },
    { href: "/timeline", label: t.nav.timeline },
    { href: "/#about", label: t.nav.about },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    if (href === "/#about") return false;
    return pathname.startsWith(href);
  };

  /* DeepSeek 官网风格的圆弧形分段语言切换（中文 | EN） */
  const langSwitch = (
    <div className="inline-flex items-center rounded-full border border-white/60 bg-white/40 p-[3px] shadow-sm">
      <button
        type="button"
        onClick={() => setLang("zh")}
        aria-pressed={lang === "zh"}
        className={`px-3.5 py-1.5 rounded-full text-[13px] leading-none transition-all ${
          lang === "zh"
            ? "bg-white text-primary-light font-semibold shadow"
            : "text-muted hover:text-foreground"
        }`}
      >
        中文
      </button>
      <button
        type="button"
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
        className={`px-3.5 py-1.5 rounded-full text-[13px] leading-none transition-all ${
          lang === "en"
            ? "bg-white text-primary-light font-semibold shadow"
            : "text-muted hover:text-foreground"
        }`}
      >
        EN
      </button>
    </div>
  );

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-nav-scrolled" : "glass-nav"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2"
          >
            <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-500 text-white text-[15px] font-black flex items-center justify-center shadow-sm">
              G
            </span>
            G-YOUNG
          </Link>

          {/* 桌面导航 */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.href) ? "text-primary-light" : "text-muted hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            ))}

            <span className="ml-2">{langSwitch}</span>

            <a href="mailto:hello@gyoung.xyz" className="ml-2 btn-primary !py-2 !px-4 !text-sm">
              {t.nav.contact}
            </a>
          </div>

          {/* 移动端菜单按钮 */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={t.nav.menu}
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
                    ? "text-primary-light"
                    : "text-muted hover:text-foreground hover:bg-white/60"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="px-4 mt-3">{langSwitch}</div>
            <a
              href="mailto:hello@gyoung.xyz"
              className="block px-4 py-3 mx-2 mt-2 text-sm font-medium text-primary-light"
            >
              {t.nav.contact}
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}
