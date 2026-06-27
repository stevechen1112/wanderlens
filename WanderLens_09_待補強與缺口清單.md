# WanderLens 待補強與缺口清單

> 本文件依《在地隨選攝影平台_商業企劃書》、《WanderLens_04_階段化產品路線》及全專案程式碼盤點整理，記錄**尚未實作**或**已有骨架但未串完**的所有項目，供後續開發排程與驗收對照使用。
>
> 建立日期：2026-06-25  
> 最後更新：**2026-06-27（Web Wave 1–4 強化後 · 子專案 README 同步）**  
> 盤點基準：`WanderLens_08` + 程式碼實地檢視 + Bugbot Code Review

---

## 1. 總覽

### 1.1 整體完成度（對照企劃書五階段）

| 階段 | 目標 | 更新前 | **更新後** | 狀態 |
| --- | --- | :---: | :---: | --- |
| 階段一：服務驗證 | 單區預約、RAW、AI 交付、清算 | ~85% | **~95%** | ✅ staging 驗收待跑 |
| 階段二：服務完整化 | 三池、雙機、精修、評價治理 | ~60% | **~90%** | ✅ 核心已串完 |
| 階段三：內容平台化 | 相簿、公開、SEO、分享、召回 | ~80% | **~92%** | ✅ 進階能力大部分完成 |
| 階段四：數據變現 | 聯盟行銷、場景推薦 | ~5% | **~75%** | ⚠️ 報表/治理待深化 |
| 階段五：跨境網絡 | 多語多幣、入境旅拍、跨境推薦 | ~0% | **~55%** | ⚠️ 骨架完成，營運待驗 |

### 1.2 優先級定義

| 優先級 | 代號 | 說明 |
| --- | --- | --- |
| P0 | 🔴 | 阻擋正式上線；無此項無法完成真實交易或核心服務承諾 |
| P1 | 🟠 | 企劃書明確要求、Phase 1–2 應具備；影響完整服務體驗 |
| P2 | 🟡 | Phase 3 進階能力或體驗優化；不阻擋早期營運 |
| P3 | ⚪ | Phase 4–5 或未來擴張；可排入中長期 roadmap |

### 1.3 缺口數量摘要（2026-06-25 更新）

| 類別 | 原 P0 | **剩 P0** | 原 P1 | **剩 P1** | 原 P2 | **剩 P2** | 原 P3 | **剩 P3** |
| --- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| 第三方整合 | 4 | **1** | 1 | **0** | 0 | 0 | 1 | **0** |
| 預約與媒合 | 0 | 0 | 8 | **0** | 2 | **0** | 0 | 0 |
| 訂單履約 | 0 | 0 | 4 | **0** | 2 | **0** | 0 | 0 |
| 內容平台 | 0 | 0 | 0 | 0 | 6 | **2** | 0 | 0 |
| 數據變現（Phase 4） | 0 | 0 | 0 | 0 | 0 | 0 | 6 | **2** |
| 跨境網絡（Phase 5） | 0 | 0 | 0 | 0 | 0 | 0 | 8 | **4** |
| 測試與營運 | 1 | **1** | 3 | **1** | 2 | **0** | 0 | 0 |
| **合計** | **5** | **2** | **16** | **1** | **12** | **2** | **15** | **6** |

> **說明**：原 48 項缺口中，**38 項已實作完成**；**8 項部分完成**（需 staging 實測或營運配置）；**2 項仍待後續**（見 §14.3）。

---

## 2. P0 — 上線阻塞項

### 2.1 綠界 ECPay 金流整合 ✅ 已實作

| 項目 | 狀態 | 涉及檔案 |
| --- | --- | --- |
| 付款表單產生 | ✅ `buildCheckoutForm` + CheckMacValue SHA256 | `PaymentServiceImpl.java` |
| 退款 API | ✅ `DoAction` Action=R + RtnCode 驗證 | 同上 |
| 加時即時付款 | ✅ `EXT{orderId}` 獨立交易號 + 回呼入帳 | 同上、`OrderController` |
| CheckMacValue 驗證 | ✅ 計算 + callback 驗簽 | 同上 |
| App WebView 加時付款 | ✅ `ExtraTimePaymentScreen.tsx` | `wanderlens-app` |

**部署待辦**：設定 `ECPAY_MERCHANT_ID` / `HASH_KEY` / `HASH_IV` / `ECPAY_MODE`；**2026-06-27 本地 staging**：官方測試商戶 + `simulate-success` + `payment-staging` E2E 1/1 通過。

### 2.2 Google Maps API ✅ 已實作

| 項目 | 狀態 | 涉及檔案 |
| --- | --- | --- |
| Directions 距離 | ✅ JSON 解析 | `GoogleMapsUtil.java` |
| Geocoding | ✅ lat/lng 回傳 | 同上 |
| Places Autocomplete | ✅ `/google/places/autocomplete` | `GoogleController.java` |
| 交通費串接 | ✅ `SearchServiceImpl.resolveTransportationFee` | 同上 |

