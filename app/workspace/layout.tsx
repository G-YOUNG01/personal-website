import { getSession } from "@/lib/auth/session";
import WorkspaceLayoutWrapper from "@/components/workspace/WorkspaceLayoutWrapper";

export const dynamic = "force-dynamic";

/**
 * 工作台根布局：获取 session，统一包裹所有 /workspace/* 页面
 * - 登录页由 wrapper 判断不渲染侧边栏
 * - 未登录重定向由各页面自行处理（redirect("/workspace/login")）
 */
export default async function WorkspaceRootLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <WorkspaceLayoutWrapper username={session.username || ""} csrfToken={session.csrfToken || ""}>
      {children}
    </WorkspaceLayoutWrapper>
  );
}
