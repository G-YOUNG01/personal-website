# AI Programmer 个人网站

一个面向 **AI 程序员** 的动态炫酷个人网站。集成个人简介、GitHub 作品展示、博客、经历时间线四大板块，支持**后台管理页在线添加/编辑内容**，部署在自有的阿里云 Linux 服务器上，域名 **gyoung.xyz**，HTTPS 访问。

---

## 一、项目定位

- **风格**：暗色炫酷 + 渐变光效 + 滚动动画（AI 程序员科技风）
- **内容管理**：动态后台（浏览器内增删改查，无需改代码）
- **作品展示**：GitHub 仓库数据服务端 `revalidate` 缓存，过期后下次访问触发后台刷新
- **部署**：阿里云 Linux 服务器，PM2 + Nginx，域名 gyoung.xyz，HTTPS 访问

## 二、技术栈

| 层 | 技术 | 说明 |
|---|---|---|
| 前端框架 | Next.js 15（React，App Router） | 前端展示 + 后端 API 一体 |
| 样式 | Tailwind CSS + next-themes | 快速构建 UI，内置暗色/亮色主题切换 |
| 动画 | Framer Motion | 滚动动效、元素渐入、交互动效（尊重 reduced-motion） |
| 3D 元素 | Three.js（`next/dynamic` 懒加载） | 仅首页使用，按需加载，控制首屏体积 |
| 图片优化 | next/image | 自动压缩、懒加载，配置 remotePatterns |
| 字体 | next/font | 自托管字体，避免 FOIT |
| ORM | Drizzle ORM | 轻量、SQLite 支持好、迁移可控 |
| 数据库 | SQLite（WAL 模式） | 单文件数据库，无需额外数据库服务 |
| 校验 | Zod | 环境变量运行时校验 + API 请求体校验 |
| 认证 | iron-session | 固定管理员账号，加密 session cookie，中间件拦截 `/admin/*` |
| 密码哈希 | bcryptjs | 管理员密码 bcrypt 哈希存储与校验 |
| XSS 过滤 | sanitize-html | 博客正文 HTML 渲染前白名单过滤 |
| 富文本 | Tiptap | 头尾分离、扩展性强的编辑器 |
| 代码高亮 | Shiki | 博客正文代码语法高亮 |
| 工具库 | uuid | 上传文件重命名，防路径遍历 |
| 文件类型检测 | file-type | 上传文件真实类型检测（读文件头魔数），替代手写魔数表 |
| 数据源 | GitHub REST API | 服务端拉取仓库数据，fetch `revalidate` 缓存 |
| 代码规范 | ESLint + Prettier + TypeScript strict | 统一代码风格，husky + lint-staged 提交前检查 |
| 部署 | Node.js + PM2（fork 模式）+ pm2-logrotate + Nginx | 守护进程 + 日志轮转 + 反向代理 |

## 三、架构设计（关键决策）

### 3.1 SQLite 并发与持久化方案

SQLite 是单进程写入锁数据库，PM2 cluster 模式下多进程并发写入会触发 `SQLITE_BUSY`。

- **PM2 使用 `fork` 模式**（非 cluster），单进程运行
- **启用 WAL 模式**（`PRAGMA journal_mode=WAL`），提升并发读性能
- **数据库路径强制绝对路径**：`path.resolve(process.cwd(), 'data.db')`，避免 PM2 不同 cwd 下数据库文件建到错误位置
- 写入操作通过 Drizzle 统一管理，必要时加写入队列
- 个人网站低并发场景下此方案完全够用；后续高并发可平滑迁移 PostgreSQL / Turso

**WAL 模式下的一致性备份**：不能直接 `cp data.db`（WAL 模式有 `-wal`、`-shm` 伴生文件，直接复制可能得到不一致状态）。必须用 SQLite 官方备份 API：
```bash
sqlite3 data.db ".backup '/backup/data-$(date +%Y%m%d).db'"
# 或
sqlite3 data.db "VACUUM INTO '/backup/data-$(date +%Y%m%d).db'"
```

