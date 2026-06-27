# JoyShot Admin — 專案完整說明文件

> 攝影服務平台 JoyShot 的後台管理系統，用於管理攝影師、客戶、訂單、推廣員、優惠券、行政區域、服務項目、系統設定等。

---

## 一、專案概覽

| 項目 | 內容 |
|------|------|
| **專案名稱** | `joyshot-admin` |
| **版本** | `0.1.0`（前端版本 `2.17.2025`） |
| **標題** | JoyShot Admin |
| **版權** | JoyShot Copyright @ 2023 |
| **技術棧** | Vue 2 + Element UI + Vuex + Vue Router |
| **開發伺服器** | `localhost:9555` |
| **後端 API** | `localhost:7272`（透過 `/api` proxy） |
| **正式環境** | `admin.joyshot.app`（後台）、`joyshot.app`（前台） |

---

## 二、技術棧

### 核心框架與函式庫

| 分類 | 套件 | 版本 | 用途 |
|------|------|------|------|
| 核心框架 | `vue` | `^2.5.21` | Vue 2 框架 |
| 路由 | `vue-router` | `^3.0.1` | SPA 路由（history mode） |
| 狀態管理 | `vuex` | `^3.0.1` | 全域狀態管理 |
| UI 框架 | `element-ui` | `^2.15.8` | Element UI（按需引入） |
| 國際化 | `vue-i18n` | `^8.28.2` | 多語系（zh / en） |
| HTTP 客戶端 | `axios` | `^0.18.1` | API 請求 |
| 進度條 | `nprogress` | `^0.2.0` | 頁面切換/請求進度條 |
| 日期處理 | `dayjs` / `moment` | `^1.11.1` / `^2.29.4` | 日期格式化 |
| 圖表 | `echarts` + `v-charts` | `^4.1.0` / `^1.19.0` | 資料視覺化 |
| 工具庫 | `lodash` | `^4.17.21` | 工具函式 |
| 加密 | `crypto-js` | `^3.1.9-1` | 加密功能 |
| JWT | `jsonwebtoken` | `^8.5.0` | JWT 處理 |
| PDF | `jspdf` | `^1.5.3` | PDF 生成 |
| 密碼產生 | `generate-password` | `^1.7.0` | 優惠券碼產生 |
| Cookie | `js-cookie` | `^2.2.0` | Cookie 操作（sidebar 狀態） |
| 圖片延遲載入 | `vue-lazyload` | `^1.3.4` | 圖片 lazy load |
| 數字格式 | `vue-number-format` | `^1.2.1` | 數字格式化（prefix `$`, thousand `,`） |
| 捲動 | `vue-scrollto` | `^2.20.0` | 捲動定位 |
| 計數動畫 | `vue-count-to` | `^1.0.13` | 數字計數動畫 |
| 富文本編輯 | `vue2-editor` | `^2.10.3` | 富文本編輯器 |

### 開發工具

| 套件 | 用途 |
|------|------|
| `@vue/cli-service` `^3.1.1` | Vue CLI 建置服務 |
| `@vue/cli-plugin-babel` | Babel 編譯 |
| `@vue/cli-plugin-eslint` + `eslint-plugin-vue` | ESLint 程式碼檢查 |
| `@vue/cli-plugin-e2e-cypress` | E2E 測試（Cypress） |
| `@vue/cli-plugin-unit-mocha` + `chai` | 單元測試（Mocha + Chai） |
| `@vue/test-utils` | Vue 測試工具 |
| `babel-plugin-component` | Element UI 按需引入 |
| `stylus` + `stylus-loader` | Stylus 預處理器 |

---

## 三、建置與環境設定

### 3.1 Scripts

```json
"serve": "vue-cli-service serve --mode dev",
"build": "vue-cli-service build",
"lint": "vue-cli-service lint",
"test:e2e": "vue-cli-service test:e2e",
"test:unit": "vue-cli-service test:unit"
```

### 3.2 vue.config.js

```js
module.exports = {
  runtimeCompiler: true,
  publicPath: '/',
  devServer: {
    port: 9555,
    open: process.platform === 'darwin',
    https: false,
    hotOnly: false,
    proxy: {
      '/api': {
        target: 'http://localhost:7272/'
      }
    }
  },
  productionSourceMap: true
}
```

### 3.3 環境變數

#### `.env`（正式環境）

