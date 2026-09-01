/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface PostInitial {
  id: number;
  title: string;
  slug: string;
  content: string;
  coverImage: string | null;
  tags: string[];
  published: boolean;
}

const inputCls =
  "w-full px-3 py-2 rounded-lg border border-slate-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 text-sm";

export default function PostForm({
  csrfToken,
  initial,
}: {
  csrfToken: string;
  initial?: PostInitial;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initial?.title || "");
  const [slug, setSlug] = useState(initial?.slug || "");
  const [content, setContent] = useState(initial?.content || "");
  const [coverImage, setCoverImage] = useState(initial?.coverImage || "");
  const [tags, setTags] = useState(initial?.tags?.join(", ") || "");
  const [published, setPublished] = useState(initial?.published ?? false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("csrfToken", csrfToken);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (res.ok) {
        setCoverImage(data.url);
      } else {
        setError(data.error || "上传失败");
      }
    } catch {
      setError("上传失败");
    } finally {
      setUploading(false);
      if (e.target) e.target.value = "";
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);
    const payload = {
      title,
      slug: slug.trim().toLowerCase(),
      content,
      coverImage,
      tags: tags
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      published,
      csrfToken,
    };
    try {
      const res = await fetch(initial ? `/api/posts/${initial.id}` : "/api/posts", {
        method: initial ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        router.push("/admin/posts");
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
          <label className="block text-sm font-medium mb-1.5">标题 *</label>
          <input
            className={inputCls}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">
            slug *（英文小写，如 my-first-post）
          </label>
          <input
            className={inputCls}
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="my-first-post"
            required
            pattern="[a-z0-9-]+"
            title="只能包含小写字母、数字和连字符"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">正文内容</label>
        <textarea
          className={`${inputCls} min-h-[240px] font-mono text-[13px] leading-relaxed`}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="支持 Markdown 语法"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">封面图</label>
        <div className="flex items-center gap-3 flex-wrap">
          <input
            className={`${inputCls} flex-1 min-w-[200px]`}
            value={coverImage}
            onChange={(e) => setCoverImage(e.target.value)}
            placeholder="/uploads/xxx.png 或外部图片 URL"
          />
          <label className="btn-outline !py-2 text-sm cursor-pointer">
            {uploading ? "上传中…" : "上传图片"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        </div>
        {coverImage && (
          <img
            src={coverImage}
            alt="封面预览"
            className="mt-3 h-32 object-cover rounded-lg border border-slate-200"
          />
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-4 items-end">
        <div>
          <label className="block text-sm font-medium mb-1.5">标签（逗号分隔）</label>
          <input
            className={inputCls}
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Next.js, AI, 全栈"
          />
        </div>
        <label className="flex items-center gap-2 text-sm pb-2.5">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300"
          />
          发布（未勾选保存为草稿）
        </label>
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}

      <div className="flex items-center gap-3 pt-2">
        <button type="submit" disabled={saving} className="btn-primary text-sm">
          {saving ? "保存中…" : initial ? "保存修改" : "创建文章"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/posts")}
          className="btn-outline text-sm"
          disabled={saving}
        >
          取消
        </button>
      </div>
    </form>
  );
}