### 2.3 LINE Messaging API ✅ 已實作

| 項目 | 狀態 | 涉及檔案 |
| --- | --- | --- |
| Webhook 綁定 | ✅ follow/message + `BIND <empno>` | `LineController.java` |
| `line_user_id` | ✅ V010 migration + Entity | `User.java` |
| 通知通道 | ✅ 優先 `lineUserId`，fallback `lineToken` | `NotifyServiceImpl.java` |

### 2.4 RAW 分段上傳 ⚠️ 程式完成，待 staging 實測

| 項目 | 狀態 | 涉及檔案 |
| --- | --- | --- |
| Provider 上傳 UI | ✅ | `RawUploader.vue` |
| Media 分段 API | ✅ | `wanderlens-media/app/api/upload.py` |
| 驗收失敗通知 | ✅ | `MediaInterfaceServiceImpl.java` |
| **大檔 E2E 實測** | ⚠️ 需 MinIO + media 環境 | — |

### 2.5 端對端整合測試 ✅ 已跑通（2026-06-27）

| 項目 | 狀態 |
| --- | --- |
| Playwright E2E | ✅ 根目錄 `e2e/`（47 項 chromium） |
| CI 整合 | ✅ 根 [.github/workflows/ci-e2e.yml](.github/workflows/ci-e2e.yml)（`wanderlens-infra/.github/workflows/` 為同步副本） |
| **最新結果** | **42 passed** / **1 failed** / **4 skipped** |
| 失敗項 | `app-flow` Google Places（需 `GOOGLE_PLACES_API_KEY` 或 staging key） |
| 略過項 | Expo App UI ×3（需 `expo start --web` :8081）、完整媒合流程 ×1 |
| 已覆蓋 | a11y、album、order-lifecycle、payment-staging、api-error-codes、fulfillment、staging |

---

## 3. P1 — 企劃核心功能 ✅ 已完成

### 3.1 六步預約流程 ✅

| Step | 狀態 | 備註 |
| --- | --- | --- |
| 1 拍攝類型 | ✅ | |
| 2 拍攝配置 | ✅ | 人數/造型師/配置連動 `suggestedConfig` |
| 3 時間地點 | ✅ | Places Autocomplete + 棚拍 StudioCard |
| 4 三池選人 | ✅ | `searchMultiPool` |
| 5 確認總覽 | ✅ | 分項計價 |
| 6 結帳 | ✅ | ECPay 表單 |

**後端**：`MultiPoolSearchServiceImpl` 已啟用 `needStudio` / `needStylist` / `photographerCount` / `configurationId`。

### 3.2 探索頁三池 UI ✅

| 頁面 | 狀態 |
| --- | --- |
| `index.vue` | ✅ 三池 API 串接 |
| `photographer-list.vue` | ✅ 分 pool 呼叫 API + poolCounts |

### 3.3 三供給池 ✅

三池媒合、雙機、配置對照表均已串接前後端。

### 3.4 訂單執行與治理 ✅

| 項目 | 狀態 |
| --- | --- |
| 24h 自動 rematch | ✅ `CronTaskManager.autoRematchNoContact` |
| 暫停一週 + 到期恢復 | ✅ `suspendedUntil` + `restoreSuspendedProviders` |
| 消費者評價 POST + UI | ✅ API + Web/App |
| 加時確認 + 付款 | ✅ confirm → paymentForm → WebView |
| SLA 起算點 | ✅ 從 `ShootEvent SHOOT_END` |
| RAW 驗收失敗通知 | ✅ |

### 3.5 精修加購 ✅

Web `albums/[id].vue` + App `AlbumDetailScreen` 均已串 `retouch-api`。

### 3.6 通知與 SMS ✅

| 項目 | 狀態 |
| --- | --- |
| Twilio SMS | ✅ REST API 實作 | `SmsChannel.java` |
| WhatsApp（跨境） | ✅ 骨架 | `WhatsAppChannel.java` |
| Email | ⚠️ 需 SMTP 正式環境 | |

### 3.7 Provider / Admin ✅

| 項目 | 狀態 |
| --- | --- |
| 縣市→鄉鎮區 | ✅ areas/tree |
| Geocoder | ✅ `/google/maps/geocode` |
| AI 介入 | ✅ `AiMonitor.vue` + `/media/intervene` |
| 圖片上傳 | ✅ `LocalFileStorageService` |

### 3.8 供給端角色分工 ✅

| 項目 | 狀態 |
| --- | --- |
| 造型師專用 UI | ✅ `StylistDashboard.vue` + 選單分流 |
| 雙攝影師訂單顯示 | ✅ `OrderDetail.vue` |