```
VUE_APP_I18N_LOCALE=zh
VUE_APP_I18N_FALLBACK_LOCALE=zh
VUE_APP_LINE_NOTIFY=https://notify-bot.line.me/oauth/authorize?response_type=code&scope=notify
VUE_APP_AVATAR_URL=http://admin.joyshot.app/api/file
VUE_APP_API_SERVER=http://admin.joyshot.app/api
VUE_APP_FRONTEND=http://joyshot.app
VUE_APP_LINE_CLIENT_ID=jUN8smqiXmL9gxlt8zKyPw
VUE_APP_LINE_CALLBACK=http://admin.joyshot.app/api/line/callback
```

#### `.env.dev`（開發環境）

```
VUE_APP_AVATAR_URL=http://localhost:9555/api/file
VUE_APP_API_SERVER=http://localhost:9555/api
VUE_APP_FRONTEND=http://localhost:9666
VUE_APP_LINE_CLIENT_ID=r5qyQj893F28hdmdoYyxqh
VUE_APP_LINE_CALLBACK=http://localhost:9555/api/line/callback
```

### 3.4 其他設定檔

| 檔案 | 說明 |
|------|------|
| `babel.config.js` | `@vue/app` preset + `babel-plugin-component`（Element UI 按需引入） |
| `postcss.config.js` | autoprefixer |
| `.eslintrc.js` | `plugin:vue/essential` + `eslint:recommended` |
| `.browserslistrc` | `> 1%`, `last 2 versions`, `not ie <= 8` |
| `cypress.json` | E2E 測試設定 |
| `public/index.html` | 載入 Google Maps API（地址轉經緯度） |

---

## 四、專案目錄結構

```
src/
├── App.vue              # 根元件（版本檢查 + 路由出口）
├── main.js              # 應用程式進入點
├── i18n.js              # 國際化設定
├── settings.js          # 佈局設定
├── api/                 # API 呼叫層（14 個檔案）
├── assets/              # 靜態資源（圖片、樣式、icons）
├── components/          # 通用元件（9 個子目錄）
├── config/              # 支援語系設定
├── containers/          # 佈局容器（Full.vue）
├── icons/               # SVG icon 處理
├── locales/             # 語系檔（zh.json, en.json）
├── mock/                # Mock 資料（已停用）
├── plugins/             # Vue 插件（element, vcharts, print, plugins）
├── router/              # 路由設定
├── static/              # 靜態版本
├── store/               # Vuex 狀態管理
├── util/                # 工具函式（token 管理）
├── utils/               # 工具函式（validate, resizeHandler）
└── views/               # 頁面元件（24 個子目錄）
```

---

## 五、應用程式進入點（main.js）

```js
import Vue from 'vue'
import App from './App.vue'
import router from './router/router'
import store from './store/index'
import './assets/styles/reset.css'
import './assets/styles/common.css'
import './plugins/element.js'
import './plugins/vcharts.js'
import plugins from '@/plugins/plugins'
import version from '@/static/version'
import i18n from './i18n'

Vue.use(version)
Vue.use(plugins)

import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload, { loading: member_icon })

import '@/api/request'
import request from "@/api/request"
Vue.prototype.request = request  // 全域掛載 request

import VueNumberFormat from 'vue-number-format'
Vue.use(VueNumberFormat, { prefix: '$', thousand: ',', precision: 0 })

Vue.config.productionTip = false

new Vue({
    router, store, i18n,
    beforeCreate() { Vue.prototype.$bus = this },  // 事件匯流排
    render: h => h(App)
}).$mount('#app')
```

**關鍵設計**：
- **全域 request**：`Vue.prototype.request = request`，元件內可直接 `this.request.get/post()`
- **事件匯流排**：`Vue.prototype.$bus = this`（在 `beforeCreate` 中設定）
- **版本控制**：`Vue.use(version)` 注入 `this.version = '2.17.2025'`，版本不符時自動 `window.location.reload()`
- **圖片延遲載入**：使用 `Loading_icon.gif` 作為 loading 佔位圖

---

## 六、佈局結構

採用 Element UI Container 佈局：

```
┌─────────────────────────────────────────────────┐
│  Header (50px) — Logo + 漢堡選單 + 使用者下拉     │
├──────────┬──────────────────────────────────────┤
│          │  Breadcrumb                           │
│ Sidebar  ├──────────────────────────────────────┤
│ (200px)  │  el-main — router-view               │
│ #333333  │  (fade-transform 過渡動畫)            │
│          ├──────────────────────────────────────┤
│          │  Footer (50px) — 版權                 │
└──────────┴──────────────────────────────────────┘
```

- 使用 `ResizeMixin` 處理響應式：寬度 < 992px 判定為 mobile，自動關閉 sidebar
- Header 高度 `50px`，Footer 高度 `50px`，背景色 `#f5f5f5`
- 路由切換過渡：`fade-transform`（translateX 滑動效果）

---

## 七、路由系統

