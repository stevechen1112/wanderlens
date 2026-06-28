#!/usr/bin/env bash
# WanderLens 完整部署（Linode demo / wanderlenstw.com）
set -euo pipefail

LOG=/var/log/wanderlens-deploy.log
exec > >(tee -a "$LOG") 2>&1

echo "========== WanderLens deploy started $(date -Is) =========="

export DEBIAN_FRONTEND=noninteractive
REPO_URL="${REPO_URL:-https://github.com/stevechen1112/wanderlens.git}"
DEPLOY_DIR=/opt/wanderlens
CERTBOT_EMAIL="${CERTBOT_EMAIL:-admin@wanderlenstw.com}"

rand() { openssl rand -hex 16; }
rand_long() { openssl rand -base64 48 | tr -d '/+=' | head -c 48; }

echo "==> [1/8] System packages"
apt-get update
apt-get upgrade -y
apt-get install -y git curl ca-certificates certbot ufw openssl

if ! command -v docker >/dev/null 2>&1; then
  curl -fsSL https://get.docker.com | sh
fi
# 確保 compose v2 插件可用
if ! docker compose version >/dev/null 2>&1; then
  apt-get install -y docker-compose-plugin || apt-get install -y docker-compose-v2 || true
fi
if ! docker compose version >/dev/null 2>&1; then
  echo "ERROR: docker compose not available" >&2
  exit 1
fi

if ! command -v node >/dev/null 2>&1 || [[ "$(node -v 2>/dev/null || echo v0)" < "v22" ]]; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
fi

systemctl enable --now docker
ufw allow OpenSSH || true
ufw allow 80/tcp || true
ufw allow 443/tcp || true
echo "y" | ufw enable || true

echo "==> [2/8] Clone / update repo"
mkdir -p "$DEPLOY_DIR" /var/www/certbot
if [ -d "$DEPLOY_DIR/.git" ]; then
  cd "$DEPLOY_DIR"
  git fetch origin
  git reset --hard origin/main
else
  git clone "$REPO_URL" "$DEPLOY_DIR"
  cd "$DEPLOY_DIR"
fi

echo "==> [3/8] Configure .env"
cd "$DEPLOY_DIR/wanderlens-infra"
if [ ! -f .env ]; then
  cp env/.env.demo.example .env
fi
# 僅替換仍為 placeholder 的項目
if grep -q 'CHANGE_ME' .env; then
  sed -i \
    -e "s/CHANGE_ME_STRONG_ROOT/$(rand)/" \
    -e "s/CHANGE_ME_STRONG_APP/$(rand)/" \
    -e "s/CHANGE_ME_STRONG_REDIS/$(rand)/" \
    -e "s/CHANGE_ME_STRONG_MINIO/$(rand)/" \
    -e "s/CHANGE_ME_STRONG_MEDIA_KEY/$(rand)/" \
    -e "s/CHANGE_ME_LONG_RANDOM_JWT_SECRET/$(rand_long)/" \
    .env
fi

mkdir -p deploy/wanderlenstw/static/{app-web,papp-web}

echo "==> [4/8] Build wanderlens-web (.output for Docker)"
cd "$DEPLOY_DIR/wanderlens-web"
export NUXT_PUBLIC_API_BASE="${NUXT_PUBLIC_API_BASE:-https://api.wanderlenstw.com/api}"
if [ -d .output/server ] && [ "${FORCE_WEB_BUILD:-}" != "1" ]; then
  echo "Using existing .output (set FORCE_WEB_BUILD=1 to rebuild)"
elif ! (npm install && npm run build); then
  echo "WARN: npm build failed; continuing only if .output exists" >&2
  [ -d .output/server ] || exit 1
fi

echo "==> [5/8] Docker build (may take 15–30 min)"
cd "$DEPLOY_DIR/wanderlens-infra"
COMPOSE="docker compose -f docker-compose.yml -f docker-compose.demo.yml --profile full --profile demo"

$COMPOSE build

echo "==> [6/8] Start backend services (without nginx)"
$COMPOSE up -d mysql redis minio api media web provider admin retouch

echo "==> [6b/8] Apply DB migrations"
bash "$DEPLOY_DIR/wanderlens-infra/scripts/apply-db-migrations.sh" "$DEPLOY_DIR/wanderlens-infra"

echo "Waiting for MySQL/API..."
for i in $(seq 1 60); do
  if curl -sf http://127.0.0.1:8080/api/search/service-types >/dev/null 2>&1; then
    echo "API is up"
    break
  fi
  sleep 10
done

echo "==> [7/8] Let's Encrypt SSL"
if [ ! -f /etc/letsencrypt/live/wanderlenstw.com/fullchain.pem ]; then
  certbot certonly --standalone \
    -d wanderlenstw.com -d www.wanderlenstw.com \
    -d api.wanderlenstw.com -d provider.wanderlenstw.com -d admin.wanderlenstw.com \
    -d retouch.wanderlenstw.com -d app.wanderlenstw.com -d papp.wanderlenstw.com \
    --non-interactive --agree-tos -m "$CERTBOT_EMAIL" \
    --preferred-challenges http
fi

echo "==> [8/8] Expo Web static + nginx"
cd "$DEPLOY_DIR/wanderlens-infra"
export EXPO_PUBLIC_API_BASE=https://api.wanderlenstw.com/api
bash scripts/build-app-web.sh

$COMPOSE up -d nginx

echo "========== Deploy finished $(date -Is) =========="
echo "Verify:"
echo "  curl -s https://api.wanderlenstw.com/api/search/service-types"
echo "  https://www.wanderlenstw.com"
echo "  https://app.wanderlenstw.com"
