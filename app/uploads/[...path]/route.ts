import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

// 开发环境通过本路由访问 /uploads/ 下的上传图片；
// 生产环境由 Nginx 直接 alias 该目录（见 nginx.conf），不走 Next.js。
export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const { path: parts } = await params;
  const root = path.join(process.cwd(), "uploads");
  const full = path.normalize(path.join(root, parts.join("/")));
  if (!full.startsWith(root + path.sep)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const data = await readFile(full).catch(() => null);
  if (!data) return new NextResponse("Not Found", { status: 404 });

  const ext = path.extname(full).slice(1).toLowerCase();
  const mime: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
  };
  return new NextResponse(data, {
    headers: {
      "Content-Type": mime[ext] || "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
