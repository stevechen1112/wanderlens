#!/bin/bash
set -e
cd /opt/wanderlens/wanderlens-infra
set -a
source .env
set +a
docker exec -i wanderlens-mysql mysql -u root -p"$MYSQL_ROOT_PASSWORD" wanderlens_db < /tmp/seed-demo-users.sql
