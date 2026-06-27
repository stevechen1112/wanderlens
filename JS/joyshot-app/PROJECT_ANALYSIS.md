# JoyShot App — 專案完整說明文件

> JoyShot 全台隨行攝影預訂平台的**客戶端 App**（C 端），讓客戶搜尋、挑選、預約攝影師並完成付款。定位為「全台隨行拍攝預訂平台」，slogan「精彩時刻，攝影隨行」。

---

## 一、專案概覽

| 項目 | 內容 |
|------|------|
| **專案名稱** | `joyshot-app` |
| **版本** | `0.1.0`（App 版本 `01.08.2024`） |
| **技術棧** | Vue 2.7.14 + Vue Router 3 + Vuex 3 + Element UI 2.15.12 |
| **建置工具** | Vue CLI 4.5.15 |
| **Dev Server** | `localhost:9666` |
| **後端 API** | `localhost:7272`（透過 `/api` proxy） |
| **Node Server** | `localhost:3000`（透過 `/place-api` proxy，Google Places） |
| **多語系** | zh / en / jp / ka（中/英/日/韓） |

---

## 二、技術棧與依賴

### Dependencies

| 套件 | 版本 | 用途 |
|------|------|------|
| `vue` | ^2.7.14 | 核心框架（Vue 2） |
| `vue-router` | ^3.2.0 | 路由（history mode） |
| `vuex` | ^3.6.2 | 狀態管理 |
| `element-ui` | ^2.15.12 | UI 元件庫（按需載入） |
| `axios` | ^1.3.2 | HTTP client |
| `vue-i18n` | ^8.28.2 | 多語系（zh/en/jp/ka） |
| `swiper` | ^5.4.5 | 輪播滑動元件 |
| `air-datepicker` | ^3.3.5 | 日期選擇器 |
| `dayjs` | ^1.11.7 | 日期處理 |
| `lodash` | ^4.17.21 | 工具函式 |
| `nanoid` | ^3.3.1 | 匿名 token 生成 |
| `nprogress` | ^0.2.0 | 頁面載入進度條 |
| `vue-lazyload` | ^1.3.4 | 圖片懶載入 |
| `vue-fb-customer-chat` | ^0.2.2 | Facebook Messenger 客服 |
| `vue-gtag` | ^1.16.1 | Google Analytics |

### Scripts

```json
"serve": "vue-cli-service serve --mode dev",
"build": "vue-cli-service build"
```

---

## 三、專案目錄結構

```
src/
├── App.vue                      # 根元件（Header + router-view + Footer + Cookie欄 + GoTop + Messenger）
├── main.js                      # 入口
├── i18n.js                      # VueI18n 初始化
├── api/
│   ├── request.js               # axios 實例（/api，含 apptoken/locale header）
│   ├── mockRequest.js           # axios 實例（/mock）
│   ├── app-api.js               # APP API
│   └── area-api.js              # 區域 API
├── assets/
│   ├── css/index.css            # 全域樣式
│   ├── images/                  # 圖示、banner、icon
│   └── logo.svg
├── components/                  # 21 個元件
├── config/supported-locales.js  # 支援語系
├── locales/                     # 多語系 JSON（zh/en/jp/ka）
├── mock/                        # MockJS 資料
├── plugins/
│   ├── element.js               # Element UI 按需註冊
│   ├── plugins.js               # 自訂全域 filter
│   └── vue-fb-customer-chat.js
├── router/index.js              # 路由設定
├── static/version.js            # 版本號
├── store/
│   ├── index.js                 # Vuex Store（area + jsapp 模組）
│   ├── area.js                  # 區域 action
│   └── jsapp.js                 # 核心：搜尋條件、預訂資訊、瀏覽紀錄
├── util/index.js                # Token 管理
└── views/                       # 11 個頁面
```

---

## 四、核心設定

### 4.1 vue.config.js

```js
module.exports = {
  lintOnSave: false,
  runtimeCompiler: true,
  publicPath: '/',
  devServer: {
    port: 9666,
    disableHostCheck: true,
    proxy: {
      '/api': { target: 'http://localhost:7272/' },
      '/place-api': { target: 'http://localhost:3000/', pathRewrite: {'^/place-api': ''} }
    }
  },
  productionSourceMap: true
}
```

### 4.2 App.vue

