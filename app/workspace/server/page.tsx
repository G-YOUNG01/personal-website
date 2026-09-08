"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

interface ServerInfo {
  cpu: {
    model: string;
    cores: number;
    usagePercent: number;
    loadAvg: { "1min": number; "5min": number; "15min": number };
  };
  memory: {
    total: number;
    used: number;
    free: number;
    usagePercent: number;
    totalGB: string;
    usedGB: string;
  };
  disk: {
    total: number;
    used: number;
    free: number;
    usagePercent: number;
    totalGB: string;
    usedGB: string;
  };
  system: {
    platform: string;
    arch: string;
    hostname: string;
    release: string;
    nodeVersion: string;
    uptimeSeconds: number;
    uptimeFormatted: string;
  };
  network: { ips: string[] };
  timestamp: string;
}

function ProgressBar({ percent, color = "blue" }: { percent: number; color?: string }) {
  const colors: Record<string, string> = {
    blue: "from-blue-500 to-blue-400",
    green: "from-green-500 to-green-400",
    yellow: "from-yellow-500 to-yellow-400",
    red: "from-red-500 to-red-400",
  };
  const barColor = percent > 80 ? "red" : percent > 60 ? "yellow" : color;
  return (
    <div className="h-2.5 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
      <div
        className={`h-full bg-gradient-to-r ${colors[barColor]} rounded-full transition-all duration-500`}
        style={{ width: `${Math.min(100, percent)}%` }}
      />
    </div>
  );
}

export default function ServerPage() {
  const { t } = useLanguage();
  const [data, setData] = useState<ServerInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    setLoading(true);
    fetch("/api/workspace/server")
      .then((r) => r.json())
      .then((res) => setData(res))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const id = requestAnimationFrame(() => fetchData());
    const interval = setInterval(fetchData, 10000); // 每 10 秒刷新
    return () => {
      cancelAnimationFrame(id);
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">{t.workspace.server}</h1>
          <p className="text-muted text-sm">服务器资源使用情况（每 10 秒自动刷新）</p>
        </div>
        <button onClick={fetchData} className="btn-outline text-sm" disabled={loading}>
          {loading ? "刷新中..." : "刷新"}
        </button>
      </div>

      {loading && !data ? (
        <div className="card p-10 text-center text-muted">加载中...</div>
      ) : data ? (
        <div className="space-y-6">
          {/* CPU & 内存 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">CPU</h2>
                <span className="text-2xl font-bold">{data.cpu.usagePercent}%</span>
              </div>
              <ProgressBar percent={data.cpu.usagePercent} />
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">型号</span>
                  <span className="font-mono text-xs truncate max-w-[60%]">{data.cpu.model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">核心数</span>
                  <span className="font-medium">{data.cpu.cores} 核</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">负载 (1/5/15min)</span>
                  <span className="font-mono text-xs">
                    {data.cpu.loadAvg["1min"].toFixed(2)} / {data.cpu.loadAvg["5min"].toFixed(2)} /{" "}
                    {data.cpu.loadAvg["15min"].toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">内存</h2>
                <span className="text-2xl font-bold">{data.memory.usagePercent}%</span>
              </div>
              <ProgressBar percent={data.memory.usagePercent} />
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">已用</span>
                  <span className="font-medium">{data.memory.usedGB} GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">总量</span>
                  <span className="font-medium">{data.memory.totalGB} GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">空闲</span>
                  <span className="font-medium">
                    {(parseFloat(data.memory.totalGB) - parseFloat(data.memory.usedGB)).toFixed(1)}{" "}
                    GB
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 磁盘 & 系统 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">磁盘</h2>
                <span className="text-2xl font-bold">{data.disk.usagePercent}%</span>
              </div>
              <ProgressBar percent={data.disk.usagePercent} />
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">已用</span>
                  <span className="font-medium">{data.disk.usedGB} GB</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">总量</span>
                  <span className="font-medium">{data.disk.totalGB} GB</span>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <h2 className="text-lg font-semibold mb-4">系统信息</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">主机名</span>
                  <span className="font-mono text-xs">{data.system.hostname}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">系统</span>
                  <span className="font-mono text-xs">
                    {data.system.platform} {data.system.release}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">架构</span>
                  <span className="font-mono text-xs">{data.system.arch}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Node.js</span>
                  <span className="font-mono text-xs">{data.system.nodeVersion}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">运行时长</span>
                  <span className="font-medium">{data.system.uptimeFormatted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">IP 地址</span>
                  <span className="font-mono text-xs">{data.network.ips.join(", ") || "未知"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
