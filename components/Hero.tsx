"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";

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
  const { visibleLines, currentLine, charCount } = useTyping(codeLines);
  const cursor = (
    <span className="inline-block w-2 h-4 bg-sky-400 ml-0.5 align-middle animate-pulse" />
  );

  return (
    <motion.section
      id="about"
      className="min-h-[calc(100vh-4rem)] flex items-center px-6 py-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-6xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
        {/* 左侧 - 简介 */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-5"
          >
            <span className="inline-flex items-center gap-2 text-sm font-medium text-primary-light">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              AI 程序员 / 全栈开发者 / 开源爱好者
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6"
          >
            <span className="text-gradient">{name}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg sm:text-xl text-muted max-w-xl leading-relaxed mb-8"
          >
            {bio}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap gap-2 mb-10"
          >
            {skills.map((skill) => (
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
              查看我的作品
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
              阅读技术博客
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

          {/* 向下滚动 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
            className="mt-14 hidden lg:block"
          >
            <a
              href="#projects"
              className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary-light transition-colors"
            >
              向下滚动
              <svg
                className="w-4 h-4 animate-bounce"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </a>
          </motion.div>
        </div>

        {/* 右侧 - 代码卡片 */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative hidden sm:block"
        >
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-cyan-400/20 blur-2xl rounded-3xl -z-10" />
          <div className="card overflow-hidden">
            {/* 标题栏 */}
            <div className="flex items-center gap-2 px-5 py-3.5 bg-white/60 border-b border-white/60">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-yellow-400" />
              <span className="w-3 h-3 rounded-full bg-green-400" />
              <span className="ml-3 text-xs text-muted font-mono">developer.ts</span>
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
