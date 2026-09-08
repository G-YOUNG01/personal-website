"use client";

import { useState } from "react";
import { useLanguage } from "@/components/LanguageProvider";

export default function AccountPage() {
  const { t } = useLanguage();

  const getCsrf = () => {
    if (typeof document === "undefined") return "";
    const meta = document.querySelector('meta[name="csrf-token"]');
    return meta ? meta.getAttribute("content") || "" : "";
  };
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwdMsg, setPwdMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [pwdLoading, setPwdLoading] = useState(false);

  // 用户名修改
  const [newUsername, setNewUsername] = useState("");
  const [userMsg, setUserMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [userLoading, setUserLoading] = useState(false);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdMsg(null);

    if (newPassword.length < 8) {
      setPwdMsg({ type: "error", text: "新密码至少 8 位" });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdMsg({ type: "error", text: "两次输入的新密码不一致" });
      return;
    }
    if (newPassword === oldPassword) {
      setPwdMsg({ type: "error", text: "新密码不能与旧密码相同" });
      return;
    }

    setPwdLoading(true);
    try {
      const res = await fetch("/api/workspace/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "password",
          oldPassword,
          newPassword,
          csrfToken: getCsrf(),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setPwdMsg({ type: "success", text: data.message || "密码修改成功" });
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPwdMsg({ type: "error", text: data.error || "修改失败" });
      }
    } catch {
      setPwdMsg({ type: "error", text: "网络错误，请重试" });
    } finally {
      setPwdLoading(false);
    }
  };

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserMsg(null);

    if (newUsername.length < 2) {
      setUserMsg({ type: "error", text: "用户名至少 2 位" });
      return;
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(newUsername)) {
      setUserMsg({ type: "error", text: "用户名只能包含字母、数字、下划线和连字符" });
      return;
    }

    setUserLoading(true);
    try {
      const res = await fetch("/api/workspace/account", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "username",
          newUsername,
          csrfToken: getCsrf(),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setUserMsg({ type: "success", text: `用户名修改成功，新用户名：${data.username}` });
        setNewUsername("");
      } else {
        setUserMsg({ type: "error", text: data.error || "修改失败" });
      }
    } catch {
      setUserMsg({ type: "error", text: "网络错误，请重试" });
    } finally {
      setUserLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">{t.workspace.account}</h1>
        <p className="text-muted text-sm">修改登录密码和用户名</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 修改密码 */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">修改密码</h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">当前密码</label>
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/60 dark:bg-white/10 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">新密码</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="至少 8 位"
                className="w-full px-4 py-2.5 rounded-xl bg-white/60 dark:bg-white/10 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">确认新密码</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-white/60 dark:bg-white/10 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                required
              />
            </div>
            {pwdMsg && (
              <div
                className={`text-sm px-3 py-2 rounded-lg ${
                  pwdMsg.type === "success"
                    ? "bg-green-500/10 text-green-600 dark:text-green-400"
                    : "bg-red-500/10 text-red-600 dark:text-red-400"
                }`}
              >
                {pwdMsg.text}
              </div>
            )}
            <button type="submit" className="btn-primary text-sm w-full" disabled={pwdLoading}>
              {pwdLoading ? "修改中..." : "确认修改密码"}
            </button>
          </form>
        </div>

        {/* 修改用户名 */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold mb-4">修改用户名</h2>
          <form onSubmit={handleUsernameSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">新用户名</label>
              <input
                type="text"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="字母、数字、下划线、连字符"
                className="w-full px-4 py-2.5 rounded-xl bg-white/60 dark:bg-white/10 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                required
              />
              <p className="text-xs text-muted mt-1.5">修改后需要使用新用户名登录</p>
            </div>
            {userMsg && (
              <div
                className={`text-sm px-3 py-2 rounded-lg ${
                  userMsg.type === "success"
                    ? "bg-green-500/10 text-green-600 dark:text-green-400"
                    : "bg-red-500/10 text-red-600 dark:text-red-400"
                }`}
              >
                {userMsg.text}
              </div>
            )}
            <button type="submit" className="btn-primary text-sm w-full" disabled={userLoading}>
              {userLoading ? "修改中..." : "确认修改用户名"}
            </button>
          </form>

          <div className="mt-6 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
            <h3 className="text-sm font-medium mb-2">安全提示</h3>
            <ul className="text-xs text-muted space-y-1">
              <li>• 密码使用 bcrypt 哈希存储，无法逆向还原</li>
              <li>• 修改密码后，当前会话保持有效，其他设备需重新登录</li>
              <li>• 建议使用强密码，包含大小写字母、数字和特殊字符</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