### 3.9 App 預約 parity ✅（2026-06-25 對外標準強化）

| 項目 | 狀態 |
| --- | --- |
| 6 步預約 | ✅ `BookingScreen.tsx` |
| 三池媒合 | ✅ `searchMultiPool` |
| **App 內 ECPay 結帳** | ✅ `PaymentWebViewScreen` + `paymentApi.ecpayCheckout` |
| DatePicker / 時間選擇 | ✅ `@react-native-community/datetimepicker` |
| 地點選擇（縣市 + 熱門） | ✅ `LocationPicker.tsx` |
| 加時確認 + WebView 付款 | ✅ |
| 相簿全螢幕預覽 + 下載 | ✅ `PhotoViewerModal.tsx` |
| Design System | ✅ `ScreenHeader` / `StateView` / `Button` |
| i18n zh/en | ✅ `src/i18n` + 設定頁切換 |
| Expo Web SecureStore | ✅ `secureStorage.ts` localStorage fallback |
| CORS :8081 | ✅ API `SecurityConfig` / `CorsConfig` |
| **Code Review P0 修復** | ✅ OrderResultURL、Web form submit、建單/取表單拆分、i18n Context |

**仍待後續（非本期）：** Google Places autocomplete、Expo Push 真推播、App E2E（Maestro/Detox）、出境旅拍頁

---

## 4. P2 — Phase 3 進階

| 項目 | 狀態 | 備註 |
| --- | --- | --- |
| SEO JSON-LD | ✅ | `useJsonLd.ts` — 地點頁、入境頁 |
| 分享品牌印記 | ✅ | media `preview_service.py` 水印 |
| App expo-linking 分享 | ✅ | `AlbumDetailScreen.tsx` |
| 旅遊回顧召回 | ✅ | `CronTaskManager.travelRecall` |
| 公開激勵 | ✅ | `PublicIncentiveService` — 授權公開發優惠碼 |
| 場景標籤 AI 辨識 | ⚠️ | 仍為規則式標籤，非 ML 影像辨識 |
| 拍攝歷程 UI | ⚠️ | API 有，Web/App 時間軸可再美化 |
| AI 調色 ML 升級 | ⚪ | 長期 roadmap |
| 法律條款 UI | ⚪ | 需法務文案 |

---

## 5. P3 — Phase 4 數據變現

| 項目 | 狀態 |
| --- | --- |
| Affiliate 後端 API | ✅ `AffiliateController` + V010 schema |
| 推薦碼追蹤 | ✅ click + conversion |
| 場景推薦 | ✅ `SceneRecommendationController` |
| 市場訊號儀表板 | ✅ `MarketSignalController` |
| 成效報表（Admin UI） | ✅ | `MarketSignalDashboard.vue` ECharts 圖表 |
| 商業內容治理規則引擎 | ⚪ |

---

## 6. P3 — Phase 5 跨境網絡

| 模組 | 狀態 |
| --- | --- |
| 多語網站 | ⚠️ zh/en/jp/ka JSON + 入境頁 |
| 多幣別展示 | ✅ `CurrencyController` TWD/USD/JPY/KRW |
| 入境旅拍頁 | ✅ `inbound-travel.vue` |
| 出境旅拍 | ⚪ 未做 |
| WhatsApp 通知 | ✅ 通道已建，需 Meta 憑證 |
| 跨境推薦完整流程 | ⚠️ referral + market_signal 有，UI 待深化 |
| 海外供給招募 | ⚪ |
| 溝通翻譯輔助 | ⚪ |

---

## 7. 基礎設施

| 項目 | 狀態 |
| --- | --- |
| docker-compose | ✅ |
| E2E CI | ✅ `ci-e2e.yml` |
| 金流單元測試 | ✅ `PaymentCheckMacTest.java` |
| 正式雲端部署驗收 | ⚠️ 待 INF 對照 |
| RAW 大檔 staging 實測 | ⚠️ 待執行 |

---

## 8. 依子專案匯總（更新後）

| 子專案 | 狀態 | 剩餘 |
| --- | --- | --- |
| wanderlens-api | ✅ 核心完成 | staging 金流實測 |
| wanderlens-web | ✅ | SEO 可擴更多頁；**Wave 1–4**：品牌 token、toast、dark mode、相簿 parity、E2E |
| wanderlens-provider | ✅ | i18n + build ✅ |
| wanderlens-admin | ✅ | i18n + build ✅ |
| wanderlens-media | ✅ | RAW 大檔實測 |
| wanderlens-app | ✅ | `npm install` webview |
| wanderlens-infra | ⚠️ | 正式環境驗收 |
| wanderlens-retouch | ✅ | — |

---

## 9. 企劃書章節對照（更新後）