- **布局**：`#app` → `.wrapper` → `Header` + `<router-view>` + `Footer`
- **附加元素**：`.privacyBox`（Cookie 同意）、`.goTop`（回到頂部）、`#fb-root`（Messenger）
- **搜尋模式切換**：透過 `mode` class（`searchOpen`）控制全域搜尋表單展開/收合
- **匿名 token**：mounted 時用 `nanoid()` 產生 `JS_APP_TOKEN` 存 localStorage
- **版本檢查**：比對 `localStorage.JSAPP_VERSION` 與 `this.version`，不一致則 reload
- **語系 class**：`getLang()-app`（如 `zh-app`、`en-app`）用於 CSS 語系差異化

### 4.3 public/index.html

- `<title>全台隨行拍攝預訂平台</title>`
- SEO meta：description、keywords、og、twitter card、hreflang
- viewport：禁止縮放（`user-scalable=0`）
- 外部載入：Google Analytics（`G-DLGSCPNQCV`）、Meta Pixel（`3503288849915425`）、GTM（`GTM-NSJCP3P`）
- Google Maps API key：`AIzaSyCZt0Avv2Dx6P9uSyYXAh2dP-dx5JaxrII`

---

## 五、路由設定

| 路徑 | 名稱 | 說明 | 載入方式 |
|------|------|------|---------|
| `/` | Home | 首頁 | 同步 |
| `/match` | Match | 搜尋結果頁 | 同步 |
| `/photographer/:pid` | Photographer | 攝影師詳情 | 懶載入 |
| `/matched-photographer/:pid` | MatchedPhotographer | 配對結果攝影師 | 懶載入 |
| `/checkout` | Checkout | 結帳頁 | 懶載入 |
| `/thankyou/:tradeNo` | Thankyou | 付款結果 | 懶載入 |
| `/pay/:orderNo` | Pay | 付款頁 | 懶載入 |
| `/photographer-list` | PhotographerList | 攝影師列表 | 懶載入 |
| `/faq` | FAQ | 常見問題 | 懶載入 |
| `/privacy-policy` | PrivacyPolicy | 隱私政策 | 懶載入 |
| `/404` | NotFind | 404 頁面 | 懶載入 |
| `*` | NotFound | 萬用路由 | 懶載入 |

- `afterEach`：`gtag('config', 'G-DLGSCPNQCV', {page_path: to.fullPath})`（SPA 頁面瀏覽追蹤）

---

## 六、Vuex Store

### 6.1 jsapp 模組（核心業務狀態）

**State**：
- `token`：匿名用戶 token（`JS_APP_TOKEN`）
- `searchCondition`：搜尋條件（服務類別、日期、時間、時數、地點、人數、寵物、lat/lng、city/city_area、指定攝影師）
- `preOrderInfo`：選定攝影師與訂單資訊
- `previewMatchedPhotographer`：瀏覽過的攝影師紀錄

**Mutations**：
- `SAVE_SEARCH_CONDITION`：儲存搜尋條件
- `SAVE_PRE_ORDER`：儲存選定攝影師，寫入 localStorage `JS_PRE_ORDER`
- `SAVE_PREVIEW_MATCHED_PHOTOGRAPHER`：紀錄瀏覽過的攝影師

**Getters**：
- `order`：回傳 `preOrderInfo.order`
- `mapGeometry`：回傳 `${lat},${lng}`（供 Google Maps embed）
- `shootingPersons`：組裝拍攝人數描述（大人/小孩/寵物，含 i18n）
- `previewPhotographer`：回傳瀏覽紀錄

---

## 七、API 整合

### 7.1 請求封裝（request.js）

```js
const request = axios.create({
  baseURL: '/api',
  timeout: 5000
})
```

**請求攔截器**：
- `NProgress.start()`
- 帶 `apptoken` header（取自 store.jsapp.token）
- 帶 `locale` header（i18n.locale）

**回應攔截器**：`NProgress.done()`，回傳 `response.data`

### 7.2 API 端點一覽

