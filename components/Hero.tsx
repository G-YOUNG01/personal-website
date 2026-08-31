"use client";

import { motion } from "framer-motion";
import Link from "next/link";

interface HeroProps {
  name: string;
  bio: string;
  skills: string[];
  contacts: Record<string, string>;
}

export default function Hero({ name, bio, skills, contacts }: HeroProps) {
  return (
    <motion.section
      className="min-h-[calc(100vh-4rem)] flex items-center px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 text-sm text-muted">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            开放合作中
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.1] mb-8"
        >
          你好，我是
          <br />
          <span className="text-gradient">{name}</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-xl sm:text-2xl text-muted max-w-2xl leading-relaxed mb-10"
        >
          {bio}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-wrap gap-2 mb-12"
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
            查看作品
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
          <Link href="/blog" className="btn-outline">
            阅读博客
          </Link>
          {contacts.github && (
            <a href={contacts.github} target="_blank" rel="noopener noreferrer" className="btn-outline">
              GitHub ↗
            </a>
          )}
        </motion.div>
      </div>
    </motion.section>
  );
}