| 章節 | 狀態 |
| --- | --- |
| §3 三供給池 | ✅ |
| §4.1 六步預約 | ✅ |
| §4.2 訂單執行 | ✅ |
| §5.1 精修加購 | ✅ |
| §5.2 內容飛輪 | ✅ 大部分 |
| §5.3 廣告聯盟 | ⚠️ 75% |
| §8 跨境策略 | ⚠️ 55% |
| §9 階段四、五 | ⚠️ 已啟動 |

---

## 10. 建議修復順序（更新後）

### ✅ 已完成（原第一～三輪）

1.–15. 見 §14.1 實作清單

### 待執行（上線前）

1. **Staging ECPay 端對端**：下單 → 付款 → WaitingProviderContact → 聯繫 → 起拍 → RAW → AI → 相簿
2. **RAW >100MB 實測**：MinIO + media + provider 三方
3. **正式環境變數**：ECPay / Google / LINE / Twilio / WhatsApp / SMTP
4. **App 依賴安裝**：`wanderlens-app` 執行 `npm install`（含 `react-native-webview`）

### 中長期（P2/P3 剩餘）

5. Admin 市場訊號 / Affiliate 成效圖表
6. 出境旅拍、溝通翻譯、ML 場景標籤
7. 法律條款與下單同意流程

---

## 11. 驗收完成定義

### 階段一～二完整

- [x] 消費者可完成：選類型（自動配置）→ 選時間地點（含棚拍選棚）→ 三池選人 → 付款成功
- [x] 攝影師 24h 未聯繫會自動 rematch，且懲罰分級含暫停一週
- [x] RAW 上傳、AI 調色、48h 內相簿交付在 **staging 環境 E2E 通過**（**2026-06-27**：`staging-flow` 6/6、`core-flow` 8/8、`album-flow` 5/5（含 PhotoViewer／收藏）、`fulfillment-flow` 1/1 — 起拍→RAW 驗收→`ai-complete`→消費者相簿；對 `localhost:3001` docker web + API）
- [x] 加時可完成第二次付款（App WebView + ECPay）
- [x] 消費者結案後可評價攝影師
- [x] 精修加購在 Web 與 App 均可發起並走完工單

### 階段三完整

- [x] 公開相簿、SEO 頁（JSON-LD）、分享工具已實作
- [ ] 回訪召回推播**生產環境實測成功**（排程已有，待 Expo push token 驗證）

### 階段四～五（部分）

- [x] Affiliate API + 場景推薦 + 市場訊號
- [x] 入境旅拍頁 + 多幣別換算
- [ ] 跨境推薦完整營運閉環
- [ ] 出境旅拍

---

## 12. 第二次交叉審查（維持原記錄）

見原 §12.1–12.3，均已納入本次實作。

---

## 13. 相關文件

| 文件 | 用途 |
| --- | --- |
| `在地隨選攝影平台_商業企劃書.md` | 需求來源 |
| `WanderLens_04_階段化產品路線.md` | 階段定義 |
| `WanderLens_08_開發盤點與CodeReview報告.md` | 前次盤點 |
| 各子專案 `TASK_PLAN.md` | 任務級追蹤 |

---

## 14. 完整強化實作紀錄（2026-06-25）

### 14.1 本次新增／修改重點

#### 後端 `wanderlens-api`

| 模組 | 檔案 | 內容 |
| --- | --- | --- |
| 金流 | `PaymentServiceImpl.java` | ECPay 表單、退款、加時 EXT{orderId}、Paid→WaitingProviderContact |
| 排程 | `CronTaskManager.java` | 24h rematch、暫停恢復、旅遊召回、SLA ShootEvent |
| 三池 | `MultiPoolSearchServiceImpl.java` | 完整三池邏輯 |
| Maps | `GoogleMapsUtil.java`, `SearchServiceImpl.java` | Directions/Geocode/Autocomplete + 交通費 |
| LINE | `LineController.java`, V010 | Webhook 綁定 |
| Phase 4 | `AffiliateController`, `SceneRecommendationController` | 聯盟 + 場景推薦 |
| Phase 5 | `MarketSignalController`, `CurrencyController`, `WhatsAppChannel` | 訊號 + 多幣 + WhatsApp |
| 媒體 | `MediaInterfaceServiceImpl.java`, `MediaController.java` | 驗收通知 + Admin 介入 |
| 內容 | `LocalFileStorageService`, `PublicIncentiveService` | 上傳 + 公開激勵 |
| 通知 | `SmsChannel.java`（Twilio）, `NotifyServiceImpl.java` | SMS + WhatsApp |
| Migration | V010, V011 | 缺口 schema + ecpay_trade_no |

#### 前端

