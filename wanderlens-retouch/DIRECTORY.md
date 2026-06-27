# wanderlens-retouch 目錄結構

> **文件狀態**：目錄樹為概略；以實際 repo 為準。現況見 [README.md](./README.md)。最後對照：**2026-06-27**。

```
wanderlens-retouch/
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
    │   └── job-api.ts            # 工單 API
    ├── assets/
    │   └── css/
    │       ├── main.css
    │       └── variables.css
    ├── components/
    │   ├── common/
    │   │   ├── AppHeader.vue
    │   │   ├── AppSidebar.vue
    │   │   └── AppPagination.vue
    │   └── job/
    │       ├── JobCard.vue
    │       ├── JobDetail.vue
    │       ├── RawDownloadList.vue  # RAW 下載清單
    │       ├── RetouchUpload.vue    # 成品上傳
    │       └── StatusBadge.vue
    ├── layouts/
    │   └── DefaultLayout.vue
    ├── router/
    │   └── index.ts
    ├── stores/
    │   ├── auth.ts
    │   └── job.ts
    ├── views/
    │   ├── auth/
    │   │   └── Login.vue
    │   ├── job/
    │   │   ├── JobList.vue       # 工單列表（4 狀態分頁）
    │   │   └── JobDetail.vue     # 工單詳情
    │   └── spec/
    │       └── SpecDocument.vue  # 修圖規範文件
    ├── utils/
    │   ├── format.ts
    │   └── download.ts           # 安全下載
    └── types/
        └── api.d.ts
```