# wanderlens-retouch

> WanderLens 外包修圖入口 — 精修工單協作平台。

---

## 專案概覽

| 項目 | 內容 |
|------|------|
| **定位** | 精修工單協作平台 |
| **技術棧** | Vue 3 + Element Plus（輕量） |
| **Port** | 3005（dev） |
| **JS 參考** | 無 |
| **依賴** | wanderlens-api（工單 API）、wanderlens-media（RAW 下載） |
| **啟動階段** | 階段二（初期可由 admin 後台 + 人工流程過渡） |

## 啟動方式

```bash
npm install
npm run dev   # → localhost:3005
npm run build
```

## 現況快照（2026-06-27）

| 項目 | 內容 |
|------|------|
| **API** | 工單 CRUD 走 wanderlens-api；錯誤碼 `retouch_job_not_found` |
| **RAW** | 下載來源 wanderlens-media |
| **平台文件** | [Monorepo 總覽](../README.md) · [WanderLens_09](../WanderLens_09_待補強與缺口清單.md) · [WanderLens_06](../WanderLens_06_專案拆分總規劃.md) |

## 相關文件

- [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md)
- [TASK_PLAN.md](./TASK_PLAN.md)
- [ARCHITECTURE.md](./ARCHITECTURE.md)