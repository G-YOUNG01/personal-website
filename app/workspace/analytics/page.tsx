"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

interface DailyStat {
  date: string;
  pv: number;
  uv: number;
}

export default function AnalyticsPage() {
  const { t } = useLanguage();
  const [days, setDays] = useState<7 | 30>(7);
  const [data, setData] = useState<DailyStat[]>([]);
  const [totalPv, setTotalPv] = useState(0);
  const [totalUv, setTotalUv] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setLoading(true);
      fetch(`/api/workspace/analytics?days=${days}`)
        .then((r) => r.json())
        .then((res) => {
          setData(res.data || []);
          setTotalPv(res.totalPv || 0);
          setTotalUv(res.totalUv || 0);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    });
    return () => cancelAnimationFrame(id);
  }, [days]);

  const maxPv = Math.max(...data.map((d) => d.pv), 1);
  const chartHeight = 200;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">{t.workspace.analytics}</h1>
          <p className="text-muted text-sm">访客访问趋势与统计</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setDays(7)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              days === 7
                ? "bg-blue-500/15 text-primary-light"
                : "glass-card text-muted hover:text-foreground"
            }`}
          >
            近 7 天
          </button>
          <button
            onClick={() => setDays(30)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              days === 30
                ? "bg-blue-500/15 text-primary-light"
                : "glass-card text-muted hover:text-foreground"
            }`}
          >
            近 30 天
          </button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card p-5">
          <div className="text-muted text-sm mb-1">总浏览量 (PV)</div>
          <div className="text-3xl font-bold">{totalPv.toLocaleString()}</div>
        </div>
        <div className="card p-5">
          <div className="text-muted text-sm mb-1">独立访客 (UV)</div>
          <div className="text-3xl font-bold">{totalUv.toLocaleString()}</div>
        </div>
        <div className="card p-5">
          <div className="text-muted text-sm mb-1">日均 PV</div>
          <div className="text-3xl font-bold">
            {data.length > 0 ? Math.round(totalPv / data.length).toLocaleString() : 0}
          </div>
        </div>
      </div>

      {/* 趋势图 */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold mb-4">访问趋势</h2>
        {loading ? (
          <div className="h-[200px] flex items-center justify-center text-muted">加载中...</div>
        ) : (
          <div>
            {/* SVG 柱状图 */}
            <div className="relative" style={{ height: chartHeight + 40 }}>
              <svg width="100%" height={chartHeight} className="overflow-visible">
                {data.map((d, i) => {
                  const pvHeight = (d.pv / maxPv) * chartHeight * 0.85;
                  const uvHeight = (d.uv / maxPv) * chartHeight * 0.85;
                  const x = (i / data.length) * 100;
                  return (
                    <g key={d.date}>
                      {/* PV 柱 */}
                      <rect
                        x={`${x + 1}%`}
                        y={chartHeight - pvHeight}
                        width={`${100 / data.length - 2}%`}
                        height={pvHeight}
                        rx="4"
                        fill="url(#pvGradient)"
                        className="transition-all hover:opacity-80"
                      >
                        <title>{`${d.date}: PV ${d.pv}, UV ${d.uv}`}</title>
                      </rect>
                      {/* UV 线 */}
                      <circle
                        cx={`${x + 50 / data.length}%`}
                        cy={chartHeight - uvHeight}
                        r="3"
                        fill="#a855f7"
                      />
                    </g>
                  );
                })}
                <defs>
                  <linearGradient id="pvGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.3" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            {/* 日期标签 */}
            <div className="flex justify-between mt-2">
              {data
                .filter((_, i) => i % Math.ceil(data.length / 7) === 0)
                .map((d) => (
                  <span key={d.date} className="text-[11px] text-muted">
                    {d.date.slice(5)}
                  </span>
                ))}
            </div>
            {/* 图例 */}
            <div className="flex gap-4 mt-3 text-xs text-muted">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-blue-500/60 inline-block" /> PV
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-500 inline-block" /> UV
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
