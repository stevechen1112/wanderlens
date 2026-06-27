# wanderlens-web 技術架構

> **文件狀態**：架構說明仍有效；功能現況以 [README.md](./README.md) 與 [WanderLens_09](../WanderLens_09_待補強與缺口清單.md) 為準。最後對照程式碼：**2026-06-27**。

---

## 1. 技術選型

| 項目 | 選擇 | 理由 |
|------|------|------|
| 框架 | Nuxt 3（Vue 3 + SSR + SSG） | SEO 內容池需要 SSR，Phase 3 SEO 頁需要伺服器渲染；SSG 用於靜態內容頁 |
| UI | Tailwind CSS + 自訂元件 | 現代化、輕量、不同於後台的 Element Plus |
| 狀態 | Pinia | Vue 3 官方推薦 |
| HTTP | Axios | 攔截器設計 |
| i18n | vue-i18n 9.x | 四語系 |
| 地圖 | Google Places API | 透過 api 代理 |

## 2. 頁面結構

```
/                     ← 首頁
/search               ← 搜尋結果
/photographer/:uuid   ← 攝影師詳情
/booking              ← 預約流程（Step 1-6）
/checkout             ← 結帳
/thankyou/:tradeNo    ← 付款結果
/albums               ← 我的相簿（需登入）
/albums/:id           ← 相簿詳情
/conversations        ← 站內溝通（需登入）
/faq                  ← FAQ
/privacy-policy       ← 隱私政策
/location/:name       ← 地點靈感頁（Phase 3）
/service/:type        ← 拍攝類型頁（Phase 3）
```

## 3. 與其他子專案的關係

```
wanderlens-web ──→ REST API ──→ wanderlens-api
```

- 所有資料來自 api
- 不直接接觸 media（媒體透過 api 中介）
- 與 app 互補：web 獲客，app 留存

## 4. 配色系統（沿用 JS 精神，現代化調整）

| 色碼 | 用途 |
|------|------|
| `#f37a69` | 主色珊瑚紅（強調、按鈕） |
| `#52b6cc` | 次色青藍（輔助） |
| `#333333` | 深色文字 |
| `#f5f5f5` | 淺灰背景 |

---

*文件建立日期：2026-06-23*