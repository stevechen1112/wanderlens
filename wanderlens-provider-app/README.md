# wanderlens-provider-app

> WanderLens 攝影師行動 App — 外出拍攝時的接單、履約、訊息與收益工具。桌面深度操作仍由 `wanderlens-provider`（Vue Web）負責。

---

## 專案概覽

| 項目 | 內容 |
|------|------|
| **定位** | 攝影師行動履約工具（接單模式、訂單、行事曆、訊息、收益） |
| **技術棧** | React Native 0.74 + Expo SDK 51 + React Navigation |
| **Web 預覽 Port** | 8081（`expo start --web`，Metro 預設） |
| **依賴** | wanderlens-api（REST + WebSocket 媒合 + SSE 訊息） |
| **互補** | `wanderlens-provider`：RAW 上傳、檔期設定、作品集等長表單操作 |

## 啟動方式

```bash
npm install
npm run dev              # Expo Dev Tools
npx expo start --web     # Web 預覽 → http://localhost:8081
```

環境變數（`app.config` / `.env`）：`EXPO_PUBLIC_API_URL=http://127.0.0.1:8080/api`

## 現況快照（2026-06-27）

| 項目 | 內容 |
|------|------|
| **主要畫面** | 6 Tab：首頁儀表板、行事曆、訂單、訊息、收益、我的 |
| **能力** | 接單模式（WebSocket）、訂單履約節點、SSE 訊息、通知、亮/深色、i18n |
| **示範帳號** | `photographer1` / 密碼 `123456` |
| **E2E** | 根目錄 `e2e/app-flow.spec.ts`（需本機 `expo start --web` + `APP_BASE_URL=http://localhost:8081`） |
| **打包** | `eas.json` 已含 development / preview / production profile；詳見 [WanderLens_05 §App 打包](../WanderLens_05_完整開發計畫與APP規格書.md) |

## 相關文件

- [../README.md](../README.md) — Monorepo 總覽
- [DIRECTORY.md](./DIRECTORY.md)
- [TASK_PLAN.md](./TASK_PLAN.md) — Task 清單
- [../WanderLens_05_完整開發計畫與APP規格書.md](../WanderLens_05_完整開發計畫與APP規格書.md) — App 規格與 EAS 打包
- [../WanderLens_09_待補強與缺口清單.md](../WanderLens_09_待補強與缺口清單.md) — 跨專案現況
- [../WanderLens_06_專案拆分總規劃.md](../WanderLens_06_專案拆分總規劃.md) — 子專案邊界
- [../wanderlens-provider/README.md](../wanderlens-provider/README.md) — 攝影師 Web 端
