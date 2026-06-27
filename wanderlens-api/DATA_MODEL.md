# wanderlens-api 資料模型

> 本文件定義 wanderlens-api 的核心 Entity，是全平台的資料模型唯一來源。

---

## 1. 核心物件總覽

```
User ─┬─ Provider（攝影師/造型師/攝影棚）
      └─ Consumer（消費者）

ServiceType ─→ Configuration（拍攝配置）

Booking ─→ Order ─┬─ ShootEvent（拍攝事件）
                  ├─ OrderHistory（訂單歷程）
                  └─ LedgerEntry（清算帳本）

Order ─→ Conversation ─→ Message

Order ─→ Album ─→ MediaAsset
                 ├─ Consent（授權）
                 ├─ SceneTag（場景標籤）
                 └─ BehaviorEvent（行為事件）

Order ─→ RetouchJob（精修工單）
```

---

## 2. Entity 定義

### 2.1 User

| 欄位 | 類型 | 說明 |
|------|------|------|
| id | BIGINT (AUTO) | ID |
| empno | VARCHAR(50) | 登入帳號 |
| password | VARCHAR(255) | 密碼（BCrypt） |
| username | VARCHAR(100) | 姓名 |
| phone | VARCHAR(20) | 電話 |
| email | VARCHAR(255) | Email |
| avatar | VARCHAR(255) | 大頭照 URL |
| role | ENUM | CONSUMER/PHOTOGRAPHER/STYLIST/STUDIO_MANAGER/ADMIN/SUPPORT/FINANCE/RETOUCH_COMPANY |
| roleId | BIGINT | 角色 ID（RBAC） |
| area | VARCHAR(50) | 所在區域 |
| providerId | BIGINT | 關聯 Provider（如適用） |
| affiliateId | BIGINT | 關聯推廣員（如適用） |
| lineToken | VARCHAR(255) | LINE Notify token |
| status | ENUM | ACTIVE/SUSPENDED/DELETED |
| createdAt | DATETIME | 建立時間 |
| modifiedAt | DATETIME | 修改時間 |

### 2.2 Provider（攝影師/造型師/攝影棚）

| 欄位 | 類型 | 說明 |
|------|------|------|
| id | BIGINT (AUTO) | ID |
| providerUuid | VARCHAR(36) | UUID（前台用） |
| providerType | ENUM | PHOTOGRAPHER/STYLIST/STUDIO |
| name | VARCHAR(100) | 姓名/名稱 |
| nickName | VARCHAR(100) | 暱稱 |
| nickNameEn | VARCHAR(100) | 暱稱（英） |
| nickNameJp | VARCHAR(100) | 暱稱（日） |
| nickNameKr | VARCHAR(100) | 暱稱（韓） |
| phone | VARCHAR(20) | 電話 |
| email | VARCHAR(255) | Email |
| city | VARCHAR(50) | 縣市 |
| districtName | VARCHAR(50) | 鄉鎮區 |
| address | VARCHAR(255) | 地址 |
| addrLng | DOUBLE | 經度 |
| addrLat | DOUBLE | 緯度 |
| avatar | VARCHAR(255) | 大頭照 |
| bannerImg | VARCHAR(255) | 代表圖 |
| intro | TEXT | 介紹 |
| introEn | TEXT | 介紹（英） |
| introJp | TEXT | 介紹（日） |
| introKr | TEXT | 介紹（韓） |
| rating | DECIMAL(2,1) | 評價 |
| goLive | ENUM | Y/N（上架狀態） |
| serviceItem | VARCHAR(255) | 服務項目（逗號分隔 ID） |
| violationCount | INT | 違規次數 |
| violationLevel | ENUM | NONE/WARNING/SUSPENDED/PERMANENT_BAN |
| createdAt | DATETIME | |
| modifiedAt | DATETIME | |

### 2.3 Availability（行事曆）

| 欄位 | 類型 | 說明 |
|------|------|------|
| id | BIGINT (AUTO) | ID |
| providerId | BIGINT | 攝影師/造型師 ID |
| scheduleDate | DATE | 日期 |
| slotStart | TIME | 開始時間 |
| slotEnd | TIME | 結束時間 |
| bufferBefore | INT | 前置緩衝（分鐘，造型師用） |
| maxValue | INT | 可預約數 |
| active | ENUM | Y/N |
| lockedByOrderId | BIGINT | 被訂單鎖定時的訂單 ID |
| createdAt | DATETIME | |
| modifiedAt | DATETIME | |

