# wanderlens-admin

> WanderLens 營運後台 — 服務品質、供給、清算與客服控制台。

---

## 專案概覽

| 項目 | 內容 |
|------|------|
| **定位** | 平台營運管理系統 |
| **技術棧** | Vue 3 + Element Plus |
| **Port** | 3003（dev） |
| **JS 參考** | joyshot-admin（Dashboard、攝影師管理、訂單管理、優惠券、推廣員、區域管理） |
| **依賴** | wanderlens-api、wanderlens-media（AI 狀態監控） |

## 啟動方式

```bash
npm install
npm run dev   # → localhost:3003
npm run build
```

## 現況快照（2026-06-27）

| 項目 | 內容 |
|------|------|
| **本機 / Docker** | `:3003` |
| **i18n** | 側欄、登入、GenericCrud、Dashboard、訂單/媒體/收益；ElConfigProvider 語系 |
| **a11y** | 同 Provider：skip link、landmark、`focus-visible` |
| **示範帳號** | `admin` / 密碼 `123456` |
| **平台文件** | [Monorepo 總覽](../README.md) · [WanderLens_09](../WanderLens_09_待補強與缺口清單.md) · [WanderLens_06](../WanderLens_06_專案拆分總規劃.md) |

## 相關文件

- [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md)
- [TASK_PLAN.md](./TASK_PLAN.md)
- [ARCHITECTURE.md](./ARCHITECTURE.md)