| 專案 | 重點 |
| --- | --- |
| wanderlens-web | 6 步預約、三池、精修、Places、入境頁、JSON-LD |
| wanderlens-app | 6 步預約、ECPay WebView 結帳、DatePicker、地點選擇、相簿全螢幕、i18n、Design System |
| wanderlens-provider | Geocoder、造型師 UI、雙機訂單顯示 |
| wanderlens-admin | AiMonitor 完整介入、MarketSignalDashboard |
| wanderlens-media | 預覽圖品牌水印 |

#### 測試／CI

| 項目 | 路徑 |
| --- | --- |
| E2E | `e2e/core-flow.spec.ts`, `e2e/staging-flow.spec.ts` |
| CI | `wanderlens-infra/.github/workflows/ci-e2e.yml` |
| 單元測試 | `PaymentCheckMacTest.java` |

### 14.2 Bugbot Review 已修復項

| 問題 | 修復 |
| --- | --- |
| 加時 MerchantTradeNo 無法還原 | 改 `EXT{orderId}` |
| 付款後未進 WaitingProviderContact | 雙段 transition |
| 加時未收款即入帳 | 付款回呼才入帳 |
| 退款未驗證綠界 | 解析 RtnCode |
| 媒體介入非法轉狀態 | 改為僅通知 |
| city 誤塞完整地址 | 拆分 shootingLocation |
| Directions 失敗交通費為 0 | distance≤0 fallback |
| AuthUtil 靜態誤用 | Content/MarketSignal/Studio 改注入 authUtil |
| OrderServiceImpl Provider 型別 | 補全 qualified name |

### 14.3 仍待人工驗收（非程式缺口）

| 項目 | 原因 |
| --- | --- |
| Staging ECPay 真實交易 | 需商戶測試環境憑證 |
| RAW >100MB 斷點續傳 | 需 MinIO + 真實大檔 |
| Expo Push 召回推播 | 需裝置 token 實測 |
| 正式 SMTP / WhatsApp Meta | 需第三方帳號開通 |
| 出境旅拍 / ML 場景標籤 | 產品 roadmap 未排本期 |

### 14.4 2026-06-25 追加（Admin 儀表板 + E2E）

| 項目 | 狀態 | 路徑 |
| --- | --- | --- |
| Admin 市場訊號儀表板 | ✅ | `wanderlens-admin/src/views/analytics/MarketSignalDashboard.vue` |
| 側欄入口「市場訊號」 | ✅ | `/analytics/market-signals` |
| App webview 依賴 | ✅ | `react-native-webview` 已 npm install |
| E2E staging 腳本 | ✅ | `e2e/staging-flow.spec.ts`（服務未啟動時自動 skip） |
| E2E 本地執行結果 | ✅ | 2026-06-27：`staging-flow` 6/6、`core-flow` 8/8、`album-flow` 3/3（2 skip）；API docker + Web preview `:3010` |
| API Docker 編譯 | ✅ | 修正 AuthUtil / Provider 型別後 `docker compose --profile api up --build` 成功 |
| DB migration | ⚠️ | 本機已補 `market_signal` 等表；完整 V010/V011 需納入 Flyway 或部署腳本 |

### 14.5 2026-06-25 App 對外標準 UI/UX 強化

| 項目 | 狀態 | 路徑 |
| --- | --- | --- |
| 共用 Design System | ✅ | `src/components/{ScreenHeader,StateView,Button,DateTimeField,LocationPicker,PhotoViewerModal}.tsx` |
| 品牌登入頁 | ✅ | `LoginScreen.tsx` — 主色 `#F37A69`、錯誤提示 |
| 預約 ECPay 結帳 | ✅ | 建單 → `PaymentWebViewScreen`（不再跳 Web） |
| 訂單待付款 | ✅ | `OrderDetailScreen` → WebView 付款 |
| 相簿 UX | ✅ | 下拉刷新、全螢幕、下載、精修 userId 修正 |
| 導航返回鍵 | ✅ | `TabNavigator` stack header |
| i18n | ✅ | `src/i18n` + `SettingsScreen` 語言切換 |
| Web 儲存 | ✅ | `secureStorage.ts` |
| DateTimePicker | ✅ | `@react-native-community/datetimepicker` |

**Staging E2E 執行方式：**

```bash
# 1. 基礎服務 + API（wanderlens-infra 目錄）
docker compose up -d mysql redis minio
docker compose --profile api up -d --build api

# 2. Web（wanderlens-web 目錄，尚無 Dockerfile）
npm run dev   # :3001

# 3. 根目錄執行
npm run test:e2e:staging
npm run test:e2e          # core-flow 8 項
```

### 14.6 2026-06-25 App 上架剩餘項（本輪完成）

