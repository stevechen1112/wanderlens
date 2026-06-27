# wanderlens-api Task Plan

> Task ID 格式：`API-{階段}-{流水號}`
> 狀態：🔲 todo / 🔄 in-progress / ✅ done / ⛔ blocked

---

## Phase 1：服務驗證

### 1.0 專案骨架與基礎設施

| Task ID | 標題 | 描述 | 依賴 | 估時 | 狀態 |
|---------|------|------|------|------|------|
| API-1-001 | Spring Boot 3.x 專案初始化 | Java 17 + Spring Boot 3.x + Maven 專案骨架、目錄結構、多環境設定（dev/prod/test） | INF-1-001 | 4h | ✅ |
| API-1-002 | MyBatis-Plus + MySQL 配置 | 連線配置、分頁插件、自動填充（createdAt/modifiedAt）、SQL 日誌 | API-1-001 | 3h | ✅ |
| API-1-003 | Redis 連線配置 | Redis 連線、基礎快取配置、分散式鎖工具類 | API-1-001 | 3h | ✅ |
| API-1-004 | 通用回傳格式與例外處理 | Result<T> 統一回傳、GlobalExceptionHandler、ServiceException、錯誤碼定義 | API-1-001 | 4h | ✅ |
| API-1-005 | SpringDoc OpenAPI 3 配置 | API 文件自動生成、Swagger UI、環境隔離 | API-1-001 | 2h | ✅ |
| API-1-006 | CORS 白名單配置 | 限制允許來源（dev/prod 不同白名單）、所有方法、Credentials | API-1-001 | 1h | ✅ |
| API-1-007 | Logback 多環境配置 | dev/prod/test 三環境日誌配置、RollingFileAppender、保留策略 | API-1-001 | 2h | ✅ |

### 1.1 認證與權限

| Task ID | 標題 | 描述 | 依賴 | 估時 | 狀態 |
|---------|------|------|------|------|------|
| API-1-010 | Spring Security 配置 | SecurityFilterChain、密碼編碼器（BCrypt）、路徑權限 | API-1-004 | 4h | ✅ |
| API-1-011 | JWT 認證模組 | 獨立密鑰（非密碼）、token 生成/驗證/刷新、8h 過期 | API-1-010 | 6h | ✅ |
| API-1-012 | User Entity + Mapper + Service | 消費者/攝影師/造型師/營運/客服/財務角色、BCrypt 密碼 | API-1-002, API-1-010 | 6h | ✅ |
| API-1-013 | Role + Menu Entity + RBAC | 角色 CRUD、選單權限、角色→選單關聯 | API-1-012 | 6h | ✅ |
| API-1-014 | 認證 API（登入/登出/刷新/變更密碼） | POST /auth/login、POST /auth/logout、POST /auth/refresh、POST /auth/change-password | API-1-011, API-1-012 | 4h | ✅ |
| API-1-015 | 攝影師註冊申請 API | POST /providers/apply（實名、作品集、器材、服務區、拍攝類型能力） | API-1-012 | 4h | ✅ |

### 1.2 預約與媒合

| Task ID | 標題 | 描述 | 依賴 | 估時 | 狀態 |
|---------|------|------|------|------|------|
| API-1-020 | ServiceType Entity + API | 拍攝類型 CRUD + 多語系 + 類型→建議配置對照 | API-1-002 | 4h | ✅ |
| API-1-021 | Configuration Entity + API | 拍攝配置（外拍/棚拍、單機/雙機、造型師是/否） | API-1-020 | 3h | ✅ |
| API-1-022 | Provider Entity + API | 攝影師 CRUD（含 UUID、多語系、上架狀態、服務項目） | API-1-012 | 8h | ✅ |
| API-1-023 | Availability Entity + API | 攝影師行事曆 CRUD（日期、時段、緩衝、封鎖） | API-1-022 | 6h | ✅ |
| API-1-024 | ProviderArea Entity + API | 服務地區（樹狀、多語系） | API-1-022 | 4h | ✅ |
| API-1-025 | ProviderBank Entity + API | 匯款資料 CRUD | API-1-022 | 3h | ✅ |
| API-1-026 | ProviderFeature Entity + API | 特色資料 CRUD（多語系） | API-1-022 | 3h | ✅ |
| API-1-027 | ProviderWorks Entity + API | 作品集 CRUD（最多 50 張） | API-1-022 | 4h | ✅ |
| API-1-028 | ProviderRating Entity + API | 評價 CRUD | API-1-022 | 3h | ✅ |
| API-1-029 | 搜尋媒合 API | 依類型/地點/日期/時段/人數搜尋可用攝影師（階段一僅單池） | API-1-023, API-1-024 | 8h | ✅ |
| API-1-030 | 時段鎖定機制 | Redis 分散式鎖，選到即確定，防止併發衝突 | API-1-003, API-1-029 | 6h | ✅ |

