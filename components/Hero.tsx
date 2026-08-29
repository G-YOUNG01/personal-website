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

const titles = ["AI 程序员", "全栈开发者", "开源爱好者", "终身学习者"];

function useTypewriter(words: string[], typingSpeed = 100, deletingSpeed = 50, pauseTime = 2000) {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex];
    let timeout: NodeJS.Timeout;

    if (!isDeleting && text === currentWord) {
      timeout = setTimeout(() => setIsDeleting(true), pauseTime);
    } else if (isDeleting && text === "") {
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % words.length);
    } else {
      timeout = setTimeout(
        () => {
          setText((prev) =>
            isDeleting ? currentWord.substring(0, prev.length - 1) : currentWord.substring(0, prev.length + 1),
          );
        },
        isDeleting ? deletingSpeed : typingSpeed,
      );
    }

    return () => clearTimeout(timeout);
  }, [text, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseTime]);

  return text;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function Hero({ name, bio, skills, contacts }: HeroProps) {
  const typedText = useTypewriter(titles);

  return (
    <motion.section
      className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 sm:px-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-4xl mx-auto text-center">
        <motion.div variants={itemVariants} className="mb-6">
          <span className="tag">👋 欢迎来到我的个人网站</span>
        </motion.div>

        <motion.h1 variants={itemVariants} className="text-4xl sm:text-6xl font-bold mb-4">
          你好，我是 <span className="text-gradient">{name}</span>
        </motion.h1>

        <motion.div variants={itemVariants} className="text-xl sm:text-2xl text-muted mb-8 h-8">
          <span>{typedText}</span>
          <span className="animate-pulse text-primary">|</span>
        </motion.div>

        <motion.p variants={itemVariants} className="text-base sm:text-lg text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
          {bio}
        </motion.p>

        <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-2 mb-10">
          {skills.map((skill) => (
            <span key={skill} className="tag">
              {skill}
            </span>
          ))}
        </motion.div>

        <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4">
          <Link href="/works" className="btn-primary">
            查看作品
          </Link>
          <Link href="/blog" className="btn-outline">
            阅读博客
          </Link>
          {contacts.github && (
            <a href={contacts.github} target="_blank" rel="noopener noreferrer" className="btn-outline">
              GitHub
            </a>
          )}
        </motion.div>
      </div>
    </motion.section>
  );
}