### 3.2 GitHub 作品数据缓存策略

作品集页面在服务端渲染时直接调用 GitHub API，用 Next.js `fetch` 的 `revalidate` 做服务端缓存：

```ts
const repos = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos`, {
  headers: { Authorization: `Bearer ${GITHUB_TOKEN}` },
  next: { revalidate: 300 }, // 服务端缓存 5 分钟，过期后下次访问触发后台刷新
});
```

- **用 `/users/{username}/repos` 而非 `/user/repos`**：后者返回的是 token 拥有者的仓库，会让 `GITHUB_USERNAME` 变成死配置。
- **不建缓存表、不跑定时任务**。API 失败或限流时，Next.js 自动返回上一次 revalidate 缓存，作品集不会空白——降级逻辑由框架内置。
- **首次加载降级**：首次部署（无缓存）或缓存过期后重新拉取时，若 GitHub API 不可用，页面需显示友好错误提示 + 重试按钮，而非白屏。（fetch `revalidate` 缓存持久化在磁盘 `.next/cache`，`pm2 reload` 不会清空；但每次 `npm run build` 会重建 `.next` 目录，缓存随之清空，部署后首次访问需重新拉取）
- 配置 `GITHUB_TOKEN`（PAT），API 配额从 60 次/小时提升到 5000 次/小时。

### 3.3 后台认证与安全

- **iron-session**：固定管理员账号，密码 bcrypt 哈希存储，登录成功写入加密 session cookie
- **Cookie 属性**：`httpOnly: true`、`sameSite: 'lax'`、设置 `maxAge` 过期时间；`secure` 按运行环境静态判断（iron-session 只接受静态配置对象，不支持运行时动态判断）：
  ```ts
  // lib/auth/config.ts
  const isProd = process.env.NODE_ENV === 'production';
  export const sessionOptions = {
    cookieName: "session",
    password: process.env.SESSION_SECRET!,
    cookieOptions: { secure: isProd, httpOnly: true, sameSite: 'lax' as const, maxAge: 60 * 60 * 24 * 7 },
  };
  ```
  开发时 `http://localhost:3000` 非 HTTPS，`secure: false` 才能正常存 session。
- **密码哈希生成**：提供 `scripts/hash-password.js`，运行后生成 bcrypt 哈希填入环境变量，避免用户手动生成
- **路由中间件**（`middleware.ts`）：拦截 `/admin/*`，未认证重定向登录页；必须显式配置 `matcher` 限定范围，避免每个请求都跑中间件：
  ```ts
  // middleware.ts
  export const config = { matcher: ['/admin/:path*'] };
  ```
- **CSRF 防护**：采用 double-submit cookie 模式——登录时下发 csrf cookie，写请求时 header 携带同样的值，服务端比对；或校验 Origin/Referer 头只允许本站域名
- **登录限流**：同 IP 连续失败延迟递增，防爆破（计数器存内存，PM2 reload 后重置，属**软限流**；个人网站够用，如需持久化可改用 SQLite 存最近 N 分钟失败记录）
- **操作日志**：后台增删改操作记录日志，防误删可追溯
- **可选 IP 白名单**：仅允许指定 IP 访问 `/admin`

### 3.4 安全响应头

