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
    const handleScroll = () => setScrolled(window.scrollY > 24);
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

  /* DeepSeek 官网风格语言切换：圆弧分段，14px 文字，紧凑尺寸 */
  const langSwitch = (
    <div className="inline-flex items-center rounded-full bg-white/25 p-0.5">
      <button
        type="button"
        onClick={() => setLang("zh")}
        aria-pressed={lang === "zh"}
        className={`px-3 py-1.5 rounded-full text-[14px] leading-none transition-colors ${
          lang === "zh"
            ? "bg-white/85 text-primary-light font-medium shadow-sm"
            : "text-muted hover:text-foreground"
        }`}
      >
        中文
      </button>
      <button
        type="button"
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
        className={`px-3 py-1.5 rounded-full text-[14px] leading-none transition-colors ${
          lang === "en"
            ? "bg-white/85 text-primary-light font-medium shadow-sm"
            : "text-muted hover:text-foreground"
        }`}
      >
        EN
      </button>
    </div>
  );

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* 官网实现：导航始终为居中的圆弧胶囊；未滚动透明（border/bg 透明），滚动后加背景模糊。
          过渡仅作用于背景/边框颜色，不产生黑边。 */}
      <div className="w-full">
        <div
          className={`mx-auto mt-2 max-w-[1280px] rounded-full border transition-colors duration-300 ${
            scrolled ? "glass-nav-pill" : "border-transparent bg-transparent"
          }`}
        >
          <div className="px-6 h-14 flex items-center justify-between">
            <Link
              href="/"
              className="text-lg font-bold tracking-tight text-foreground flex items-center gap-2"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/icon.svg" alt="G-YOUNG" className="w-6 h-6" />
              G-YOUNG
            </Link>

            {/* 桌面导航 */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3.5 py-2 rounded-full text-[15px] font-medium transition-colors ${
                    isActive(item.href) ? "text-primary-light" : "text-muted hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              <span className="ml-2">{langSwitch}</span>

              <a
                href="mailto:hello@gyoung.xyz"
                className="ml-2 btn-primary !py-2 !px-4 !text-[14px]"
              >
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
              className="md:hidden pb-6 pt-2 mt-2 mb-4 rounded-2xl bg-white/90 backdrop-blur-xl border border-white/70 shadow-xl"
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
      </div>
    </nav>
  );
}
