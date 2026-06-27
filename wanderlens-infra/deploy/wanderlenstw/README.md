# 在 wanderlenstw.com 上部署 WanderLens（Linode 單機）

> **Linode IP**：`172.238.15.171`  
> **App 方案**：方案 A（Expo Web 靜態，`app` / `papp` 子網域）

---

## 0. 你要先做兩件事（我無法代填密碼）

### A. GoDaddy DNS

照 [DNS.md](./DNS.md) 新增 8 條 A 記錄 → `172.238.15.171`。

### B. SSH 金鑰（本機 PowerShell 執行一次）

```powershell
# 1. 產生 deploy 專用金鑰（無 passphrase 方便 CI；正式可再加 passphrase）
ssh-keygen -t ed25519 -f $env:USERPROFILE\.ssh\wanderlenstw_linode -N '""'

# 2. 首次用密碼上傳公鑰（會提示輸入 root 密碼）
type $env:USERPROFILE\.ssh\wanderlenstw_linode.pub | ssh root@172.238.15.171 "mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"

# 3. 之後免密登入
ssh -i $env:USERPROFILE\.ssh\wanderlenstw_linode root@172.238.15.171
```

若 Linode 防火牆未開 **22**，到 Linode Cloud → Networking → Firewalls → 允許 SSH。

---

## 1. 子網域（已定）

| URL | 產品 |
|-----|------|
| https://www.wanderlenstw.com | 消費者 Web |
| https://provider.wanderlenstw.com | 攝影師 Web |
| https://admin.wanderlenstw.com | 營運後台 |
| https://retouch.wanderlenstw.com | 修圖 |
| https://app.wanderlenstw.com | 消費者 App（Web） |
| https://papp.wanderlenstw.com | 攝影師 App（Web） |
| https://api.wanderlenstw.com/api | API |

---

## 2. 伺服器初始化（SSH 登入後）

```bash
apt update && apt upgrade -y
apt install -y git docker.io docker-compose-plugin certbot

# 建議：非 root 部署使用者（可選）
# adduser deploy && usermod -aG docker deploy

mkdir -p /opt/wanderlens /var/www/certbot
cd /opt/wanderlens
git clone <你的 repo URL> .
# 或 rsync / scp 整個 monorepo

cd wanderlens-infra
cp env/.env.demo.example .env
nano .env   # 填入 CHANGE_ME_* 強密碼
```

---

## 3. 建置 Web 映像（web 須先本機 build .output）

```bash
cd /opt/wanderlens/wanderlens-web
npm ci && npm run build

cd /opt/wanderlens/wanderlens-infra
docker compose -f docker-compose.yml -f docker-compose.demo.yml --profile full --profile demo build

# 首次請勿先起 nginx（尚無 SSL 憑證）；見下方 §5 順序
docker compose -f docker-compose.yml -f docker-compose.demo.yml --profile full --profile demo up -d \
  mysql redis minio api media web provider admin retouch
```

---

## 4. 建置 App Web 靜態（方案 A）

在**有 Node 的機器**上（可本機 build 再 scp，或在 Linode 上 build）：

```bash
export API=https://api.wanderlenstw.com/api

cd wanderlens-app
npm ci
EXPO_PUBLIC_API_BASE=$API npx expo export --platform web
# 產物目錄依 Expo 版本：dist/ 或 web-build/

cd ../wanderlens-provider-app
npm ci
EXPO_PUBLIC_API_BASE=$API npx expo export --platform web
```

複製到 Linode nginx 掛載目錄：

```bash
# 在 Linode
mkdir -p /opt/wanderlens/wanderlens-infra/deploy/wanderlenstw/static/app-web
mkdir -p /opt/wanderlens/wanderlens-infra/deploy/wanderlenstw/static/papp-web
# scp -r 本機 build 產物 → 上述目錄

docker compose -f docker-compose.yml -f docker-compose.demo.yml --profile demo restart nginx
```

或使用 repo 內腳本：`scripts/build-app-web.sh`（Linux）。

---

## 5. SSL（Let's Encrypt）

DNS 生效後，在 Linode。**注意**：`wanderlenstw.conf` 需要憑證檔才能啟動 nginx，請依序操作：

```bash
cd /opt/wanderlens/wanderlens-infra

# 5a. 先起不含 nginx 的服務（API / Web 等）
docker compose -f docker-compose.yml -f docker-compose.demo.yml --profile full --profile demo up -d \
  mysql redis minio api media web provider admin retouch

# 5b. 用 standalone 取得憑證（暫佔 80 port）
certbot certonly --standalone \
  -d wanderlenstw.com -d www.wanderlenstw.com \
  -d api.wanderlenstw.com -d provider.wanderlenstw.com -d admin.wanderlenstw.com \
  -d retouch.wanderlenstw.com -d app.wanderlenstw.com -d papp.wanderlenstw.com \
  --non-interactive --agree-tos -m you@example.com

# 5c. 再啟動 nginx（HTTPS）
docker compose -f docker-compose.yml -f docker-compose.demo.yml --profile full --profile demo up -d nginx
```

憑證掛載路徑見 `docker-compose.demo.yml`（`/etc/letsencrypt`）。

---

## 6. 驗收

| 檢查 | 預期 |
|------|------|
| https://api.wanderlenstw.com/api/search/service-types | JSON 200 |
| https://www.wanderlenstw.com | 首頁 |
| https://provider.wanderlenstw.com/login | 攝影師登入 |
| https://admin.wanderlenstw.com/login | 後台登入 |
| https://app.wanderlenstw.com | 消費者 App Web |
| https://papp.wanderlenstw.com | 攝影師 App Web |

示範帳號（**上公網請改密碼**）：`consumer1` / `photographer1` / `admin`，密碼 `123456`。

---

## 7. 給同事的連結表（可直接轉貼）

```
消費者網站    https://www.wanderlenstw.com
消費者 App    https://app.wanderlenstw.com      （consumer1 / 123456）
攝影師 Web    https://provider.wanderlenstw.com   （photographer1 / 123456）
攝影師 App    https://papp.wanderlenstw.com     （photographer1 / 123456）
營運後台      https://admin.wanderlenstw.com    （admin / 123456）
```

---

## 8. 常見問題

| 問題 | 處理 |
|------|------|
| 登入「網路錯誤」 | API 未起來、CORS 未含 wanderlenstw 網域、App build 時 API 網址錯 |
| Web 空白 | `wanderlens-web` 須先 `npm run build` 再 docker build web |
| SSH 連不上 | Linode 防火牆 / 22 port / IP 是否正確 |

程式碼已含 API CORS：`wanderlenstw.com` 各子網域（見 `SecurityConfig.java`）。
