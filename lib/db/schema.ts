import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

// 管理员用户
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// 博客文章
export const posts = sqliteTable("posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  coverImage: text("cover_image"),
  tags: text("tags", { mode: "json" }).$type<string[]>().default([]),
  published: integer("published", { mode: "boolean" }).notNull().default(false),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

// 经历时间线
export const timelines = sqliteTable("timelines", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  year: integer("year").notNull(),
  title: text("title").notNull(),
  description: text("description"),
  iconType: text("icon_type"),
  sortOrder: integer("sort_order").notNull().default(0),
});

// 个人简介（单行配置表，id 固定为 1）
export const profile = sqliteTable("profile", {
  id: integer("id").primaryKey().default(1),
  name: text("name").notNull(),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  skills: text("skills", { mode: "json" }).$type<string[]>().default([]),
  contacts: text("contacts", { mode: "json" }).$type<Record<string, string>>().default({}),
});

// 操作日志（后台增删改审计）
export const auditLogs = sqliteTable("audit_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  action: text("action").notNull(),
  targetType: text("target_type"),
  targetId: integer("target_id"),
  detail: text("detail", { mode: "json" }).$type<Record<string, unknown>>(),
  ip: text("ip"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export type User = typeof users.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type Timeline = typeof timelines.$inferSelect;
export type Profile = typeof profile.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;
