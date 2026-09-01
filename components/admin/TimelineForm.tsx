"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface TimelineInitial {
  id: number;
  slug: string;
  year: number;
  title: string;
  description: string | null;
  iconType: string | null;
  sortOrder: number;
}

const inputCls =
  "w-full px-3 py-2 rounded-lg border border-slate-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 text-sm";

export default function TimelineForm({
  csrfToken,
  initial,
}: {
  csrfToken: string;
  initial?: TimelineInitial;
}) {
  const router = useRouter();
  const [slug, setSlug] = useState(initial?.slug || "");
  const [year, setYear] = useState(
    initial?.year ? String(initial.year) : String(new Date().getFullYear()),
  );
  const [title, setTitle] = useState(initial?.title || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [iconType, setIconType] = useState(initial?.iconType || "");
  const [sortOrder, setSortOrder] = useState(initial ? String(initial.sortOrder) : "0");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const payload = {
      slug: slug.trim().toLowerCase(),
      year: Number(year),
      title,
      description,
      iconType,
      sortOrder: Number(sortOrder) || 0,
      csrfToken,
    };
    try {
      const res = await fetch(initial ? `/api/timelines/${initial.id}` : "/api/timelines", {
        method: initial ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        router.push("/admin/timelines");
      } else {
        setError(data.error || "保存失败");
      }
    } catch {
      setError("网络错误，保存失败");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-6 space-y-5">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">年份 *</label>
          <input
            className={inputCls}
            value={year}
            onChange={(e) => setYear(e.target.value)}
            type="number"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">标题 *</label>
          <input
            className={inputCls}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">slug *（英文小写）</label>
          <input
            className={inputCls}
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="start-learning-ai"
            required
            pattern="[a-z0-9-]+"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">图标（可选，如 code / rocket）</label>
          <input
            className={inputCls}
            value={iconType}
            onChange={(e) => setIconType(e.target.value)}
            placeholder="code"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">描述</label>
        <textarea
          className={`${inputCls} min-h-[120px]`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">排序值（越小越靠前）</label>
        <input
          className={inputCls}
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          type="number"
        />
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}

      <div className="flex items-center gap-3 pt-2">
        <button type="submit" disabled={saving} className="btn-primary text-sm">
          {saving ? "保存中…" : initial ? "保存修改" : "添加时间线"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/timelines")}
          className="btn-outline text-sm"
          disabled={saving}
        >
          取消
        </button>
      </div>
    </form>
  );
}
