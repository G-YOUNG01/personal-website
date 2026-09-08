"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/**
 * 页面外壳：根据路由决定渲染哪些全局元素。
 * - 工作台（/workspace/*）：不渲染主站导航栏与页脚，由工作台自己的侧边栏布局替代
 * - 其余页面：正常渲染主站导航栏 + 页脚
 */
export default function MainShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isWorkspace = pathname.startsWith("/workspace");

  if (isWorkspace) {
    return <main>{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main className="pt-16">{children}</main>
      <Footer />
    </>
  );
}
