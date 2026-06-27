# JoyShot Photographer — 專案完整說明文件

> JoyShot 攝影師專屬空間（攝影師端管理後台），讓攝影師管理基本資料、接案時段、服務地區、作品集、匯款資料、特色資料、客戶評價，以及檢視訂單、通報聯繫客戶與照片上傳狀態。

---

## 一、專案概覽

| 項目 | 內容 |
|------|------|
| **專案名稱** | `joyshot-photographer` |
| **版本** | `0.1.0`（前端版本 `8.14.2023`） |
| **標題** | JoyShot攝影師專屬空間 |
| **技術棧** | Vue 2.5.21 + Element UI 2.15.8 + Vuex 3 + Vue Router 3 |
| **Dev Server** | `localhost:9777` |
| **後端 API** | `localhost:7272`（透過 `/api` proxy） |
| **正式環境** | `jsmaster.joyshot.app` |
| **多語系** | zh / en（攝影師資料支援 tw/en/jp/kr 四語系） |

---

## 二、技術棧

| 項目 | 技術 / 版本 |
|------|------------|
| 框架 | Vue 2.5.21 |
| 路由 | vue-router 3.0.1（history mode） |
| 狀態管理 | vuex 3.0.1 |
| UI 框架 | Element UI 2.15.8（按需引入） |
| 圖表 | v-charts 1.19.0 + echarts 4.1.0 |
| HTTP | axios 1.7.9 |
| 多語系 | vue-i18n 8.28.2（zh / en） |
| 日期 | dayjs 1.11.1 + moment 2.29.4 |
| 圖片延遲載入 | vue-lazyload 1.3.4 |
| 數字格式 | vue-number-format 1.2.1 |
| 進度條 | nprogress 0.2.0 |
| 加密 | crypto-js 4.2.0、jsonwebtoken 9.0.2 |
| 建置工具 | @vue/cli-service 3.1.1 |
| CSS 預處理 | stylus + stylus-loader |
| E2E 測試 | Cypress |
| 單元測試 | Mocha + Chai |

---

## 三、環境設定

### 3.1 vue.config.js

```js
module.exports = {
  runtimeCompiler: true,
  publicPath: '/',
  devServer: {
    port: 9777,
    proxy: {
      '/api': { target: 'http://localhost:7272/' }
    }
  },
  productionSourceMap: true
}
```

### 3.2 環境變數

#### `.env`（正式環境）

```
VUE_APP_I18N_LOCALE=zh
VUE_APP_I18N_FALLBACK_LOCALE=zh
VUE_APP_LINE_NOTIFY=https://notify-bot.line.me/oauth/authorize?response_type=code&scope=notify
VUE_APP_AVATAR_URL=https://jsmaster.joyshot.app/api/file
VUE_APP_API_SERVER=https://jsmaster.joyshot.app/api
VUE_APP_FRONTEND=https://joyshot.app
VUE_APP_LINE_CLIENT_ID=jUN8smqiXmL9gxlt8zKyPw
VUE_APP_LINE_CALLBACK=https://joyshot.app/api/line/callback
```

#### `.env.dev`（開發環境）

```
VUE_APP_AVATAR_URL=http://localhost:9777/api/file
VUE_APP_API_SERVER=http://localhost:9777/api
VUE_APP_FRONTEND=http://localhost:9666
VUE_APP_LINE_CLIENT_ID=r5qyQj893F28hdmdoYyxqh
VUE_APP_LINE_CALLBACK=http://localhost:9555/api/line/callback
```

### 3.3 Scripts

```json
"serve": "vue-cli-service serve --mode dev",
"build": "vue-cli-service build",
"lint": "vue-cli-service lint",
"test:e2e": "vue-cli-service test:e2e",
"test:unit": "vue-cli-service test:unit"
```

---

## 四、專案目錄結構

