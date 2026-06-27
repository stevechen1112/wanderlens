# WanderLens Design Tokens（跨端設計規範）

> 更新日期：2026-06-25  
> 適用：Web (3001) · Admin (3003) · Provider (3002) · App (8081)

## 品牌色

| Token | 值 | 用途 |
|-------|-----|------|
| `--wl-primary` | `#F37A69` | 主色 CTA、連結、強調 |
| `--wl-primary-dark` | `#D85A49` | Hover / Active |
| `--wl-primary-light` | `#FFF0EE` | 淺色背景、Badge |
| `--wl-secondary` | `#52B6CC` | 次要強調 |
| `--wl-success` | `#13CE66` | 成功狀態 |
| `--wl-warning` | `#FF9F40` | 警告 |
| `--wl-danger` | `#FF4D4F` | 錯誤、刪除 |

## 文字色

| Token | 值 |
|-------|-----|
| `--wl-text-primary` | `#333333` |
| `--wl-text-regular` | `#666666` |
| `--wl-text-secondary` | `#999999` |

## 各端實作

| 端 | 檔案 | 備註 |
|----|------|------|
| Web | `wanderlens-web/src/assets/css/main.css` | Tailwind + CSS Variables |
| Admin | `wanderlens-admin/src/assets/css/main.css` | Element Plus 主題覆蓋 |
| Provider | `wanderlens-provider/src/assets/css/main.css` | 同 Admin |
| App | `wanderlens-app/src/theme/colors.ts` | React Native StyleSheet |

## 圖示規範

- **Web**：inline SVG（Heroicons 風格），禁止 emoji 作為功能圖示
- **Admin / Provider**：`@element-plus/icons-vue`
- **App**：`@expo/vector-icons` (Ionicons)

## 共用 UI 元件（Web）

| 元件 | 路徑 | 用途 |
|------|------|------|
| `WlLoading` | `components/common/WlLoading.vue` | 載入中 |
| `WlEmpty` | `components/common/WlEmpty.vue` | 空狀態 |
| `WlError` | `components/common/WlError.vue` | 錯誤 + 重試 |

## 佈局

- **登入/註冊**：使用 `layouts/auth.vue`（無搜尋列）
- **一般頁面**：`layouts/default.vue`（完整 Header）
- **行動搜尋**：Header 單一「搜尋」按鈕展開面板

## Element Plus 對齊

Admin / Provider 的 `.el-button--primary`、`.el-tabs__active-bar`、分頁 active 色皆映射至 `--wl-primary`。