### 1.3 訂單與狀態機

| Task ID | 標題 | 描述 | 依賴 | 估時 | 狀態 |
|---------|------|------|------|------|------|
| API-1-040 | Order Entity + Mapper | 訂單完整欄位（含配置、價格明細、人員、地點、時間） | API-1-002 | 6h | ✅ |
| API-1-041 | 訂單狀態機實作 | 17+ 狀態的狀態轉移引擎、非法轉移防護 | API-1-040 | 10h | ✅ |
| API-1-042 | OrderHistory Entity + API | 訂單事件紀錄（每次狀態變更記錄） | API-1-040 | 3h | ✅ |
| API-1-043 | ShootEvent Entity + API | 起拍/加時/結束時間戳記 API | API-1-040 | 4h | ✅ |
| API-1-044 | 加時申請 + 即時付款 API | 攝影師發起加時、消費者確認 + 即時付款 | API-1-041, API-1-050 | 6h | ✅ |
| API-1-045 | 取消退款 API | 分級取消（早/中/近）、退款流程 | API-1-041, API-1-050 | 6h | ✅ |
| API-1-046 | 重新媒合 API | 攝影師棄權（24h未聯繫）→ 自動重新媒合 | API-1-041, API-1-029 | 5h | ✅ |
| API-1-047 | 攝影師棄權懲罰紀錄 | 違規紀錄（警告/暫停/下架三級） | API-1-046 | 3h | ✅ |
| API-1-048 | 訂單 CRUD API | 建立訂單、查詢訂單、訂單列表、後台手動建立 | API-1-040, API-1-041 | 6h | ✅ |
| API-1-049 | 訂單統計 API | 客戶數/訂單數/金額統計 | API-1-048 | 3h | ✅ |

### 1.4 金流

| Task ID | 標題 | 描述 | 依賴 | 估時 | 狀態 |
|---------|------|------|------|------|------|
| API-1-050 | ECPay 綠界支付整合 | SDK 整合、付款表單產生、CheckMacValue 驗證 | API-1-040 | 10h | ✅ |
| API-1-051 | 付款回呼 API | 綠界回呼驗證、狀態更新 pay_success、通知觸發 | API-1-050, API-1-041 | 6h | ✅ |
| API-1-052 | LedgerEntry Entity + API | 清算帳本（收款/平台抽成/應付攝影師/實際撥款） | API-1-040 | 6h | ✅ |
| API-1-053 | 撥款 API | 後台標記已撥款、更新帳本 | API-1-052 | 3h | ✅ |
| API-1-054 | Coupon Entity + API | 折扣碼 CRUD + 驗證（期間/次數/低消/服務類型） | API-1-040 | 6h | ✅ |

### 1.5 站內溝通

