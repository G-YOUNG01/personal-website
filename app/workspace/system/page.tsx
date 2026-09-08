"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

interface SystemStatus {
  database: { status: string; error: string | null };
  github: { status: string; error: string | null; username: string };
  uptime: { seconds: number; formatted: string };
  versions: {
    node: string;
    next: string;
    platform: string;
    arch: string;
    env: string;
  };
  timestamp: string;
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
        status === "ok"
          ? "bg-green-500/15 text-green-600 dark:text-green-400"
          : status === "error"
            ? "bg-red-500/15 text-red-600 dark:text-red-400"
            : "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400"
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status === "ok" ? "bg-green-500" : status === "error" ? "bg-red-500" : "bg-yellow-500"
        }`}
      />
      {status === "ok" ? "正常" : status === "error" ? "异常" : "未知"}
    </span>
  );
}

export default function SystemPage() {
  const { t } = useLanguage();
  const [data, setData] = useState<SystemStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    setLoading(true);
    fetch("/api/workspace/system")
      .then((r) => r.json())
      .then((res) => setData(res))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const id = requestAnimationFrame(() => fetchData());
    const interval = setInterval(fetchData, 30000); // 每 30 秒刷新
    return () => {
      cancelAnimationFrame(id);
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">{t.workspace.system}</h1>
          <p className="text-muted text-sm">系统运行状态与版本信息</p>
        </div>
        <button onClick={fetchData} className="btn-outline text-sm" disabled={loading}>
          {loading ? "刷新中..." : "刷新"}
        </button>
      </div>

      {loading && !data ? (
        <div className="card p-10 text-center text-muted">加载中...</div>
      ) : data ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 服务状态 */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-4">服务状态</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">数据库</div>
                  <div className="text-xs text-muted">SQLite / libSQL</div>
                </div>
                <StatusBadge status={data.database.status} />
              </div>
              {data.database.error && (
                <div className="text-xs text-red-500">{data.database.error}</div>
              )}
              <div className="border-t border-slate-200 dark:border-white/10" />
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">GitHub API</div>
                  <div className="text-xs text-muted">@{data.github.username}</div>
                </div>
                <StatusBadge status={data.github.status} />
              </div>
              {data.github.error && <div className="text-xs text-red-500">{data.github.error}</div>}
            </div>
          </div>

          {/* 运行信息 */}
          <div className="card p-6">
            <h2 className="text-lg font-semibold mb-4">运行信息</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted">运行时长</span>
                <span className="font-medium">{data.uptime.formatted}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Node.js</span>
                <span className="font-mono text-sm">{data.versions.node}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Next.js</span>
                <span className="font-mono text-sm">{data.versions.next}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">平台</span>
                <span className="font-mono text-sm">
                  {data.versions.platform} / {data.versions.arch}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">环境</span>
                <span
                  className={`font-medium ${
                    data.versions.env === "production" ? "text-green-600" : "text-yellow-600"
                  }`}
                >
                  {data.versions.env}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">最后检查</span>
                <span className="font-mono text-xs">
                  {new Date(data.timestamp).toLocaleTimeString("zh-CN")}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