| 項目 | 狀態 | 路徑 |
| --- | --- | --- |
| Google Places autocomplete | ✅ | `LocationPicker.tsx` + `googleApi` + `utils/googlePlaces.ts` |
| 經緯度媒合 | ✅ | `BookingScreen` 傳 `lat`/`lng` 至三池搜尋 |
| axios Result 業務錯誤 | ✅ | `api/client.ts` — `code !== '200'` 自動 reject |
| 全 App i18n 擴充 | ✅ | `locales/zh.json`、`en.json`；Booking/Settings/Notification/DateTimeField |
| Notification Design System | ✅ | `NotificationScreen` — ScreenHeader + StateView + notifyApi |
| DateTimeField Web 原生 input | ✅ | `<input type="date/time">` |
| Expo Push 骨架 | ✅ | `hooks/usePushNotifications.ts` + Settings 開關 |
| App E2E（Expo Web） | ✅ | `e2e/app-flow.spec.ts` — `npm run test:e2e:app` |

**App E2E 執行方式：**

```bash
# API
docker compose --profile api up -d --build api

# App Expo Web（wanderlens-app 目錄）
npm run web   # :8081

# 根目錄
npm run test:e2e:app
```

### 14.7 2026-06-25 站內訊息完整實作

| 項目 | 狀態 | 路徑 |
| --- | --- | --- |
| 三通道架構（ORDER/CS/ADMIN，各為雙邊） | ✅ | `Conversation.java`、`ConversationServiceImpl` |
| 付款開啟訂單房 + 造型師獨立房 | ✅ | `PaymentServiceImpl` |
| 結案自動唯讀 / 爭議重新開啟 | ✅ | `OrderServiceImpl.transition` |
| 列表聚合 lastMessage / unreadCount / peerName | ✅ | `ConversationSummaryDto` |
| 客服通道 API | ✅ | `POST /conversations/customer-service` |
| 管理通道 API | ✅ | `POST /conversations/admin-channel` |
| 後台客服訊息 UI | ✅ | `wanderlens-admin/.../SupportChat.vue` |
| App 訊息 UX（唯讀/markAsRead/圖片/polling） | ✅ | `ConversationRoomScreen.tsx` |
| Web / Provider 對齊 | ✅ | `conversations/*`、`ConversationRoom.vue` |
| E2E conversation API | ✅ | `e2e/conversation-api.spec.ts` |

### 14.8 2026-06-27 Web / Provider / Admin 三波強化

| Wave | 項目 | 狀態 | 路徑 / 備註 |
| --- | --- | --- | --- |
| **Wave 1** | 品牌 token `#F37A69` 對齊 App | ✅ | `wanderlens-web/tailwind.config.ts`、`main.css` |
| **Wave 1** | axios singleton + login/register 走 auth-api | ✅ | `wanderlens-web/src/api/request.ts` |
| **Wave 1** | provider/admin Result code 攔截 | ✅ | `*/src/api/request.ts` |
| **Wave 1** | WlStateView 相簿/登入三態 | ✅ | `WlStateView.vue`、`albums/*` |
| **Wave 2** | useToast + 相簿 alert 清零 | ✅ | `composables/useToast.ts`、`albums/[id].vue` |
| **Wave 2** | PhotoViewer + AlbumConsentSheet + favorites | ✅ | `components/album/*` |
| **Wave 2** | provider i18n 側欄 + admin header i18n | ✅ | `*/src/i18n/`、`DefaultLayout.vue` |
| **Wave 2** | E2E 相簿 smoke | ✅ | `e2e/album-flow.spec.ts` |
| **Wave 3** | Admin 側欄全 i18n + 語言切換 | ✅ | `wanderlens-admin` `WlLangSwitcher.vue` |
| **Wave 3** | Provider 語言切換 | ✅ | `wanderlens-provider` `WlLangSwitcher.vue` |
| **Wave 3** | Web dark mode（class + CSS vars） | ✅ | `useColorScheme.ts`、`ThemeToggle.vue` |
| **Wave 3** | 全站 alert→toast（profile/orders/checkout） | ✅ | 相簿外剩餘 alert 已清 |
| **Wave 3** | E2E viewer / favorite 互動 | ✅ | `album-flow.spec.ts` 擴充 |
| **Wave 4** | Web dark polish（預約／攝影師列表 token） | ✅ | `--wl-bg-card`、`booking/index.vue`、`photographer-list.vue` |
| **Wave 4** | ElConfigProvider 語系切換 | ✅ | provider/admin `App.vue` + `getElementLocale()` |
| **Wave 4** | Admin 登入 i18n + Provider 登入 i18n | ✅ | `*/views/auth/Login.vue` |
| **Wave 4** | admin `vue-tsc` build 修復 | ✅ | `AppFlowMaintain`、`NotificationList`、`PhotographerList`、`ScheduleDashboard` |
| **Wave 4** | provider `vue-tsc` build 修復 | ✅ | `MyOrder.vue` `statusTagType` |
| **Wave 4** | admin `markNotifyRead` API | ✅ | `POST /notify/read/{id}` |

