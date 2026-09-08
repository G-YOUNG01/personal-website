"use client";

export default function AdminDeleteButton({
  apiPath,
  id,
  csrfToken,
}: {
  apiPath: string;
  id: number;
  csrfToken: string;
}) {
  async function onDelete() {
    if (!window.confirm("确定删除？此操作不可恢复。")) return;
    try {
      const res = await fetch(`${apiPath}/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csrfToken }),
      });
      if (res.ok) {
        window.location.reload();
      } else {
        const data = await res.json().catch(() => null);
        window.alert(data?.error || "删除失败");
      }
    } catch {
      window.alert("网络错误，删除失败");
    }
  }

  return (
    <button
      type="button"
      onClick={onDelete}
      className="px-3 py-1.5 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
    >
      删除
    </button>
  );
}
