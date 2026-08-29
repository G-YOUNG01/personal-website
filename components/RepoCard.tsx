"use client";

import { motion } from "framer-motion";
import type { GitHubRepo } from "@/lib/github";
import { languageColors } from "@/lib/github";

interface RepoCardProps {
  repo: GitHubRepo;
  index: number;
}

export default function RepoCard({ repo, index }: RepoCardProps) {
  const langColor = repo.language ? languageColors[repo.language] || "#8b8b9e" : "#8b8b9e";

  return (
    <motion.a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="glow-border rounded-xl p-5 block h-full"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary-light transition-colors">
          {repo.name}
        </h3>
        <svg className="w-5 h-5 text-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </div>

      <p className="text-sm text-muted mb-4 line-clamp-2 min-h-[2.5rem]">
        {repo.description || "暂无描述"}
      </p>

      <div className="flex items-center gap-4 text-xs text-muted">
        {repo.language && (
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: langColor }} />
            {repo.language}
          </span>
        )}
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 .587l3.668 7.568L24 9.75l-6 5.853L19.336 24 12 19.897 4.664 24 6 15.603 0 9.75l8.332-1.595z" />
          </svg>
          {repo.stargazers_count}
        </span>
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          {repo.forks_count}
        </span>
      </div>

      {repo.topics && repo.topics.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {repo.topics.slice(0, 3).map((topic) => (
            <span key={topic} className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary-light">
              {topic}
            </span>
          ))}
        </div>
      )}
    </motion.a>
  );
}
