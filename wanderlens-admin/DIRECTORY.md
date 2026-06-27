# wanderlens-admin 目錄結構

> **文件狀態**：目錄樹為概略；以實際 repo 為準。現況見 [README.md](./README.md)。最後對照：**2026-06-27**。

```
wanderlens-admin/
├── README.md
├── DEVELOPMENT_PLAN.md
├── TASK_PLAN.md
├── ARCHITECTURE.md
├── DIRECTORY.md                  ← 本文件
├── package.json
├── vite.config.ts
├── tsconfig.json
├── .env.example
├── public/
│   └── favicon.ico
└── src/
    ├── App.vue
    ├── main.ts
    ├── api/
    │   ├── request.ts
    │   ├── auth-api.ts
    │   ├── user-api.ts
    │   ├── provider-api.ts
    │   ├── customer-api.ts
    │   ├── order-api.ts
    │   ├── payment-api.ts
    │   ├── ledger-api.ts
    │   ├── media-api.ts          # RAW 驗收/AI 監控
    │   ├── conversation-api.ts   # 溝通調閱
    │   ├── coupon-api.ts
    │   ├── affiliate-api.ts
    │   ├── area-api.ts
    │   └── content-api.ts        # Banner/News/FAQ/景點/IG
    ├── assets/
    │   ├── css/
    │   │   ├── main.css
    │   │   └── variables.css
    │   └── images/
    ├── components/
    │   ├── common/
    │   │   ├── AppHeader.vue
    │   │   ├── AppSidebar.vue
    │   │   ├── AppBreadcrumb.vue
    │   │   ├── AppFooter.vue
    │   │   ├── AppPagination.vue
    │   │   ├── UploadWidget.vue
    │   │   └── RichTextEditor.vue
    │   ├── dashboard/
    │   │   ├── StatCard.vue
    │   │   ├── OrderTrendChart.vue
    │   │   └── AreaDistributionChart.vue
    │   ├── order/
    │   │   ├── OrderTable.vue
    │   │   ├── OrderDetail.vue
    │   │   ├── OrderTimeline.vue     # 狀態歷程時間軸
    │   │   └── ManualOrderForm.vue
    │   ├── media/
    │   │   ├── RawVerifyTable.vue    # RAW 驗收
    │   │   ├── AiSlaMonitor.vue      # AI SLA 倒數
    │   │   └── DeliveryAlert.vue     # 交付異常
    │   ├── finance/
    │   │   ├── LedgerTable.vue
    │   │   ├── PayoutForm.vue
    │   │   └── RefundForm.vue
    │   └── support/
    │       ├── DisputeTable.vue
    │       ├── ConversationViewer.vue # 溝通調閱
    │       └── AccessLogTable.vue
    ├── composables/
    │   ├── useAuth.ts
    │   ├── useRbac.ts             # 動態選單
    │   └── useDashboard.ts
    ├── layouts/
    │   └── DefaultLayout.vue
    ├── router/
    │   └── index.ts
    ├── stores/
    │   ├── auth.ts
    │   ├── menu.ts               # RBAC 動態選單
    │   └── app.ts
    ├── views/
    │   ├── auth/
    │   │   └── Login.vue
    │   ├── dashboard/
    │   │   └── Dashboard.vue
    │   ├── users/
    │   │   ├── UserMaintain.vue
    │   │   ├── RoleMaintain.vue
    │   │   └── MenuMaintain.vue
    │   ├── photographer/
    │   │   ├── PhotographerList.vue
    │   │   ├── PhotographerDetail.vue
    │   │   ├── ScheduleDashboard.vue
    │   │   └── Broadcast.vue      # LINE 群發
    │   ├── customer/
    │   │   └── CustomerMaintain.vue
    │   ├── order/
    │   │   ├── OrderList.vue      # 5 狀態分頁
    │   │   └── OrderDetail.vue
    │   ├── media/
    │   │   ├── RawVerify.vue      # RAW 驗收
    │   │   └── AiMonitor.vue      # AI 交付監控
    │   ├── finance/
    │   │   ├── Ledger.vue
    │   │   ├── Payout.vue
    │   │   └── Refund.vue
    │   ├── support/
    │   │   ├── DisputeList.vue
    │   │   └── ConversationAccess.vue
    │   ├── campaign/
    │   │   └── CouponMaintain.vue
    │   ├── affiliate/
    │   │   ├── AffiliateList.vue
    │   │   └── AffiliateReport.vue
    │   ├── content/
    │   │   ├── BannerMaintain.vue
    │   │   ├── NewsMaintain.vue
    │   │   ├── FaqMaintain.vue
    │   │   ├── AttractionMaintain.vue
    │   │   └── InstagramMaintain.vue
    │   └── settings/
    │       ├── AreaMaintain.vue
    │       ├── ServiceTypeMaintain.vue
    │       ├── DictionaryMaintain.vue
    │       └── FlowSetting.vue
    ├── locales/
    │   ├── zh.json
    │   └── en.json
    ├── utils/
    │   ├── format.ts
    │   ├── validate.ts
    │   └── export.ts             # Excel 匯入匯出
    └── types/
        ├── api.d.ts
        └── order.d.ts
```