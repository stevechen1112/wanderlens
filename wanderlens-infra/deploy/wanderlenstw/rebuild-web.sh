#!/usr/bin/env bash
# 從 Git 原始碼重建 consumer web（先 npm build .output，再 docker build web）
set -euo pipefail

DEPLOY_DIR="${DEPLOY_DIR:-/opt/wanderlens}"
cd "$DEPLOY_DIR/wanderlens-web"
export NUXT_PUBLIC_API_BASE="${NUXT_PUBLIC_API_BASE:-https://api.wanderlenstw.com/api}"
echo "==> Building wanderlens-web with NUXT_PUBLIC_API_BASE=$NUXT_PUBLIC_API_BASE"
npm install
npm run build
[ -d .output/server ] || { echo "ERROR: .output missing after build" >&2; exit 1; }

cd "$DEPLOY_DIR/wanderlens-infra"
COMPOSE="docker compose -f docker-compose.yml -f docker-compose.demo.yml"
$COMPOSE build web
$COMPOSE up -d web
docker exec wanderlens-nginx nginx -s reload 2>/dev/null || true
echo "==> wanderlens-web redeployed"
