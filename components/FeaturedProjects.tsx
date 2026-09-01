"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import type { GitHubRepo } from "@/lib/github";
import { languageColors } from "@/lib/github";
import { useLanguage } from "@/components/LanguageProvider";

interface FeaturedProjectsProps {
  repos: GitHubRepo[];
}

/** 精选项目（取 star 数最高的 4 个） */
export default function FeaturedProjects({ repos }: FeaturedProjectsProps) {
  const { t } = useLanguage();
  const featured = [...repos]
    .filter((r) => !r.fork && r.stargazers_count > 0)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 4);

  if (featured.length < 4) {
    const top = [...repos].filter((r) => !r.fork).slice(0, 4);
    if (top.length > featured.length) {
      for (const r of top) {
        if (!featured.includes(r)) featured.push(r);
        if (featured.length >= 4) break;
      }
    }
  }

  return (
    <section id="projects" className="max-w-7xl mx-auto px-6 py-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-10"
      >
        <h2 className="text-4xl font-bold tracking-tight">{t.featured.title}</h2>
        <Link href="/works" className="text-sm font-medium text-primary-light hover:underline">
          {t.featured.viewAll}
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {featured.map((repo, i) => {
          const langColor = repo.language ? languageColors[repo.language] || "#94a3b8" : "#94a3b8";
          const tags = [
            ...new Set([repo.language, ...(repo.topics || []).slice(0, 2)].filter(Boolean)),
          ].slice(0, 3);
          return (
            <motion.a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card p-6 block group"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold group-hover:text-primary-light transition-colors">
                  {repo.name}
                </h3>
                <svg
                  className="w-4 h-4 text-muted flex-shrink-0 mt-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </div>
              <p className="text-sm text-muted mb-4 line-clamp-2 min-h-[2.5rem]">
                {repo.description || t.featured.noDesc}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1.5">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1 text-xs px-2 py-0.5 rounded-md bg-blue-500/10 text-primary-light"
                    >
                      {tag === repo.language && (
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: langColor }}
                        />
                      )}
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="flex items-center gap-1 text-xs text-muted flex-shrink-0">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 .587l3.668 7.568L24 9.75l-6 5.853L19.336 24 12 19.897 4.664 24 6 15.603 0 9.75l8.332-1.595z" />
                  </svg>
                  {repo.stargazers_count}
                </span>
              </div>
            </motion.a>
          );
        })}
      </div>
    </section>
  );
}