```
src/
├── App.vue                      # 根元件（版本檢查 + 路由出口）
├── main.js                      # 應用程式進入點
├── i18n.js                      # 國際化設定
├── settings.js                  # 佈局設定
├── api/
│   ├── request.js               # axios 實例 + 攔截器
│   ├── index.js                 # 主要 API 定義
│   ├── role-api.js              # 角色 API
│   └── mockRequest.js           # Mock 請求
├── assets/                      # 靜態資源（圖片、樣式、icons）
├── components/                  # 通用元件
│   ├── header/Header.vue
│   ├── sidebar/Sidebar.vue
│   ├── breadcrumb/Breadcrumb.vue
│   ├── footer/Footer.vue
│   ├── pagination/AppPagination.vue
│   ├── upload/index.vue         # UploadWidget
│   ├── loading/Loading.vue
│   └── scrolltotop/Scrolltotop.vue
├── config/supported-locales.js
├── containers/Full.vue          # 主版面容器
├── icons/                       # SVG icon 處理
├── locales/                     # 語系檔（zh.json, en.json）
├── plugins/
│   ├── element.js               # Element UI 按需引入
│   ├── plugins.js               # 自訂 filters
│   ├── vcharts.js               # v-charts 元件
│   └── print.js                 # 列印功能
├── router/router.js             # 路由設定
├── static/version.js            # 版本號 8.14.2023
├── store/                       # Vuex 狀態管理
│   ├── index.js
│   ├── getters.js
│   ├── login.js
│   ├── user.js
│   ├── role.js
│   └── modules/
│       ├── app.js
│       └── profile.js
├── util/index.js                # Token 管理
├── utils/
│   ├── resizeHandler.js         # 響應式 mixin
│   └── validate.js
└── views/                       # 頁面元件
    ├── 404.vue
    ├── users/
    │   ├── Login.vue
    │   ├── profile.vue
    │   ├── change_password.vue
    │   └── maintain/index.vue
    ├── photographers/
    │   ├── my_order.vue
    │   ├── terms_and_condition.vue
    │   └── maintain/
    │       ├── detail.vue       # 攝影師資料維護（Tab 頁）
    │       ├── basic_info.vue
    │       ├── schedule.vue
    │       ├── service_area.vue
    │       ├── bank_info.vue
    │       ├── basic_info_features.vue
    │       ├── photo_works.vue
    │       ├── rating.vue
    │       └── order_info.vue
    ├── notify/index.vue
    └── charts/、tables/、resource/  # 模板保留頁面
```

---

## 五、應用程式進入點（main.js）

- 掛載 `router`、`store`、`i18n`、Element UI、v-charts、自訂 plugins
- 載入 `reset.css`、`common.css`、`iconfont.css`、`global.css`
- 註冊 `VueLazyload`（loading 圖 `member.svg`）
- 註冊 `VueNumberFormat`（prefix `$`, thousand `,`, precision 0）
- `Vue.prototype.request = request`（全域 axios）
- `Vue.prototype.$bus = this`（事件匯流排）
- 版本控管：`Vue.use(version)` 注入 `this.version = '8.14.2023'`

---

## 六、佈局結構

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

---

## 七、路由設定

| 路徑 | 名稱 | 說明 |
|------|------|------|
| `/login` | Login | 登入頁 |
| `*` | NotFind | 404 頁面 |
| `/account` | PhotographerDetail | 攝影師資料維護（7 個 Tab） |
| `/data/users/profile` | UserProfile | 個人訊息 |
| `/data/users/change_password` | ChangePassword | 密碼變更 |
| `/terms` | TermsAndCondition | 使用者條款 |
| `/myorder` | MyOrder | 我的訂單 |

### 路由守衛

- token 存於 `localStorage.JS_P_TOKEN`
- 已登入造訪 `/login` → 阻擋
- 已登入但 store 無 username → 呼叫 `login/getUserInfo` 重撈使用者資料
- 未登入造訪非 login 頁 → 導向 `/login?redirect=<path>`

---

## 八、Vuex Store

### 模組結構

```js
modules: { app, profile, user, role, login }
```

### 各模組說明

| 模組 | 功能 |
|------|------|
| `app` | sidebar 開合狀態、device 類型（js-cookie） |
| `profile` | token 管理（localStorage `JS_P_TOKEN`）、username |
| `login` | 登入 action、取得用戶資料、未讀通知數 |
| `user` | 使用者 CRUD |
| `role` | 角色 CRUD |

### Token Keys

- `JS_P_TOKEN` — 登入 token
- `JS_P_ROLE_MENU` — 角色選單（JSON 字串）
- `JS_P_VERSION` — 版本號

