# wanderlens-web 目錄結構

> **文件狀態**：目錄樹為概略；以實際 repo 為準。現況見 [README.md](./README.md)。最後對照：**2026-06-27**。

```
wanderlens-web/
├── README.md
├── DEVELOPMENT_PLAN.md
├── TASK_PLAN.md
├── ARCHITECTURE.md
├── DIRECTORY.md                  ← 本文件
├── nuxt.config.ts                # Nuxt 3 配置
├── package.json
├── tsconfig.json
├── tailwind.config.ts            # Tailwind CSS 配置
├── .env.example
├── public/
│   ├── favicon.ico
│   └── images/                   # 靜態圖片
└── src/
    ├── assets/
    │   ├── css/
    │   │   ├── main.css          # 全域樣式 + Tailwind
    │   │   └── variables.css     # CSS Custom Properties（Design Token）
    │   └── images/               # 需處理的圖片
    ├── api/                      # API 整合層
    │   ├── request.ts            # Axios 實例 + 攔截器
    │   ├── auth-api.ts
    │   ├── provider-api.ts
    │   ├── booking-api.ts
    │   ├── order-api.ts
    │   ├── payment-api.ts
    │   ├── album-api.ts
    │   ├── conversation-api.ts
    │   └── content-api.ts        # Banner/News/FAQ/景點
    ├── components/
    │   ├── common/               # 通用元件
    │   │   ├── AppHeader.vue
    │   │   ├── AppFooter.vue
    │   │   ├── SearchBar.vue
    │   │   ├── LanguageSwitcher.vue
    │   │   ├── AppPagination.vue
    │   │   ├── EmptyState.vue
    │   │   └── LoadingSpinner.vue
    │   ├── home/                 # 首頁元件
    │   │   ├── HeroBanner.vue
    │   │   ├── ServiceIntro.vue
    │   │   ├── ServiceTypeCards.vue
    │   │   ├── BookingSteps.vue
    │   │   ├── PhotographerShowcase.vue
    │   │   ├── RatingCarousel.vue
    │   │   ├── AttractionCarousel.vue
    │   │   ├── InstagramFeed.vue
    │   │   └── RecruitSection.vue
    │   ├── photographer/         # 攝影師相關
    │   │   ├── PhotographerCard.vue
    │   │   ├── PhotographerGrid.vue
    │   │   ├── PhotographerDetail.vue
    │   │   └── PhotographerWorks.vue
    │   ├── booking/              # 預約流程
    │   │   ├── StepIndicator.vue
    │   │   ├── Step1ServiceType.vue
    │   │   ├── Step2Configuration.vue
    │   │   ├── Step3TimeLocation.vue
    │   │   ├── Step4SelectProvider.vue
    │   │   ├── Step5Confirm.vue
    │   │   └── Step6Checkout.vue
    │   ├── album/                # 相簿
    │   │   ├── AlbumList.vue
    │   │   ├── AlbumDetail.vue
    │   │   └── PhotoViewer.vue
    │   └── conversation/         # 站內溝通
    │       ├── ConversationList.vue
    │       ├── ConversationRoom.vue
    │       └── MessageBubble.vue
    ├── composables/              # Vue 3 Composables
    │   ├── useAuth.ts
    │   ├── useSearch.ts
    │   ├── useBooking.ts
    │   └── useI18n.ts
    ├── layouts/
    │   ├── default.vue           # Header + Footer
    │   └── blank.vue             # 無導航（付款頁等）
    ├── pages/                    # Nuxt 檔案路由
    │   ├── index.vue             # 首頁
    │   ├── search.vue            # 搜尋結果
    │   ├── photographer/
    │   │   └── [uuid].vue        # 攝影師詳情
    │   ├── booking/
    │   │   └── index.vue         # 預約流程
    │   ├── checkout.vue          # 結帳
    │   ├── thankyou/
    │   │   └── [tradeNo].vue     # 付款結果
    │   ├── albums/
    │   │   ├── index.vue         # 相簿列表
    │   │   └── [id].vue          # 相簿詳情
    │   ├── conversations/
    │   │   ├── index.vue         # 溝通室列表
    │   │   └── [id].vue          # 溝通室
    │   ├── faq.vue
    │   ├── privacy-policy.vue
    │   └── [...404].vue          # 404
    ├── stores/                   # Pinia
    │   ├── auth.ts
    │   ├── search.ts
    │   └── booking.ts
    ├── locales/                  # 多語系
    │   ├── zh.json
    │   ├── en.json
    │   ├── jp.json
    │   └── ka.json
    ├── utils/
    │   ├── format.ts             # 格式化工具
    │   ├── validate.ts           # 驗證工具
    │   └── google-maps.ts        # Google Maps/Places
    └── types/                    # TypeScript 型別
        ├── api.d.ts
        ├── booking.d.ts
        └── provider.d.ts
```