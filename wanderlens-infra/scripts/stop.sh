#!/bin/bash
# 停止所有服務
set -e
docker compose down
echo "✅ 所有服務已停止"