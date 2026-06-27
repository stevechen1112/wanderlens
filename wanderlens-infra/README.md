# wanderlens-infra

> WanderLens 基礎設施 — 部署、CI/CD、環境配置、基礎設施即代碼。

---

## 專案概覽

| 項目 | 內容 |
|------|------|
| **定位** | 部署、CI/CD、環境配置 |
| **技術棧** | Docker + Docker Compose（dev）+ GitHub Actions + Nginx |
| **JS 參考** | 無（JS 無基礎設施管理） |
| **被依賴** | 所有子專案 |

## 快速啟動（Docker Compose）

```powershell
cd wanderlens-infra
docker compose up -d
```

| 服務 | Port | 說明 |
|------|------|------|
| api | 8080 | Spring Boot |
| web | 3001 | Nuxt（需見下方重建說明） |
| provider | 3002 | Vue |
| admin | 3003 | Vue |
| media | 3004 | 媒體管線 |
| mysql | 3306 | 僅本機 |
| redis | 6379 | 僅本機 |
| minio | 9000 | 物件儲存 |

示範帳號：`consumer1` / `photographer1` / `admin`，密碼 `123456`

## 重建映像（程式更新後）

**API**（多階段 Maven build，test 原始碼須能編譯）：

```powershell
cd wanderlens-infra
docker compose build api
docker compose up -d api
```

**Web**（Dockerfile 只 COPY 本機 `.output`，須先在本機 build）：

```powershell
cd wanderlens-web
npm run build
cd ../wanderlens-infra
docker compose build web
docker compose up -d web
```

**Provider / Admin**（映像內含 build 或 COPY dist，依 Dockerfile）：

```powershell
docker compose build provider admin
docker compose up -d provider admin
```

## E2E（Playwright，專案根目錄）

```powershell
cd wanderlens
$env:WEB_BASE_URL="http://localhost:3001"
$env:API_BASE_URL="http://127.0.0.1:8080/api"
npx playwright test e2e/ --project=chromium
```

可選：`APP_BASE_URL=http://localhost:8081`（需 `wanderlens-app` 或 `wanderlens-provider-app` 的 `expo start --web`）

CI：根目錄 [.github/workflows/](../.github/workflows/)（GitHub 正式位置；`wanderlens-infra/.github/workflows/` 為同步副本）

## 現況快照（2026-06-27）

| 項目 | 內容 |
|------|------|
| **E2E 結果** | 42 passed / 1 failed（Google Places 需 API key）/ 4 skipped |
| **環境變數** | 複製 `env/.env.dev.example` → `.env`；ECPay / Google 見範例註解 |
| **平台文件** | [Monorepo 總覽](../README.md) · [WanderLens_09](../WanderLens_09_待補強與缺口清單.md) · [WanderLens_06](../WanderLens_06_專案拆分總規劃.md) |

## 相關文件

- [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md)
- [TASK_PLAN.md](./TASK_PLAN.md)
- [ARCHITECTURE.md](./ARCHITECTURE.md)
