# wanderlens-infra 技術架構

> **文件狀態**：架構說明仍有效；功能現況以 [README.md](./README.md) 與 [WanderLens_09](../WanderLens_09_待補強與缺口清單.md) 為準。最後對照程式碼：**2026-06-27**。

---

## 1. 開發環境架構

```
                    ┌─────────────┐
                    │   Nginx     │
                    │   :80       │
                    └──────┬──────┘
                           │
        ┌──────┬───────┬───┴───┬───────┬──────┐
        ▼      ▼       ▼       ▼       ▼      ▼
     :3001  :3002  :3003   :3004   :8080   :9000
      web  provider admin  media   api    minio
                                          │
                              ┌───────────┼──────────┐
                              ▼           ▼          ▼
                           :3306       :6379
                           mysql       redis
```

## 2. Docker Compose 服務定義

| 服務 | Image | Port | 依賴 |
|------|-------|------|------|
| nginx | nginx:latest | 80 | web, provider, admin, media, api |
| api | 自建 Java 17 | 8080 | mysql, redis |
| web | 自建 Node 18 | 3001 | api |
| provider | 自建 Node 18 | 3002 | api, media |
| admin | 自建 Node 18 | 3003 | api |
| media | 自建 Python/Node | 3004 | minio, api |
| mysql | mysql:8.0 | 3306 | - |
| redis | redis:7 | 6379 | - |
| minio | minio/minio | 9000 | - |

## 3. Nginx 路由

| Path | Upstream | 說明 |
|------|----------|------|
| / | web:3001 | 網站 |
| /provider | provider:3002 | 攝影師端 |
| /admin | admin:3003 | 營運後台 |
| /api | api:8080 | 後端 API |
| /media | media:3004 | 媒體管線 |

## 4. CI/CD Pipeline

```
PR 發起 → lint → test → build → review → merge → deploy
```

| 階段 | 觸發 | 動作 |
|------|------|------|
| lint | PR | ESLint / Checkstyle |
| test | PR | 單元測試 + 整合測試 |
| build | PR | Docker image build |
| deploy | merge to main | 部署至 dev 環境 |

## 5. 環境變數管理

| 環境 | 來源 | 說明 |
|------|------|------|
| dev | .env.dev | 本地開發 |
| prod | GitHub Secrets / Vault | 正式環境 |
| test | .env.test | 測試環境 |

---

*文件建立日期：2026-06-23*