| Task ID | 標題 | 描述 | 依賴 | 估時 | 狀態 |
|---------|------|------|------|------|------|
| API-1-060 | Conversation Entity + API | 溝通室（類型：管理/客服/訂單，狀態：開啟/唯讀/關閉） | API-1-002 | 5h | ✅ |
| API-1-061 | Message Entity + API | 訊息 CRUD（文字/圖片/系統/範本）、已讀標記 | API-1-060 | 6h | ✅ |
| API-1-062 | 訂單通道連動 | 付款後自動開啟、結案後轉唯讀、爭議時營運介入 | API-1-060, API-1-041 | 5h | ✅ |
| API-1-063 | 敏感資訊遮罩 | 手機/Email/地址自動遮罩、違規關鍵字偵測基礎 | API-1-061 | 4h | ✅ |
| API-1-064 | 溝通圖片上傳 API | 溝通室內圖片上傳（參考圖/服裝/場地照片） | API-1-061 | 3h | ✅ |
| API-1-065 | ConversationAccessLog | 調閱日誌（調閱者/時間/原因） | API-1-060 | 2h | ✅ |

### 1.6 通知與排程

| Task ID | 標題 | 描述 | 依賴 | 估時 | 狀態 |
|---------|------|------|------|------|------|
| API-1-070 | LINE Notify 整合 | OAuth 綁定 + 通知發送 + 群發 | API-1-012 | 6h | ✅ |
| API-1-071 | SMS 整合 | 三竹（prod）/ Twilio（dev）簡訊發送 | API-1-004 | 4h | ✅ |
| API-1-072 | Email 整合 | SMTP HTML 郵件、dev-mode BCC | API-1-004 | 4h | ✅ |
| API-1-073 | NotifyMessage Entity + API | 站內通知訊息（未讀/已讀） | API-1-012 | 4h | ✅ |
| API-1-074 | 排程：24h聯繫提醒 | 拍攝前 24H 提醒攝影師聯繫 | API-1-041, API-1-070 | 3h | ✅ |
| API-1-075 | 排程：RAW上傳提醒 | 拍攝後 12H/18H 提醒上傳 | API-1-041 | 3h | ✅ |
| API-1-076 | 排程：自動取消 | 超過 24H 未付款自動取消 + 釋放時段 | API-1-041, API-1-030 | 3h | ✅ |
| API-1-077 | 排程：48h SLA 告警 | AI 交付 SLA 倒數告警 | API-1-041 | 3h | ✅ |
| API-1-078 | 排程：關帳通知 | 定期關帳通知 | API-1-052 | 2h | ✅ |
| API-1-079 | AppFlow 通知流程設定 | 依 flowType 查詢通知人員、觸發 LINE/Email/SMS | API-1-070, API-1-071, API-1-072 | 5h | ✅ |

### 1.7 相簿與內容基礎

| Task ID | 標題 | 描述 | 依賴 | 估時 | 狀態 |
|---------|------|------|------|------|------|
| API-1-090 | Album Entity + API | 基本相簿（私人相簿、拍攝日期/地點/攝影師/類型） | API-1-040 | 5h | ✅ |
| API-1-091 | MediaAsset Entity + API | 媒體資產關聯（RAW/JPEG/AI/精修版本、預覽圖、縮圖） | API-1-090 | 5h | ✅ |
| API-1-092 | Consent Entity + API | 授權基礎（私密/連結分享/公開雛形）+ 可撤回 | API-1-090 | 5h | ✅ |
| API-1-093 | SceneTag Entity + API | 場景標籤基礎（從訂單自動產生：類型/地點/日期/城市） | API-1-040 | 4h | ✅ |
| API-1-094 | BehaviorEvent Entity + API | 行為事件基礎（AlbumViewed/PhotoDownloaded/PhotoShared） | API-1-090 | 4h | ✅ |
| API-1-095 | 相簿下載/分享 API | 下載照片、產生分享連結 | API-1-090, API-1-092 | 4h | ✅ |

### 1.8 媒體管線介面

