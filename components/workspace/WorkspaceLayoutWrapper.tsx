"use client";

import { usePathname } from "next/navigation";
import WorkspaceLayout from "./WorkspaceLayout";

/**
 * 工作台布局包装器：根据路径决定是否渲染侧边栏布局
 * - /workspace/login：不渲染侧边栏，直接渲染内容
 * - 其他 /workspace/*：渲染 WorkspaceLayout（左侧边栏 + 右侧内容）
 */
export default function WorkspaceLayoutWrapper({
  children,
  username,
  csrfToken,
}: {
  children: React.ReactNode;
  username: string;
  csrfToken: string;
}) {
  const pathname = usePathname();
  const isLogin = pathname === "/workspace/login";

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <WorkspaceLayout username={username} csrfToken={csrfToken}>
      {children}
    </WorkspaceLayout>
  );
}
