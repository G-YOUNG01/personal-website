#!/bin/bash
set -e

cd /var/www/personal-website

OLD_HEAD=$(git rev-parse HEAD)

# [1/5] 拉取代码；git pull 超时则降级为 fetch + merge --ff-only
if ! timeout 60 git pull origin main; then
  echo "[warn] git pull 失败，降级为 fetch + merge --ff-only"
  git fetch origin
  git merge --ff-only origin/main
fi

NEW_HEAD=$(git rev-parse HEAD)
CHANGED=$(git diff --name-only "$OLD_HEAD" "$NEW_HEAD")

# [2/5] 依赖：node_modules 缺失或 package*.json 变更时才重装
if [ ! -d node_modules ] || echo "$CHANGED" | grep -qE 'package(-lock)?\.json'; then
  echo "[2/5] 依赖有变更，执行 npm ci ..."
  npm ci
else
  echo "[2/5] 无依赖变更，跳过 npm ci"
fi

# [3/5] 数据库：drizzle/schema 变更时才备份 + 迁移
if echo "$CHANGED" | grep -qiE 'drizzle|schema|migration|\.sql'; then
  echo "[3/5] 数据库有变更，备份后执行 migrate ..."
  sqlite3 data.db ".backup '/backup/pre-migrate-$(date +%Y%m%d_%H%M%S).db'"
  npx drizzle-kit migrate
else
  echo "[3/5] 无数据库变更，跳过 migrate"
fi

# [4/5] 构建
echo "[4/5] 执行 npm run build ..."
npm run build

# [5/5] 重启
echo "[5/5] 执行 pm2 reload ..."
pm2 reload personal-website --update-env

echo "部署完成"
