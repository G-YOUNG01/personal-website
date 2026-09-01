"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/components/LanguageProvider";

interface HeroProps {
  name: string;
  bio: string;
  skills: string[];
  contacts: Record<string, string>;
}

const codeLines = [
  { indent: 0, text: "const developer = {", color: "text-slate-200" },
  { indent: 1, text: "name: 'G-YOUNG',", color: "text-sky-300" },
  { indent: 1, text: "role: 'AI Programmer',", color: "text-sky-300" },
  { indent: 1, text: "focus: ['Full-Stack', 'AI Application'],", color: "text-emerald-300" },
  { indent: 1, text: "passion: 'Open Source',", color: "text-sky-300" },
  { indent: 1, text: "belief: 'Code changes the world'", color: "text-sky-300" },
  { indent: 0, text: "}", color: "text-slate-200" },
  { indent: 0, text: "// Let's build the future together! 🚀", color: "text-slate-400" },
];

/** 名字周围漂浮的光点（DeepSeek「未至之境」风格） */
const sparks = [
  { left: "-4%", top: "10%", color: "#93c5fd", delay: "0s", dur: "5s" },
  { left: "103%", top: "2%", color: "#c4b5fd", delay: "1.2s", dur: "6.5s" },
  { left: "58%", top: "-32%", color: "#67e8f9", delay: "0.6s", dur: "5.5s" },
  { left: "18%", top: "-22%", color: "#a5b4fc", delay: "2s", dur: "7s" },
  { left: "88%", top: "72%", color: "#93c5fd", delay: "0.3s", dur: "5.8s" },
  { left: "-8%", top: "62%", color: "#c4b5fd", delay: "1.6s", dur: "6.2s" },
  { left: "42%", top: "98%", color: "#67e8f9", delay: "0.9s", dur: "6.8s" },
  { left: "110%", top: "46%", color: "#a5b4fc", delay: "2.4s", dur: "5.2s" },
];

/** 代码打字机效果 */
function useTyping(lines: { indent: number; text: string }[], speed = 14) {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [charCount, setCharCount] = useState(0);

  useEffect(() => {
    if (currentLine >= lines.length) return;
    const full = lines[currentLine].text;
    // 所有 setState 均放入 setTimeout 回调，避免在 effect 体内同步更新状态
    const t = setTimeout(() => {
      if (charCount <= full.length) {
        setCharCount((c) => c + 1);
      } else {
        setVisibleLines((v) => [...v, currentLine]);
        setCurrentLine((c) => c + 1);
        setCharCount(0);
      }
    }, speed);
    return () => clearTimeout(t);
  }, [currentLine, charCount, lines, speed]);

  return { visibleLines, currentLine, charCount };
}

export default function Hero({ name, bio, skills, contacts }: HeroProps) {
  const { lang, t } = useLanguage();
  const { visibleLines, currentLine, charCount } = useTyping(codeLines);
  const cursor = (
    <span className="inline-block w-2 h-4 bg-sky-400 ml-0.5 align-middle animate-pulse" />
  );
  const shownBio = lang === "en" ? t.hero.bioEn : bio || t.hero.bioFallback;
  // 技术栈标签：在现有技能基础上补充常用项（去重）
  const shownSkills = [...new Set([...skills, "Git", "Linux", "TailwindCSS", "Vite"])];

  return (
    <motion.section
      id="about"
      className="min-h-[calc(100vh-4rem)] flex items-center px-6 py-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
        {/* 左侧 - 简介 */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-5"
          >
            <span className="inline-flex items-center gap-2 text-base font-medium text-primary-light">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              {t.hero.tagline}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.05] mb-6"
          >
            <span
              className="title-aurora"
              aria-label={name}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
                e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
              }}
            >
              <span className="aurora-blob" aria-hidden="true" />
              <span className="title-shine" aria-hidden="true">
                {name}
              </span>
              <span className="title-spotlight" aria-hidden="true">
                {name}
              </span>
              {sparks.map((s, i) => (
                <span
                  key={i}
                  aria-hidden="true"
                  className="spark"
                  style={{
                    left: s.left,
                    top: s.top,
                    color: s.color,
                    ["--dur" as string]: s.dur,
                    ["--delay" as string]: s.delay,
                  }}
                />
              ))}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-xl sm:text-2xl text-muted max-w-xl leading-relaxed mb-8"
          >
            {shownBio}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap gap-2 mb-10"
          >
            {shownSkills.map((skill) => (
              <span key={skill} className="tag">
                {skill}
              </span>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            <Link href="/works" className="btn-primary">
              {t.hero.viewWorks}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
            <Link href="/blog" className="btn-outline">
              {t.hero.readBlog}
            </Link>
            {contacts.github && (
              <a
                href={contacts.github}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                GitHub ↗
              </a>
            )}
          </motion.div>
        </div>

        {/* 右侧 - 代码卡片 */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative hidden sm:block lg:w-[86%] lg:ml-auto"
        >
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-cyan-400/20 blur-2xl rounded-3xl -z-10" />
          <div className="card overflow-hidden">
            {/* 标题栏 */}
            <div className="flex items-center gap-2 px-5 py-3.5 bg-white/60 border-b border-white/60">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-yellow-400" />
              <span className="w-3 h-3 rounded-full bg-green-400" />
              <span className="ml-3 text-xs text-muted font-mono">{t.hero.developerTs}</span>
            </div>
            {/* 代码区 */}
            <pre className="!bg-slate-900 !rounded-none !border-0 !shadow-none min-h-[280px]">
              <code>
                {codeLines.map((line, i) => {
                  const shown = i < visibleLines.length || i === currentLine;
                  if (!shown) return null;
                  const isCurrent = i === currentLine;
                  const text = isCurrent ? line.text.slice(0, charCount) : line.text;
                  return (
                    <div
                      key={i}
                      className="whitespace-pre"
                      style={{ paddingLeft: `${line.indent * 1.5}rem` }}
                    >
                      <span className={line.color}>
                        {text}
                        {isCurrent ? cursor : null}
                      </span>
                    </div>
                  );
                })}
              </code>
            </pre>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
