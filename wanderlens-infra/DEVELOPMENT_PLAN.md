# wanderlens-infra 開發計畫

> **文件狀態**：階段規劃仍有效；完成度以 [README.md](./README.md) 與 [WanderLens_09](../WanderLens_09_待補強與缺口清單.md) 為準。最後對照：**2026-06-27**。

---

## 1. 階段總覽

| 階段 | 核心目標 |
|------|---------|
| Phase 1 | 開發環境 Docker Compose + CI/CD 基礎 + Nginx 反向代理 |
| Phase 2 | 正式環境部署 + 監控 + 日誌 |
| Phase 3 | 自動擴展 + CDN |
| Phase 5 | 多區域部署 |

---

## 2. Phase 1：開發環境與 CI/CD 基礎

### 2.1 開發範圍

| 模組 | 內容 |
|------|------|
| Docker Compose | 所有子專案的一鍵啟動開發環境 |
| 環境變數管理 | .env 模板、環境隔離 |
| Nginx 反向代理 | 統一入口、路由分發 |
| GitHub Actions | CI pipeline（lint + test + build） |
| MySQL Docker | 開發用資料庫 |
| Redis Docker | 開發用 Redis |
| 物件儲存（本地） | MinIO（S3 相容，開發用） |

### 2.2 Docker Compose 服務

| 服務 | Port | 說明 |
|------|------|------|
| wanderlens-api | 8080 | Java 後端 |
| wanderlens-web | 3001 | 網站 |
| wanderlens-provider | 3002 | 攝影師端 |
| wanderlens-admin | 3003 | 營運後台 |
| wanderlens-media | 3004 | 媒體管線 |
| mysql | 3306 | 資料庫 |
| redis | 6379 | 快取/鎖定 |
| minio | 9000 | 物件儲存（開發用） |
| nginx | 80 | 反向代理 |

### 2.3 成功判準

| 指標 | 意義 |
|------|------|
| 一鍵啟動 | docker compose up 即可開發 |
| CI 自動化 | PR 自動 lint + test + build |
| 環境隔離 | dev/prod 環境變數不混雜 |

---

## 3. Phase 2：正式環境

| 模組 | 內容 |
|------|------|
| 正式部署 | Docker Swarm 或 K8s |
| 監控 | Prometheus + Grafana |
| 日誌 | ELK 或 Loki |
| SSL | Let's Encrypt 自動續期 |
| 備份 | 資料庫定時備份 |

## 4. Phase 3：擴展

| 模組 | 內容 |
|------|------|
| CDN | 靜態資源加速 |
| 自動擴展 | 依負載自動擴展 |

## 5. Phase 5：跨境

| 模組 | 內容 |
|------|------|
| 多區域 | 依市場就近部署 |
| 全球加速 | CDN 多區域 |

---

*文件建立日期：2026-06-23*