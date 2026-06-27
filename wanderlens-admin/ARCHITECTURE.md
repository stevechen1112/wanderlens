# wanderlens-admin 技術架構

> **文件狀態**：架構說明仍有效；功能現況以 [README.md](./README.md) 與 [WanderLens_09](../WanderLens_09_待補強與缺口清單.md) 為準。最後對照程式碼：**2026-06-27**。

---

## 1. 技術選型

| 項目 | 選擇 | 理由 |
|------|------|------|
| 框架 | Vue 3 + Vite | 管理後台 |
| UI | Element Plus | 沿用 JS 精神 |
| 狀態 | Pinia | |
| 圖表 | ECharts | Dashboard |
| 富文本 | vue2-editor 替代品 | 內容編輯 |

## 2. 頁面結構

```
/login                ← 登入
/dashboard            ← 主控台
/data/users           ← 使用者管理
/data/roles           ← 角色管理
/data/areas           ← 行政區域
/data/services        ← 服務項目
/data/faqs            ← FAQ
/data/banner          ← Banner
/data/news            ← News
/data/attraction      ← 景點
/data/instagram       ← IG
/photographer/maintain    ← 攝影師列表
/photographer/detail/:id  ← 攝影師詳情
/photographer/dashboard   ← 時段主控台
/photographer/broadcast   ← LINE 群發
/customers            ← 客戶管理
/orders               ← 訂單管理（5 狀態分頁）
/orders/:id           ← 訂單詳情
/media/verify         ← RAW 驗收
/media/ai-monitor     ← AI 交付監控
/finance/ledger       ← 清算帳本
/finance/payout       ← 撥款
/finance/refund       ← 退款
/support/dispute      ← 爭議處理
/support/conversation ← 溝通調閱
/campaign/coupons     ← 優惠券
/affiliate            ← 推廣員
/settings/dictionary  ← 字典
/settings/menu        ← 選單
/settings/flow        ← 通知流程
```

## 3. 與其他子專案的關係

```
wanderlens-admin ──→ REST API ──→ wanderlens-api
               └──→ 媒體狀態 ──→ wanderlens-media（透過 api 中介）
```

## 4. 配色

| 色碼 | 用途 |
|------|------|
| `#333333` | Sidebar |
| `#f27968` | 主色 |
| `#484e5c` | Footer |

---

*文件建立日期：2026-06-23*