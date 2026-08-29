import { env } from "@/lib/env";

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  created_at: string;
  topics: string[];
  homepage: string | null;
  archived: boolean;
  fork: boolean;
}

export interface GitHubUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
}

const GITHUB_API = "https://api.github.com";

export async function fetchUserRepos(): Promise<GitHubRepo[]> {
  const res = await fetch(`${GITHUB_API}/users/${env.GITHUB_USERNAME}/repos?per_page=100&sort=updated`, {
    headers: {
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
    },
    next: { revalidate: 300 }, // 5 分钟缓存
  });

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }

  const repos: GitHubRepo[] = await res.json();
  return repos.filter((r) => !r.fork); // 排除 fork 仓库
}

export async function fetchUserProfile(): Promise<GitHubUser> {
  const res = await fetch(`${GITHUB_API}/users/${env.GITHUB_USERNAME}`, {
    headers: {
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      Accept: "application/vnd.github+json",
    },
    next: { revalidate: 600 }, // 10 分钟缓存
  });

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// 语言颜色映射
export const languageColors: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Go: "#00ADD8",
  Rust: "#dea584",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Vue: "#41b883",
  React: "#61dafb",
  Shell: "#89e051",
  Dockerfile: "#384d54",
  Markdown: "#083fa1",
  Jupyter: "#DA5B0B",
};
