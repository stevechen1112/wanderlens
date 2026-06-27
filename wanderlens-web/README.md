# wanderlens-web

> WanderLens 網站 RWD — 獲客入口、SEO 內容池、首次下單轉換。

---

## 專案概覽

| 項目 | 內容 |
|------|------|
| **定位** | 獲客入口、SEO 內容池、首次下單轉換 |
| **技術棧** | Nuxt 3（Vue 3 + SSR + SSG） |
| **Port** | 3001（dev） |
| **JS 參考** | joyshot-app（首頁結構、搜尋列、攝影師列表、結帳流程） |
| **依賴** | wanderlens-api |

## 啟動方式

```bash
npm install
npm run dev   # → localhost:3001
npm run build # → 正式環境建置
```

## 現況快照（2026-06-27）

| 項目 | 內容 |
|------|------|
| **本機 dev** | `npm run dev` → `:3001` |
| **Docker web** | 映像只 COPY `.output` → **須先** `npm run build`，再 `docker compose build web` |
| **i18n** | zh / en / jp / ka；首頁行銷區、相簿、dark mode |
| **a11y** | `WlSkipLink`、`#main-content`、行動選單 Escape、登入 label |
| **E2E** | `e2e/a11y-baseline.spec.ts`、`album-flow.spec.ts`、`mobile-nav.spec.ts` |
| **平台文件** | [Monorepo 總覽](../README.md) · [WanderLens_09](../WanderLens_09_待補強與缺口清單.md) · [WanderLens_06](../WanderLens_06_專案拆分總規劃.md) |

## 相關文件

- [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md)
- [TASK_PLAN.md](./TASK_PLAN.md)
- [ARCHITECTURE.md](./ARCHITECTURE.md)