### 7.1 路由配置

- **模式**：`history`（HTML5 History API）
- **路由守衛**：`router.beforeEach` — 檢查 token（`JS_ADMIN_TOKEN`），未登入重導至 `/login`
- **Token 恢復**：頁面重新整理時從 `localStorage` 恢復 token

### 7.2 路由表

#### 公共路由

| 路徑 | 名稱 | 說明 |
|------|------|------|
| `/login` | Login | 登入頁 |
| `/404` | NotFind | 404 頁面 |
| `*` | NotFind | 萬用路由（404） |
| `/` | Full | 主佈局（redirect `/dashboard`） |
| `/dashboard` | Dashboard | 主控台 |

#### 角色權限路由

**資料維護（`/data`）**

| 路徑 | 說明 |
|------|------|
| `/data/users/maintain` | 使用者帳號管理 |
| `/data/users/profile` | 個人資料 |
| `/data/users/change_password` | 變更密碼 |
| `/data/roles/maintain` | 角色管理 |
| `/data/areas/maintain` | 行政區域管理 |
| `/data/services/maintain` | 服務項目管理 |
| `/data/faqs/maintain` | 常見問題 |
| `/data/instagram/maintain` | IG 貼文管理 |
| `/data/banner/maintain` | 首頁文案圖 |
| `/data/news/maintain` | 置頂消息 |
| `/data/attraction/maintain` | 景點文章 |

**攝影師管理（`/photographer`）**

| 路徑 | 說明 |
|------|------|
| `/photographer/maintain` | 攝影師列表 |
| `/photographer/detail/:pid` | 攝影師詳情（含 7 個分頁） |
| `/photographer/dashboard` | 時段主控台（月曆） |
| `/photographer/broadcast` | LINE 群發 |

**其他模組**

| 路徑 | 說明 |
|------|------|
| `/customers/maintain` | 客戶管理 |
| `/orders/maintain` | 訂單管理（5 狀態分頁） |
| `/campaign/coupons/maintain` | 優惠券管理 |
| `/settings/dictionary` | 字典維護 |
| `/settings/menu` | 選單維護 |
| `/settings/flow` | 通知流程設定 |
| `/affiliate/maintain` | 推廣員管理 |
| `/affiliate/report` | 推廣員統計報表 |

### 7.3 路由 Meta

所有需登入路由均設定 `requireLogin: true`，並包含：
- `breadcrumb`：麵包屑路徑（i18n key）
- `title`：頁面標題（i18n key）

---

## 八、狀態管理（Vuex Store）

### 8.1 Store 結構

```js
modules: { app, profile, login, user, role, menu, dic, area, customer }
```

### 8.2 Getters

```js
sidebar: state => state.app.sidebar
device: state => state.app.device
token: state => state.profile.token
username: state => state.user.username
userId: state => state.user.userId
menus: state => state.login.userMenus
userInfo: state => state.login.userInfo
```

### 8.3 各模組說明

| 模組 | 功能 |
|------|------|
| `app` | sidebar 開合狀態、device 類型（使用 js-cookie 儲存） |
| `profile` | token 管理（localStorage `JS_ADMIN_TOKEN`）、username |
| `login` | 登入 action、取得用戶資料、未讀通知數 |
| `user` | 使用者 CRUD（namespaced） |
| `role` | 角色 CRUD（namespaced） |
| `menu` | 選單 CRUD（namespaced） |
| `dic` | 字典 CRUD（namespaced） |
| `area` | 區域 CRUD（namespaced） |
| `customer` | 客戶 CRUD（namespaced） |

---

## 九、API 整合層

### 9.1 請求封裝（request.js）

```js
const request = axios.create({
  baseURL: '/api',
  timeout: 10000
})
```

**請求攔截器**：
- `NProgress.start()` — 顯示進度條
- 注入 headers：`token`（登入 token）、`info`（user id）、`locale`（語系）

**回應攔截器**：
- `NProgress.done()` — 結束進度條
- 回傳 `response.data`（直接取資料層）

### 9.2 API 端點一覽

