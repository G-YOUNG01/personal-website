import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { sessionOptions, type SessionData } from "./config";
import { randomUUID } from "crypto";

export async function getSession() {
  const cookieStore = await cookies();
  // Next.js RequestCookies 与 iron-session CookieStore 运行时兼容，类型断言绕过
  return getIronSession<SessionData>(cookieStore as never, sessionOptions);
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session.isAdmin) {
    return null;
  }
  return session;
}

export function generateCsrfToken() {
  return randomUUID();
}

// 登录限流（内存存储，软限流，重启后重置）
const loginAttempts = new Map<string, { count: number; firstAttempt: number }>();

export function checkLoginRateLimit(ip: string): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 分钟窗口
  const maxAttempts = 5;

  const record = loginAttempts.get(ip);

  if (!record || now - record.firstAttempt > windowMs) {
    loginAttempts.set(ip, { count: 1, firstAttempt: now });
    return { allowed: true, retryAfter: 0 };
  }

  if (record.count >= maxAttempts) {
    const retryAfter = Math.ceil((windowMs - (now - record.firstAttempt)) / 1000);
    return { allowed: false, retryAfter };
  }

  record.count++;
  return { allowed: true, retryAfter: 0 };
}

export function resetLoginRateLimit(ip: string) {
  loginAttempts.delete(ip);
}