---

## 九、API 整合

### 9.1 請求封裝（request.js）

```js
const request = axios.create({
  baseURL: '/api',
  timeout: 5000
})
```

**請求攔截器**：
- `NProgress.start()`
- 注入 headers：`token`、`info`（user id）、`locale`

**回應攔截器**：`NProgress.done()`，回傳 `response.data`

### 9.2 API 端點一覽

| 頁面 | 方法 | 端點 | 說明 |
|------|------|------|------|
| Login | POST | `/user/login` | 登入 |
| Profile | POST | `/user/info` | 取得用戶資料 |
| Header | GET | `/user/logout` | 登出 |
| Header | GET | `/notify/unread` | 未讀通知數 |
| 基本資料 | GET | `/photographer/{pid}` | 取攝影師資料 |
| 基本資料 | POST | `/photographer` | 儲存攝影師資料 |
| 基本資料 | GET | `/area/area1` | 縣市列表 |
| 基本資料 | GET | `/area/area3/{cityId}` | 鄉鎮區 |
| 基本資料 | GET | `/service-cat` | 服務項目 |
| 接案時段 | GET/POST | `/photographer/schedule` | 時段 CRUD |
| 服務地區 | GET/POST | `/photographer/service/area/{phId}` | 服務地區 |
| 匯款資料 | GET/POST | `/photographer/bank` | 匯款資料 |
| 特色資料 | GET/POST/DELETE | `/photographer/feature` | 特色 CRUD |
| 特色資料 | GET | `/dic/type?queryField=feature_type` | 特色類型字典 |
| 作品集 | GET | `/photographer/works/{phId}` | 作品列表 |
| 作品集 | POST(upload) | `/file/upload-works/{phId}` | 上傳作品 |
| 作品集 | DELETE | `/photographer/works/{id}` | 刪除作品 |
| 客戶評價 | GET | `/photographer/rating/{phId}` | 評價列表 |
| 我的訂單 | GET | `/order/myorder` | 訂單列表 |
| 我的訂單 | POST | `/order/contact/customer/{id}` | 通報已聯繫 |
| 我的訂單 | POST | `/order/photo/uploaded/{id}` | 通報照片已上傳 |
| 我的訂單 | POST | `/order/photo/uploaded/pic-num` | 通報照片張數 |
| 通知 | GET | `/notify/page` | 通知分頁 |
| 上傳 | POST | `/file/upload/{usage}` | 通用檔案上傳 |
| 密碼變更 | POST | `/user/change-password` | 變更密碼 |

---

## 十、頁面元件詳解

### 10.1 登入頁（Login.vue）

- 全螢幕背景圖 `bg.jpg`，置中 logo + 標題「攝影師 My Space 登入」
- `el-form`：帳號（empno = 手機號碼）、密碼
- 登入流程：`dispatch('login/submitLoginForm')` → 成功通知 → 跳轉 `/account`
- 卡片樣式：max-width 340px、圓角 10px、陰影

### 10.2 攝影師資料維護（detail.vue）— 核心頁

**Tab 頁面**（`el-tabs`，7 個分頁）：

| 分頁 | 元件 | 說明 |
|------|------|------|
| 基本資料 | `PhotographerBasicInfo` | 含前台連結、LINE 整合、手機/姓名/暱稱/Email、縣市鄉鎮區地址、經緯度、身份別、介紹、擅長拍攝類型、大頭照+封面照、多語系欄位 |
| 設定接案時段 | `Schedule` | 月曆式 UI（lazy） |
| 可服務地區 | `PhotographerServiceArea` | el-tree checkbox（lazy） |
| 匯款資料 | `PhotographerBankInfo` | 銀行帳號（lazy） |
| 特色資料 | `PhotographerFeatures` | 多語系特色（lazy） |
| 作品集 | `PhotographerPhotoWorks` | 拖拽上傳 + 預覽（lazy） |
| 客戶評價 | `PhotographerRating` | 評價列表（lazy） |

- pid 來源：`this.userInfo.id`（非路由參數）

### 10.3 基本資料（basic_info.vue）

