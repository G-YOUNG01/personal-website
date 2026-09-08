import { NextResponse } from "next/server";
import os from "os";
import { execSync } from "child_process";
import { requireAdminApi } from "@/lib/workspace-api";

// 服务器信息：CPU、内存、磁盘、系统运行时间、Node 版本、IP
export async function GET() {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.unauthorized;

  // CPU
  const cpus = os.cpus();
  const cpuCount = cpus.length;
  const cpuModel = cpus[0]?.model || "unknown";
  // 计算 CPU 使用率（取两次采样间隔）
  const loadAvg = os.loadavg();
  const cpuUsagePercent = Math.min(100, Math.round((loadAvg[0] / cpuCount) * 100));

  // 内存
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const memUsagePercent = Math.round((usedMem / totalMem) * 100);

  // 磁盘（跨平台：Windows 用 wmic，Linux 用 df）
  let diskInfo = { total: 0, used: 0, free: 0, usagePercent: 0 };
  try {
    if (process.platform === "win32") {
      const output = execSync("wmic logicaldisk get size,freespace,caption /format:csv", {
        encoding: "utf-8",
        timeout: 5000,
      });
      const lines = output.trim().split("\n").slice(1);
      let total = 0,
        free = 0;
      for (const line of lines) {
        const parts = line.split(",");
        if (parts.length >= 4 && parts[1] && parts[2] && parts[3]) {
          free += parseInt(parts[2], 10) || 0;
          total += parseInt(parts[3], 10) || 0;
        }
      }
      if (total > 0) {
        diskInfo = {
          total,
          used: total - free,
          free,
          usagePercent: Math.round(((total - free) / total) * 100),
        };
      }
    } else {
      const output = execSync("df -B1 --output=size,used,avail / | tail -1", {
        encoding: "utf-8",
        timeout: 5000,
      });
      const parts = output.trim().split(/\s+/);
      const total = parseInt(parts[0], 10) || 0;
      const used = parseInt(parts[1], 10) || 0;
      const free = parseInt(parts[2], 10) || 0;
      if (total > 0) {
        diskInfo = {
          total,
          used,
          free,
          usagePercent: Math.round((used / total) * 100),
        };
      }
    }
  } catch {
    // 磁盘信息获取失败时留空
  }

  // 系统运行时间
  const sysUptime = os.uptime();
  const sysUptimeFormatted = formatUptime(Math.floor(sysUptime));

  // 网络 IP
  const interfaces = os.networkInterfaces();
  const ips: string[] = [];
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      if (iface.family === "IPv4" && !iface.internal) {
        ips.push(iface.address);
      }
    }
  }

  return NextResponse.json({
    cpu: {
      model: cpuModel,
      cores: cpuCount,
      usagePercent: cpuUsagePercent,
      loadAvg: { "1min": loadAvg[0], "5min": loadAvg[1], "15min": loadAvg[2] },
    },
    memory: {
      total: totalMem,
      used: usedMem,
      free: freeMem,
      usagePercent: memUsagePercent,
      totalGB: (totalMem / 1024 / 1024 / 1024).toFixed(1),
      usedGB: (usedMem / 1024 / 1024 / 1024).toFixed(1),
    },
    disk: {
      ...diskInfo,
      totalGB: (diskInfo.total / 1024 / 1024 / 1024).toFixed(1),
      usedGB: (diskInfo.used / 1024 / 1024 / 1024).toFixed(1),
    },
    system: {
      platform: process.platform,
      arch: process.arch,
      hostname: os.hostname(),
      release: os.release(),
      nodeVersion: process.version,
      uptimeSeconds: Math.floor(sysUptime),
      uptimeFormatted: sysUptimeFormatted,
    },
    network: { ips },
    timestamp: new Date().toISOString(),
  });
}

function formatUptime(seconds: number): string {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const parts: string[] = [];
  if (days > 0) parts.push(`${days}天`);
  if (hours > 0) parts.push(`${hours}时`);
  parts.push(`${mins}分`);
  return parts.join(" ") || "0分";
}
