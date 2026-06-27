#!/usr/bin/env bash
# 套用 wanderlens-api/doc/migration/*.sql（依檔名排序）
set -euo pipefail

INFRA_DIR="${1:-/opt/wanderlens/wanderlens-infra}"
cd "$INFRA_DIR"

set -a
# shellcheck disable=SC1091
source .env
set +a

MIG_DIR="$INFRA_DIR/../wanderlens-api/doc/migration"

echo "==> Applying DB migrations from $MIG_DIR"
for f in $(ls "$MIG_DIR"/V*.sql | sort -V); do
  echo "  -> $(basename "$f")"
  docker compose -f docker-compose.yml -f docker-compose.demo.yml exec -T mysql \
    mysql -u root -p"${MYSQL_ROOT_PASSWORD}" wanderlens_db < "$f"
done

echo "==> Done. Restarting API..."
docker compose -f docker-compose.yml -f docker-compose.demo.yml restart api