| 模組 | 方法 | URL | 說明 |
|------|------|-----|------|
| 登入 | POST | `/user/login` | 登入 |
| 用戶資料 | POST | `/user/info` | 取得用戶資料 |
| 未讀通知 | GET | `/notify/unread` | 未讀通知數 |
| 登出 | GET | `/user/logout` | 登出 |
| 使用紀錄 | GET | `/user/log` | 使用紀錄 |
| 使用者分頁 | GET | `/user/page` | 分頁查詢用戶 |
| 使用者 CRUD | POST/DELETE | `/user` | 新增/更新/刪除 |
| 客戶 CRUD | GET/POST/DELETE | `/customer` | 客戶管理 |
| 客戶匯入匯出 | GET/POST | `/customer/export`, `/customer/imp` | 匯入匯出 |
| 角色 CRUD | GET/POST/DELETE | `/role` | 角色管理 |
| 選單 CRUD | GET/POST/DELETE | `/menu` | 選單管理 |
| 選單圖示 | GET | `/menu/icons` | 取得圖示列表 |
| 區域 CRUD | GET/POST/DELETE | `/area` | 區域管理 |
| 字典 CRUD | GET/POST/DELETE | `/dic` | 字典維護 |
| 商品 CRUD | GET/POST/DELETE | `/product` | 服務項目 |
| LINE 群發 | POST | `/group-notify` | LINE 群發訊息 |
| 檔案上傳 | POST | `/api/file/upload/{usage}` | 通用上傳 |

**檔案上傳用途（usage）**：
- `user_profile` — 使用者頭像
- `service_cat` — 服務項目圖片
- `area_feature_image` — 區域特色圖
- `line_notify_image` — LINE 群發圖片

---

## 十、頁面元件詳解

### 10.1 登入頁（Login.vue）

**版面**：
- 全螢幕背景圖（`big-roupe-joyshot.png`，`background-attachment: fixed`）
- 中央白色卡片（max-width `340px`，圓角 `10px`，陰影）
- Logo（`logo.svg`，寬 `220px`）

**表單**：
- 帳號（`empno`）：`el-input` + `el-icon-user` 前綴圖
- 密碼（`password`）：`el-input` + `show-password` + `el-icon-lock` 前綴
- 密碼驗證規則：6~12 碼
- 登入按鈕：`type="primary"`，寬度 `100%`

**邏輯**：
- 呼叫 `this.$store.dispatch('login/submitLoginForm', this.ruleForm)`
- 成功後 `setToken('JS_ADMIN_TOKEN', token)` + `setToken('JS_ROLE_MENU', userMenus)`
- 通知：`this.$notify`（success/error）
- 重導：`this.$route.query.redirect` 或 `/`

### 10.2 主控台（Dashboard.vue）

- 載入 `PanelGroup` 元件（統計卡片）
- 內建測試資料：`lineChartData`（newVisitis、messages、purchases、shoppings）
- 載入使用紀錄（`/user/log`）
- 載入使用者功能捷徑（`/user/shortcut`），區分 `daily`（每日）與 `notDaily`（非每日）

### 10.3 使用者管理（users/maintain）

**搜尋區**：
- `el-select`（查詢欄位：依姓名 `username` / 依分區 `area`）
- `el-input`（關鍵字，`el-icon-search` 後綴）
- 搜尋 / 清除按鈕、新增按鈕

**表格**：
- 欄位：username（含頭像 `avatar`）、empno（帳號）、role.name（角色）
- 操作欄：編輯（warning）、刪除（danger，`el-popconfirm` 確認）
- 攝影師角色不顯示編輯/刪除
- 分頁：`AppPagination` 元件

**對話框**：
- `UploadWidget`（頭像上傳）
- 表單欄位：empno（blur 時檢查重複）、username、password、roleId、area
- 響應式：`el-col :xs="24" :sm="24" :md="8"`

### 10.4 攝影師管理（photographers/maintain）

**版面**：左側分組統計表（6/24）+ 右側主表（18/24）

**左側分組表**：依地區分組統計攝影師數量，顯示 `上架: X / 全部: Y`

**主表**：
- 欄位：name（含頭像）、nickName（暱稱）、phone（電話）、city（縣市）
- **上架開關**：`el-switch`（active `#13ce66` / inactive `#DCDFE6`），即時切換上架狀態
- 操作：編輯（circle）、刪除（circle + popconfirm）

**對話框**（建立攝影師）：
- 手機（blur 檢查重複）、姓名、暱稱
- 縣市/鄉鎮區二級下拉（連動）
- 地址（blur 時 `getGeo` 取得經緯度 — Google Maps API）
- Email
- 多語系欄位：姓名(英/日)、暱稱(英/日)

### 10.5 攝影師詳情（photographers/maintain/detail）

**分頁結構**（`el-tabs`，7 個分頁）：

| 分頁 | 元件 | 說明 |
|------|------|------|
| 基本資料 | `PhotographerBasicInfo` | 含前台連結、手機/姓名/暱稱/Email/上架開關、縣市鄉鎮區地址、經緯度、身份別 |
| 設定接案時段 | `Schedule` | lazy 載入 |
| 可服務地區 | `PhotographerServiceArea` | lazy |
| 匯款資料 | `PhotographerBankInfo` | lazy |
| 特色資料 | `PhotographerFeatures` | lazy |
| 作品集 | `PhotographerPhotoWorks` | lazy |
| 評價 | `PhotographerRating` | lazy |

