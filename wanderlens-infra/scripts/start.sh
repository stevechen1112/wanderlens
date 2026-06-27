#!/bin/bash
# 啟動所有服務
set -e
docker compose --env-file .env.dev up -d
echo "✅ 所有服務已啟動，使用 'make status' 查看狀態"