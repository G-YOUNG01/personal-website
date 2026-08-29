#!/bin/bash
set -e

cd /var/www/personal-website

# 迁移前先备份当前数据库
sqlite3 data.db ".backup '/backup/pre-migrate-$(date +%Y%m%d_%H%M%S).db'"

git pull origin main
npm ci                  # 干净安装依赖（需要 package-lock.json）
npx drizzle-kit migrate # 数据库迁移
npm run build
pm2 reload personal-website --update-env

echo "部署完成"
