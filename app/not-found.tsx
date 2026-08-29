import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-8xl font-bold text-gradient mb-4">404</h1>
      <p className="text-xl text-muted mb-2">页面未找到</p>
      <p className="text-muted mb-8 max-w-md">你访问的页面可能已被移动或删除。</p>
      <Link href="/" className="btn-primary">
        返回首页
      </Link>
    </div>
  );
}