**仍待後續（非 Wave 4 範圍）：**

| 項目 | 優先級 | 狀態 | 說明 |
| --- | --- | --- | --- |
| Web dark mode 全頁視覺 polish | P2 | ✅ 部分 | `wl-card`/`wl-surface` token 化；orders/profile/booking 等已對齊 |
| Web en/jp/ka album keys | P2 | ✅ | `album.*` consent/favorite/retouch 全語系 |
| provider 高頻頁 i18n | P2 | ✅ 部分 | 登入、Notifications、Profile |
| admin/provider 各 view 頁 i18n | P2 | 🟡 部分 | 訂單／媒體／收益／儀表板已 i18n；其餘 CRUD 表單仍硬編碼 |

### 14.6 P2 收尾（2026-06-27）

| 項目 | 狀態 | 說明 |
| --- | --- | --- |
| UTF-8 損壞修復 | ✅ | PowerShell 批次替換導致多檔亂碼；已還原 `inbound-travel.vue` script、`photographer-list.vue`、`AppFooter`、`HeroBanner`、`WlToastHost`、`ThemeToggle`、`PhotoViewer` 等 |
| 三端 `npm run build` | ✅ | web / provider / admin 均通過 |
| `index.vue` 首頁 | ✅ | 已還原完整版：作品 mosaic、全類型網格、三池精選、流程、景點、招募；Hero 保留 i18n |
| Web 註解／UI 亂碼清零 | ✅ | `AppHeader`（返回／搜尋）、`PhotoViewer`（關閉／下載／上一張／下一張）、`AppFooter`（服務類型／聯絡／版權連結）、`search.vue` emoji；註解已清理 |
| 首頁／入境旅拍 dark mode | ✅ | `index.vue`／`inbound-travel.vue` scoped 樣式改 `--wl-*` token；`main.css` 補 inbound 深色規則 |
| Staging E2E 複跑 | ✅ | 見 §11；另修 `SecurityConfig` 公開 API、`/booking` 移除誤加 auth、`album-flow` cookie+localStorage 登入 |
| RAW 履約 E2E | ✅ | 新增 `/media/ai-complete`、`fulfillment-flow.spec.ts`；`seed-demo-content.sql` 補 `media_asset` + `DEMO-FFL` |
| Docker web 映像 | ✅ | `docker compose build web` 已重建，`:3001` 與最新 `.output` 同步 |
| Docker provider/admin 映像 | ✅ | `docker compose build provider admin` 已重建，`:3002` / `:3003` 同步 |
| API 媒體管線修補 | ✅ | `upload-token` 改 `ProviderIdResolver`；`ShootingEnded`→`UploadingRaw` 於核發 token 時轉移 |
| ECPay staging | ✅ | 官方測試商戶金鑰寫入 `.env`；`POST /payment/staging/simulate-success`；`payment-staging.spec.ts` 1/1 |
| provider/admin 業務 i18n | ✅ 部分 | `useOrderStatus` composable；`MyOrder`/`Earnings`/`RawVerify`/`OrderList`/`Dashboard` 已 i18n |

### 14.7 品質衝刺 Q1（2026-06-27）

| 項目 | 狀態 | 說明 |
| --- | --- | --- |
| 狀態機 Draft→PendingPayment | ✅ | `PaymentServiceImpl.generateEcpayCheckout` 進入結帳時轉移；callback 冪等強化 |
| 狀態機 Confirmed→ReadyToShoot | ✅ | `POST /orders/confirm-ready/{orderId}`；Provider `OrderDetail`/`MyOrder` UI |
| Web 行動導覽 | ✅ | `AppHeader` 漢堡選單 + drawer；`data-testid`；nav i18n 補齊 |
| E2E 狀態機 | ✅ | `order-lifecycle.spec.ts`、`payment-staging` 補 PendingPayment 斷言 |
| E2E 行動導覽 | ✅ | `mobile-nav.spec.ts` |
| 單元測試 | ✅ | `PaymentServiceImplCheckoutTest` |

### 14.8 品質衝刺 Q2（2026-06-27）

| 項目 | 狀態 | 說明 |
| --- | --- | --- |
| Provider/Admin 響應式 | ✅ | stat card `xs/sm/md`、表格 `wl-table-scroll`、小螢幕側欄自動收合 |
| Provider 錯誤/載入 | ✅ | `MyOrder` `v-loading`；`ConversationList` 錯誤態 + i18n |
| Admin GenericCrud i18n | ✅ | 搜尋/新增/編輯/刪除/表單訊息全走 locale |
| Admin Dashboard i18n | ✅ | 地區分布、操作日誌表頭 |
| Web 關鍵頁狀態 | ✅ | `photographer/[uuid]`、`orders/[id]` 改用 `WlStateView` |