在 `next.config.js` 的 `headers()` 中统一配置（HTTPS 环境下完整生效）：
- `Content-Security-Policy`：CSP（Three.js + 内联样式需仔细配置 `'unsafe-inline'` 取舍；当前阶段暂用 `'unsafe-inline'`，后续可优化为 `nonce` 模式——在 `headers()` 中动态生成 nonce 并注入页面，实现 `script-src 'nonce-{随机值}'`，彻底干掉 `unsafe-inline`）
- `X-Frame-Options: DENY`：防点击劫持
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy`
- `Strict-Transport-Security`（HTTPS 下启用 HSTS）

### 3.5 上传文件处理

后台上传的封面图、正文插图存储在 `uploads/` 目录（不进 Git，纳入备份）。

**访问链路**：`uploads/` 不在 `public/` 下，Next.js 不会自动 serve。生产环境由 **Nginx 直接 alias** 该目录（性能最好），开发环境用 `/api/uploads/*` 静态文件路由兜底。

**上传安全校验**：
- 文件大小限制（如单图 ≤ 5MB）
- 格式白名单（仅允许 jpg/png/webp/gif 等图片格式）
- 真实文件类型检测：用 `file-type` 包读文件头魔数判断真实类型，替代手写魔数表，防伪造 Content-Type
- 文件名重命名（UUID），防路径遍历

## 四、功能模块

### 1. 首页 / 关于我
- 头像（next/image）、一句话定位（打字机效果）、个人简介
- 技能标签、联系方式
- 3D 元素 / 粒子光效背景（懒加载）
- 尊重 `prefers-reduced-motion`：用户系统开启"减少动画"时自动降级动效

### 2. 作品集（GitHub 数据）
- 服务端渲染的仓库列表（账号：**G-YOUNG01**），fetch `revalidate` 服务端缓存
- 卡片展示：仓库名称、简介、主要语言（带语言颜色映射）、Star 数、最近更新时间
- 点击卡片跳转对应 GitHub 仓库
- 支持排序（更新时间 / Star 数）与关键词筛选（纯客户端操作，基于一次性拉取的仓库数组做前端过滤）
- 仓库较多时支持分页或虚拟滚动

### 3. 博客
- 后台 Tiptap 编辑器在线撰写、发布文章
- 文章列表（分页）+ 详情页，支持标签、封面
- 字段：标题、slug、正文、封面图、标签、发布状态、发布时间、更新时间
- **代码高亮**：Shiki 渲染正文代码块
- **阅读时间**：自动估算文章阅读时长
- **RSS Feed**：`/rss.xml` 订阅，生成符合 RSS 2.0 规范的 XML，`robots.ts` 中声明 RSS 路径
- Markdown/HTML 渲染时做 sanitize（DOMPurify / sanitize-html），防 XSS；**白名单必须同时放行 Shiki 代码块的 class/style**，否则高亮被洗掉或 XSS 漏进来

### 4. 经历时间线
- 按时间轴展示教育、工作、项目、成就等里程碑
- 后台可视化维护：年份、标题、描述、图标类型、排序

### 5. 后台管理（/admin）
- 仅管理员登录使用
- 可视化管理：博客文章、时间线事件、个人简介/头像/联系方式
- 操作日志查看

## 五、数据模型

```sql
-- 管理员用户
users:
  id, username, password_hash, created_at

-- 博客文章
posts:
  id, title, slug, content, cover_image, tags(JSON),
  published(BOOLEAN), created_at, updated_at

-- 经历时间线
timelines:
  id, year, title, description, icon_type, sort_order

-- 个人简介（单行配置表，全站一份，id 固定为 1）
profile:
  id, name, avatar_url, bio, skills(JSON), contacts(JSON)

-- 操作日志（后台增删改审计）
audit_logs:
  id, action, target_type, target_id, detail(JSON), ip, created_at
```

**设计原则**：站点配置（profile）与内容数据（posts / timelines）分离，避免改配置污染内容表。

**数据约束**：`posts.slug` 加 UNIQUE 约束；`profile` 表 `id` 固定为 1，保证只有一条记录。

**时间存储**：所有时间字段统一存 UTC（INTEGER unix 时间戳，Drizzle schema 中用 `integer('created_at', { mode: 'timestamp' })`，注意是**秒级**时间戳，手动写入时 `Date.now()` 需除以 1000），页面展示时在客户端用 `Intl.DateTimeFormat` 转访客本地时区，避免服务器/访客时区混乱。

## 六、API 层设计

```
app/api/
├── auth/              # 登录 / 登出（session 会话）
├── blog/              # 博客 CRUD（需认证 + Zod 校验）
├── timeline/          # 时间线 CRUD（需认证 + Zod 校验）
├── profile/           # 个人简介 CRUD（需认证 + Zod 校验）
├── upload/            # 图片上传（需认证 + 格式/大小校验）
├── uploads/[...path]  # 上传文件静态访问路由（开发环境兜底，生产由 Nginx alias）
└── health/            # 健康检查端点
```

**请求校验**：所有写 API 的请求体用 Zod schema 校验，校验失败返回 400，防止脏数据入库。

健康检查端点：
```ts
// app/api/health/route.ts
export async function GET() {
  return Response.json({ status: "ok", timestamp: Date.now() });
}
```

## 七、目录结构

```
personal-website/
├── app/
│   ├── page.tsx            # 首页（关于我）
│   ├── works/              # 作品集
│   ├── blog/               # 博客列表 + 详情
│   ├── timeline/           # 经历时间线
│   ├── admin/              # 后台管理页（需认证）
│   ├── api/                # API 路由
│   ├── error.tsx           # 错误边界
│   ├── global-error.tsx    # 全局错误
│   ├── loading.tsx         # 加载态
│   ├── not-found.tsx       # 404 页面
│   ├── sitemap.ts          # 动态 sitemap
│   └── robots.ts           # robots.txt
├── components/             # 通用组件（导航、卡片、动画等）
├── lib/
│   ├── db/                 # Drizzle 数据库连接 + schema
│   ├── auth/               # iron-session 配置 + 登录校验
│   ├── env/                # Zod 环境变量校验
│   └── github/             # GitHub API 拉取（fetch revalidate）
├── drizzle/                # 数据库迁移文件
├── scripts/
│   ├── hash-password.js    # 生成管理员密码 bcrypt 哈希
│   ├── seed.js             # 初始化示例数据（幂等）
│   ├── backup.sh           # SQLite 一致性备份 + uploads 备份
│   └── deploy.sh           # 部署脚本（git pull → ci → migrate → build → reload）
├── uploads/                # 后台上传的图片（不进 Git，纳入备份）
├── public/                 # 静态资源
├── middleware.ts           # iron-session 路由保护中间件
├── drizzle.config.ts       # Drizzle 数据库迁移配置
├── ecosystem.config.js     # PM2 配置（fork 模式、端口、环境变量、日志）
├── nginx.conf              # Nginx 反向代理配置（反向代理 + 静态资源 + uploads alias + gzip）
├── .gitignore              # 忽略 /node_modules/ / .env / data.db / data.db-* / /uploads/ / .next/
├── .env.example            # 环境变量模板
├── .eslintrc.json          # ESLint 配置
├── .prettierrc             # Prettier 配置
├── README.md
└── package.json
```

## 八、代码规范与类型安全

- **TypeScript strict 模式**：`strict: true`，禁止隐式 any
- **ESLint**：代码质量检查，next/core-web-vitals 规则集
- **Prettier**：统一代码格式化
- **husky + lint-staged**：Git 提交前自动 lint + format
- **Zod 环境变量校验**（`lib/env.ts`）：启动时校验所有必需环境变量，缺失则直接报错退出，避免运行到一半才出问题
- **Zod API 校验**：所有写接口请求体用 Zod schema 校验
- **`package-lock.json` 必须提交到 Git**，`node_modules` 不提交（`npm ci` 依赖 lock 文件）

## 九、开发脚本

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "format": "prettier --write .",
    "setup": "npm install && npx drizzle-kit migrate",
    "seed": "node scripts/seed.js",
    "hash-password": "node scripts/hash-password.js",
    "deploy": "bash scripts/deploy.sh"
  }
}
```

## 十、环境变量

`.env.example`：
```env
# GitHub
GITHUB_TOKEN=ghp_xxxxxxxxxxxx
GITHUB_USERNAME=G-YOUNG01

# 认证
ADMIN_PASSWORD_HASH=$2b$10$xxxxxxxxxxxx
SESSION_SECRET=xxxxxxxxxxxx        # iron-session 加密密钥（>= 32 字符）

# 站点（OG 图 / sitemap / RSS / canonical 的绝对地址）
SITE_URL=https://gyoung.xyz

# 数据库（绝对路径，由代码解析 process.cwd()）
DATABASE_FILENAME=data.db

# 运行环境
NODE_ENV=production
```

> 所有敏感配置走环境变量，不进 Git。启动时由 Zod 校验，缺失即报错退出。

## 十一、部署方案（阿里云 Linux）

> 生产环境通过域名 gyoung.xyz + HTTPS 访问；开发测试阶段可直接用服务器 IP + 端口。

### 11.1 访问策略

| 环境 | 方案 | 说明 |
|---|---|---|
| **开发/测试** | `http://服务器IP:端口` | 本地或服务器测试用 |
| **生产** | `https://gyoung.xyz` | Nginx 反代 + Let's Encrypt 证书，80/443 端口 |

> 国内云服务器使用域名访问 80/443 端口需完成 ICP 备案，此为服务器接入前提，不在本文档范围内。

### 11.2 PM2 配置（ecosystem.config.js）
```js
module.exports = {
  apps: [{
    name: "personal-website",
    script: "node_modules/next/dist/bin/next",
    args: "start -p 3000",
    exec_mode: "fork",          // 必须 fork，SQLite 单进程写入
    instances: 1,
    cwd: "/var/www/personal-website",
    env: { NODE_ENV: "production" },
    error_file: "./logs/error.log",
    out_file: "./logs/out.log",
    log_date_format: "YYYY-MM-DD HH:mm:ss"
  }]
};
```

**日志轮转**：安装 `pm2-logrotate`，防止日志无限增长占满磁盘：
```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### 11.3 Nginx 配置（nginx.conf，生产环境使用）

```nginx
server {
    listen 80;
    server_name gyoung.xyz;
    # Let's Encrypt 验证路径
    location /.well-known/acme-challenge/ {
        root /var/www/certbot;
    }
    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name gyoung.xyz;

    ssl_certificate     /etc/letsencrypt/live/gyoung.xyz/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/gyoung.xyz/privkey.pem;

    # 强制 HTTPS（HSTS），与 next.config.js 中的安全响应头互补
    add_header Strict-Transport-Security "max-age=31536000" always;

    # 上传文件大小限制
    client_max_body_size 10M;

    # gzip 压缩
    gzip on;
    gzip_types text/css application/javascript application/json image/svg+xml;

    # 静态资源缓存（Next.js 构建产物）
    location /_next/static/ {
        alias /var/www/personal-website/.next/static/;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    # 上传文件直接由 Nginx 提供（性能最好）
    location /uploads/ {
        alias /var/www/personal-website/uploads/;
        expires 7d;
    }

    # 反向代理到 Next.js
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**HTTPS 证书（Let's Encrypt，免费）**：
```bash
# 安装 certbot
apt install certbot python3-certbot-nginx
# 只申请证书不修改 Nginx 配置（Nginx 统一用项目中的 nginx.conf）
certbot certonly --nginx -d gyoung.xyz
# 自动续期（certbot 自带 systemd timer）
certbot renew --dry-run
```

### 11.4 部署流程（scripts/deploy.sh）
```bash
#!/bin/bash
set -e  # 任何一步失败即中止
cd /var/www/personal-website
# 迁移前先备份当前数据库，万一迁移出问题可恢复
sqlite3 data.db ".backup '/backup/pre-migrate-$(date +%Y%m%d_%H%M%S).db'"
git pull origin main
npm ci                  # 干净安装依赖（需要 package-lock.json，且与 package.json 一致）
npx drizzle-kit migrate # 数据库迁移（schema 变更时；无新 migration 时仅检查版本，基本无开销；失败则中止部署，防止脏数据）
npm run build
pm2 reload personal-website --update-env
echo "部署完成"
```

**回滚方案**：代码问题 `git revert <commit>` 后重新跑 deploy.sh；PM2 `reload` 保证零停机切换。**注意数据库迁移是 forward-only**：`drizzle-kit migrate` 只会前进不回退，回滚代码后 schema 仍是新版，若新旧代码不兼容，需先用 11.7 的备份恢复数据库再回滚代码。

### 11.5 部署步骤（首次）

**服务器准备：**
1. 服务器安装 Node.js（≥20.9 LTS）、Git、PM2、sqlite3 命令行工具（备份脚本依赖，`apt install sqlite3` / `yum install sqlite`）、Nginx
2. 配置防火墙（firewalld/ufw）：放行 SSH、80、443；开发测试阶段可临时放行应用端口
3. 云服务商安全组同步放行对应端口

**应用部署：**
4. 代码通过 Git 管理，服务器 `git clone` 到 `/var/www/personal-website`
5. 配置 `.env`（参考 `.env.example`，用 `npm run hash-password` 生成密码哈希）
6. `npm run setup` 安装依赖 + 初始化数据库
7. `npm run seed` 写入示例数据（幂等：只补缺失行，不覆盖已有内容，可安全重跑）
8. `npm run build` 构建生产版本
9. `pm2 start ecosystem.config.js` 启动
10. `pm2 save` + `pm2 startup` 配置开机自启

**生产环境（域名 + HTTPS）：**
11. 域名解析到服务器 IP（添加 A 记录）
12. 配置 Nginx（Debian/Ubuntu 系）：将项目中的 `nginx.conf` 复制到 `/etc/nginx/sites-available/gyoung.xyz` 并软链到 `sites-enabled/`，`nginx -t` 校验后 `systemctl reload nginx`（CentOS/RHEL 系则放到 `/etc/nginx/conf.d/gyoung.xyz.conf`）
13. 用 certbot 申请 Let's Encrypt HTTPS 证书
14. 访问 `https://gyoung.xyz` 验证

### 11.6 健康检查与监控
- `/api/health` 端点返回服务状态
- PM2 配置健康检查，异常自动重启
- 后续可接入告警

### 11.7 数据备份（scripts/backup.sh）
```bash
#!/bin/bash
BACKUP_DIR="/backup/$(date +%Y%m%d)"
mkdir -p "$BACKUP_DIR"
# SQLite 一致性备份（WAL 模式下不能直接 cp）
sqlite3 /var/www/personal-website/data.db ".backup '$BACKUP_DIR/data.db'"
# 备份上传文件
cp -r /var/www/personal-website/uploads "$BACKUP_DIR/"
# 保留最近 30 天
find /backup -maxdepth 1 -type d -mtime +30 -exec rm -rf {} +
```

- 服务器 cron 每日凌晨自动执行
- 建议备份文件额外同步到对象存储或异地
- **恢复**：先停 PM2，删除旧的 `data.db-wal`、`data.db-shm` 文件，再 `sqlite3 data.db ".restore '/backup/<日期>/data.db'"`，最后 `pm2 start`（避免恢复期间写入冲突和旧 WAL 文件干扰）

访问方式：`https://gyoung.xyz`（生产）/ `http://服务器IP:端口`（开发测试）

## 十二、错误处理与用户体验

| 机制 | 文件 | 作用 |
|---|---|---|
| 路由错误边界 | `error.tsx` | 局部错误不崩溃整站，生产环境不暴露堆栈 |
| 全局错误 | `global-error.tsx` | 根布局级错误兜底 |
| 加载态 | `loading.tsx` | 每个路由的 Suspense 加载界面 |
| 404 页面 | `not-found.tsx` | 自定义未找到页面 |
| SEO 元数据 | `metadata` / `generateMetadata` | 每页独立标题、描述、OG 图 |
| 站点地图 | `sitemap.ts` | 动态生成 sitemap.xml |
| 爬虫规则 | `robots.ts` | 动态生成 robots.txt |
| 图片优化 | `next/image` | 自动压缩、懒加载、remotePatterns 配置 |
| 字体优化 | `next/font` | 自托管，避免 FOIT |
| 减少动画 | `prefers-reduced-motion` | 尊重用户系统设置，动效自动降级 |
| 站点图标 | `public/favicon.ico` | 浏览器自动请求，避免 404 日志刷屏 |
| 结构化数据 | JSON-LD | 首页 Person schema、博客详情页 Article schema，SEO 增强 |

## 十三、服务器安全（基线）

网站暴露在公网，服务器侧需同步加固：
- SSH 禁用密码登录，改用密钥认证，修改默认端口
- 安装 `fail2ban` 防 SSH 暴力破解
- 防火墙最小化放行：仅 SSH（自定义端口）、80、443；开发测试阶段可临时放行应用端口
- 定期系统更新
- Nginx 配置安全响应头（与 next.config.js 中的 headers 互补）

## 十四、后续可扩展模块

- 留言板 / 评论区
- 访客统计
- 项目详情页（单项目深度展示）
- 作品集按语言/标签分类筛选
- 暗色 / 亮色主题切换（next-themes 已预留）
- SEO 增强（JSON-LD 已在初版实现，后续可扩展更多 schema）
- Docker 化部署（Dockerfile 已预留）
- 数据库迁移 PostgreSQL / Turso（高并发时）
- 单元测试（Vitest，覆盖 GitHub 拉取、认证、数据库操作）

## 十五、开发计划

- [ ] 搭建 Next.js + Tailwind + Drizzle 项目骨架（ESLint/Prettier/TS strict/husky）
- [ ] Zod 环境变量校验 + 密码哈希生成脚本
- [ ] 配置 iron-session 认证 + 中间件 + CSRF（double-submit）+ 登录限流
- [ ] 数据库 schema + 迁移 + seed 示例数据（幂等：Drizzle `onConflictDoNothing()`，依赖 UNIQUE 约束）
- [ ] 安全响应头配置（next.config.js headers）
- [ ] 首页「关于我」（炫酷动画 + Three.js 懒加载 + reduced-motion）
- [ ] 作品集：GitHub API 服务端拉取 + fetch `revalidate` + 卡片展示 + 首次加载降级
- [ ] 时间线页面
- [ ] 博客列表 + 详情页（Tiptap 编辑器 + Shiki 高亮 + sanitize + RSS）
- [ ] 上传文件处理（API 路由 + 格式/大小/魔数校验 + Nginx alias）
- [ ] 后台管理页（博客 / 时间线 / 简介 CRUD + Zod 校验 + 操作日志）
- [ ] 错误边界 / 加载态 / 404 / SEO 元数据 / sitemap / robots / favicon / JSON-LD 结构化数据
- [ ] next/image + next/font 优化
- [ ] 健康检查端点 + 备份脚本（WAL 一致性备份）+ 恢复流程
- [ ] PM2 ecosystem.config.js + pm2-logrotate + deploy.sh + Nginx 配置
- [ ] 本地完整测试
- [ ] 阿里云部署 + PM2（fork）+ IP 端口测试
- [ ] 生产环境：域名解析 + Nginx + Let's Encrypt + HTTPS 访问验证

---

**维护说明**：内容更新一律在 `/admin` 后台完成，无需修改代码；功能迭代走代码开发 + Git 版本管理 + 服务器 `bash scripts/deploy.sh` 部署。
