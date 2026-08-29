import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  GITHUB_TOKEN: z.string().default("ghp_placeholder"),
  GITHUB_USERNAME: z.string().default("G-YOUNG01"),
  ADMIN_USERNAME: z.string().default("admin"),
  ADMIN_PASSWORD_HASH: z.string().default("placeholder_hash"),
  SESSION_SECRET: z.string().default("placeholder_session_secret_at_least_32_characters_long"),
  SITE_URL: z.string().default("http://localhost:3000"),
  DATABASE_URL: z.string().default("file:./data.db"),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:");
  const issues = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`);
  console.error(issues.join("\n"));
  throw new Error("Invalid environment variables");
}

export const env = parsed.data;

// 运行时校验关键配置（构建时用占位值通过）
export function assertRuntimeConfig() {
  if (env.ADMIN_PASSWORD_HASH === "placeholder_hash") {
    throw new Error("ADMIN_PASSWORD_HASH is not configured. Run `npm run hash-password` to generate.");
  }
  if (env.GITHUB_TOKEN === "ghp_placeholder") {
    console.warn("⚠️ GITHUB_TOKEN is not configured, GitHub API will be rate-limited");
  }
}
