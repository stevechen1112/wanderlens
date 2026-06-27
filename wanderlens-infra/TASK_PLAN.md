# wanderlens-infra Task Plan

> Task ID 格式：`INF-{階段}-{流水號}`

---

## Phase 1：開發環境與 CI/CD 基礎

### 1.0 Docker Compose 開發環境

| Task ID | 標題 | 描述 | 依賴 | 估時 | 狀態 |
|---------|------|------|------|------|------|
| INF-1-001 | Docker Compose 骨架 | docker-compose.yml、網路、volume 規劃 | - | 3h | ✅ |
| INF-1-002 | MySQL Docker 服務 | MySQL 8.0、初始化腳本、端口 3306 | INF-1-001 | 2h | ✅ |
| INF-1-003 | Redis Docker 服務 | Redis 7、端口 6379 | INF-1-001 | 1h | ✅ |
| INF-1-004 | MinIO Docker 服務 | S3 相容物件儲存、端口 9000、Bucket 初始化 | INF-1-001 | 3h | ✅ |
| INF-1-005 | Nginx 反向代理 | 路由分發、SSL 預留 | INF-1-001 | 4h | ✅ |

### 1.1 環境變數管理

| Task ID | 標題 | 描述 | 依賴 | 估時 | 狀態 |
|---------|------|------|------|------|------|
| INF-1-010 | .env 模板 | 所有子專案的環境變數模板 | INF-1-001 | 2h | ✅ |
| INF-1-011 | 環境隔離 | dev/prod/test 環境變數分離 | INF-1-010 | 2h | ✅ |

### 1.2 CI/CD

| Task ID | 標題 | 描述 | 依賴 | 估時 | 狀態 |
|---------|------|------|------|------|------|
| INF-1-020 | GitHub Actions CI | lint + test + build pipeline | - | 4h | ✅ |
| INF-1-021 | CI for wanderlens-api | Java build + test | INF-1-020 | 2h | ✅ |
| INF-1-022 | CI for 前端專案 | Vue build + lint | INF-1-020 | 2h | ✅ |
| INF-1-023 | CI for wanderlens-media | Python/Node build + test | INF-1-020 | 2h | ✅ |

### 1.3 開發工具

| Task ID | 標題 | 描述 | 依賴 | 估時 | 狀態 |
|---------|------|------|------|------|------|
| INF-1-030 | 一鍵啟動腳本 | makefile 或 shell script | INF-1-005 | 2h | ✅ |
| INF-1-031 | 資料庫初始化 | Schema 初始化、種子資料 | INF-1-002 | 3h | ✅ |

---

## Phase 2：正式環境（預覽）

| Task ID | 標題 | 依賴 | 估時 | 狀態 |
|---------|------|------|------|------|
| INF-2-001 | 正式部署配置 | INF-1-001 | 8h | ✅ |
| INF-2-002 | 監控配置 | INF-2-001 | 6h | ✅ |
| INF-2-003 | 日誌配置 | INF-2-001 | 4h | ✅ |
| INF-2-004 | SSL + 備份 | INF-2-001 | 4h | ✅ |

---

## 估時總計

| 階段 | Task 數 | 預估工時 |
|------|---------|---------|
| Phase 1 | 14 tasks | ~38h |
| Phase 2 | 4 tasks（預覽） | ~22h |

---

## Phase 4：品質衝刺（2026-06-27）

| Task ID | 標題 | 狀態 | 備註 |
|---------|------|------|------|
| INF-4-001 | Docker 映像重建流程文件 | ✅ | README：web 先 `npm run build` |
| INF-4-002 | E2E CI + 本地指令 | ✅ | `ci-e2e.yml`、42/47 passed |

---

*文件建立日期：2026-06-23 · Phase 4 更新：2026-06-27*