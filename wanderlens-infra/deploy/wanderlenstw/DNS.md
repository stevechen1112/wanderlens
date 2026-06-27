# GoDaddy DNS — wanderlenstw.com

> Linode 公網 IP：**172.238.15.171**（2026-06-27）

在 GoDaddy → **wanderlenstw.com** → DNS → 新增下列 **A 記錄**（TTL 600 或預設即可）。

| 類型 | 名稱 (Host) | 指向 (Points to) | 用途 |
|------|-------------|------------------|------|
| A | `@` | `172.238.15.171` | 根網域 → 轉 www |
| A | `www` | `172.238.15.171` | 消費者 Web |
| A | `api` | `172.238.15.171` | 後端 API |
| A | `provider` | `172.238.15.171` | 攝影師 Web |
| A | `admin` | `172.238.15.171` | 營運後台 |
| A | `retouch` | `172.238.15.171` | 修圖入口（可選） |
| A | `app` | `172.238.15.171` | 消費者 App（方案 A Web） |
| A | `papp` | `172.238.15.171` | 攝影師 App（方案 A Web，`p` = partner/provider app） |

## 生效後網址一覽

| 產品 | URL |
|------|-----|
| 消費者 Web | https://www.wanderlenstw.com |
| 攝影師 Web | https://provider.wanderlenstw.com |
| 營運後台 | https://admin.wanderlenstw.com |
| 修圖 | https://retouch.wanderlenstw.com |
| 消費者 App（Web） | https://app.wanderlenstw.com |
| 攝影師 App（Web） | https://papp.wanderlenstw.com |
| API | https://api.wanderlenstw.com/api |

根網域 https://wanderlenstw.com 會 301 轉到 https://www.wanderlenstw.com。

## 注意

- 全部先指同一 IP；靠 Nginx 依 `Host` 分流。
- DNS 傳播可能 5～30 分鐘；可用 `nslookup api.wanderlenstw.com` 確認。
