"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-gradient mb-4">出错了</h1>
      <p className="text-muted mb-8 max-w-md">
        页面加载时出现了问题，请稍后重试。
      </p>
      <div className="flex gap-4">
        <button onClick={reset} className="btn-primary">
          重试
        </button>
        <a href="/" className="btn-outline">
          返回首页
        </a>
      </div>
    </div>
  );
}
