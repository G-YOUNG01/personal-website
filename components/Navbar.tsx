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
  const [langOpen, setLangOpen] = useState(false);

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

  const selectLang = (next: "zh" | "en") => {
    setLang(next);
    setLangOpen(false);
  };

  const globeIcon = (
    <svg
      className="w-[18px] h-[18px]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9.2" />
      <path d="M3 12h18" />
      <path d="M12 2.8a13.5 13.5 0 0 1 0 18.4a13.5 13.5 0 0 1 0-18.4z" />
    </svg>
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

            {/* 语言切换（DeepSeek 官网风格：地球图标 + 下拉菜单） */}
            <div className="relative ml-2">
              <button
                type="button"
                onClick={() => setLangOpen((v) => !v)}
                aria-label={t.nav.menu}
                aria-haspopup="listbox"
                aria-expanded={langOpen}
                className="p-2 rounded-full text-muted hover:text-foreground hover:bg-white/60 transition-colors"
              >
                {globeIcon}
              </button>
              {langOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setLangOpen(false)} />
                  <div
                    role="listbox"
                    className="absolute right-0 mt-2 z-20 w-40 py-1.5 rounded-xl bg-white/90 backdrop-blur-xl border border-white/60 shadow-xl"
                  >
                    <button
                      type="button"
                      role="option"
                      aria-selected={lang === "zh"}
                      onClick={() => selectLang("zh")}
                      className={`w-full flex items-center justify-between px-4 py-2 text-sm text-left transition-colors ${
                        lang === "zh"
                          ? "text-primary-light font-medium"
                          : "text-foreground hover:bg-white/60"
                      }`}
                    >
                      中文
                      {lang === "zh" && <span className="text-primary-light">✓</span>}
                    </button>
                    <button
                      type="button"
                      role="option"
                      aria-selected={lang === "en"}
                      onClick={() => selectLang("en")}
                      className={`w-full flex items-center justify-between px-4 py-2 text-sm text-left transition-colors ${
                        lang === "en"
                          ? "text-primary-light font-medium"
                          : "text-foreground hover:bg-white/60"
                      }`}
                    >
                      English
                      {lang === "en" && <span className="text-primary-light">✓</span>}
                    </button>
                  </div>
                </>
              )}
            </div>

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
            <div className="mt-2 px-4 flex items-center gap-2">
              <span className="text-muted">{globeIcon}</span>
              <button
                type="button"
                onClick={() => setLang("zh")}
                className={`px-3 py-2 text-sm rounded-lg ${
                  lang === "zh" ? "text-primary-light font-medium" : "text-muted"
                }`}
              >
                中文
              </button>
              <button
                type="button"
                onClick={() => setLang("en")}
                className={`px-3 py-2 text-sm rounded-lg ${
                  lang === "en" ? "text-primary-light font-medium" : "text-muted"
                }`}
              >
                English
              </button>
            </div>
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