- `pid` 從路由參數取得：`parseInt(this.$route.params.pid)`

### 10.6 攝影師時段主控台（photographers/dashboard）

**月曆介面**：
- 左側：地區分組統計表
- 右側：月曆顯示（標題 `YYYY年MM月`，上一月/今日/下一月按鈕）
- 每日格子顯示預約數/總數（`el-tag`），點擊開啟詳情對話框
- 對話框：攝影師排程表（姓名、日期、時段、可預約數、前台連結）
- 前台連結：`${fontend}/photographer/${phUuid}`

### 10.7 LINE 群發（photographers/broadcast）

- `el-card` 表單
- 訊息輸入（textarea, 5 rows）
- 圖片上傳（`UploadWidget`, usage: `line_notify_image`）
- 發送對象：攝影師 / JoyShot（radio）
- LINE 群發按鈕（success, `el-popconfirm` 確認）

### 10.8 訂單管理（orders/maintain）

**分頁結構**（`el-tabs`，5 個狀態分頁，均 lazy）：

| 分頁 | 說明 |
|------|------|
| 全部狀態 | 所有訂單 |
| 未付款 | 等待付款 |
| 已付款 | 付款完成 |
| 照片已上傳 | 攝影師已上傳照片 |
| 結案 | 訂單結案 |

**新增訂單對話框**：
- 拍攝類型（8 種：旅遊拍攝、風格街拍、家庭聚會、活動紀錄、紀念時刻、情侶閏蜜聚、露營野餐、公司活動）
- 攝影師（`el-autocomplete` 自動完成）
- 客戶姓名、客戶電話、方便連絡時間、email
- 拍攝日期（`el-date-picker`）、拍攝時間、拍攝時數（change 時 `calcFee` 計算費用）
- 費用、大人人數、小孩人數
- 社群聯絡（Line/WhatsApp/Wechat）、社群帳號
- 地點、備註

### 10.9 訂單列表（all_order.vue）

**表格欄位**：
- 訂單編號（含操作按鈕：取消、變更、設成已付款、訂單歷程）
- 客戶（姓名 + 電話）
- 拍攝日期（日期 + 時間 + 時數）
- 訂單金額（`${{totalFee}}`）
- 攝影師（nickName）
- 訂單總成本/拍攝酬勞/交通補貼
- 折扣碼、手動單（Y/N）
- **訂單狀態**（`el-tag`，依狀態顯示不同顏色）：

| 狀態 | tag type/effect |
|------|----------------|
| `processing` | warning（dark） |
| `pay_success` | success（dark） |
| `contact` | info（plain） |
| `pay_failed` | danger（plain） |
| `uploaded` | info（plain） |
| `confirm-uploaded` | info（plain） |
| `close` | default（plain） |

- 展開欄：方便聯絡時間、拍攝類型、地點、人數、社群聯絡方式、email、客戶來自縣市、附加資訊

### 10.10 其他頁面

| 頁面 | 說明 |
|------|------|
| 客戶管理 | 搜尋區 + 表格（Customer No./Company/Name/Phone）+ 分頁 + 對話框 |
| 角色管理 | 表格 + 選單權限設定（`el-tree` show-checkbox） |
| 行政區域 | 樹狀表格（`row-key` + `tree-props`）、多語系名稱、圖片上傳、最低拍攝時數 |
| 字典維護 | 左側分組表 + 右側主表，5 種字典類型（menu_icon/subsidy/unit_price/feature_type/general） |
| 選單維護 | 樹狀表格、圖示下拉選擇 |
| 服務項目 | 表格（圖片/icon/名稱/價格）+ 對話框 |
| 系統流程 | 流程通知人設定（`el-select` multiple） |
| 推廣員管理 | 表格（含銀行資訊）+ 對話框 |
| 推廣員報表 | 訂單統計（訂單編號/客戶/拍攝日期/金額/折扣碼/推廣員） |
| 優惠券管理 | 折扣碼 CRUD、自動產生碼（`generateCouponCode`）、指定推廣員、使用次數追蹤 |
| 個人資料 | 頭像上傳、LINE 整合、Google Drive 連接（admin only） |
| 變更密碼 | 舊/新/確認密碼，6~12 碼，修改成功後強制登出 |
| 404 頁面 | 顯示 `joyshot-ig.jpg` + 回首頁按鈕 |

---

## 十一、通用元件

### 11.1 Header（components/header/Header.vue）

