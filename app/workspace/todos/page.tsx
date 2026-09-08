"use client";

import { useEffect, useState, useCallback } from "react";
import { useLanguage } from "@/components/LanguageProvider";

interface Todo {
  id: number;
  title: string;
  category: string | null;
  priority: "low" | "medium" | "high";
  dueDate: string | null;
  note: string | null;
  sortOrder: number;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

const priorityColors: Record<string, string> = {
  high: "bg-red-500/15 text-red-600 dark:text-red-400",
  medium: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-400",
  low: "bg-green-500/15 text-green-600 dark:text-green-400",
};

const priorityLabels: Record<string, string> = {
  high: "高",
  medium: "中",
  low: "低",
};

export default function TodosPage() {
  const { t } = useLanguage();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<"all" | "active" | "completed">("all");

  // 表单状态
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [dueDate, setDueDate] = useState("");
  const [note, setNote] = useState("");

  const fetchTodos = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/workspace/todos");
      const data = await res.json();
      setTodos(data.todos || []);
    } catch {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(() => fetchTodos());
    return () => cancelAnimationFrame(id);
  }, [fetchTodos]);

  const getCsrf = () => {
    if (typeof document === "undefined") return "";
    const meta = document.querySelector('meta[name="csrf-token"]');
    return meta ? meta.getAttribute("content") || "" : "";
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const res = await fetch("/api/workspace/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          category: category.trim() || null,
          priority,
          dueDate: dueDate || null,
          note: note.trim() || null,
          csrfToken: getCsrf(),
        }),
      });
      if (res.ok) {
        setTitle("");
        setCategory("");
        setPriority("medium");
        setDueDate("");
        setNote("");
        setShowForm(false);
        fetchTodos();
      }
    } catch {
      alert("创建失败");
    }
  };

  const toggleComplete = async (todo: Todo) => {
    try {
      await fetch(`/api/workspace/todos/${todo.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !todo.completed, csrfToken: getCsrf() }),
      });
      fetchTodos();
    } catch {
      alert("操作失败");
    }
  };

  const deleteTodo = async (id: number) => {
    if (!confirm("确定删除这个待办吗？")) return;
    try {
      await fetch(`/api/workspace/todos/${id}`, {
        method: "DELETE",
        headers: { "X-CSRF-Token": getCsrf() },
      });
      fetchTodos();
    } catch {
      alert("删除失败");
    }
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">{t.workspace.todos}</h1>
          <p className="text-muted text-sm">
            {activeCount} 项待完成 · {completedCount} 项已完成
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary text-sm">
          {showForm ? "取消" : "+ 新建待办"}
        </button>
      </div>

      {/* 筛选 */}
      <div className="flex gap-2 mb-4">
        {(["all", "active", "completed"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === f
                ? "bg-blue-500/15 text-primary-light"
                : "glass-card text-muted hover:text-foreground"
            }`}
          >
            {f === "all" ? "全部" : f === "active" ? "进行中" : "已完成"}
          </button>
        ))}
      </div>

      {/* 新建表单 */}
      {showForm && (
        <form onSubmit={handleCreate} className="card p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">新建待办</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">标题 *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="待办内容"
                className="w-full px-4 py-2.5 rounded-xl bg-white/60 dark:bg-white/10 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                required
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">分类</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="如：工作、学习"
                  className="w-full px-4 py-2.5 rounded-xl bg-white/60 dark:bg-white/10 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">优先级</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as "low" | "medium" | "high")}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/60 dark:bg-white/10 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                >
                  <option value="high">高</option>
                  <option value="medium">中</option>
                  <option value="low">低</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">截止日期</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/60 dark:bg-white/10 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">备注</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="详细说明（可选）"
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl bg-white/60 dark:bg-white/10 border border-slate-200 dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/30 resize-none"
              />
            </div>
            <button type="submit" className="btn-primary text-sm">
              创建待办
            </button>
          </div>
        </form>
      )}

      {/* 待办列表 */}
      {loading ? (
        <div className="card p-10 text-center text-muted">加载中...</div>
      ) : filteredTodos.length === 0 ? (
        <div className="card p-10 text-center text-muted">
          {filter === "all" ? "还没有待办，点击「新建待办」开始" : "没有符合条件的待办"}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTodos.map((todo) => (
            <div
              key={todo.id}
              className={`card p-4 flex items-start gap-3 transition-all ${
                todo.completed ? "opacity-60" : ""
              }`}
            >
              <button
                onClick={() => toggleComplete(todo)}
                className={`mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center flex-none transition-all ${
                  todo.completed
                    ? "bg-blue-500 border-blue-500 text-white"
                    : "border-slate-300 dark:border-white/30 hover:border-blue-500"
                }`}
              >
                {todo.completed && <span className="text-xs">✓</span>}
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`font-medium ${todo.completed ? "line-through text-muted" : ""}`}
                  >
                    {todo.title}
                  </span>
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${priorityColors[todo.priority]}`}
                  >
                    {priorityLabels[todo.priority]}
                  </span>
                  {todo.category && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-600 dark:text-slate-300">
                      {todo.category}
                    </span>
                  )}
                  {todo.dueDate && (
                    <span className="text-[11px] text-muted">
                      📅 {new Date(todo.dueDate).toLocaleDateString("zh-CN")}
                    </span>
                  )}
                </div>
                {todo.note && <p className="text-sm text-muted mt-1 line-clamp-2">{todo.note}</p>}
              </div>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-muted hover:text-red-500 transition-colors flex-none p-1"
                title="删除"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
