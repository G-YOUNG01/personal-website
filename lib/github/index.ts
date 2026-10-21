import "server-only";
import { env } from "@/lib/env";
import type { GitHubRepo, GitHubUser, GitHubRepoDetail } from "./shared";

// 类型与语言配色定义在客户端安全的 ./shared，这里转发以保持既有导入路径可用。
export type { GitHubRepo, GitHubUser, GitHubRepoDetail };
export { languageColors } from "./shared";

const GITHUB_API = "https://api.github.com";

// 检测是否为占位 token（包含 placeholder、xxxxxxxx 或为空）
function isPlaceholderToken(token: string): boolean {
  if (!token) return true;
  const lower = token.toLowerCase();
  return lower.includes("placeholder") || lower.includes("xxxxxxxx") || lower === "ghp_placeholder";
}

function getAuthHeaders(): Record<string, string> {
  const token = env.GITHUB_TOKEN;
  if (isPlaceholderToken(token)) {
    return { Accept: "application/vnd.github+json" };
  }
  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
  };
}

export async function fetchUserRepos(): Promise<GitHubRepo[]> {
  const res = await fetch(
    `${GITHUB_API}/users/${env.GITHUB_USERNAME}/repos?per_page=100&sort=updated`,
    {
      headers: getAuthHeaders(),
      next: { revalidate: 300 }, // 5 分钟缓存
    },
  );

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }

  const repos: GitHubRepo[] = await res.json();
  return repos.filter((r) => !r.fork); // 排除 fork 仓库
}

export async function fetchUserProfile(): Promise<GitHubUser> {
  const res = await fetch(`${GITHUB_API}/users/${env.GITHUB_USERNAME}`, {
    headers: getAuthHeaders(),
    next: { revalidate: 600 }, // 10 分钟缓存
  });

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// 单仓库详情
export async function fetchRepoDetail(repo: string): Promise<GitHubRepoDetail> {
  const res = await fetch(`${GITHUB_API}/repos/${env.GITHUB_USERNAME}/${repo}`, {
    headers: getAuthHeaders(),
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// 仓库语言占比（字节数）
export async function fetchRepoLanguages(repo: string): Promise<Record<string, number>> {
  const res = await fetch(`${GITHUB_API}/repos/${env.GITHUB_USERNAME}/${repo}/languages`, {
    headers: getAuthHeaders(),
    next: { revalidate: 300 },
  });

  if (!res.ok) return {};
  return res.json();
}

// 仓库 README（返回解码后的 Markdown 原文）
export async function fetchRepoReadme(repo: string): Promise<string | null> {
  const res = await fetch(`${GITHUB_API}/repos/${env.GITHUB_USERNAME}/${repo}/readme`, {
    headers: getAuthHeaders(),
    next: { revalidate: 300 },
  });

  if (!res.ok) return null;
  const data = await res.json();
  if (!data?.content) return null;
  return Buffer.from(data.content, "base64").toString("utf8");
}
