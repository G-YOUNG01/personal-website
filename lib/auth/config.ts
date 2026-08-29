import type { SessionOptions } from "iron-session";
import { env } from "@/lib/env";

export interface SessionData {
  userId?: number;
  username?: string;
  isAdmin?: boolean;
  csrfToken?: string;
}

const isProd = env.NODE_ENV === "production";

export const sessionOptions: SessionOptions = {
  cookieName: "session",
  password: env.SESSION_SECRET,
  ttl: 60 * 60 * 24 * 7, // 7 天（秒）
  cookieOptions: {
    secure: isProd,
    httpOnly: true,
    sameSite: "lax",
  },
};