- 左側 Logo 區（`joyshot.png` + `joyshot2.png`，寬 200px，背景 `#000`）
- 側邊欄切換按鈕（`el-icon-newfont-caidan`，顏色 `#f27968`）
- 右側使用者下拉選單（`el-dropdown`）：頭像（36x36，圓角 999px）+ 使用者名稱
- 下拉項：個人訊息、密碼變更、登出
- Logo 寬度動畫：200px ↔ 64px（`transition .4s ease`）
- 響應式：`@media (max-width: 768px)` Logo 寬度 0

### 11.2 Sidebar（components/sidebar/Sidebar.vue）

- `el-menu`（`router` 模式，可折疊）
- 背景色 `#333333`，文字色 `#fff`，活躍色 `#f27968`
- 選單資料來源：`JSON.parse(getToken('JS_ROLE_MENU'))`（從 localStorage 讀取）
- 支援子選單（`el-submenu` + `el-menu-item`）
- 選單名稱使用 i18n：`$t(menu.name)`
- 展開寬度 200px，活躍項背景 `#484e5c`

### 11.3 其他元件

| 元件 | 說明 |
|------|------|
| Breadcrumb | `el-breadcrumb`（首頁 → breadcrumb → title），使用 i18n |
| Footer | 高度 50px，背景 `#484e5c`，內容 `JoyShot Copyright @ 2023` |
| AppPagination | `el-pagination`（background, prev/pager/next），雙向綁定 |
| UploadWidget | `el-upload`（drag 模式），action: `/api/file/upload/${usage}`，jpg/png < 2MB |
| SvgIcon | SVG sprite 元件，支援外部連結判斷 |
| Scrolltotop | 回頂部按鈕，捲動 > 100px 時顯示，平滑捲動 |

---

## 十二、國際化（i18n）

### 12.1 設定

- 使用 `vue-i18n`（`^8.28.2`）
- **預設語系**：`zh`（中文）
- **fallback**：`zh`
- 支援語系：`zh`（中文）、`en`（English）

### 12.2 語系檔結構

```
action.*       — 操作訊息（新增/儲存/刪除成功失敗、上傳錯誤等）
message.*      — 通用訊息（成功/錯誤/帳號/密碼/必填/無資料等）
buttons.*      — 按鈕文字（登入/儲存/確認/搜尋/清除/新增/取消/編輯/刪除）
dashboard.*    — 主控台
login.*        — 登入成功/失敗
header.*       — 頁首（個人訊息/密碼變更/登出）
route.meta.*   — 路由 meta（breadcrumb + title）
page.*         — 頁面特定文字
menu.*         — 選單名稱
```

**特色**：使用 `@:` 引用其他 key（如 `"login": "@:buttons.login@:message.success"`）

---

## 十三、樣式系統

### 13.1 樣式檔案

| 檔案 | 用途 |
|------|------|
| `assets/styles/reset.css` | CSS Reset（字體 tahoma/arial/Hiragino Sans GB/微軟雅黑） |
| `assets/styles/common.css` | 過渡動畫（fade、fade-transform、slide、breadcrumb）+ 響應式 |
| `assets/global.css` | 工具 class（margin/padding/float/text-align/width） |
| `assets/icons/iconfont.css` | iconfont 圖示字體 |

### 13.2 配色方案

| 用途 | 色碼 |
|------|------|
| Sidebar 背景 | `#333333` |
| Sidebar 活躍項 | `#484e5c` |
| 主色（活躍文字/按鈕） | `#f27968`（珊瑚橘） |
| Header 背景 | `#ffffff` |
| Header Logo 區 | `#000000` |
| Main 背景 | `#f5f5f5` |
| Footer 背景 | `#484e5c` |
| 上架開關 active | `#13ce66`（綠） |
| 上架開關 inactive | `#DCDFE6`（灰） |

### 13.3 過渡動畫

| 動畫 | 用途 |
|------|------|
| `fade` | 路由切換（App.vue），translateY ±20px |
| `fade-transform` | 容器內路由切換（Full.vue），translateX ±20px |
| `slide` | 回頂部按鈕 |
| `breadcrumb` | 麵包屑 |

---

## 十四、Plugins 系統

### 14.1 Element UI 按需引入（plugins/element.js）

手動引入並註冊約 **40+ 個 Element UI 元件**，包括：
Container, Header, Aside, Main, Footer, Row, Col, Pagination, Dialog, Button, Input, Table, TableColumn, Form, FormItem, Dropdown, Breadcrumb, Autocomplete, Menu, Submenu, MenuItem, MessageBox, Message, Loading, Notification, DatePicker, TimePicker, Tabs, Tree, Select, Option, Tooltip, Carousel, Upload, Popconfirm, Tag, Popover, Card, Checkbox, Badge, Radio, Image, Drawer, Switch, Slider 等。