### 2.4 ServiceType（拍攝類型）

| 欄位 | 類型 | 說明 |
|------|------|------|
| id | BIGINT (AUTO) | ID |
| name | VARCHAR(100) | 類型名稱 |
| nameEn | VARCHAR(100) | 英 |
| nameJp | VARCHAR(100) | 日 |
| nameKr | VARCHAR(100) | 韓 |
| iconUrl | VARCHAR(255) | 圖示 |
| suggestedConfig | JSON | 建議配置（外拍/棚拍、單機/雙機、造型師） |
| sortOrder | INT | 排序 |
| active | ENUM | Y/N |

### 2.5 Configuration（拍攝配置）

| 欄位 | 類型 | 說明 |
|------|------|------|
| id | BIGINT (AUTO) | ID |
| shootLocation | ENUM | OUTDOOR/STUDIO/BOTH |
| photographerCount | INT | 1 或 2 |
| needStylist | BOOLEAN | 是否需要造型師 |
| label | VARCHAR(100) | 配置標籤 |

### 2.6 Booking（預約條件）

| 欄位 | 類型 | 說明 |
|------|------|------|
| id | BIGINT (AUTO) | ID |
| consumerId | BIGINT | 消費者 ID |
| serviceTypeId | BIGINT | 拍攝類型 |
| configurationId | BIGINT | 拍攝配置 |
| shootingDate | DATE | 拍攝日期 |
| shootingTimeStart | TIME | 開始時間 |
| shootingTimeEnd | TIME | 結束時間 |
| shootingDuration | DECIMAL(3,1) | 拍攝時數 |
| shootingLocation | VARCHAR(255) | 拍攝地點 |
| shootingLat | DOUBLE | 緯度 |
| shootingLng | DOUBLE | 經度 |
| adultNum | INT | 大人人數 |
| childNum | INT | 小孩人數 |
| petInfo | VARCHAR(255) | 寵物資訊 |
| status | ENUM | DRAFT/CONFIRMED/EXPIRED |

### 2.7 Order（訂單）

| 欄位 | 類型 | 說明 |
|------|------|------|
| id | BIGINT (AUTO) | ID |
| orderNo | VARCHAR(20) | 訂單編號（yyyyMMddHHmmssSS） |
| bookingId | BIGINT | 預約條件 ID |
| consumerId | BIGINT | 消費者 ID |
| photographerId | BIGINT | 攝影師 ID |
| stylistId | BIGINT | 造型師 ID（如適用） |
| studioId | BIGINT | 攝影棚 ID（如適用） |
| serviceTypeId | BIGINT | 拍攝類型 |
| configurationId | BIGINT | 拍攝配置 |
| serviceFee | INT | 拍攝費 |
| unitPrice | INT | 每小時單價 |
| transportationFee | INT | 交通費 |
| couponCode | VARCHAR(50) | 折扣碼 |
| couponDiscount | INT | 折扣金額 |
| extraTimeFee | INT | 加時費用 |
| totalFee | INT | 總費用 |
| photographerProfit | INT | 攝影師應付 |
| status | VARCHAR(30) | 訂單狀態（狀態機） |
| paymentMethod | VARCHAR(20) | 付款方式 |
| customerName | VARCHAR(100) | 客戶姓名 |
| customerPhone | VARCHAR(20) | 客戶電話 |
| email | VARCHAR(255) | Email |
| shootingDate | DATE | 拍攝日期 |
| shootingTime | VARCHAR(50) | 拍攝時間 |
| shootingDuration | DECIMAL(3,1) | 拍攝時數 |
| shootingLocation | VARCHAR(255) | 拍攝地點 |
| adultNum | INT | 大人人數 |
| childNum | INT | 小孩人數 |
| picNum | INT | 照片張數 |
| manualOrder | ENUM | Y/N |
| createdAt | DATETIME | |
| modifiedAt | DATETIME | |

### 2.8 ShootEvent（拍攝事件）

| 欄位 | 類型 | 說明 |
|------|------|------|
| id | BIGINT (AUTO) | ID |
| orderId | BIGINT | 訂單 ID |
| eventType | ENUM | SHOOT_START/SHOOT_END/EXTRA_TIME_REQUEST/EXTRA_TIME_CONFIRMED/EXTRA_TIME_REJECTED |
| eventTime | DATETIME | 事件時間 |
| extraTimeMinutes | INT | 加時分鐘（如適用） |
| extraTimeFee | INT | 加時費用（如適用） |
| operatorId | BIGINT | 操作者 ID |

