import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { env } from "@/lib/env";
import { requireAdminApi } from "@/lib/workspace-api";
import nextPkg from "next/package.json";

// 系统状态：数据库、GitHub API、运行时长、版本
export async function GET() {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.unauthorized;

  // 数据库连通性
  let dbStatus = "ok";
  let dbError: string | null = null;
  try {
    await db.$client.execute("SELECT 1");
  } catch (e) {
    dbStatus = "error";
    dbError = e instanceof Error ? e.message : String(e);
  }

  // GitHub API 连通性（轻量请求）
  let githubStatus = "unknown";
  let githubError: string | null = null;
  try {
    const token = env.GITHUB_TOKEN;
    const headers: Record<string, string> = { Accept: "application/vnd.github+json" };
    if (!token.toLowerCase().includes("placeholder") && token !== "ghp_placeholder") {
      headers.Authorization = `Bearer ${token}`;
    }
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`https://api.github.com/users/${env.GITHUB_USERNAME}`, {
      headers,
      signal: controller.signal,
    });
    clearTimeout(timeout);
    githubStatus = res.ok ? "ok" : "error";
    if (!res.ok) githubError = `HTTP ${res.status}`;
  } catch (e) {
    githubStatus = "error";
    githubError = e instanceof Error ? e.message : String(e);
  }

  // 运行时长
  const uptimeSeconds = Math.floor(process.uptime());
  const uptimeFormatted = formatUptime(uptimeSeconds);

  // 版本信息
  const versions = {
    node: process.version,
    next: getNextVersion(),
    platform: process.platform,
    arch: process.arch,
    env: env.NODE_ENV,
  };

  return NextResponse.json({
    database: { status: dbStatus, error: dbError },
    github: { status: githubStatus, error: githubError, username: env.GITHUB_USERNAME },
    uptime: { seconds: uptimeSeconds, formatted: uptimeFormatted },
    versions,
    timestamp: new Date().toISOString(),
  });
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  const parts: string[] = [];
  if (days > 0) parts.push(`${days}天`);
  if (hours > 0) parts.push(`${hours}时`);
  if (mins > 0) parts.push(`${mins}分`);
  parts.push(`${secs}秒`);
  return parts.join(" ");
}

function getNextVersion(): string {
  try {
    return (nextPkg as { version?: string }).version || "unknown";
  } catch {
    return "unknown";
  }
}