### 14.2 自訂 Plugins（plugins/plugins.js）

全域 Vue filters：
- `fmtDateTime`：格式化日期時間（預設 `YYYY-MM-DD HH:mm`）
- `fmtDate`：格式化日期（預設 `YYYY-MM-DD`）
- `fmtMultiLine`：換行轉 `<br/>`
- `withDash`：逗號轉 `--`
- `fmtTodoType`：待辦類型轉中文
- `fmtPaymentMethod`：付款方式（匯款/現金/支票）

### 14.3 v-charts（plugins/vcharts.js）

全域註冊 4 種圖表元件：`VeLine`（折線圖）、`VeGauge`（儀表板）、`VeHistogram`（柱狀圖）、`VeRing`（環形圖）

### 14.4 列印（plugins/print.js）

自訂列印類別（`Print`），透過 iframe 實現列印功能，保留 input/textarea/select 狀態。

---

## 十五、工具函式

### 15.1 Token 管理（util/index.js）

```js
setToken(key, token)    // localStorage.setItem
getToken(key)           // localStorage.getItem
removeToken(key)        // localStorage.removeItem
```

Token keys：
- `JS_ADMIN_TOKEN` — 登入 token
- `JS_ROLE_MENU` — 角色選單（JSON 字串）
- `JS_ADMIN_VERSION` — 版本號

### 15.2 響應式處理（utils/resizeHandler.js）

- `ResizeMixin`：偵測視窗寬度 < 992px → 判定為 mobile
- 自動關閉 sidebar、切換 device 狀態
- 路由變更時若為 mobile 則自動收合 sidebar

---

## 十六、UI/UX 設計模式分析

### 16.1 版面布局

```
┌──────────────────────────────────────────────────┐
│  Header (50px) — Logo + 漢堡選單 + 使用者下拉      │
├────────────┬─────────────────────────────────────┤
│            │  Breadcrumb                          │
│  Sidebar   ├─────────────────────────────────────┤
│  (200px)   │  搜尋區（查詢欄位 + 關鍵字 + 按鈕）    │
│  深色背景   ├─────────────────────────────────────┤
│  #333333   │  表格區（stripe + 自訂表頭）          │
│            │  分頁                                │
│            ├─────────────────────────────────────┤
│            │  Footer (50px) — 版權                 │
└────────────┴─────────────────────────────────────┘
```

### 16.2 響應式設計

- 使用 Element UI Grid（`el-row` + `el-col`）
- 斷點：`xs`（<768px）、`sm`（≥768px）、`md`（≥992px）、`lg`（≥1200px）
- 常見模式：`:xs="24" :sm="24" :lg="8"`（手機全寬，桌面 1/3）
- Mobile 偵測：< 992px 自動收合 sidebar

### 16.3 表格設計模式

- **統一模式**：`el-table` + `stripe` + `header-row-class-name="headerStyle"`
- **分組側欄**：部分頁面左側顯示分組統計（如攝影師、字典、流程）
- **樹狀表格**：區域、選單使用 `row-key` + `tree-props` 支援父子層級
- **展開欄**：訂單使用 `type="expand"` 顯示更多資訊
- **操作欄**：編輯（warning）、刪除（danger + `el-popconfirm`）
- **狀態標籤**：`el-tag` + 不同 type/effect 組合

### 16.4 表單設計模式

- **對話框模式**：`el-dialog` + `el-form`（label-position: top 或 left）
- **驗證**：自訂 validator 函式，trigger: `change` / `blur`
- **響應式表單**：`el-row` + `el-col` 多欄佈局
- **上傳元件**：`UploadWidget`（拖曳上傳，預覽，jpg/png < 2MB）
- **日期選擇**：`el-date-picker`（format `yyyy/MM/dd`）
- **下拉連動**：縣市 → 鄉鎮區二級連動
- **自動完成**：`el-autocomplete`（攝影師搜尋）

### 16.5 互動模式

- **進度條**：NProgress（請求時顯示）
- **通知**：`this.$notify`（success/error，duration 1000-3000ms）
- **確認對話框**：`this.$confirm`（登出確認）
- **刪除確認**：`el-popconfirm`（inline 確認）
- **載入動畫**：`el-icon-loading`（上傳時）
- **路由過渡**：`fade` / `fade-transform`
- **版本檢查**：mounted 時比對版本，不一致自動 reload

### 16.6 多語系欄位設計

