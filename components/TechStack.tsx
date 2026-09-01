"use client";

import { motion } from "framer-motion";
import { useLanguage } from "@/components/LanguageProvider";

interface TechStackProps {
  skills: string[];
}

/** 技能名 → 本地高清品牌 logo */
const logoMap: Record<string, string> = {
  TypeScript: "typescript",
  React: "react",
  "Next.js": "nextdotjs",
  "Node.js": "nodedotjs",
  Python: "python",
  "AI/ML": "tensorflow",
  TensorFlow: "tensorflow",
  Docker: "docker",
  Git: "git",
  TailwindCSS: "tailwindcss",
  Tailwind: "tailwindcss",
  SQLite: "sqlite",
  Vite: "vite",
  "C++": "cplusplus",
  Linux: "linux",
  GitHub: "github",
};

/** 扩展常用技术展示（含用户技能 + 常用补充），去重 */
const extraSkills = ["Git", "TailwindCSS", "SQLite", "Vite", "C++", "Linux"];

export default function TechStack({ skills }: TechStackProps) {
  const { t } = useLanguage();
  const base = skills.length > 0 ? skills : [];
  const list = [...new Set([...base, ...extraSkills])].filter((s) => logoMap[s]);

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <h2 className="text-4xl font-bold tracking-tight">{t.techstack.title}</h2>
        <p className="text-muted mt-2 text-sm">{t.techstack.subtitle}</p>
      </motion.div>

      <div className="flex flex-wrap justify-center gap-4">
        {list.map((skill, i) => (
          <motion.div
            key={skill}
            initial={{ opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            className="card px-5 py-4 flex items-center gap-3 hover:-translate-y-1"
          >
            {/* 半透明圆底衬真实 logo，深色 logo 也清晰且透出玻璃背景 */}
            <span className="w-11 h-11 rounded-xl bg-white/75 backdrop-blur-sm shadow-sm flex items-center justify-center flex-shrink-0 p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`/icons/${logoMap[skill]}.svg`}
                alt={`${skill} logo`}
                className="w-full h-full object-contain"
                loading="lazy"
              />
            </span>
            <span className="font-semibold text-[15px]">{skill}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
