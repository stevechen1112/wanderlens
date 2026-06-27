# wanderlens-app 目錄結構

> **文件狀態**：目錄樹為概略；以實際 repo 為準。現況見 [README.md](./README.md)。最後對照：**2026-06-27**。

```
wanderlens-app/
├── README.md
├── DEVELOPMENT_PLAN.md
├── TASK_PLAN.md
├── ARCHITECTURE.md
├── DIRECTORY.md                  ← 本文件
├── package.json
├── app.json                      # Expo 配置
├── tsconfig.json
├── babel.config.js
├── .env.example
├── assets/                       # App 靜態資源（icon/splash）
└── src/
    ├── App.tsx                   # 入口
    ├── api/
    │   ├── client.ts             # Axios + 攔截器
    │   ├── auth-api.ts
    │   ├── album-api.ts
    │   ├── conversation-api.ts
    │   └── booking-api.ts
    ├── components/
    │   ├── common/
    │   │   ├── Header.tsx
    │   │   ├── EmptyState.tsx
    │   │   ├── LoadingSpinner.tsx
    │   │   └── LanguageSwitcher.tsx
    │   ├── album/
    │   │   ├── AlbumCard.tsx
    │   │   ├── PhotoGrid.tsx
    │   │   └── PhotoViewer.tsx    # 全螢幕瀏覽
    │   ├── conversation/
    │   │   ├── ConversationItem.tsx
    │   │   ├── MessageBubble.tsx
    │   │   └── ChatInput.tsx
    │   └── booking/
    │       ├── ServiceTypeSelector.tsx
    │       └── ProviderCard.tsx
    ├── screens/                  # 頁面
    │   ├── auth/
    │   │   ├── LoginScreen.tsx
    │   │   └── RegisterScreen.tsx
    │   ├── album/
    │   │   ├── AlbumListScreen.tsx
    │   │   └── AlbumDetailScreen.tsx
    │   ├── conversation/
    │   │   ├── ConversationListScreen.tsx
    │   │   └── ConversationRoomScreen.tsx
    │   ├── booking/
    │   │   └── BookingScreen.tsx
    │   └── profile/
    │       ├── ProfileScreen.tsx
    │       └── SettingsScreen.tsx
    ├── navigation/
    │   ├── AppNavigator.tsx      # 根導航
    │   ├── TabNavigator.tsx      # Bottom Tab Bar
    │   └── AuthNavigator.tsx     # 未登入導航
    ├── stores/                   # Zustand
    │   ├── authStore.ts
    │   ├── albumStore.ts
    │   └── conversationStore.ts
    ├── hooks/
    │   ├── useAuth.ts
    │   ├── useAlbum.ts
    │   └── usePushNotification.ts
    ├── locales/
    │   ├── zh.json
    │   ├── en.json
    │   ├── jp.json
    │   └── ka.json
    ├── theme/
    │   ├── colors.ts             # Design Token
    │   ├── typography.ts
    │   └── spacing.ts
    ├── utils/
    │   ├── format.ts
    │   └── permissions.ts        # 相機/相簿權限
    └── types/
        ├── api.d.ts
        ├── album.d.ts
        └── navigation.d.ts
```