攝影師、區域等實體支援**四語系**：
- 中文（預設）
- 英文（`nameEn` / `nickNameEn` / `valueEn`）
- 日文（`nameJp` / `nickNameJp` / `valueJp`）
- 韓文（`nameKr` / `valueKr`）

---

## 十七、業務功能模組總結

| 模組 | 主要功能 | API 端點前綴 |
|------|---------|-------------|
| 使用者管理 | 帳號 CRUD、角色指派、地區指派 | `/user` |
| 角色管理 | 角色 CRUD、選單權限設定（Tree） | `/role` |
| 選單管理 | 選單 CRUD（樹狀）、圖示設定 | `/menu` |
| 行政區域 | 區域 CRUD（樹狀）、多語系、最低拍攝時數、圖片 | `/area` |
| 服務項目 | 服務 CRUD、代表圖、icon、價格 | `/product` |
| 攝影師管理 | 攝影師 CRUD、詳情（7 分頁）、上架開關、時段主控台、LINE 群發 | `/photographer` |
| 客戶管理 | 客戶 CRUD、匯入匯出 | `/customer` |
| 訂單管理 | 訂單 CRUD、5 狀態分頁、後台手動建立、訂單歷程 | `/order` |
| 優惠券 | 折扣碼 CRUD、自動產生碼、指定推廣員、使用次數追蹤 | `/campaign` |
| 推廣員 | 推廣員 CRUD、銀行資訊、統計報表 | `/affiliate` |
| 字典維護 | 系統字典 CRUD（5 類型） | `/dic` |
| 常見問題 | FAQ 管理 | `/faqs` |
| IG 貼文 | Instagram 內容管理 | `/instagram` |
| 首頁文案圖 | Banner 管理 | `/banner` |
| 置頂消息 | News 管理 | `/news` |
| 景點文章 | 景點內容管理 | `/attraction` |
| 通知流程 | 系統流程通知人設定 | `/flow` |
| 個人資料 | 個人資料編輯、LINE 整合、Google Drive 連接 | `/user/info` |
| 密碼變更 | 變更密碼（舊/新/確認） | `/user` |
| 檔案上傳 | 通用檔案上傳 | `/api/file/upload/{usage}` |

---

## 十八、外部整合

| 服務 | 用途 | 設定位置 |
|------|------|---------|
| LINE Notify | OAuth 認證、群發訊息 | `.env` / `.env.dev` |
| Google Maps API | 地址轉經緯度（攝影師地址） | `public/index.html` |
| Google Drive | admin 帳號可連接 | `profile.vue` |
| 後端 API | `joyshot-api`（Java Spring Boot） | proxy `/api` → `localhost:7272` |
| 前台 | `joyshot-app` / `joyshot-photographer` | `VUE_APP_FRONTEND` |
| 檔案伺服器 | `https://www.joyshot.app` | `$file_location` |

---

## 十九、關鍵設計特點

1. **版本控制快取機制**：透過 `static/version.js` + `localStorage` 比對，版本更新時自動 reload，確保使用者取得最新前端資源。

2. **角色權限選單**：登入時取得 `userMenus` 並存入 `localStorage`（`JS_ROLE_MENU`），Sidebar 直接讀取渲染，實現動態選單。

3. **Token 管理**：使用 `localStorage` 儲存 token，請求攔截器自動注入 `token`、`info`（user id）、`locale` headers。

4. **全域 request 掛載**：`Vue.prototype.request = request`，元件內可直接 `this.request.get/post()` 呼叫未封裝的 API。

5. **事件匯流排**：`Vue.prototype.$bus = this`，用於跨元件通訊。

6. **按需引入 Element UI**：透過 `babel-plugin-component` + 手動註冊，減少打包體積。

7. **多語系架構**：i18n 完整整合，路由 meta、元件、訊息均使用 i18n key，支援 `@:` 引用語法。

8. **響應式設計**：992px 斷點自動切換 desktop/mobile，sidebar 自動收合。

9. **攝影師多語系**：支援中/英/日/韓四語系欄位，對應國際化攝影服務平台需求。

10. **Mock 基礎設施**：Mock 完整但已停用，可快速切換開發模式。

---

## 二十、測試配置

| 類型 | 框架 | 指令 |
|------|------|------|
| 單元測試 | Mocha + Chai + @vue/test-utils | `npm run test:unit` |
| E2E 測試 | Cypress | `npm run test:e2e` |

---

## 二十一、開發指令速查

```bash
# 安裝依賴
npm install

# 開發模式（localhost:9555）
npm run serve

# 建置正式環境
npm run build

# 程式碼檢查
npm run lint

# 單元測試
npm run test:unit

# E2E 測試
npm run test:e2e
```

---

*文件生成日期：2026-06-23*