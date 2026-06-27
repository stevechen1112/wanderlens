#!/bin/bash
# WanderLens 環境初始化腳本
# 使用方式：./scripts/setup.sh

set -e

echo "╔══════════════════════════════════════════╗"
echo "║   WanderLens 開發環境初始化              ║"
echo "╚══════════════════════════════════════════╝"

# 檢查 Docker
if ! command -v docker &> /dev/null; then
    echo "❌ 未安裝 Docker，請先安裝 Docker Desktop"
    exit 1
fi

if ! command -v docker compose &> /dev/null; then
    echo "❌ 未安裝 Docker Compose，請先安裝"
    exit 1
fi

# 複製環境變數
if [ ! -f .env.dev ]; then
    cp env/.env.dev.example .env.dev
    echo "✅ 已建立 .env.dev（請依需求修改）"
else
    echo "ℹ️  .env.dev 已存在"
fi

# 啟動基礎服務
echo "啟動基礎服務..."
docker compose --env-file .env.dev up -d mysql redis minio

# 等待服務就緒
echo "等待 MySQL 就緒..."
until docker compose exec -T mysql mysqladmin ping -h localhost -u root -proot123 &> /dev/null; do
    sleep 2
done
echo "✅ MySQL 已就緒"

echo "等待 Redis 就緒..."
until docker compose exec -T redis redis-cli ping &> /dev/null; do
    sleep 2
done
echo "✅ Redis 已就緒"

echo "等待 MinIO 就緒..."
until curl -sf http://localhost:9000/minio/health/live &> /dev/null; do
    sleep 2
done
echo "✅ MinIO 已就緒"

# 初始化 MinIO Bucket
echo "初始化 MinIO Bucket..."
docker run --rm --network wanderlens-network \
    -e MINIO_ROOT_USER=wanderlens \
    -e MINIO_ROOT_PASSWORD=wanderlens123 \
    -v "$(pwd)/docker/minio/init.sh:/init.sh:ro" \
    --entrypoint /bin/sh \
    minio/mc:latest /init.sh

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║   ✅ 環境初始化完成！                     ║"
echo "╠══════════════════════════════════════════╣"
echo "║   MySQL:  localhost:3306                 ║"
echo "║   Redis:  localhost:6379                 ║"
echo "║   MinIO:  localhost:9000 (API)           ║"
echo "║           localhost:9001 (Console)       ║"
echo "║                                          ║"
echo "║   下一步：                                ║"
echo "║   make up        啟動基礎服務             ║"
echo "║   make up-full   啟動所有服務             ║"
echo "╚══════════════════════════════════════════╝"