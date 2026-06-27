# wanderlens-provider 目錄結構

> **文件狀態**：目錄樹為概略；以實際 repo 為準。現況見 [README.md](./README.md)。最後對照：**2026-06-27**。

```
wanderlens-provider/
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
    │   ├── request.ts            # Axios + 攔截器
    │   ├── auth-api.ts
    │   ├── provider-api.ts       # 攝影師自助 API
    │   ├── order-api.ts          # 訂單/履約 API
    │   ├── upload-api.ts         # RAW/JPEG 上傳 API
    │   └── conversation-api.ts
    ├── assets/
    │   ├── css/
    │   │   ├── main.css
    │   │   └── variables.css     # Design Token
    │   └── images/
    ├── components/
    │   ├── common/
    │   │   ├── AppHeader.vue
    │   │   ├── AppSidebar.vue
    │   │   ├── AppBreadcrumb.vue
    │   │   ├── AppFooter.vue
    │   │   ├── AppPagination.vue
    │   │   └── UploadWidget.vue  # 通用檔案上傳
    │   ├── upload/               # RAW 上傳專用元件（核心）
    │   │   ├── RawUploader.vue   # 分段上傳 + 斷點續傳
    │   │   ├── JpegFastPath.vue  # JPEG 快路徑
    │   │   ├── UploadQueue.vue   # 上傳隊列
    │   │   └── UploadProgress.vue
    │   └── conversation/
    │       ├── ConversationList.vue
    │       ├── ConversationRoom.vue
    │       └── MessageBubble.vue
    ├── composables/
    │   ├── useAuth.ts
    │   ├── useRawUpload.ts       # RAW 上傳邏輯
    │   └── useSchedule.ts        # 行事曆邏輯
    ├── layouts/
    │   └── DefaultLayout.vue     # Header + Sidebar + Main + Footer
    ├── router/
    │   └── index.ts
    ├── stores/
    │   ├── auth.ts
    │   ├── provider.ts
    │   └── upload.ts             # 上傳狀態
    ├── views/
    │   ├── auth/
    │   │   └── Login.vue
    │   ├── account/              # 攝影師資料維護（7 分頁）
    │   │   ├── AccountDetail.vue # Tab 容器
    │   │   ├── BasicInfo.vue
    │   │   ├── Schedule.vue      # 月曆時段
    │   │   ├── ServiceArea.vue   # el-tree
    │   │   ├── BankInfo.vue
    │   │   ├── Features.vue
    │   │   ├── PhotoWorks.vue    # 作品集
    │   │   └── Rating.vue
    │   ├── order/
    │   │   ├── MyOrder.vue       # 訂單列表
    │   │   ├── OrderDetail.vue   # 訂單詳情 + 拍攝節點 + RAW 上傳
    │   │   └── ShootControls.vue # 起拍/加時/結束
    │   ├── conversation/
    │   │   ├── ConversationList.vue
    │   │   └── ConversationRoom.vue
    │   └── profile/
    │       ├── Profile.vue
    │       ├── ChangePassword.vue
    │       └── Notifications.vue
    ├── locales/
    │   ├── zh.json
    │   └── en.json
    ├── utils/
    │   ├── format.ts
    │   ├── validate.ts
    │   └── google-maps.ts
    └── types/
        ├── api.d.ts
        └── upload.d.ts
```