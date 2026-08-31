"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export interface TimelineItem {
  id: number;
  year: number;
  title: string;
  description: string | null;
  iconType: string | null;
}

interface TimelineSectionProps {
  items: TimelineItem[];
}

const iconMap: Record<string, string> = {
  rocket: "🚀",
  star: "⭐",
  brain: "🧠",
  globe: "🌐",
  code: "💻",
  book: "📚",
  trophy: "🏆",
  briefcase: "💼",
};

/** 成长时间线 - 横向 4 节点 */
export default function TimelineSection({ items }: TimelineSectionProps) {
  const list = [...items].sort((a, b) => a.year - b.year).slice(0, 4);

  return (
    <section className="max-w-6xl mx-auto px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-12"
      >
        <h2 className="text-3xl font-bold tracking-tight">成长时间线</h2>
        <Link href="/timeline" className="text-sm font-medium text-primary-light hover:underline">
          查看完整历程 →
        </Link>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {list.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="relative card p-6"
          >
            {/* 顶部连线 */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center shadow">
              <span className="text-[10px] font-bold text-blue-500">
                {iconMap[item.iconType || ""] || "📌"}
              </span>
            </div>
            <div className="text-3xl font-bold text-gradient mb-2 text-center mt-2">
              {item.year}
            </div>
            <h3 className="font-semibold text-center mb-2">{item.title}</h3>
            {item.description && (
              <p className="text-sm text-muted text-center leading-relaxed">{item.description}</p>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