### 14.9 品質衝刺 Q3（2026-06-27）

| 項目 | 狀態 | 說明 |
| --- | --- | --- |
| Web 首頁 i18n | ✅ | `index.vue` 行銷區塊改 `$t`；zh/en/jp/ka `home.*` 補齊 |
| Provider 表單 i18n | ✅ | `BasicInfo`、`Schedule`、`ConversationRoom` + locale |
| PaymentController 錯誤碼 | ✅ | 統一 `ResultCode`（`order_not_found` / `403`） |
| 狀態機單元測試 | ✅ | `OrderServiceImplTransitionTest` |

### 14.10 品質衝刺 Q4（2026-06-27）

| 項目 | 狀態 | 說明 |
| --- | --- | --- |
| Web a11y 基線 | ✅ | `WlSkipLink`、`#main-content` landmark、AppHeader Escape/aria、登入 label |
| Provider a11y 基線 | ✅ | skip link、sidebar/user aria、`focus-visible`、登入 `aria-label` |
| Admin a11y 基線 | ✅ | 同 Provider 模式 |
| E2E a11y | ✅ | `e2e/a11y-baseline.spec.ts`（skip link、Escape、登入 label） |

### 14.11 品質衝刺收尾（2026-06-27）

| 項目 | 狀態 | 說明 |
| --- | --- | --- |
| API 錯誤碼全面統一 | ✅ | Album/Booking/Conversation/Media/Notify/Retouch/Auth/Admin/Line + `OrderController` NOT_FOUND |
| `ResultCode` 擴充 | ✅ | notification/user/retouch/slot/service_unauthorized/conflict |
| Provider 次要頁 i18n | ✅ | Terms/BankInfo/Rating/Features/PhotoWorks/ServiceArea/RawUpload/ChangePassword/AccountDetail |
| RawUpload 訂單 API | ✅ | 改為 `/orders/provider`（修正原 `/orders/my`） |
| API 錯誤碼 E2E | ✅ | `e2e/api-error-codes.spec.ts` |
| OrderController 單元測試 | ✅ | `OrderControllerNotFoundTest` |

**注意**：勿以 PowerShell `Get-Content` / `Set-Content` 批次改寫 UTF-8 的 `.vue` 檔。

### 14.12 子專案文件同步（2026-06-27）

| 項目 | 狀態 | 說明 |
| --- | --- | --- |
| 九子專案 README | ✅ | 各加「現況快照」、Docker/E2E/示範帳號 |
| `wanderlens-provider-app/README.md` | ✅ | 新建（原缺） |
| `wanderlens-api/API_SPEC.md` | ✅ | §1.3 語意化 `ResultCode` |
| `wanderlens-infra/README.md` | ✅ | 重建映像、E2E 指令 |
| `WanderLens_06` | ✅ | 目錄樹 + provider-app 職責 + 依賴圖 |
| 各 `TASK_PLAN.md` | ✅ | Phase 4 品質衝刺 Q1–Q4 摘要 |
| 各 `ARCHITECTURE.md` / `DEVELOPMENT_PLAN.md` | ✅ | 頂部「文件狀態」註記；詳情以 README + 本文件為準 |

### 14.13 修訂版 A — repo 根治理（2026-06-27 執行）

| 項目 | 狀態 | 說明 |
| --- | --- | --- |
| 根 `README.md` | ✅ | 子專案表、Docker、E2E、新功能決策表 |
| 根 `.gitignore` | ✅ | test 產物、`*.log`、`pw/` node_modules |
| `docs/README.md` | ✅ | 文件索引；**未搬移**根目錄 `.md`（保留 `../WanderLens_*` 連結） |
| `JS/README.md` | ✅ | 標記 joyshot 唯讀參考 |
| 根 `.github/workflows/` | ✅ | 自 infra 同步 7 份 workflow |
| `test:e2e:all` | ✅ | 根 `package.json` |
| 子專案 rename | ⛔ 未做 | 維持 `wanderlens-*` |
| `e2e/` 搬移 | ⛔ 未做 | 避免動 `playwright.config.ts` |

**2026-06-27 複查**：根/infra 7 份 workflow 內容 hash 一致；`docs/README` 連結 13 份平台文件均存在（無 `WanderLens_00` 檔）。九子專案 README 已加 [Monorepo 總覽](../README.md) 連結。`npm run test:e2e:all`：**42 passed / 1 failed / 4 skipped**（失敗：Google Places key）。

### 14.14 仍待人工驗收（非程式缺口）

同 §14.3。**E2E 全套**見 §2.5（42 passed / 1 failed / 4 skipped，2026-06-27）；生產推播與綠界真實刷卡仍待測。

---

*文件結束 — 2026-06-27 修訂版 A 根治理（README / gitignore / CI / docs 索引）*