**欄位**：
- 前台介紹頁連結：`${fontend}/photographer/${form.phUuid}`
- LINE Notify 整合按鈕（OAuth）
- 手機（登入帳號，readonly）、姓名、暱稱、Email
- 縣/市、鄉/鎮/區（連動下拉）、地址、經緯度（Google Maps Geocoder）
- 身份別（全職/兼職攝影）、攝影經歷（年）
- 攝影師介紹（textarea）、擅長拍攝類型（多選）
- 大頭照（300x300）、封面照（2000x1200）
- **多語系欄位**：暱稱/介紹（英、日、韓）

### 10.4 接案時段（schedule.vue）

- 月曆式 UI，顯示當月日期格
- 標題列：年份月份、上個月/今日/下個月按鈕、設定按鈕
- 每日格顯示已設定的時段（`el-tag`），active='Y' 可刪除，已被預約的不可刪
- 設定 dialog：選擇開始時段（08:00~22:00）、結束時段（10:00~22:00），checkbox-group 選日期

### 10.5 服務地區（service_area.vue）

- `el-tree`（show-checkbox），node-key=id
- 載入：`GET /photographer/service/area/{phId}` → rootNodes + allChildNodes
- 儲存：`POST /photographer/service/area/{phId}`，帶 rootNodes + selectedNodes

### 10.6 匯款資料（bank_info.vue）

- 欄位：銀行代碼、銀行、分行、戶名、帳號、備註

### 10.7 特色資料（basic_info_features.vue）

- `el-table` 列表：語系（tw/en/jp/kr）、特色類型、簡短說明
- 新增/編輯 dialog：語系（radio）、特色類型（select，從字典取）、簡短說明（textarea）

### 10.8 作品集（photo_works.vue）

- 拖拽上傳：`el-upload` drag，multiple
- 限制：jpg/png < 2MB，最多 50 張
- 已上傳列表：`el-image`（160x160）+ 點擊預覽，每張有刪除按鈕

### 10.9 客戶評價（rating.vue）

- `el-table`：客戶名稱、星等、評價內容（v-html）

### 10.10 我的訂單（my_order.vue）

**表格欄位**：
- 訂單編號、客戶（姓名+電話）、拍攝時間（日期+時段+時長）
- 已聯繫客戶（是/否）、照片目錄（連結 `driverLink`）、照片張數
- 照片已上傳（是/否）、拍攝酬勞（`shootingDuration × 800`）、預定匯款日期
- 操作：通報已聯繫客戶（popconfirm）、通報照片已上傳（dialog 輸入張數，min 40）

- 分頁：pageSize 15
- 篩選：排除 `auto_cancel`、`pay_failed`、`cancel` 狀態

### 10.11 其他頁面

| 頁面 | 說明 |
|------|------|
| profile.vue | 個人訊息（頭像上傳、LINE 整合、姓名） |
| change_password.vue | 變更密碼（舊/新/確認），成功後強制登出 |
| terms_and_condition.vue | 隱私權保護政策、個人資料蒐集 |
| notify/index.vue | 通知訊息列表（未讀/已讀） |
| 404.vue | 顯示圖片 + 回首頁按鈕 |

---

## 十一、通用元件

| 元件 | 說明 |
|------|------|
| Header | Logo 區（黑底 #000，寬 200px↔64px）+ 漢堡按鈕（#f27968）+ 使用者下拉（密碼變更、登出） |
| Sidebar | `el-menu`，背景 `#333333`，活躍色 `#f27968`，從 localStorage `JS_P_ROLE_MENU` 動態載入 |
| Breadcrumb | `el-breadcrumb`，三層（首頁 → breadcrumb → title） |
| Footer | `JoyShot Copyright @ 2023`，背景 `#484e5c` |
| AppPagination | `el-pagination`（background, prev/pager/next） |
| UploadWidget | `el-upload` drag 模式，action `/api/file/upload/${usage}`，jpg/png < 2MB |

---

## 十二、UI/UX 設計模式

### 12.1 配色方案

| 用途 | 色碼 |
|------|------|
| Sidebar 背景 | `#333333` |
| Sidebar 活躍項 | `#f27968`（橘紅） |
| Sidebar active bg | `#484e5c` |
| Header logo 區 | `#000000` |
| Header 漢堡 icon | `#f27968` |
| Footer | `#484e5c` + 白字 |
| Main 背景 | `#f5f5f5` |
| 完成（finish） | 綠色系 |
| 未完成（not-finish） | 灰色系 |

