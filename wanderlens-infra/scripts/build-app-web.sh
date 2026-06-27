#!/usr/bin/env bash
# 建置 Expo Web 靜態檔（方案 A）並複製到 nginx 掛載目錄
set -euo pipefail

MONO_ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
INFRA_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
API_BASE="${EXPO_PUBLIC_API_BASE:-https://api.wanderlenstw.com/api}"
STATIC_APP="$INFRA_ROOT/deploy/wanderlenstw/static/app-web"
STATIC_PAPP="$INFRA_ROOT/deploy/wanderlenstw/static/papp-web"

echo "API_BASE=$API_BASE"

build_app() {
  local dir="$1"
  local out="$2"
  echo "==> Building $dir"
  cd "$MONO_ROOT/$dir"
  npm ci || npm install
  EXPO_PUBLIC_API_BASE="$API_BASE" npx expo export --platform web
  rm -rf "$out"/*
  if [ -d dist ]; then
    cp -a dist/. "$out/"
  elif [ -d web-build ]; then
    cp -a web-build/. "$out/"
  else
    echo "Cannot find dist/ or web-build/ in $dir" >&2
    exit 1
  fi
}

build_app wanderlens-app "$STATIC_APP"
build_app wanderlens-provider-app "$STATIC_PAPP"

echo "Done. Restart nginx: docker compose -f docker-compose.yml -f docker-compose.demo.yml --profile full --profile demo restart nginx"
