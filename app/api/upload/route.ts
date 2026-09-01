import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { fileTypeFromBuffer } from "file-type";
import { requireAdminApi, csrfValid } from "@/lib/admin-api";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

export async function POST(request: Request) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.unauthorized;

  const form = await request.formData().catch(() => null);
  if (!form) {
    return NextResponse.json({ error: "请求格式错误" }, { status: 400 });
  }
  if (!csrfValid(auth.session, { csrfToken: form.get("csrfToken") })) {
    return NextResponse.json({ error: "CSRF 校验失败" }, { status: 403 });
  }
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "未找到上传文件" }, { status: 400 });
  }
  if (file.size === 0) {
    return NextResponse.json({ error: "文件为空" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "文件过大，最大 5MB" }, { status: 413 });
  }

  // 魔数校验真实文件类型（防止伪造 Content-Type）
  const buffer = Buffer.from(await file.arrayBuffer());
  const type = await fileTypeFromBuffer(buffer);
  if (!type || !ALLOWED.has(type.mime)) {
    return NextResponse.json({ error: "仅支持 JPG / PNG / WebP / GIF 图片" }, { status: 400 });
  }

  // 文件名使用随机 UUID，避免路径穿越与覆盖
  const filename = `${randomUUID()}.${type.ext}`;
  const uploadDir = path.join(process.cwd(), "uploads");
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), buffer);

  return NextResponse.json({ url: `/uploads/${filename}`, mime: type.mime });
}