### 12.2 響應式設計

- `ResizeMixin`：寬度 < 992px 判定為 mobile → 自動關閉 sidebar
- Element UI Grid：`el-col :xs="24" :sm="24" :lg="N"`
- Sidebar/Header 在 768px 以下自動收合
- viewport：禁止縮放

### 12.3 互動模式

- **登入流程**：Login → submitLoginForm → setToken → 跳轉 `/account`
- **接單流程**：my_order 列表 → 通報已聯繫（popconfirm）→ 通報照片已上傳（dialog 輸入張數 ≥40）
- **照片上傳**：UploadWidget 拖拽 → 回傳 uuid → 預覽
- **作品集上傳**：拖拽 multiple → 列表更新
- **時段設定**：月曆 UI → dialog 選時段+日期 → 儲存
- **地區設定**：tree checkbox → 儲存
- **LINE Notify**：OAuth 跳轉，state=userInfo.id

---

## 十三、多語系支援

### 支援語系

- 介面：`zh`（中文）、`en`（English）
- 攝影師資料與特色：**tw/en/jp/kr** 四語系欄位

### 機制

- `vue-i18n`，`require.context` 自動載入 `locales/*.json`
- 起始語系：`zh`
- 使用 `@:` 連結語法

---

## 十四、外部整合

| 服務 | 用途 |
|------|------|
| LINE Notify | OAuth 綁定，攝影師接收訂單通知 |
| Google Maps API | 地址轉經緯度（Geocoder） |
| 後端 API | `joyshot-api`（Java Spring Boot），proxy `/api` → `localhost:7272` |
| 前台 | `joyshot-app`，攝影師介紹頁連結 |

---

## 十五、與 admin / app 專案的差異

| 面向 | photographer | admin | app |
|------|-------------|-------|-----|
| **定位** | 攝影師自助管理後台 | 平台管理員後台 | 消費者端 App |
| **token key** | `JS_P_TOKEN` | `JS_ADMIN_TOKEN` | `JS_APP_TOKEN` |
| **dev port** | 9777 | 9555 | 9666 |
| **正式環境** | `jsmaster.joyshot.app` | `admin.joyshot.app` | `joyshot.app` |
| **功能** | 基本資料/時段/地區/匯款/特色/作品/評價/我的訂單 | 完整 CRUD（用戶/客戶/訂單/攝影師/角色/選單/區域/服務/優惠券/字典/消息/FAQ） | 預約/瀏覽攝影師/下單 |
| **多語系** | zh/en + 資料四語系 | zh/en | zh/en/jp/ka |

### 攝影師端獨有功能

- 月曆式接案時段管理（schedule）
- el-tree 服務地區設定
- 作品集管理（多張拖拽上傳 + 預覽）
- 匯款資料維護
- 多語系特色資料（tw/en/jp/kr）
- 我的訂單 + 通報流程（聯繫客戶、照片上傳、張數回報）
- LINE Notify OAuth 綁定
- 前台攝影師介紹頁連結
- 拍攝酬勞計算（時長 × 800）

---

## 十六、已知問題與觀察

1. **`profile.vue` 路由跳轉錯誤**：`loadData()` 最後呼叫 `this.$router.push({path: '/detail'})`，但路由表中無 `/detail`（應為 `/account`）
2. **`rating.vue` 使用 `this.form.phId`** 但 data 中未定義 form
3. **`axios.js` 為空檔**，實際使用 `request.js`
4. **`productionSourceMap: true`**：正式環境暴露原始碼
5. **Google Maps API key 直接寫在 index.html**：無環境隔離
6. **timeout 5000ms**：上傳照片可能逾時
7. **Vue 2.5.21 版本偏舊**，建議升級至 2.7.x
8. **Header 語言切換已註解**：目前無法切換語系
9. **`my_order.vue` 的 `handleCurrentChange` 為空函式**：分頁切換未實作
10. **`photo_works.vue` 上傳未帶 token header**（el-upload 預設不走 axios 攔截器）

---

## 十七、開發指令速查

```bash
# 安裝依賴
npm install

# 開發模式（localhost:9777）
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