| 端點 | 方法 | 用途 |
|------|------|------|
| `/area/area1` | GET | 取得縣市區域清單 |
| `/service-cat` | GET | 取得服務類別 |
| `/search/photographer` | POST | 依條件搜尋攝影師 |
| `/photographer/info/:phUuid` | GET | 攝影師詳情 |
| `/photographer/info/works/:phUuid` | GET | 攝影師作品集 |
| `/photographer/area/:areaId` | GET | 依區域取攝影師 |
| `/photographer/ratings` | GET | 評價分頁 |
| `/photographer/ratings-all` | GET | 評價總數 |
| `/attraction` | GET | 景點列表 |
| `/banner/type/banner_desktop` | GET | 桌面 banner |
| `/banner/type/banner_mobile` | GET | 手機 banner |
| `/banner/type/homepage_hero` | GET | 首頁 hero 廣告 |
| `/news/on` | GET | 公告 |
| `/instagram` | GET | IG 貼文 |
| `/faq` | GET | FAQ 列表 |
| `/order` | POST | 建立訂單 |
| `/order/ecpayCheckout` | GET | 綠界付款表單 |
| `/order/check/paid/:orderNo` | GET | 檢查付款狀態 |
| `/order/info/:tradeNo` | GET | 訂單詳情 |
| `/coupon/apply` | POST | 套用折扣碼 |
| `/place-api/textsearch` | GET | Google Places 文字搜尋（node-server 代理） |

---

## 八、頁面元件詳解

### 8.1 首頁（Home.vue）

**版面區塊順序**：
1. **Banner** — 輪播 banner（桌面/手機不同圖）
2. **UvpBox** — 認識 JoyShot + 4 大訴求（超值/彈性/效率/快速）
3. **MilestoneBox** — 服務類別卡片（8 項服務 + 價格）
4. **ReserveStepBox** — 5 步驟預約流程
5. **PhotographerBox** — 各地專業攝影師（AreaSlider + PhotographerGrid）
6. **RatingBox** — 評價輪播
7. **TouristSpots** — 熱門跟拍景點
8. **InstagramBox** — IG 貼文輪播
9. **AdBox** — 首頁 hero 廣告
10. **Recruit** — FAQ 連結 + 攝影師招募 + FB 粉絲頁

### 8.2 搜尋結果（Match.vue）

- **資料來源**：從 `searchCondition` 取條件，POST `/search/photographer`
- **UI**：banner + 標題「專業攝影師」+ 搜尋條件摘要 + 攝影師卡片列表
- **每張卡片**：bannerImg、nickName、city、avatar、服務費/交通費/總價、「立即預約」按鈕
- **互動**：
  - 點卡片 → 紀錄瀏覽 → 跳轉 `/matched-photographer/:phUuid`
  - 點「立即預約」→ `SAVE_PRE_ORDER` → 跳轉 `/checkout`，`fbq('track','AddToCart')`
- **指定攝影師**：搜尋結果為空時，跳出 `el-dialog` 提示

### 8.3 攝影師詳情（Photographer.vue）

- **API**：`GET /photographer/info/:phUuid`
- **UI 區塊**：
  - banner（動態背景圖）+ avatar + nickName + city
  - 評論數 / 預約數
  - 攝影師簡介（VIEW MORE/LESS 切換，140 字 excerpt）
  - 服務類別（含 icon）
  - 「預約此攝影師」按鈕 → 展開搜尋表單並指定攝影師
  - 特色列表（依語系過濾）
  - 評價輪播（Swiper）
  - 作品集
- **事件追蹤**：`fbq('track','ViewContent')`

### 8.4 配對結果攝影師（MatchedPhotographer.vue）

- 與 Photographer.vue 類似，但**帶價格資訊**（serviceFee/transportationFee/total）
- 「選擇此攝影師」按鈕 → `SAVE_PRE_ORDER` → `/checkout`
- **保護**：若 `previewPhotographer` 為空（直接 refresh），導回首頁

### 8.5 結帳（Checkout.vue）

**表單欄位**：
- customerName（姓名）、customerPhone（連絡電話）、contactTime（方便連絡時間）
- social（Line/WhatsApp/Wechat）、socialAccount（帳號）、email
- customerCity（taiwan / not_taiwan，決定付款方式）
- extraInfo（附加資訊）、couponCode（折扣碼）

**訂單明細側欄**：
- 攝影師、服務類別、拍攝時數
- 拍攝費、交通費（原價刪除線 + 實付）、折扣、總價 TWD
- Google Maps iframe

**付款方式**：
- 台灣 → 綠界 ECPay
- 非台灣 → PayPal
- **目前狀態**：線上支付已關閉，改為「Contact Us!」按鈕導向 Messenger + 「加入 Line@」按鈕

