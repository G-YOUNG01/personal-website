import type { Metadata } from "next";
import WorksClient from "@/components/WorksClient";
import { fetchUserRepos, type GitHubRepo } from "@/lib/github";

export const metadata: Metadata = {
  title: "作品集",
  description: "来自 GitHub 的开源项目，实时同步更新",
};

export const revalidate = 300; // 5 分钟重新验证

export default async function WorksPage() {
  let repos: GitHubRepo[] = [];
  let error: string | null = null;

  try {
    repos = await fetchUserRepos();
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to fetch repositories";
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 text-center">
        <h1 className="text-4xl font-bold mb-4">
          <span className="text-gradient">作品集</span>
        </h1>
        <p className="text-muted mb-6">暂时无法加载 GitHub 项目数据</p>
        <p className="text-sm text-muted mb-8">{error}</p>
        <a
          href="https://github.com/G-YOUNG01"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
        >
          直接访问 GitHub
        </a>
      </div>
    );
  }

  return <WorksClient repos={repos} />;
}
