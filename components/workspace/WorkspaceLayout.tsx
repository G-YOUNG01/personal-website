import WorkspaceSidebar from "./WorkspaceSidebar";
import BackgroundGlow from "@/components/BackgroundGlow";

/**
 * 工作台布局：左侧玻璃侧边栏 + 右侧主内容区
 * 所有 /workspace/* 页面（除 login）共用此布局
 */
export default function WorkspaceLayout({
  children,
  username,
  csrfToken,
}: {
  children: React.ReactNode;
  username: string;
  csrfToken: string;
}) {
  return (
    <div className="min-h-screen relative">
      <BackgroundGlow />
      {/* 注入 CSRF token，供 client 组件读取 */}
      <meta name="csrf-token" content={csrfToken} />
      <WorkspaceSidebar username={username} csrfToken={csrfToken} />
      <main className="lg:pl-[260px] pt-16 lg:pt-0 min-h-screen">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">{children}</div>
      </main>
    </div>
  );
}
