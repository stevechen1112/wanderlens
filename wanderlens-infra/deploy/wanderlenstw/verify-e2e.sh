#!/usr/bin/env bash
set -euo pipefail
cd /opt/wanderlens/wanderlens-infra
source .env
API="https://api.wanderlenstw.com/api"
MYSQL="docker exec -i wanderlens-mysql mysql -uroot -p$MYSQL_ROOT_PASSWORD wanderlens_db"

echo "=== DB: provider + availability sample ==="
$MYSQL -e \
  "SELECT id,city,service_item,go_live,unit_price FROM provider WHERE id=1;
   SELECT schedule_date,slot_start,slot_end,active,locked_by_order_id FROM availability WHERE provider_id=1 AND schedule_date >= CURDATE() ORDER BY schedule_date LIMIT 8;"

echo "=== Search multi-pool ==="
FUTURE=$(date -d '+14 days' +%Y-%m-%d 2>/dev/null || date -v+14d +%Y-%m-%d)
SEARCH_RESP=$(curl -sS -X POST "$API/search/multi-pool" \
  -H 'Content-Type: application/json' \
  -d "{\"serviceTypeId\":1,\"shootingDate\":\"$FUTURE\",\"timeStart\":\"10:00\",\"timeEnd\":\"12:00\",\"city\":\"臺北市\",\"shootingLocation\":\"台北101\",\"adultNum\":1}")
echo "$SEARCH_RESP" | head -c 800
echo ""

PHOTO_COUNT=$(echo "$SEARCH_RESP" | python3 -c "import sys,json; d=json.load(sys.stdin); print(len(d.get('data',{}).get('photographers') or []))" 2>/dev/null || echo 0)
echo "photographers found: $PHOTO_COUNT"

echo "=== Login consumer + create order if search hit ==="
LOGIN=$(curl -sS -X POST "$API/auth/login" -H 'Content-Type: application/json' -d '{"empno":"consumer1","password":"123456"}')
TOKEN=$(echo "$LOGIN" | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['token'])")

if [ "$PHOTO_COUNT" -gt 0 ]; then
  CONFIG_ID=$(echo "$SEARCH_RESP" | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['configurationId'])")
  PJSON=$(echo "$SEARCH_RESP" | python3 -c "import sys,json; ps=json.load(sys.stdin)['data']['photographers']; p=next((x for x in ps if x.get('providerId')==1), ps[0]); import json; print(json.dumps(p))")
  PID=$(echo "$PJSON" | python3 -c "import sys,json; print(json.load(sys.stdin)['providerId'])")
  AVID=$(echo "$PJSON" | python3 -c "import sys,json; print(json.load(sys.stdin).get('availabilityId') or '')")
  ORDER_BODY=$(python3 - <<PY
import json
print(json.dumps({
  "photographerId": $PID,
  "serviceTypeId": 1,
  "configurationId": $CONFIG_ID,
  "shootingDate": "$FUTURE",
  "shootingTime": "10:00-12:00",
  "shootingDuration": 2,
  "shootingLocation": "台北101",
  "adultNum": 1,
  "childNum": 0,
  "customerName": "示範消費者",
  "customerPhone": "0912345678",
  "availabilityId": int("$AVID") if "$AVID" else None
}))
PY
)
  ORDER=$(curl -sS -X POST "$API/orders" -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' -d "$ORDER_BODY")
  echo "$ORDER" | python3 -c "import sys,json; o=json.load(sys.stdin)['data']; print('ORDER', o.get('id'), 'unitPrice', o.get('unitPrice'), 'totalFee', o.get('totalFee'), 'name', o.get('photographerName'), 'uuid', o.get('photographerUuid'))"
else
  echo "SKIP order create - no photographers in search"
fi

echo "=== Orders my (enrich check) ==="
curl -sS "$API/orders/my" -H "Authorization: Bearer $TOKEN" | python3 -c "import sys,json; ds=json.load(sys.stdin).get('data') or []; print('count',len(ds));
[print(' -',x.get('id'),x.get('photographerName'),x.get('photographerUuid'),x.get('totalFee')) for x in ds[:3]]"

echo "=== Profile API ==="
curl -sS "$API/providers/info/11111111-1111-1111-1111-111111111111/profile" | python3 -c "import sys,json; p=json.load(sys.stdin)['data']['provider']; print('unitPrice',p.get('unitPrice'),'career',p.get('career'))"
