// 客户端安全的 GitHub 共享定义：仅类型与静态常量，禁止引入 lib/env 等仅服务端模块。
// 客户端组件必须从这里导入，避免把服务端 env 校验（含默认值）打进浏览器 bundle。

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

export interface GitHubRepoDetail {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  open_issues_count: number;
  watchers_count: number;
  topics: string[];
  license: { name: string } | null;
  default_branch: string;
  created_at: string;
  updated_at: string;
  archived: boolean;
  fork: boolean;
  size: number;
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