### 2.9 OrderHistory（訂單歷程）

| 欄位 | 類型 | 說明 |
|------|------|------|
| id | BIGINT (AUTO) | ID |
| orderId | BIGINT | 訂單 ID |
| orderNo | VARCHAR(20) | 訂單編號 |
| fromStatus | VARCHAR(30) | 原狀態 |
| toStatus | VARCHAR(30) | 新狀態 |
| action | VARCHAR(50) | 動作 |
| actionDetail | TEXT | 詳細說明 |
| execBy | VARCHAR(100) | 執行者 |
| createdAt | DATETIME | |

### 2.10 LedgerEntry（清算帳本）

| 欄位 | 類型 | 說明 |
|------|------|------|
| id | BIGINT (AUTO) | ID |
| orderId | BIGINT | 訂單 ID |
| entryType | ENUM | RECEIPT/PLATFORM_FEE/PROVIDER_PAYABLE/STUDIO_PAYABLE/STYLIST_PAYABLE/RETOUCH_PAYABLE/PAYOUT |
| amount | INT | 金額 |
| providerId | BIGINT | 關聯供給方 |
| status | ENUM | PENDING/SETTLED |
| settledAt | DATETIME | 撥款時間 |
| createdAt | DATETIME | |

### 2.11 Conversation（溝通室）

| 欄位 | 類型 | 說明 |
|------|------|------|
| id | BIGINT (AUTO) | ID |
| conversationType | ENUM | ADMIN/CUSTOMER_SERVICE/ORDER |
| orderId | BIGINT | 關聯訂單（ORDER 類型） |
| participantAId | BIGINT | 參與者 A |
| participantBId | BIGINT | 參與者 B |
| status | ENUM | OPEN/READONLY/CLOSED |
| createdAt | DATETIME | |
| modifiedAt | DATETIME | |

### 2.12 Message（訊息）

| 欄位 | 類型 | 說明 |
|------|------|------|
| id | BIGINT (AUTO) | ID |
| conversationId | BIGINT | 溝通室 ID |
| senderId | BIGINT | 發送者 ID |
| messageType | ENUM | TEXT/IMAGE/SYSTEM/TEMPLATE |
| content | TEXT | 訊息內容 |
| imageUrl | VARCHAR(255) | 圖片 URL（IMAGE 類型） |
| isRead | BOOLEAN | 已讀 |
| readAt | DATETIME | 已讀時間 |
| createdAt | DATETIME | |

### 2.13 Album（相簿）

| 欄位 | 類型 | 說明 |
|------|------|------|
| id | BIGINT (AUTO) | ID |
| orderId | BIGINT | 關聯訂單 |
| consumerId | BIGINT | 消費者 ID |
| photographerId | BIGINT | 攝影師 ID |
| title | VARCHAR(255) | 相簿標題 |
| shootDate | DATE | 拍攝日期 |
| shootLocation | VARCHAR(255) | 拍攝地點 |
| city | VARCHAR(50) | 城市 |
| serviceTypeId | BIGINT | 拍攝類型 |
| albumType | ENUM | PRIVATE/PUBLIC |
| createdAt | DATETIME | |

### 2.14 MediaAsset（媒體資產）

| 欄位 | 類型 | 說明 |
|------|------|------|
| id | BIGINT (AUTO) | ID |
| albumId | BIGINT | 相簿 ID |
| orderId | BIGINT | 訂單 ID |
| assetType | ENUM | RAW/JPEG/AI_BASIC/RETOUCH |
| fileUrl | VARCHAR(500) | 檔案 URL |
| previewUrl | VARCHAR(500) | 預覽圖 URL |
| thumbnailUrl | VARCHAR(500) | 縮圖 URL |
| fileSize | BIGINT | 檔案大小 |
| mimeType | VARCHAR(50) | MIME 類型 |
| status | ENUM | UPLOADING/UPLOADED/PROCESSING/READY/FAILED |
| createdAt | DATETIME | |

### 2.15 Consent（授權）

