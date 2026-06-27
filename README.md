# WanderLens

> 在地隨選攝影平台 — monorepo（九個子專案 + 根目錄 E2E）。**子專案目錄名稱維持 `wanderlens-*`，請勿自行 rename。**

---

## 開始之前

**產品脈絡**（非工程）：[WanderLens_01_完整產品架構文件.md](WanderLens_01_完整產品架構文件.md) · [在地隨選攝影平台_商業企劃書.md](在地隨選攝影平台_商業企劃書.md)

**前置需求**（依子專案而定）：Docker Desktop · Node.js 20+ · Java 17 + Maven（api）· Python 3.11+（media 本機）· Expo CLI（App 開發 / App E2E）

**環境變數**：複製 [`wanderlens-infra/env/.env.dev.example`](wanderlens-infra/env/.env.dev.example) → `wanderlens-infra/.env`（ECPay、Google Places 等見範例註解）。詳 [wanderlens-infra/README.md](wanderlens-infra/README.md)

**常見坑**

- **Web Docker**：須先在 `wanderlens-web` 執行 `npm run build`，再 `docker compose build web`
- **Expo Web**：`wanderlens-app` 與 `wanderlens-provider-app` 預設皆用 **8081**，同時只跑一個
- **E2E**：未設 `GOOGLE_PLACES_API_KEY` 時 `app-flow` 會 fail；未啟 Expo Web 時 App UI 測試會 skip

**驗收現況**（2026-06-27）：Docker 運行下 `npm run test:e2e:all` → **42 passed / 1 failed / 4 skipped**（詳 [WanderLens_09](WanderLens_09_待補強與缺口清單.md) §2.5、§14.13）

---

## 快速開始

### Docker（推薦）

```powershell
cd wanderlens-infra
docker compose up -d
```

| 服務 | URL | 說明 |
|------|-----|------|
| Web | http://localhost:3001 | 消費者網站 |
| Provider | http://localhost:3002 | 攝影師 Web 端 |
| Admin | http://localhost:3003 | 營運後台 |
| API | http://localhost:8080/api | 後端 REST |
| Media | http://localhost:3004 | 媒體管線 |

示範帳號：`consumer1` / `photographer1` / `admin`，密碼 `123456`

詳見 [wanderlens-infra/README.md](wanderlens-infra/README.md)（含 **web 映像須先本機 `npm run build`** 等注意事項）。

### 本機開發（單一子專案）

```powershell
cd wanderlens-web    # 或 api / provider / admin / app …
npm install            # 或 mvn / pip，依子專案 README
npm run dev
```

---

## 子專案一覽

| 目錄 | Port | 職責 | README |
|------|------|------|--------|
| [wanderlens-api](wanderlens-api/) | 8080 | 後端 API、訂單、金流 | [README](wanderlens-api/README.md) |
| [wanderlens-media](wanderlens-media/) | 3004 | RAW / AI 媒體管線 | [README](wanderlens-media/README.md) |
| [wanderlens-web](wanderlens-web/) | 3001 | 消費者網站 RWD | [README](wanderlens-web/README.md) |
| [wanderlens-app](wanderlens-app/) | 8081 (Expo Web) | 消費者 App | [README](wanderlens-app/README.md) |
| [wanderlens-provider](wanderlens-provider/) | 3002 | 攝影師 Web 端 | [README](wanderlens-provider/README.md) |
| [wanderlens-provider-app](wanderlens-provider-app/) | 8081 (Expo Web) | 攝影師 App | [README](wanderlens-provider-app/README.md) |
| [wanderlens-admin](wanderlens-admin/) | 3003 | 營運後台 | [README](wanderlens-admin/README.md) |
| [wanderlens-retouch](wanderlens-retouch/) | 3005 | 外包修圖（階段二） | [README](wanderlens-retouch/README.md) |
| [wanderlens-infra](wanderlens-infra/) | — | Docker、CI、環境 | [README](wanderlens-infra/README.md) |

---

## 文件地圖

| 用途 | 文件 |
|------|------|
| 產品全貌 | [WanderLens_01_完整產品架構文件.md](WanderLens_01_完整產品架構文件.md) · [商業企劃書](在地隨選攝影平台_商業企劃書.md) |
| 子專案怎麼拆 | [WanderLens_06_專案拆分總規劃.md](WanderLens_06_專案拆分總規劃.md) |
| 現況 / 缺口 / E2E | [WanderLens_09_待補強與缺口清單.md](WanderLens_09_待補強與缺口清單.md) |
| App 規格與打包 | [WanderLens_05_完整開發計畫與APP規格書.md](WanderLens_05_完整開發計畫與APP規格書.md) |
| 文件分類索引 | [docs/README.md](docs/README.md) |
| **Linode demo 部署** | [wanderlens-infra/deploy/wanderlenstw/README.md](wanderlens-infra/deploy/wanderlenstw/README.md) |
| JS 舊碼（唯讀） | [JS/README.md](JS/README.md) |

---

## E2E 測試（Playwright）

```powershell
# 根目錄
npm install
$env:WEB_BASE_URL="http://localhost:3001"
$env:API_BASE_URL="http://127.0.0.1:8080/api"
npm run test:e2e:all          # 全套 chromium
npm run test:e2e              # 煙霧（core-flow）
```

App UI 測試需另開 Expo Web：`APP_BASE_URL=http://localhost:8081` + `expo start --web`（見 `wanderlens-app`）。

CI 定義：[.github/workflows/](.github/workflows/)（與 `wanderlens-infra/.github/workflows/` 同步維護）。

---

## 新功能放哪？（決策表）

| 變更類型 | 目錄 |
|----------|------|
| API / 狀態機 / 金流 | `wanderlens-api` |
| RAW / AI 媒體 | `wanderlens-media` |
| 消費者網站 | `wanderlens-web` |
| 消費者 App | `wanderlens-app` |
| 攝影師 Web | `wanderlens-provider` |
| 攝影師 App | `wanderlens-provider-app` |
| 營運後台 | `wanderlens-admin` |
| 外包修圖入口 | `wanderlens-retouch` |
| Docker / compose | `wanderlens-infra` |
| 跨端 E2E | 根目錄 `e2e/` |

跨專案變更請同步更新 [WanderLens_09](WanderLens_09_待補強與缺口清單.md) 與相關子專案 README。

---

## Repo 根目錄說明

| 路徑 | 用途 |
|------|------|
| `e2e/` | Playwright 跨端測試（**維持位置，不搬**） |
| `docs/` | 平台文件索引（實體 `.md` 仍在根目錄以保持連結穩定） |
| `JS/` | joyshot 遺產參考（唯讀） |
| `pw/` | 舊 ad-hoc 腳本目錄（見 [pw/README.md](pw/README.md)） |
| `playwright.config.ts` | E2E 設定 |

*最後更新：2026-06-27（修訂版 A + 總 README「開始之前」補強）*
