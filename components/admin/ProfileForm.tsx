/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ProfileInitial {
  name: string;
  avatarUrl: string | null;
  bio: string | null;
  skills: string[];
  contacts: Record<string, string>;
}

const inputCls =
  "w-full px-3 py-2 rounded-lg border border-slate-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 text-sm";

const CONTACT_KEYS = ["github", "email", "wechat", "bilibili"];

export default function ProfileForm({
  csrfToken,
  initial,
}: {
  csrfToken: string;
  initial?: ProfileInitial;
}) {
  const router = useRouter();
  const [name, setName] = useState(initial?.name || "");
  const [avatarUrl, setAvatarUrl] = useState(initial?.avatarUrl || "");
  const [bio, setBio] = useState(initial?.bio || "");
  const [skills, setSkills] = useState(initial?.skills?.join(", ") || "");
  const [contacts, setContacts] = useState<Record<string, string>>(initial?.contacts || {});
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
      if (res.ok) setAvatarUrl(data.url);
      else setError(data.error || "上传失败");
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
    const cleaned: Record<string, string> = {};
    for (const [k, v] of Object.entries(contacts)) {
      if (v && v.trim()) cleaned[k] = v.trim();
    }
    const payload = {
      name,
      avatarUrl,
      bio,
      skills: skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      contacts: cleaned,
      csrfToken,
    };
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        router.push("/admin");
        router.refresh();
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
          <label className="block text-sm font-medium mb-1.5">名称 *</label>
          <input
            className={inputCls}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">头像</label>
          <div className="flex items-center gap-3">
            <input
              className={`${inputCls} flex-1`}
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="/uploads/xxx.png"
            />
            <label className="btn-outline !py-2 text-sm cursor-pointer">
              {uploading ? "…" : "上传"}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleUpload}
                disabled={uploading}
              />
            </label>
          </div>
          {avatarUrl && (
            <img
              src={avatarUrl}
              alt="头像预览"
              className="mt-3 w-20 h-20 object-cover rounded-full border border-slate-200"
            />
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">个人简介 bio</label>
        <textarea
          className={`${inputCls} min-h-[120px]`}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">技能（逗号分隔）</label>
        <input
          className={inputCls}
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder="TypeScript, React, Next.js, AI"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5">联系方式</label>
        <div className="space-y-2">
          {CONTACT_KEYS.map((k) => (
            <div key={k} className="flex items-center gap-3">
              <span className="w-20 text-sm text-muted">{k}</span>
              <input
                className={inputCls}
                value={contacts[k] || ""}
                onChange={(e) => setContacts((c) => ({ ...c, [k]: e.target.value }))}
                placeholder={
                  k === "github"
                    ? "https://github.com/G-YOUNG01"
                    : k === "email"
                      ? "hello@gyoung.xyz"
                      : ""
                }
              />
            </div>
          ))}
        </div>
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}

      <div className="flex items-center gap-3 pt-2">
        <button type="submit" disabled={saving} className="btn-primary text-sm">
          {saving ? "保存中…" : "保存简介"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="btn-outline text-sm"
          disabled={saving}
        >
          取消
        </button>
      </div>
    </form>
  );
}
