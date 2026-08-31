# AI Programmer 个人网站

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61dafb)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-38bdf8)](https://tailwindcss.com)
[![Drizzle](https://img.shields.io/badge/Drizzle-ORM-c5f74f)](https://orm.drizzle.team)
[![License: Private](https://img.shields.io/badge/License-Private-important)](<>)

一个面向 **AI 程序员** 的个人网站：个人简介、GitHub 作品集、博客（含 RSS 订阅）、经历时间线。采用 **Liquid Glass 浅蓝紫液态玻璃 UI**（灵感源自 WWDC Liquid Glass 设计语言），SQLite 单文件存储，自托管于 Linux 服务器，PM2 + Nginx 部署，HTTPS 访问（**gyoung.xyz**）。

---

## ✨ 功能特性

- **首页单页聚合**：Hero 简介（含打字机代码卡片）+ 精选项目（GitHub 真实数据）+ 技术栈（高清真实品牌 logo）+ 成长时间线 + 最新博客，滚动渐显（`whileInView`）
- **玻璃导航栏**：Liquid Glass 半透明白玻璃条，`fixed` 固定在顶部，滚动时保持悬浮（顶部白色高光线）
- **液态玻璃背景**：浅蓝→淡紫渐变 + 多层大尺寸光斑 + 两层 conic 流体渐变缓慢流动 + 磨砂噪点颗粒；`fixed` 定位，页面滚动时背景动效全程一致
- **站点图标**：玻璃质感大写 G（矢量轮廓，从系统字体提取），SVG 任意尺寸清晰，透明背景
- **作品集**：服务端拉取 GitHub 仓库（`fetch` + 5 分钟 `revalidate` 缓存），客户端搜索与排序，API 异常时优雅降级
- **博客**：文章列表 + 详情页，`sanitize-html` 白名单过滤防 XSS，支持 RSS（`/rss.xml`）、动态 sitemap、JSON-LD 结构化数据
- **经历时间线**：年份 + 标题 + 描述 + 图标的时间轴展示
- **后台管理**（`/admin`）：登录 / 登出，数据统计概览
- **安全**：iron-session 加密会话、bcrypt 密码哈希、登录限流、CSRF 校验、CSP 与安全响应头、`robots.txt` 屏蔽后台
- **动效**：Framer Motion 进场 / 滚动动画 + CSS 背景光晕 / 液态流动动画，尊重 `prefers-reduced-motion`

---

## 🚀 快速开始（本地开发）

要求：**Node.js ≥ 20**

```bash
# 1. 安装依赖
npm install

# 2. 配置环境变量（本地可先用默认值，生产必填）
cp .env.example .env

# 3. 初始化数据库（push 直接同步 schema；或用 db:migrate 走迁移文件）
npm run db:push

# 4. 写入示例数据（幂等，可安全重跑）
npm run seed

# 5. 启动开发服务器
npm run dev
```

访问 `http://localhost:3000`。后台登录地址 `/admin`：

- 用户名：`.env` 中的 `ADMIN_USERNAME`（默认 `admin`）
- 密码：`.env` 中的 `ADMIN_PASSWORD_HASH` 对应的明文（用 `npm run hash-password` 生成哈希后填入）

> 后台登录**只校验环境变量**，与数据库 `users` 表无关；`seed` 写入的示例用户仅为历史预留。

---

## 🚀 生产部署

> 生产环境：`https://gyoung.xyz`（HTTPS）；开发测试阶段可直接 `http://服务器IP:端口` 访问。
> ⚠️ 国内服务器用域名访问 80/443 需完成 **ICP 备案**，此为接入前提。

### 部署架构

```
访客 ── HTTPS ──▶ Nginx (:443) ── 静态缓存 /_next/static、alias /uploads ──┐
                       │ 301 (http → https)                                 │
                       └── proxy_pass ──▶ Next.js (:3000) ◀── PM2 fork 单进程
                                                     │
                                              SQLite (data.db)
                                              GitHub REST API
```

- **PM2 `fork` 模式、单实例**：SQLite 单进程写入，避免 `SQLITE_BUSY`
- **Nginx 直接 serve** `/uploads/` 与 `/_next/static/`，反代其余请求到 `127.0.0.1:3000`
- **HTTPS**：Let's Encrypt 免费证书 + HSTS 强制跳转

### 服务器准备

1. 安装 **Node.js ≥ 20.9 LTS**、Git、PM2、sqlite3 命令行（`apt install sqlite3`）、Nginx
2. 防火墙（firewalld/ufw）与云安全组放行：SSH、80、443

### 首次部署

```bash
# 1. 拉取代码
cd /var/www && git clone <repo-url> personal-website && cd personal-website

# 2. 配置环境变量（关键！）
cp .env.example .env
npm run hash-password          # 生成管理员密码 bcrypt 哈希 → 填入 ADMIN_PASSWORD_HASH
# SESSION_SECRET 用随机长字符串（≥ 32 字符）；GITHUB_TOKEN 填 GitHub PAT；
# SITE_URL=https://gyoung.xyz

# 3. 安装依赖 + 初始化数据库
npm run setup                  # = npm install && npm run db:migrate

# 4. 写入示例数据（幂等）
npm run seed

# 5. 构建生产版本
npm run build

# 6. PM2 启动 + 开机自启
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# 7. Nginx（Debian/Ubuntu：放 sites-available + 软链；CentOS：放 conf.d）
cp nginx.conf /etc/nginx/sites-available/gyoung.xyz
ln -s /etc/nginx/sites-available/gyoung.xyz /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

# 8. HTTPS 证书
apt install certbot python3-certbot-nginx
certbot certonly --nginx -d gyoung.xyz     # 仅申请证书，Nginx 配置用项目内 nginx.conf
certbot renew --dry-run                    # 验证自动续期

# 9. 验证
curl https://gyoung.xyz/api/health
```

### 日常更新

```bash
bash scripts/deploy.sh
```

`deploy.sh` 执行：**迁移前备份数据库 → `git pull` → `npm ci` → `drizzle-kit migrate` → `build` → `pm2 reload`**（`reload` 零停机切换）。任何一步失败即中止，避免脏数据上线。

**回滚**：代码问题 `git revert <commit>` 后重跑 deploy.sh。注意 **数据库迁移是 forward-only**（只会前进不会回退）：若新旧代码与新版 schema 不兼容，需先用备份恢复数据库再回滚代码。

### 数据备份与恢复

```bash
# scripts/backup.sh：每日备份，保留最近 30 天（建议 cron 每日执行）
sqlite3 data.db ".backup '/backup/<日期>/data.db'"
cp -r uploads /backup/<日期>/
```

> **WAL 一致性**：SQLite 有 `-wal`/`-shm` 伴生文件，**不能直接 `cp`**，必须用官方备份 API（`.backup` / `VACUUM INTO`）。备份建议额外同步到对象存储。

**恢复**：先 `pm2 stop`，删除旧的 `data.db-wal`/`data.db-shm`，再 `.restore`，最后 `pm2 start`。

### PM2 与 Nginx 配置要点

```js
// ecosystem.config.js —— 必须 fork + 单实例（SQLite 单进程写入）
{
  name: "personal-website",
  script: "node_modules/next/dist/bin/next",
  args: "start -p 3000",
  exec_mode: "fork",
  instances: 1,
  cwd: "/var/www/personal-website",
  env: { NODE_ENV: "production" }
}
```

```nginx
# nginx.conf 要点（完整见仓库）
server {                       # 80 端口
  listen 80;
  location /.well-known/acme-challenge/ { root /var/www/certbot; }  # certbot 验证
  location / { return 301 https://$host$request_uri; }
}
server {                       # 443
  listen 443 ssl http2;
  add_header Strict-Transport-Security "max-age=31536000" always;    # HSTS
  client_max_body_size 10M;
  location /_next/static/ { alias .../.next/static/; expires 365d; } # 构建产物长缓存
  location /uploads/   { alias .../uploads/; expires 7d; }           # 上传文件直出
  location / {
    proxy_pass http://127.0.0.1:3000;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

日志轮转（防止无限增长占满磁盘）：

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

---

## ⚙️ 环境变量

全部通过 `.env` 配置（**不进 Git**，`.env` 已在 `.gitignore`）。启动时由 Zod 校验格式；运行时校验关键配置（`lib/env.ts` 的 `assertRuntimeConfig`）。

| 变量                  | 必填   | 说明                                                                                                      |
| --------------------- | ------ | --------------------------------------------------------------------------------------------------------- |
| `GITHUB_TOKEN`        | 建议   | GitHub PAT。占位值（含 `placeholder`/`xxxxxxxx`）时降级为匿名请求（60 次/时）；真 token 提升到 5000 次/时 |
| `GITHUB_USERNAME`     | 否     | GitHub 账号，默认 `G-YOUNG01`                                                                             |
| `ADMIN_USERNAME`      | 否     | 后台用户名，默认 `admin`                                                                                  |
| `ADMIN_PASSWORD_HASH` | **是** | 管理员密码 bcrypt 哈希，`npm run hash-password` 生成；占位值 `placeholder_hash` 时运行时直接报错          |
| `SESSION_SECRET`      | **是** | iron-session 加密密钥（≥ 32 字符），生产必须改为随机值                                                    |
| `SITE_URL`            | **是** | 站点绝对地址（OG 图 / sitemap / RSS / JSON-LD 用）                                                        |
| `DATABASE_URL`        | 否     | SQLite 连接串，默认 `file:./data.db`                                                                      |
| `NODE_ENV`            | 否     | `development` / `production` / `test`                                                                     |

---

## 🛠 技术栈

| 层       | 技术                                   | 说明                                                    |
| -------- | -------------------------------------- | ------------------------------------------------------- |
| 框架     | Next.js 16.3.3（App Router）+ React 19 | 前后端一体                                              |
| 样式     | Tailwind CSS v4 + 全局 CSS             | Liquid Glass 浅蓝紫液态玻璃（毛玻璃 / 高光 / 流体渐变） |
| 动画     | Framer Motion                          | 进场 / 滚动动效，尊重 `prefers-reduced-motion`          |
| ORM      | Drizzle ORM + `@libsql/client`         | SQLite 单文件，迁移可控                                 |
| 数据库   | SQLite（libSQL 本地文件）              | 无需额外数据库服务                                      |
| 认证     | iron-session + bcryptjs                | 加密会话 Cookie + 密码哈希                              |
| 校验     | Zod                                    | 环境变量 + API 请求体校验                               |
| XSS 过滤 | sanitize-html                          | 博客正文渲染前白名单过滤                                |
| 数据源   | GitHub REST API                        | 服务端拉取 + `revalidate` 缓存                          |
| 质量     | TypeScript strict + ESLint + Prettier  | husky + lint-staged 提交前检查                          |
| 部署     | PM2（fork）+ Nginx + Let's Encrypt     | 守护进程 + 反向代理 + HTTPS                             |

---

## 🏗 架构设计（关键决策）

### SQLite 单进程

SQLite 是单进程写锁数据库，PM2 cluster 多进程并发写会触发 `SQLITE_BUSY`。因此 **PM2 强制 `fork` 模式 + 单实例**。个人网站低并发完全够用；后续高并发可平滑迁移 PostgreSQL / Turso。

### GitHub 作品缓存

作品页服务端渲染时直接调用 GitHub API，用 `fetch` 的 `revalidate: 300` 做服务端缓存：

- 用 `/users/{username}/repos`（而非 `/user/repos`），避免 token 拥有者与配置账号不一致
- **不建缓存表、不跑定时任务**：API 失败或限流时 Next.js 自动回退上次缓存，首次加载失败则展示友好错误 + 重试
- 注意：`npm run build` 会重建 `.next`，清空 fetch 缓存，部署后首次访问需重新拉取

### 认证与安全

- **iron-session**：登录成功写入加密 Cookie，`httpOnly` + `sameSite: 'lax'`，7 天过期，`secure` 按环境判断
- **路由代理**（`proxy.ts`，Next.js 16 新约定）：`matcher: ['/admin/:path*']` 拦截未认证请求，重定向登录页
- **CSRF**：登录时生成 token 存入 session，登出表单带 `hidden` 字段，服务端比对（`/api/auth/logout` 校验）
- **登录限流**：同 IP 15 分钟最多 5 次失败（内存计数，PM2 reload 后重置，属软限流）
- **安全响应头**（`next.config.ts`）：生产环境 `Content-Security-Policy` + `X-Frame-Options: DENY` + `nosniff` + `Referrer-Policy` + `Permissions-Policy`

### 静态化

- 首页 profile：`export const revalidate = 300`（ISR 5 分钟，首页含 GitHub 数据，与作品页缓存一致）
- 作品页：`revalidate = 300`（5 分钟）
- sitemap / RSS：动态生成

---

## 📁 目录结构

```
personal-website/
├── app/
│   ├── page.tsx             # 首页（Hero + 精选项目 + 技术栈 + 时间线 + 博客 单页聚合）
│   ├── works/               # 作品集（GitHub 数据）
│   ├── blog/                # 博客列表 + 详情
│   ├── timeline/            # 经历时间线
│   ├── admin/               # 后台管理（登录 / 概览）
│   ├── api/                 # API 路由（auth / health）
│   ├── rss.xml/             # RSS Feed
│   ├── layout.tsx           # 根布局（导航 / 页脚 / 背景光晕 / JSON-LD）
│   ├── globals.css          # 全局样式（液态玻璃 / 高光 / 动画）
│   ├── icon.svg             # 玻璃质感大 G 站点图标（SVG）
│   ├── robots.ts / sitemap.ts
│   ├── error.tsx / loading.tsx / not-found.tsx
├── components/
│   ├── BackgroundGlow.tsx   # 液态玻璃背景（光晕 + 流体渐变 + 噪点）
│   ├── Navbar.tsx           # 玻璃导航栏（fixed 悬浮）
│   ├── Hero.tsx             # 首页 Hero（打字机代码卡片）
│   ├── FeaturedProjects.tsx # 精选项目（GitHub 真实数据）
│   ├── TechStack.tsx        # 技术栈（高清真实品牌 logo）
│   ├── TimelineSection.tsx  # 首页时间线区块
│   ├── LatestBlog.tsx       # 首页最新博客区块
│   ├── WorksClient.tsx      # 作品集客户端交互（搜索 / 排序）
│   ├── RepoCard.tsx
│   └── Footer.tsx
├── lib/
│   ├── env.ts               # Zod 环境变量校验
│   ├── auth/                # iron-session 配置 + 会话 / 限流
│   ├── db/                  # Drizzle 连接 + schema
│   └── github/              # GitHub API 拉取 + 语言配色
├── scripts/
│   ├── gen_icon.py          # 从系统字体提取 G 轮廓生成站点图标
│   ├── hash-password.mjs    # 生成密码哈希
│   ├── seed.mjs             # 示例数据（幂等）
│   ├── deploy.sh            # 部署脚本
│   └── backup.sh            # 数据库 + uploads 备份
├── drizzle/                 # 数据库迁移文件
├── uploads/                 # 上传文件预留（Nginx 直出，不入 Git）
├── public/                  # 静态资源
│   └── icons/               # 技术栈高清真实品牌 logo（SVG，本地化）
├── proxy.ts                 # /admin 路由保护（Next.js 16 proxy 约定）
├── next.config.ts           # 图片域名 / 安全响应头
├── drizzle.config.ts        # Drizzle 迁移配置
├── ecosystem.config.js      # PM2 配置
├── nginx.conf               # Nginx 反向代理配置
└── .env.example             # 环境变量模板
```

---

## 🗄 数据模型

```sql
users:      id, username, password_hash, created_at          -- 管理员（历史预留）
posts:      id, title, slug(UNIQUE), content, cover_image,
            tags(JSON), published, created_at, updated_at    -- 博客文章
timelines:  id, slug(UNIQUE), year, title, description,
            icon_type, sort_order                            -- 时间线
profile:    id(=1), name, avatar_url, bio,
            skills(JSON), contacts(JSON)                     -- 个人简介（单行）
audit_logs: id, action, target_type, target_id,
            detail(JSON), ip, created_at                     -- 操作日志（预留）
```

- 站点配置（profile）与内容（posts / timelines）分离，避免改配置污染内容表
- `posts.slug` UNIQUE、`profile.id` 固定为 1
- **时间存储**：UNIX 时间戳（秒），schema 默认 `unixepoch()`。Drizzle `mode: "timestamp"` 列会自动在 `Date` 与秒级整数间互转，业务代码直接用 `Date` 对象即可（勿再手动 ×1000）；仅手写 SQL 时才需关心秒级

---

## 📦 npm 脚本

| 命令                                             | 说明                                       |
| ------------------------------------------------ | ------------------------------------------ |
| `npm run dev`                                    | 开发服务器                                 |
| `npm run build` / `npm start`                    | 生产构建 / 启动                            |
| `npm run lint` / `format`                        | ESLint / Prettier                          |
| `npm run db:generate` / `db:migrate` / `db:push` | Drizzle 迁移三件套                         |
| `npm run setup`                                  | `npm install && npm run db:migrate`        |
| `npm run seed`                                   | 写入示例数据（幂等）                       |
| `npm run hash-password`                          | 生成管理员密码 bcrypt 哈希                 |
| `npm run deploy`                                 | 服务器一键部署（`bash scripts/deploy.sh`） |

---

## 🔌 API 接口

```
POST /api/auth/login     # 登录（bcrypt + 限流，成功下发会话 + CSRF token）
POST /api/auth/logout    # 登出（校验 CSRF token）
GET  /api/health         # 健康检查
```

> 博客 / 时间线 / 简介的 CRUD API 与图片上传已预留目录（`app/api/blog|profile|timeline|upload`），**尚未实现**，见 Roadmap。

---

## 🛡 服务器安全基线

- SSH 禁用密码登录，改密钥认证 + 非默认端口；`fail2ban` 防暴力破解
- 防火墙最小化放行：仅 SSH、80、443
- 定期系统更新；Nginx 已配置安全响应头（与 `next.config.ts` 互补）

---

## 🚧 Roadmap

- [ ] **后台内容 CRUD**：文章 / 时间线 / 简介的增删改 API + 表单（当前仅概览）
- [ ] 上传功能落地：封面图 / 正文插图 + 格式 / 大小 / 魔数校验
- [x] `middleware` → `proxy` 迁移（Next.js 16 已弃用 middleware 约定）
- [ ] CSP 从 `'unsafe-inline'` 收紧为 nonce/hash 模式
- [ ] 暗色 / 亮色主题切换
- [ ] 评论区 / 访客统计 / 项目详情页
- [ ] 单元测试（Vitest，覆盖 GitHub 拉取、认证、数据库）
- [ ] Docker 化部署

---

## 📄 License

本项目为个人项目，**未开源授权**（未提供 LICENSE，保留所有权利）。仅供参考学习，请勿直接复用作为商业用途。
