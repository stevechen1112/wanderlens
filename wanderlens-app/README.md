# wanderlens-app

> WanderLens 消費者 App（iOS/Android + Expo Web）— 內容留存、預約、相簿與回訪引擎。

---

## 專案概覽

| 項目 | 內容 |
|------|------|
| **定位** | 內容留存與回訪引擎（相簿、六步預約、ECPay WebView、推播召回） |
| **技術棧** | React Native 0.74 + Expo SDK 51 + Expo Router |
| **Web 預覽 Port** | 8081（`expo start --web`） |
| **JS 參考** | 無（JS 無 App） |
| **依賴** | wanderlens-api |

## 啟動方式

```bash
npm install
npm run dev              # Expo Dev Tools
npx expo start --web     # Web 預覽 → http://localhost:8081
```

環境變數：`EXPO_PUBLIC_API_URL=http://127.0.0.1:8080/api`

## 現況快照（2026-06-27）

| 項目 | 內容 |
|------|------|
| **已具備** | 六步預約、ECPay WebView 結帳、相簿全螢幕、Design System、i18n、加時付款 |
| **示範帳號** | `consumer1` / 密碼 `123456` |
| **E2E** | `e2e/app-flow.spec.ts`（API 段；UI 段需 Metro + `APP_BASE_URL=http://localhost:8081`） |
| **網頁過渡** | 相簿/預約亦可走 [wanderlens-web](../wanderlens-web/README.md) |
| **平台文件** | [Monorepo 總覽](../README.md) · [WanderLens_09](../WanderLens_09_待補強與缺口清單.md) · [WanderLens_05](../WanderLens_05_完整開發計畫與APP規格書.md) |

## 相關文件

- [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md)
- [TASK_PLAN.md](./TASK_PLAN.md)
- [ARCHITECTURE.md](./ARCHITECTURE.md)
