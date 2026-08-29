#!/bin/bash
set -e

BACKUP_DIR="/backup/$(date +%Y%m%d)"
mkdir -p "$BACKUP_DIR"

# SQLite 一致性备份（WAL 模式下不能直接 cp）
sqlite3 /var/www/personal-website/data.db ".backup '$BACKUP_DIR/data.db'"

# 备份上传文件
cp -r /var/www/personal-website/uploads "$BACKUP_DIR/"

# 保留最近 30 天
find /backup -maxdepth 1 -type d -mtime +30 -exec rm -rf {} +

echo "备份完成: $BACKUP_DIR"