| 欄位 | 類型 | 說明 |
|------|------|------|
| id | BIGINT (AUTO) | ID |
| mediaAssetId | BIGINT | 媒體資產 ID |
| albumId | BIGINT | 相簿 ID |
| consumerConsent | ENUM | PRIVATE/LINK_SHARE/PUBLIC/PORTFOLIO/MARKETING/COMMERCIAL |
| providerConsent | ENUM | 同上 |
| consentByConsumer | BOOLEAN | 消費者已同意 |
| consentByProvider | BOOLEAN | 攝影師已同意 |
| hasMinor | BOOLEAN | 含未成年人 |
| revokedAt | DATETIME | 撤回時間 |
| createdAt | DATETIME | |

### 2.16 SceneTag（場景標籤）

| 欄位 | 類型 | 說明 |
|------|------|------|
| id | BIGINT (AUTO) | ID |
| albumId | BIGINT | 相簿 ID |
| mediaAssetId | BIGINT | 媒體資產 ID |
| tagCategory | ENUM | SERVICE_TYPE/RELATION/LOCATION/SITUATION/STYLE/COMMERCIAL_INTENT |
| tagValue | VARCHAR(100) | 標籤值 |
| tagSource | ENUM | ORDER/MAP/USER_INPUT/AI_RECOGNITION/MANUAL/BEHAVIOR |
| createdAt | DATETIME | |

### 2.17 BehaviorEvent（行為事件）

| 欄位 | 類型 | 說明 |
|------|------|------|
| id | BIGINT (AUTO) | ID |
| eventType | ENUM | ALBUM_VIEWED/PHOTO_DOWNLOADED/PHOTO_SHARED/PHOTO_MADE_PUBLIC/PUBLIC_PAGE_VIEWED/BOOKING_STARTED_FROM_CONTENT/RETOUCH_SELECTED/PHOTOGRAPHER_VIEWED/LOCATION_VIEWED/REFERRAL_CLICKED |
| userId | BIGINT | 使用者 ID |
| albumId | BIGINT | 相簿 ID（如適用） |
| mediaAssetId | BIGINT | 媒體資產 ID（如適用） |
| metadata | JSON | 附加資料 |
| createdAt | DATETIME | |

### 2.18 RetouchJob（精修工單）

| 欄位 | 類型 | 說明 |
|------|------|------|
| id | BIGINT (AUTO) | ID |
| orderId | BIGINT | 訂單 ID |
| consumerId | BIGINT | 消費者 ID |
| mediaAssetIds | JSON | 選片清單 |
| retouchCompanyId | BIGINT | 外包公司 ID |
| status | ENUM | REQUESTED/ASSIGNED/IN_PROGRESS/DELIVERED/REJECTED/SETTLED |
| spec | TEXT | 修圖規格 |
| fee | INT | 精修費用 |
| deliveryDeadline | DATETIME | 交期 |
| createdAt | DATETIME | |

### 2.19 其他 Entity

| Entity | 說明 |
|--------|------|
| Area | 行政區域樹狀 + 多語系 + 最低拍攝時數 |
| ProviderArea | 攝影師服務地區 |
| ProviderBank | 匯款資料 |
| ProviderFeature | 特色資料（多語系） |
| ProviderWorks | 作品集 |
| ProviderRating | 評價 |
| Coupon | 折扣碼 |
| Affiliate | 推廣員 |
| Banner / News / Faq | CMS |
| AttractionPost | 景點文章 |
| InstagramPost | IG 貼文 |
| FileRepo | 通用檔案儲存 |
| NotifyMessage | 站內通知 |
| AppFlow | 通知流程設定 |
| ActionLog | 操作日誌 |
| ConversationAccessLog | 溝通調閱日誌 |
| MessageReport | 訊息檢舉 |
| MessageTemplate | 範本訊息 |

---

## 3. 索引策略

| 表 | 索引 | 用途 |
|----|------|------|
| Order | (consumerId, status) | 消費者訂單查詢 |
| Order | (photographerId, status) | 攝影師訂單查詢 |
| Order | (status, shootingDate) | 營運監控 |
| Availability | (providerId, scheduleDate, active) | 時段查詢 |
| Message | (conversationId, createdAt) | 溝通記錄查詢 |
| MediaAsset | (albumId, assetType) | 相簿媒體查詢 |
| BehaviorEvent | (userId, eventType, createdAt) | 行為分析 |
| SceneTag | (tagCategory, tagValue) | 標籤搜尋 |

---

*文件建立日期：2026-06-23*