| Task ID | 標題 | 描述 | 依賴 | 估時 | 狀態 |
|---------|------|------|------|------|------|
| API-1-100 | Media 服務 API 契約定義 | 與 wanderlens-media 的介面定義（上傳token/驗收/AI狀態） | API-1-091 | 3h | ✅ |
| API-1-101 | 上傳 token 核發 API | 核發 RAW/JPEG 上傳憑證給 provider 端 | API-1-100 | 3h | ✅ |
| API-1-102 | 驗收回報 API | 接收 media 的檔案驗收結果（數量/格式/完整性） | API-1-100 | 3h | ✅ |
| API-1-103 | AI 處理狀態 API | 接收 media 的 AI 調色狀態（處理中/完成/失敗） | API-1-100 | 3h | ✅ |
| API-1-104 | 交付通知 API | AI 完成後觸發相簿上架 + 通知消費者 | API-1-103, API-1-090 | 3h | ✅ |

### 1.9 區域與內容管理

| Task ID | 標題 | 描述 | 依賴 | 估時 | 狀態 |
|---------|------|------|------|------|------|
| API-1-110 | Area Entity + API | 行政區域樹狀 CRUD + 多語系 + 最低拍攝時數 | API-1-002 | 5h | ✅ |
| API-1-111 | Banner Entity + API | 首頁 Banner CRUD（桌面/手機/hero） | API-1-002 | 3h | ✅ |
| API-1-112 | News Entity + API | 公告 CRUD | API-1-002 | 2h | ✅ |
| API-1-113 | FAQ Entity + API | FAQ CRUD + 多語系 | API-1-002 | 3h | ✅ |
| API-1-114 | AttractionPost Entity + API | 景點文章 CRUD | API-1-002 | 3h | ✅ |
| API-1-115 | InstagramPost Entity + API | IG 貼文 CRUD | API-1-002 | 2h | ✅ |
| API-1-116 | FileRepo Entity + 通用上傳 API | 通用檔案上傳（頭像/Banner/作品集/溝通圖片） | API-1-002 | 4h | ✅ |

### 1.10 Google 服務整合

| Task ID | 標題 | 描述 | 依賴 | 估時 | 狀態 |
|---------|------|------|------|------|------|
| API-1-120 | Google Maps Directions API | 攝影師住家→拍攝地距離計算（交通費） | API-1-022 | 4h | ✅ |
| API-1-121 | Google Places API 代理 | 地點搜尋代理（取代 joyshot-node-server） | API-1-004 | 3h | ✅ |
| API-1-122 | Google Maps Geocoder | 地址轉經緯度 | API-1-022 | 2h | ✅ |

### 1.11 測試與驗證

| Task ID | 標題 | 描述 | 依賴 | 估時 | 狀態 |
|---------|------|------|------|------|------|
| API-1-130 | 訂單狀態機整合測試 | 17+ 狀態的完整轉移路徑測試 | API-1-041 | 8h | ✅ |
| API-1-131 | 時段鎖定壓力測試 | 併發預約衝突測試 | API-1-030 | 4h | ✅ |
| API-1-132 | 金流端對端測試 | 綠界付款→回呼→狀態更新→通知 完整流程 | API-1-051 | 4h | ✅ |
| API-1-133 | 站內溝通流程測試 | 成交後開啟→訊息→結案唯讀→爭議調閱 | API-1-062 | 3h | ✅ |
| API-1-134 | 排程任務測試 | 所有排程任務的觸發與執行驗證 | API-1-074~078 | 4h | ✅ |

---

## Phase 2：服務完整化（預覽）

| Task ID | 標題 | 依賴 | 估時 | 狀態 |
|---------|------|------|------|------|
| API-2-001 | Studio Entity + API（攝影棚供給池） | API-1-022 | 8h | ✅ |
| API-2-002 | Stylist Entity + API（造型師供給池） | API-1-022 | 8h | ✅ |
| API-2-003 | 造型師前置緩衝計算 | API-2-002 | 4h | ✅ |
| API-2-004 | 三池媒合引擎 | API-1-029, API-2-001, API-2-002 | 12h | ✅ |
| API-2-005 | 雙攝影師配置 | API-1-021 | 4h | ✅ |
| API-2-006 | RetouchJob Entity + API | API-1-091 | 8h | ✅ |
| API-2-007 | 精修工單派工 + 成品驗收 | API-2-006 | 6h | ✅ |
| API-2-008 | 評價系統擴展（違規/淘汰） | API-1-028 | 5h | ✅ |
| API-2-009 | 清算帳本擴展（多供給池分項） | API-1-052 | 5h | ✅ |
| API-2-010 | 溝通範本訊息 | API-1-061 | 3h | ✅ |
| API-2-011 | 改期/加時流程整合 | API-1-044, API-1-062 | 5h | ✅ |

