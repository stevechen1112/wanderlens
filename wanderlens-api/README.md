# wanderlens-api

> WanderLens 平台核心後端 API，提供所有 REST API，處理認證、預約、訂單、金流、站內溝通、相簿、數據等業務邏輯。

---

## 專案概覽

| 項目 | 內容 |
|------|------|
| **定位** | 平台核心後端 API |
| **技術棧** | Java 17 + Spring Boot 3.x + MyBatis-Plus + MySQL + Redis |
| **Port** | 8080 |
| **JS 參考** | joyshot-api（27 Controller、40 Entity、35 Mapper） |
| **依賴** | wanderlens-infra（環境）、wanderlens-media（媒體管線介面） |
| **被依賴** | wanderlens-web、wanderlens-app、wanderlens-provider、wanderlens-provider-app、wanderlens-admin、wanderlens-retouch |

## 啟動方式

```bash
# 開發環境
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# 正式環境
java -jar target/wanderlens-api.jar --spring.profiles.active=prod
```

## 現況快照（2026-06-27）

| 項目 | 內容 |
|------|------|
| **本機 / Docker** | `:8080`；`cd ../wanderlens-infra && docker compose up -d api` |
| **示範帳號** | `consumer1` / `photographer1` / `admin`，密碼 `123456` |
| **近期重點** | 語意化 `ResultCode` 全面統一；Draft→PendingPayment 結帳轉移；ECPay staging |
| **E2E** | `e2e/api-error-codes.spec.ts`、`order-lifecycle.spec.ts`、`payment-staging.spec.ts` |
| **平台文件** | [Monorepo 總覽](../README.md) · [WanderLens_09](../WanderLens_09_待補強與缺口清單.md) · [WanderLens_06](../WanderLens_06_專案拆分總規劃.md) |

Docker 建置會編譯 test sources；若 test 編譯失敗，映像 build 也會失敗（即使 `-DskipTests`）。

## 相關文件

- [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md) — 開發計畫
- [TASK_PLAN.md](./TASK_PLAN.md) — Task 清單
- [ARCHITECTURE.md](./ARCHITECTURE.md) — 技術架構
- [API_SPEC.md](./API_SPEC.md) — API 規格（含語意錯誤碼）
- [DATA_MODEL.md](./DATA_MODEL.md) — 資料模型