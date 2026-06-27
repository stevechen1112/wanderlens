# wanderlens-provider

> WanderLens 攝影師/造型師端 — 供給管理與履約工具。

---

## 專案概覽

| 項目 | 內容 |
|------|------|
| **定位** | 供給管理與履約工具 |
| **技術棧** | Vue 3 + Element Plus |
| **Port** | 3002（dev） |
| **JS 參考** | joyshot-photographer（7 分頁結構、月曆 UI、服務地區 tree、作品集上傳） |
| **依賴** | wanderlens-api、wanderlens-media（RAW 上傳直接對接） |

## 啟動方式

```bash
npm install
npm run dev   # → localhost:3002
npm run build
```

## 現況快照（2026-06-27）

| 項目 | 內容 |
|------|------|
| **本機 / Docker** | `:3002` |
| **i18n** | zh / en；側欄、登入、訂單/收益/RAW 驗收；次要頁（Terms、BankInfo、RawUpload 等） |
| **a11y** | skip link、landmark、`focus-visible`、登入 `aria-label` |
| **RAW 上傳** | 訂單列表 API：`GET /orders/provider`（非 `/orders/my`） |
| **互補 App** | 行動接單見 [wanderlens-provider-app](../wanderlens-provider-app/README.md) |
| **平台文件** | [Monorepo 總覽](../README.md) · [WanderLens_09](../WanderLens_09_待補強與缺口清單.md) · [WanderLens_06](../WanderLens_06_專案拆分總規劃.md) |

## 相關文件

- [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md)
- [TASK_PLAN.md](./TASK_PLAN.md)
- [ARCHITECTURE.md](./ARCHITECTURE.md)