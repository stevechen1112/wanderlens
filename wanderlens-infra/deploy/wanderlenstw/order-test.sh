#!/usr/bin/env bash
set -euo pipefail
API="https://api.wanderlenstw.com/api"
DATE="2026-06-30"

SEARCH=$(curl -sS -X POST "$API/search/multi-pool" \
  -H 'Content-Type: application/json' \
  -d "{\"serviceTypeId\":1,\"shootingDate\":\"$DATE\",\"timeStart\":\"10:00\",\"timeEnd\":\"12:00\",\"city\":\"臺北市\",\"shootingLocation\":\"台北101\",\"adultNum\":1}")

echo "$SEARCH" | python3 <<'PY'
import sys, json
d = json.load(sys.stdin)['data']
ps = d.get('photographers') or []
print('photographers', len(ps), 'configId', d.get('configurationId'))
if ps:
    p = next((x for x in ps if x.get('providerId') == 1), ps[0])
    print('first', p.get('providerId'), 'unitPrice', p.get('unitPrice'), 'totalFee', p.get('totalFee'), 'avail', p.get('availabilityId'))
PY

LOGIN=$(curl -sS -X POST "$API/auth/login" -H 'Content-Type: application/json' \
  -d '{"empno":"consumer1","password":"123456"}')
TOKEN=$(echo "$LOGIN" | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['token'])")

ORDER_BODY=$(echo "$SEARCH" | python3 <<PY
import sys, json
d = json.load(sys.stdin)['data']
ps = d.get('photographers') or []
if not ps:
    raise SystemExit(1)
p = next((x for x in ps if x.get('providerId') == 1), ps[0])
body = {
  'photographerId': p['providerId'],
  'serviceTypeId': 1,
  'configurationId': d.get('configurationId') or 1,
  'shootingDate': '$DATE',
  'shootingTime': '10:00-12:00',
  'shootingDuration': 2,
  'shootingLocation': '台北101',
  'adultNum': 1,
  'childNum': 0,
  'customerName': '示範消費者',
  'customerPhone': '0912345678',
}
if p.get('availabilityId'):
    body['availabilityId'] = p['availabilityId']
print(json.dumps(body))
PY
)

ORDER=$(curl -sS -X POST "$API/orders" -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' -d "$ORDER_BODY")
echo "$ORDER" | python3 -c "import sys,json; o=json.load(sys.stdin).get('data') or {}; print('ORDER',o.get('id'),'unitPrice',o.get('unitPrice'),'totalFee',o.get('totalFee'),'name',o.get('photographerName'),'uuid',o.get('photographerUuid'))"

curl -sS "$API/orders/my" -H "Authorization: Bearer $TOKEN" | python3 -c "import sys,json; ds=json.load(sys.stdin).get('data') or []; print('orders',len(ds));
[print(' -',x.get('id'),x.get('photographerName'),x.get('photographerUuid'),x.get('totalFee')) for x in ds[:3]]"
