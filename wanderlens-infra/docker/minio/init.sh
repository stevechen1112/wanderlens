#!/bin/sh
# MinIO Bucket 初始化
# 在 MinIO 啟動後建立所需的 Bucket

set -e

# 等待 MinIO 就緒
echo "等待 MinIO 就緒..."
until curl -sf http://localhost:9000/minio/health/live; do
  sleep 2
done
echo "MinIO 已就緒"

# 設定 mc alias
mc alias set local http://localhost:9000 "${MINIO_ROOT_USER}" "${MINIO_ROOT_PASSWORD}"

# 建立 Bucket
echo "建立 Bucket..."

# RAW 原始檔儲存（私有，僅透過 presigned URL 存取）
mc mb local/wanderlens-raw --ignore-existing
# JPEG 快路徑儲存（私有）
mc mb local/wanderlens-jpeg --ignore-existing
# AI 調色成品儲存（預覽圖/縮圖需要公開讀取，但僅限特定 prefix）
mc mb local/wanderlens-ai-output --ignore-existing
# 精修成品儲存（私有）
mc mb local/wanderlens-retouch --ignore-existing
# 通用檔案儲存（頭像/Banner/作品集等 — 公開讀取）
mc mb local/wanderlens-files --ignore-existing
# 溝通圖片儲存（私有）
mc mb local/wanderlens-conversation --ignore-existing

# 設定 Bucket 存取策略
# AI 成品：僅 preview/thumbnail prefix 公開讀取，原始成品私有
mc anonymous set download local/wanderlens-ai-output/preview
mc anonymous set download local/wanderlens-ai-output/thumbnail
# 通用檔案：公開讀取（頭像/Banner 等公開資產）
mc anonymous set download local/wanderlens-files

echo "Bucket 初始化完成"