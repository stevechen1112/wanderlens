# wanderlens-provider 技術架構

> **文件狀態**：架構說明仍有效；功能現況以 [README.md](./README.md) 與 [WanderLens_09](../WanderLens_09_待補強與缺口清單.md) 為準。最後對照程式碼：**2026-06-27**。

---

## 1. 技術選型

| 項目 | 選擇 | 理由 |
|------|------|------|
| 框架 | Vue 3 + Vite | 管理後台不需要 SSR |
| UI | Element Plus | Vue 3 最主流企業級 UI 庫，與 admin/retouch 一致 |
| 狀態 | Pinia | Vue 3 官方推薦 |
| HTTP | Axios | 攔截器 |
| i18n | vue-i18n 9.x | zh/en |

## 2. 頁面結構

```
/login                ← 登入
/account              ← 攝影師資料維護（7 分頁）
  ├── basic-info      ← 基本資料
  ├── schedule        ← 接案時段
  ├── service-area    ← 服務地區
  ├── bank-info       ← 匯款資料
  ├── features        ← 特色資料
  ├── photo-works     ← 作品集
  └── rating          ← 評價
/my-order             ← 我的訂單
/my-order/:id         ← 訂單詳情（拍攝節點 + RAW 上傳）
/conversations        ← 溝通室列表
/conversations/:id    ← 溝通室
/profile              ← 個人訊息
/change-password      ← 密碼變更
/notifications        ← 通知列表
```

## 3. RAW 上傳架構

```
攝影師端（provider）
    │
    ├── JPEG 快路徑 ──→ wanderlens-media（直接上傳）
    │
    └── RAW 上傳 ──→ wanderlens-media（分段上傳 + 斷點續傳）
                         │
                         └── 回報狀態 ──→ wanderlens-api
```

- provider 直接對接 media 的上傳端點（不經過 api）
- 上傳憑證（token）由 api 核發
- 驗收結果由 media 回報給 api

## 4. 與其他子專案的關係

```
wanderlens-provider ──→ REST API ──→ wanderlens-api
                 └──→ 上傳端點 ──→ wanderlens-media
```

## 5. 配色（沿用 JS 精神）

| 色碼 | 用途 |
|------|------|
| `#333333` | Sidebar 背景 |
| `#f27968` | 活躍色 |
| `#484e5c` | Footer |

---

*文件建立日期：2026-06-23*