---

## 估時總計

| 階段 | Task 數 | 預估工時 |
|------|---------|---------|
| Phase 1 | 72 tasks | ~350h |
| Phase 2 | 11 tasks（預覽） | ~60h |
| Phase 3 | 10 tasks | ~55h |
| Phase 4-5 | 待規劃 | - |

---

## Phase 3：內容平台化

### 3.1 相簿擴展

| Task ID | 標題 | 描述 | 依賴 | 估時 | 狀態 |
|---------|------|------|------|------|------|
| API-3-001 | 相簿拍攝歷程 API | 依年份/地點/人物關係/拍攝類型查詢歷程 | API-1-090 | 5h | ✅ |
| API-3-002 | 相簿收藏 API | 收藏/取消收藏照片 | API-1-090 | 3h | ✅ |

### 3.2 公開授權擴展

| Task ID | 標題 | 描述 | 依賴 | 估時 | 狀態 |
|---------|------|------|------|------|------|
| API-3-003 | 多層授權 API | 公開/作品集/行銷/商業 + 雙向授權 + 撤回 | API-1-092 | 6h | ✅ |
| API-3-004 | 未成年人特別處理 | 含未成年人照片預設更高隱私 + 額外確認 | API-3-003 | 4h | ✅ |

### 3.3 SEO 內容池

| Task ID | 標題 | 描述 | 依賴 | 估時 | 狀態 |
|---------|------|------|------|------|------|
| API-3-005 | 地點靈感頁 API | 依地點 + 拍攝類型組合查詢公開相簿 | API-1-090 | 5h | ✅ |
| API-3-006 | 拍攝類型頁 API | 依拍攝類型查詢公開作品 | API-1-090 | 3h | ✅ |
| API-3-007 | 攝影師作品頁 API | 攝影師公開作品 + 可預約時段 | API-1-022 | 4h | ✅ |

### 3.4 分享工具

| Task ID | 標題 | 描述 | 依賴 | 估時 | 狀態 |
|---------|------|------|------|------|------|
| API-3-008 | 分享連結 + 社群格式 API | 產生分享連結 + IG/FB/LINE 格式輸出 | API-1-090 | 4h | ✅ |

### 3.5 場景標籤擴展

| Task ID | 標題 | 描述 | 依賴 | 估時 | 狀態 |
|---------|------|------|------|------|------|
| API-3-009 | 場景標籤擴展 API | AI 影像辨識標籤 + 行為標籤 + 標籤搜尋 | API-1-093 | 6h | ✅ |

### 3.6 回訪召回

| Task ID | 標題 | 描述 | 依賴 | 估時 | 狀態 |
|---------|------|------|------|------|------|
| API-3-010 | 回訪召回排程 | 拍攝週年/寶寶月份/旅遊回顧推播 | API-1-074 | 4h | ✅ |

---

## Phase 4：品質衝刺 Q1–Q4（2026-06-27）

| Task ID | 標題 | 狀態 | 備註 |
|---------|------|------|------|
| API-4-001 | 語意化 ResultCode 全面統一 | ✅ | 見 `ResultCode.java`、`API_SPEC.md` §1.3 |
| API-4-002 | Draft→PendingPayment 結帳轉移 | ✅ | `PaymentServiceImpl` |
| API-4-003 | OrderController NOT_FOUND | ✅ | `order_not_found` |
| API-4-004 | 狀態機 / 錯誤碼單元測試 | ✅ | `OrderServiceImplTransitionTest`、`OrderControllerNotFoundTest` |

---

*文件建立日期：2026-06-23 · Phase 4 更新：2026-06-27*