**折扣碼**：POST `/coupon/apply`，回傳折扣金額，重算 totalFee

### 8.6 付款頁（Pay.vue）

- `GET /order/check/paid/:orderNo`
- 已付款 → 跳轉 `/thankyou/:tradeNo`
- 未付款 → 重新觸發綠界付款

### 8.7 付款結果（Thankyou.vue）

- `GET /order/info/:tradeNo`
- `pay_success`：綠色標題「付款成功」+ 加入 Line@ 按鈕
- `pay_failed`：紅色標題「付款失敗」+ rtnCode + 查詢原因按鈕

### 8.8 其他頁面

| 頁面 | 說明 |
|------|------|
| PhotographerList | banner + AreaSlider（縣市篩選）+ PhotographerGrid |
| Faq | `el-collapse` 折疊面板，API `/faq` |
| PrivacyPolicy | 內容來自 i18n（v-html） |
| 404 | 顯示圖片 + 回首頁按鈕 |

---

## 九、元件詳解

### 9.1 Header.vue（核心搜尋列）

**結構**：logo + 搜尋列 + TopMenu + HeaderNav（語系切換）

**搜尋表單欄位**：
1. **服務類別**（radio card，含 icon，`/service-cat` 載入）
2. **日期**（AirDatepicker，依語系切換 locale）
3. **地點**（`el-autocomplete`，debounce 700ms，呼叫 `/place-api/textsearch`，解析 plus_code 取 city/lat/lng）
4. **時段**（hour 8-22 / minute 00-50 每 10 分）
5. **拍攝時數**（1-8 小時，每 0.5 小時一階）
6. **人數**（大人 0-10 / 99 超過10、小孩 0-10 / 99）
7. **寵物**（checkbox + 寵物類型輸入）
8. 「搜尋攝影師」按鈕

**驗證**：`formValidate()` 檢查必填欄位
**最低時數限制**：依地區 `minHour`
**查詢流程**：`SAVE_SEARCH_CONDITION` → 跳轉 `/match`，`fbq('track','Search')`

### 9.2 其他元件

| 元件 | 說明 |
|------|------|
| HeaderNav | 語系切換下拉（zh/en/jp/ka），切換後 reload |
| TopMenu | 主選單（攝影師列表） |
| Footer | Copyright + 隱私條款 + 公司資訊 |
| Banner | Swiper 輪播，autoplay 5000ms，桌面/手機不同圖 |
| NoticeBox | 公告列，`/news/on` |
| UvpBox | 認識 JoyShot + 4 大訴求 |
| MilestoneBox | 服務類別卡片，背景 `#52b6cc` |
| ReserveStepBox | 5 步驟預約流程，背景 `#fff5f4` |
| PhotographerBox | 各地攝影師 + AreaSlider + PhotographerGrid |
| PhotographerGrid | 攝影師卡片網格（可重用），響應式 4→3→2→1 欄 |
| PhotographerWorksGrid | 作品集，`el-image` + 點擊預覽 |
| AreaSlider | Swiper 縣市選擇滑桿 |
| AttractionGrid | 景點 Swiper 輪播 |
| TouristSpots | 熱門跟拍景點 |
| RatingBox | 評價輪播 + 總評價數 |
| InstagramBox / IG | IG 貼文輪播 |
| AdBox | 首頁 hero 廣告 |
| Recruit | FAQ 連結 + 攝影師招募 + FB 粉絲頁 iframe |

---

## 十、多語系支援

### 支援語系

| 代碼 | 語言 |
|------|------|
| `zh` | 中文 |
| `en` | English |
| `jp` | 日本語 |
| `ka` | 한국어 |

### 機制

- `loadLocaleMessages()`：用 `require.context` 自動載入 `locales/*.json`
- `getStartingLocale()`：優先 localStorage → 瀏覽器語系 → fallback `zh`
- 切換語系：存 localStorage 後 `location.reload()`

### 語系檔結構

```
action.*       — 操作訊息
message.*      — 通用訊息
buttons.*      — 按鈕文字
home.*         — 首頁各區塊標題
search_bar.*   — 搜尋列欄位標籤
Components.*   — 各元件文案
Views.*        — 各頁面文案
store.jsapp.*  — 人數描述
css.content.*  — CSS prefix 文字
```

