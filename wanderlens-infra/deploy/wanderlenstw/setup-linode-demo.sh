#!/usr/bin/env bash
# Linode 首次初始化（在伺服器上以 root 執行）
set -euo pipefail

echo "==> apt update & install"
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get upgrade -y
apt-get install -y git curl ca-certificates docker.io docker-compose-plugin certbot ufw

echo "==> enable docker"
systemctl enable --now docker

echo "==> ufw (allow SSH + web)"
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
echo "y" | ufw enable || true

echo "==> prepare dirs"
mkdir -p /opt/wanderlens /var/www/certbot
mkdir -p /opt/wanderlens/wanderlens-infra/deploy/wanderlenstw/static/{app-web,papp-web}

cat <<'EOF'

Next steps:
1. Clone repo to /opt/wanderlens (or rsync from your machine)
2. cp wanderlens-infra/env/.env.demo.example wanderlens-infra/.env && edit passwords
3. cd wanderlens-web && npm ci && npm run build
4. cd ../wanderlens-infra && docker compose -f docker-compose.yml -f docker-compose.demo.yml --profile full --profile demo up -d
   (若 nginx 因尚無 SSL 憑證失敗，見 README.md §5 先跑 certbot)
5. bash scripts/build-app-web.sh
6. certbot + restart nginx

EOF
