import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";

const db = createClient({
  url: process.env.DATABASE_URL || "file:./data.db",
});

async function seed() {
  console.log("🌱 开始初始化示例数据...");

  // 1. 管理员用户（用户名唯一，幂等；已存在时不覆盖密码，保护用户改过的密码）
  const adminUsername = process.env.ADMIN_USERNAME || "gyoung";
  // .env 里 bcrypt hash 按惯例写作 \$2b\$10\$...（防 dotenv 变量展开），此处还原为 $
  const rawHash = (process.env.ADMIN_PASSWORD_HASH || "").replace(/\\\$/g, "$");
  const useEnvHash = rawHash && rawHash !== "placeholder_hash";
  const adminHash = useEnvHash ? rawHash : bcrypt.hashSync("admin123", 10);
  await db.execute({
    sql: `INSERT OR IGNORE INTO users (username, password_hash) VALUES (?, ?)`,
    args: [adminUsername, adminHash],
  });
  if (useEnvHash) {
    console.log(`  ✓ 管理员用户 (${adminUsername}，密码来自 ADMIN_PASSWORD_HASH)`);
  } else {
    console.log(`  ⚠️  管理员用户 (${adminUsername} / admin123) —— 未设置 ADMIN_PASSWORD_HASH，仅限本地开发！`);
  }

  // 2. 个人简介（id 固定为 1，幂等）
  await db.execute({
    sql: `INSERT OR IGNORE INTO profile (id, name, avatar_url, bio, skills, contacts)
          VALUES (1, ?, ?, ?, ?, ?)`,
    args: [
      "G-YOUNG",
      "https://avatars.githubusercontent.com/u/G-YOUNG01",
      "AI 程序员，专注于全栈开发与人工智能应用。热爱开源，相信技术改变世界。",
      JSON.stringify(["TypeScript", "React", "Next.js", "Node.js", "Python", "AI/ML", "Docker"]),
      JSON.stringify({ email: "hello@gyoung.xyz", github: "https://github.com/G-YOUNG01" }),
    ],
  });
  console.log("  ✓ 个人简介");

  // 3. 示例博客文章（slug 唯一，幂等）
  const posts = [
    {
      slug: "hello-world",
      title: "你好，世界",
      content:
        "<h2>欢迎来到我的个人网站</h2><p>这是第一篇博客文章，用于测试博客系统的各项功能。</p><p>你可以在后台管理页面编辑、发布或删除文章。</p><pre><code class='language-typescript'>console.log('Hello, World!');</code></pre>",
      cover_image: null,
      tags: JSON.stringify(["随笔", "建站"]),
      published: 1,
    },
    {
      slug: "ai-programming-notes",
      title: "AI 编程实践笔记",
      content:
        "<h2>AI 辅助编程的经验总结</h2><p>在日常开发中使用 AI 工具的一些心得和最佳实践。</p><ul><li>合理拆分任务</li><li>提供清晰的上下文</li><li>验证 AI 生成的代码</li></ul>",
      cover_image: null,
      tags: JSON.stringify(["AI", "编程", "效率"]),
      published: 1,
    },
  ];

  for (const post of posts) {
    await db.execute({
      sql: `INSERT OR IGNORE INTO posts (title, slug, content, cover_image, tags, published)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [post.title, post.slug, post.content, post.cover_image, post.tags, post.published],
    });
  }
  console.log(`  ✓ ${posts.length} 篇示例博客文章`);

  // 4. 示例时间线事件（slug 唯一，幂等）
  const timelines = [
    {
      slug: "start-coding",
      year: 2020,
      title: "开始学习编程",
      description: "从 Python 入门，开启编程之旅。",
      icon_type: "rocket",
      sort_order: 1,
    },
    {
      slug: "first-project",
      year: 2021,
      title: "完成第一个开源项目",
      description: "在 GitHub 上发布了第一个开源项目，获得了社区的积极反馈。",
      icon_type: "star",
      sort_order: 2,
    },
    {
      slug: "ai-journey",
      year: 2023,
      title: "深入 AI 领域",
      description: "开始系统学习机器学习和大语言模型应用开发。",
      icon_type: "brain",
      sort_order: 3,
    },
    {
      slug: "personal-site",
      year: 2026,
      title: "搭建个人网站",
      description: "使用 Next.js + SQLite 搭建了这个个人网站，展示作品和分享技术。",
      icon_type: "globe",
      sort_order: 4,
    },
  ];

  for (const t of timelines) {
    await db.execute({
      sql: `INSERT OR IGNORE INTO timelines (slug, year, title, description, icon_type, sort_order)
            VALUES (?, ?, ?, ?, ?, ?)`,
      args: [t.slug, t.year, t.title, t.description, t.icon_type, t.sort_order],
    });
  }
  console.log(`  ✓ ${timelines.length} 条时间线事件`);

  console.log("\n✅ 示例数据初始化完成！");
  if (useEnvHash) {
    console.log(`   管理员账号: ${adminUsername} / （你在 .env 中设置的密码，登录后可在工作台修改）`);
  } else {
    console.log(`   管理员账号: ${adminUsername} / admin123（默认密码，请及时修改）`);
  }
}

seed().catch(console.error);