### 語系 CSS 差異化

- App.vue 根 class 加 `getLang()-app`（如 `en-app`、`jp-app`）
- 多處 CSS 針對 `.en-app`、`.jp-app`、`.kr-app` 調整字體大小與寬度

---

## 十一、UI/UX 設計模式

### 11.1 配色系統

| 色碼 | 用途 |
|------|------|
| `#f37a69` | **主色珊瑚紅**（按鈕、tag、強調、border、評價星） |
| `#52b6cc` | **次色青藍**（more 按鈕、服務卡片底、招募按鈕） |
| `#fff5f4` | 淺粉背景（ReserveStepBox） |
| `#f6f6f6` | 淺灰背景（FAQ、Recruit） |
| `#465464` | banner 遮罩色 |
| `#333333` / `#666666` / `#dddddd` | 文字/邊框灰階 |

### 11.2 字體

```
"Roboto", Arial, "Noto Sans TC", "微軟正黑體", "Microsoft JhengHei",
"蘋果儷中黑", "Apple LiGothic Medium", sans-serif
```

### 11.3 布局結構

- **全站框架**：Header（含搜尋列）+ router-view（main）+ Footer
- **容器寬度**：`max-width: 1720px`（攝影師列表）、`1560px`（UvpBox/ReserveStepBox）、`1700px`（PhotographerBox）
- **響應式斷點**：1600 / 1400 / 1200 / 1000 / 767 / 600 / 420 px
- **卡片網格**：4 欄 → 3 欄 → 2 欄 → 1 欄

### 11.4 互動模式

- **搜尋模式**：點擊 Header 搜尋列 → 展開搜尋表單 → ESC 或點擊外部關閉
- **輪播**：Swiper 廣泛用於 Banner、AreaSlider、RatingBox、InstagramBox、AttractionGrid
- **圖片懶載入**：`v-lazy` + `Loading_icon.gif`
- **回到頂部**：`.goTop` 按鈕，平滑捲動
- **Cookie 同意**：底部 `.privacyBox`
- **Messenger 客服**：右下角 Facebook Customer Chat
- **載入動畫**：NProgress 進度條 + Element Loading 遮罩

### 11.5 預約流程（5 步驟）

1. **條件搜尋**：Header 搜尋列選服務類別、日期、時間、時數、地點、人數、寵物
2. **挑選攝影師**：Match 頁列表 → 點卡片看詳情或直接「立即預約」
3. **確認預約資訊**：Checkout 頁填寫客戶資料、確認明細、套用折扣碼
4. **完成付款**：綠界（台灣）/ PayPal（海外）→ 目前改為 Contact Us / Line@
5. **預訂完成**：Thankyou 頁顯示結果

### 11.6 搜尋流程細節

- 地點搜尋：`el-autocomplete` + Google Places Text Search（透過 node-server 代理）
- 選取地點後解析 `plus_code.compound_code` 取得區/縣市
- 依地區有最低拍攝時數限制（`minHour`）
- 指定攝影師：從 Photographer 頁「預約此攝影師」帶入搜尋表單

---

## 十二、第三方整合

| 服務 | 用途 |
|------|------|
| Google Analytics | 頁面瀏覽追蹤（`G-DLGSCPNQCV`） |
| Meta Pixel | Facebook 廣告追蹤（`3503288849915425`） |
| Google Tag Manager | 標籤管理（`GTM-NSJCP3P`） |
| Facebook Messenger | 客服聊天外掛 |
| Google Places API | 地點搜尋（透過 node-server 代理） |
| Google Maps Embed | 結帳頁地圖 |
| 綠界 ECPay | 台灣線上付款 |
| PayPal | 海外付款（目前已停用） |
| Instagram | 貼文展示 |
| Facebook 粉絲頁 | iframe 嵌入 |
| Line@ | 客服引導（`https://lin.ee/9Hdd4Dl`） |

---

## 十三、版本控管

- `src/static/version.js`：`Vue.prototype.version = '01.08.2024'`
- `App.vue` mounted 比對 localStorage `JSAPP_VERSION`，不一致則 reload（強制更新快取）

---

## 十四、開發指令速查

```bash
# 安裝依賴
npm install

# 開發模式（localhost:9666）
npm run serve

# 建置正式環境
npm run build
```

---

*文件生成日期：2026-06-23*