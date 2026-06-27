# JoyShot API — 專案完整說明文件

> JoyShot 隨行攝影預訂平台的後端 API 系統，媒合客戶與攝影師，提供線上預約拍攝、線上付款、照片交付等完整流程。

---

## 一、專案概覽

| 項目 | 內容 |
|------|------|
| **GroupId / ArtifactId** | `com.joyshot.app / joyshot` |
| **版本** | `0.0.1-SNAPSHOT` |
| **作者** | avery |
| **Java 版本** | 1.8 |
| **Spring Boot** | 2.5.7 |
| **ORM** | MyBatis-Plus 3.5.1 |
| **資料庫** | MySQL（`joyshot_db`） |
| **伺服器 Port** | 7272 |
| **正式環境** | `admin.joyshot.app`（後台）、`joyshot.app`（前台） |

---

## 二、技術棧

| 項目 | 技術 / 版本 |
|------|------------|
| Java | 1.8 |
| Spring Boot | 2.5.7 |
| ORM | MyBatis-Plus 3.5.1 + MyBatis Spring Boot Starter 2.2.2 |
| 資料庫 | MySQL（`joyshot_db`） |
| SQL 監控 | P6Spy 3.9.1（test profile） |
| 認證 | JWT（com.auth0:java-jwt 3.10.3），HMAC256 |
| API 文件 | Springfox Swagger2 2.9.2 |
| 工具庫 | Hutool 5.7.20、Apache POI 4.1.2、Commons Codec 1.15 |
| 範本引擎 | Thymeleaf |
| 郵件 | spring-boot-starter-mail（SMTP） |
| 外部整合 | ECPay 綠界支付、LINE Notify、Google Drive API、Google Maps API、Twilio SMS、三竹 SMS |
| Log | Logback + Log4j-core 2.17.1 |
| 監控 | Spring Boot Actuator |

---

## 三、專案目錄結構

```
joyshot-api/
├── pom.xml
├── HELP.md
├── credentials/
│   └── StoredCredential              # Google OAuth 憑證
├── doc/
│   ├── alter-20240414.sql            # 多語系欄位新增
│   ├── alter-20240501.sql            # 移除攝影師多語系欄位
│   └── alter-20240516.sql            # 訂單服務類別多語系
└── src/main/
    ├── java/
    │   ├── com/joyshot/app/
    │   │   ├── JoyShotApplication.java       # 主啟動類別
    │   │   ├── LineMain.java                 # LINE 測試
    │   │   ├── common/                       # 通用類別（Result, Status, AppConstant）
    │   │   ├── config/                       # 設定類別
    │   │   ├── controller/                   # 27 個 Controller + dto/
    │   │   ├── entity/                        # 約 40 個 Entity/DTO
    │   │   ├── exception/                    # 例外處理
    │   │   ├── interceptor/                  # JWT 攔截器
    │   │   ├── mapper/                       # 35 個 Mapper 介面
    │   │   ├── service/                      # 35 個 Service + impl/
    │   │   └── util/                         # 工具類別
    │   └── ecpay/payment/integration/        # 綠界支付整合 SDK
    └── resources/
        ├── application.yml                   # 主設定
        ├── application-dev.yml               # 開發環境
        ├── application-prod.yml              # 正式環境
        ├── application-test.yml              # 測試環境
        ├── logback-spring.xml                # 日誌設定
        ├── keys/                             # Google API 金鑰
        ├── mapper/                          # 35 個 MyBatis XML
        └── templates/                        # Thymeleaf 範本
```

---

## 四、主啟動類別

```java
@SpringBootApplication
@EnableScheduling
@EnableAsync
public class JoyShotApplication {
    public static void main(String[] args) {
        SpringApplication.run(JoyShotApplication.class, args);
    }
}
```

- `@EnableScheduling`：啟用排程任務（CronTaskManager）
- `@EnableAsync`：啟用非同步（MailUtil、SmsUtil、LineService）

---

## 五、安全認證機制

### 5.1 JWT 攔截器（MyJwtInterceptor）

**認證流程**：
1. 從 Header 取 `apptoken`（前端 App 用）或 `token`（後台用）
2. 若 `apptoken` 不為空 → 直接放行（前端 App 專用）
3. 否則驗證 `token`：
   - 用 `JWT.decode(token).getAudience().get(0)` 取出 `empno`（工號）
   - 查詢資料庫 `User` by `empno`
   - 用資料庫中的 `password` 作為 HMAC256 密鑰驗證 JWT 簽名
   - 驗證失敗拋出 `ServiceException`

### 5.2 Token 生成（TokenUtil）

```java
JWT.create()
   .withAudience(empno)
   .withExpiresAt(DateUtil.offsetHour(new Date(), 8))  // 8 小時過期
   .sign(Algorithm.HMAC256(pwd));
```

### 5.3 密碼加密（MD5Util）

- `MD5(SALT1 + originalPassword + SALT2)`
- `SALT1 = "joyShot"`, `SALT2 = "2023"`

### 5.4 攔截器排除路徑

不需 JWT 的路徑：
- `/api/user/login`
- `/api/file/**`
- `/api/client/**`
- `/api/order/paid`（綠界回呼）
- `/api/googledrive/signin`, `/api/googledrive/oauth`
- `/api/line/**`
- `/api/**/export`, `/api/**/imp`
- `/swagger-resources/**`

---

## 六、通用類別

### 6.1 統一回傳格式（Result）

```json
{
    "code": "200" | "500" | "error" | "401" | "field_validation_error",
    "message": "ok" | 錯誤訊息,
    "data": Object
}
```

### 6.2 例外處理

| 類別 | 說明 |
|------|------|
| `GlobalExceptionHandler` | `@ControllerAdvice`，捕捉所有 `Exception` |
| `ServiceExceptionHandler` | 捕捉 `ServiceException`，回傳 `Result.error(code, message)` |
| `ServiceException` | 自訂例外，含 `code` 和 `message` |

---

## 七、API 端點設計

### 7.1 UserController (`/api/user`)

| 方法 | 路徑 | 說明 |
|------|------|------|
| GET | `/api/user` | 取得所有使用者 |
| GET | `/api/user/page` | 分頁查詢使用者 |
| POST | `/api/user` | 新增/更新使用者（密碼 MD5 加密） |
| DELETE | `/api/user/{id}` | 刪除使用者 |
| GET | `/api/user/export` | 匯出 Excel |
| POST | `/api/user/imp` | 批次匯入 Excel |
| POST | `/api/user/login` | 登入（empno + password），回傳含 token |
| POST | `/api/user/info` | 依 token 查詢使用者 |
| GET | `/api/user/log` | 取得操作紀錄（5 筆） |
| GET | `/api/user/logout` | 登出 |
| GET | `/api/user/shortcut` | 取得角色快捷選單 |
| GET | `/api/user/groupby` | 依區域群組統計 |
| POST | `/api/user/change-password` | 變更密碼 |
| GET | `/api/user/account/exists` | 檢查帳號是否已存在 |

### 7.2 OrderController (`/api/order`)

| 方法 | 路徑 | 說明 |
|------|------|------|
| POST | `/api/order` | 建立訂單（前台下訂） |
| POST | `/api/order/update` | 更新訂單 |
| POST | `/api/order/cancel` | 攝影師取消訂單 |
| GET | `/api/order/history` | 取得訂單歷史紀錄 |
| POST | `/api/order/manual-order` | 後台手動建立訂單 |
| GET | `/api/order/all` | 所有訂單分頁 |
| GET | `/api/order/has-coupon` | 有折扣碼的訂單 |
| GET | `/api/order/myorder` | 攝影師自己的訂單 |
| GET | `/api/order/status/uploaded` | 照片已上傳的訂單 |
| GET | `/api/order/status/processing` | 未付款訂單 |
| GET | `/api/order/status/pay_success` | 付款成功訂單 |
| GET | `/api/order/status/close` | 已結案訂單 |
| GET | `/api/order/ecpayCheckout` | 取得綠界付款表單 HTML |
| POST | `/api/order/paid` | 綠界付款回呼（Server-side） |
| GET | `/api/order/paypal-paid` | PayPal 付款成功 |
| POST | `/api/order/photo/uploaded/{orderId}` | 攝影師照片上傳完成 |
| POST | `/api/order/pay/transferred/{orderId}` | 匯款通知（已匯款給攝影師） |
| GET | `/api/order/photo/confirm-uploaded/{orderId}` | 通知客戶看照片 |
| GET | `/api/order/payment/remind/{orderId}` | 付款提醒 |
| POST | `/api/order/contact/customer/{orderId}` | 回報已聯繫客戶 |
| GET | `/api/order/create/folder/{orderId}` | 建立 Google Drive 共用資料夾 |
| GET | `/api/order/statistic/*` | 客戶數/訂單數/金額統計 |

### 7.3 PhotographerController (`/api/photographer`)

| 方法 | 路徑 | 說明 |
|------|------|------|
| GET | `/api/photographer/{pid}` | 取得攝影師基本資料 |
| GET | `/api/photographer/all` | 攝影師分頁 |
| GET | `/api/photographer/groupby` | 依縣市群組統計 |
| GET | `/api/photographer/feature/{pid}` | 攝影師特色 |
| GET/POST | `/api/photographer/service/area/{pid}` | 服務區域 |
| GET/POST | `/api/photographer/schedule` | 接案時段 |
| DELETE | `/api/photographer/schedule/{sid}` | 刪除時段 |
| GET | `/api/photographer/ratings` | 最新評價 |
| GET | `/api/photographer/rating/{pid}` | 攝影師評價 |
| POST | `/api/photographer` | 建立/更新攝影師（含 UUID） |
| DELETE | `/api/photographer/{id}` | 刪除攝影師 |
| POST | `/api/photographer/feature` | 新增/更新特色 |
| POST | `/api/photographer/rating` | 新增/更新評價 |
| GET | `/api/photographer/works/{pid}` | 攝影師作品 |
| GET | `/api/photographer/info/{uuid}` | 前台用-基本資料 |
| GET | `/api/photographer/info/works/{uuid}` | 前台用-作品 |
| GET/POST | `/api/photographer/bank` | 銀行帳號 |
| POST | `/api/photographer/live` | 設定上架狀態 |
| GET | `/api/photographer/area/schedule` | 依縣市取得時程 |
| GET | `/api/photographer/date` | 特定日期有時程的攝影師 |

### 7.4 其他 Controller

| Controller | 路徑前綴 | 主要功能 |
|-----------|---------|---------|
| ECPayController | `/api/ecpay` | 綠界支付設定 |
| LineController | `/api/line` | LINE OAuth 回呼、Notify 發送 |
| LineGroupNotifyController | `/api/group-notify` | 群發 LINE 訊息 |
| GdriveController | `/api/googledrive` | Google Drive 登入/OAuth |
| FileController | `/api/file` | 檔案上傳/下載/顯示 |
| AreaController | `/api/area` | 行政區域 CRUD（樹狀） |
| MenuController | `/api/menu` | 選單 CRUD |
| RoleController | `/api/role` | 角色 CRUD + 選單權限 |
| DictionaryController | `/api/dic` | 字典 CRUD |
| ServiceCatController | `/api/service-cat` | 服務類型 CRUD |
| ServiceCategoryController | `/api/service-category` | 服務分類（含多語系） |
| BannerController | `/api/banner` | Banner 管理 |
| NewsController | `/api/news` | 消息管理 |
| FaqController | `/api/faq` | FAQ 管理 |
| CouponController | `/api/coupon` | 折扣碼 CRUD + 套用 |
| AttractionPostController | `/api/attraction` | 景點文章 |
| InstagramController | `/api/instagram` | IG 貼文管理 |
| SmsController | `/api/sms-notify` | 發送簡訊 |
| SearchingController | `/api/search` | 搜尋攝影師（含交通費計算） |
| NotifyMessageController | `/api/notify` | 通知訊息 |
| AffiliateController | `/api/affiliate` | 推廣員管理 |
| AppFlowController | `/api/appflow` | 通知流程設定 |
| AreaZipcodeController | `/api/area-zipcode` | 郵遞區號查詢 |

---

## 八、資料模型設計

### 8.1 User（使用者）

| 欄位 | 類型 | 說明 |
|------|------|------|
| id | Integer (AUTO) | ID |
| empno | String | 工號（登入帳號） |
| password | String | 密碼（MD5 加密） |
| username | String | 姓名 |
| phone | String | 電話 |
| avatar | String | 大頭照 |
| token | String | JWT Token |
| area | String | 所在區域 |
| roleId | Integer | 角色 ID |
| lineAuthCode | String | LINE 授權碼 |
| lineToken | String | LINE Token |
| phId | Integer | 攝影師 ID |
| affId | Integer | 推廣員 ID |
| deletePermission | Integer | 刪除權限 |

### 8.2 Order（訂單）

| 欄位 | 類型 | 說明 |
|------|------|------|
| id | Integer (AUTO) | ID |
| orderNo | String | 訂單編號（yyyyMMddHHmmssSS） |
| phUuid | String | 攝影師 UUID |
| custId | Integer | 客戶 ID |
| serviceCat | String | 服務類型 |
| serviceCatEn/Jp/Kr | String | 服務類型（英/日/韓） |
| serviceFee | Integer | 拍攝費 |
| unitPrice | Integer | 每小時單價 |
| transportationFee | Integer | 總交通費 |
| transportationFeeOnCustomer | Integer | 客戶應負擔交通費 |
| couponCode | String | 折扣碼 |
| couponDiscount | Integer | 折扣金額 |
| totalFee | Integer | 總費用 |
| customerName | String | 客戶姓名 |
| customerPhone | String | 客戶電話 |
| shootingDate | String | 拍攝日期 |
| shootingTime | String | 拍攝時間 |
| shootingDuration | Double | 拍攝時數 |
| shootingLocation | String | 拍攝地點 |
| adultNum | Integer | 大人人數 |
| childNum | Integer | 小孩人數 |
| photographerProfit | Integer | 支付攝影師費 |
| email | String | Email |
| status | String | 訂單狀態 |
| paymentMethod | String | 刷卡方式 |
| driverLink | String | Google Drive 連結 |
| manualOrder | String | 手動訂單 |
| picNum | Integer | 照片張數 |

**訂單狀態流程**：
```
processing（尚未付款）
  → pay_success（完成付款）
  → contact（已聯繫）
  → uploaded（照片已上傳）
  → confirm-uploaded（已通知客戶看照片）
  → transferred（已匯款給攝影師）
  → close（結案）
  → pay_failed（付款失敗）
  → cancel / auto_cancel（取消）
```

### 8.3 Photographer（攝影師）

| 欄位 | 類型 | 說明 |
|------|------|------|
| id | Integer (AUTO) | ID |
| phUuid | String | 攝影師 UUID |
| name | String | 姓名 |
| nickName | String | 藝名 |
| nickNameEn/Jp/Kr | String | 藝名（英/日/韓） |
| phone | String | 聯絡電話 |
| email | String | Email |
| city | String | 縣市 |
| districtName | String | 鄉鎮區 |
| address | String | 住家地址 |
| addrLng/addrLat | Double | 住家經緯度 |
| avatar | String | 大頭照 |
| bannerImg | String | 代表圖 |
| intro | String | 介紹 |
| introEn/Jp/Kr | String | 介紹（英/日/韓） |
| rating | Double | 顆星評價 |
| goLive | String | 上架狀態（Y/N） |
| serviceItem | String | 服務項目（逗號分隔 ID） |

### 8.4 其他 Entity 摘要

| Entity | 表名 | 主要欄位 |
|--------|------|---------|
| PhotographerFeature | photographer_feature | phId, language, featureTitle, featureContent, enable, sort |
| PhotographerRating | photographer_rating | phId, comments, author, stars |
| PhotographerWorks | photographer_works | phId, fileUuid |
| PhotographerSchedule | photographer_schedule | phId, scheduleDate, slotStart/End, minValue, maxValue, active |
| PhotographerArea | photographer_area | phId, areaParentId, areaId, zipCode |
| PhotographerBank | photographer_bank | phId, bankCode, bank, bankBranch, name, account |
| Area | area | name, nameEn/Jp/Kr, parentId, imageUuid, minHour, zipCode |
| Menu | menu | name, path, icon, description, daily, parentId |
| Role | role | name, engName, description |
| Dict | dict | name, value, valueEn/Jp/Kr, type, notes |
| ServiceCat | service_cat | name, nameEn/Jp/Kr, fileUuid, iconFileUuid, price |
| Banner | banner | language, imageUuid, imageUsage, active |
| News | news | language, topic, status |
| Faq | faq | language, question, answer |
| Coupon | coupon | couponName, couponCode, discount, dateStart/End, usageCount, usagePrice, usageService, couponOwner |
| Affiliate | affiliate | uuid, name, nickName, phone, email, bankCode/Name/Branch/AccountName/AccountNo |
| AttractionPost | attraction_post | language, area, name, imageUuid, postUrl |
| InstagramPost | instagram_post | igImageUuid, igUrl, title |
| FileRepo | file_repo | name, type, size, url, uuid, fileUsage |
| OrderHistory | js_order_history | orderNo, orderAction, actionDetail, execBy |
| NotifyMessage | notify_message | messageOwner, message, messageUrl, isRead |
| ActionLog | action_log | userId, action, ip, browser |
| AppFlow | app_flow | flowType, flowName, flowCat, seq |

---

## 九、業務邏輯分析

### 9.1 訂單生命週期

1. **建立訂單**：產生訂單編號 → 儲存 → LINE 通知流程人員 → 更新攝影師時段為不可選
2. **付款成功**：驗證綠界 CheckMacValue → 更新狀態 `pay_success` → 更新折扣碼使用次數 → LINE/Email/SMS 通知 → 建立 Google Drive 資料夾
3. **照片上傳完成**：更新狀態 `uploaded` → LINE 通知客服
4. **通知客戶看照片**：更新狀態 `confirm-uploaded` → Email 通知客戶（含下載連結 + 評價表單）→ SMS 通知
5. **匯款給攝影師**：更新狀態 `close`
6. **取消訂單**：更新狀態 `auto_cancel` → 釋放攝影師時段

### 9.2 攝影師搜尋（含交通費計算）

1. 從字典檔取得設定：每公里補貼、客戶負擔比、每小時單價
2. 依條件查詢符合的攝影師（服務項目、時段、區域、上架狀態）
3. 使用 Google Maps Directions API 計算攝影師住家到拍攝地的距離
4. 10 公里以上每公里補貼（來回），最高 650 元
5. 客戶實際負擔 = 總交通費 × 客戶負擔比

### 9.3 折扣碼驗證

驗證條件：
1. 是否在有效期間（dateStart ~ dateEnd）
2. 使用次數是否已滿（usageCountCurrent < usageCount）
3. 訂單金額是否滿足低消（order.total >= usagePrice）
4. 拍攝類型是否符合（usageService 包含 order.serviceCat）

### 9.4 排程任務（CronTaskManager）

| 排程 | Cron | 說明 |
|------|------|------|
| execTask01 | `0 1 0/1 * * *` | 每小時 01 分：拍攝前 24H 提醒攝影師 |
| execTask02 | `0 5 0/1 * * *` | 每小時 05 分：拍攝後 12H 提醒上傳照片 |
| execTask03 | `0 10 0/1 * * *` | 每小時 10 分：預訂後 3H 未付款提醒 |
| execTask05 | `0 10 9-21 * * *` | 09~21 每小時 10 分：提醒尚未聯繫客戶 |
| execTask06 | `0 0 10 4,14,24 * *` | 每月 4/14/24 號 10:00：關帳通知 |
| execTask07 | `0 20 0/1 * * *` | 每小時 20 分：超過 24H 未付款自動取消 |
| execTask08 | `0 0 12 1 * *` | 每月 1 日 12:00：通知攝影師更新行事曆 |
| execTask10 | `0 50 0/1 * * *` | 每小時 50 分：拍攝後 18H 未上傳通知 |
| execTask11 | `0 0 13 1,15 * *` | 每月 1/15 日 13:00：通知攝影師近兩週行事曆 |

### 9.5 LINE Notify 流程

- `triggerFlowLineNotify(flowType, subject, content)`：
  - 依 `flowType`（如 `order_created`, `order_paid`, `pay_failed`, `photo_uploaded`）查詢 `app_flow` 表
  - 取得對應通知人員（`v_flow_user`）
  - 發送 LINE Notify

---

## 十、外部整合

### 10.1 ECPay 綠界支付

- 完整 SDK 在 `ecpay.payment.integration` 套件
- `AllInOne` 類別：AIOCheckOutALL（全功能付款）、ATM、CVS、BARCODE 等
- 設定檔：`/var/www/conf/payment_conf.xml`（含 HashKey/HashIV/MerchantID）
- 流程：`ecpayCheckout(orderId)` → 產生付款表單 → 使用者付款 → 綠界回呼 `/api/order/paid` → 驗證 CheckMacValue → `handlePaymentSuccess`

### 10.2 LINE Notify

- OAuth 流程：`/api/line/callback` → 取得 access_token → 儲存到 `user.lineToken`
- 發送：curl 呼叫 `https://notify-api.line.me/api/notify`
- 群發：依 targetUser（photographer/manager）群發

### 10.3 Google Drive

- `GdriverUtil`：OAuth 2.0 授權 + Drive API
- 功能：建立共用資料夾（anyone/writer 權限）、備份資料夾、批次複製檔案
- 設定：`google.parent.folderId`、`google.secret.key.path`（`classpath:keys/secret_*.json`）

### 10.4 Google Maps

- `MapUtil.getDistinceBetween(origin, destination, lang)`
- 使用 `DirectionsApi` 計算駕車距離
- API Key：`AIzaSyD9kBPooRXLLadDGapObylIZgcWay3Pdus`

### 10.5 簡訊（SMS）

- **dev 環境**：Twilio
- **prod 環境**：三竹 SMS（`smsapi.mitake.com.tw`）

### 10.6 郵件

- `MailUtil`：使用 `JavaMailSender`，HTML 格式
- dev-mode：`Y` 時所有郵件改寄到 BCC 地址
- SMTP：`mail.joyshot.app:587`（prod）

---

## 十一、資料庫設定

### 連線設定

| 環境 | URL | 帳號 |
|------|-----|------|
| dev | `jdbc:mysql://192.168.0.182:3306/joyshot_db` | joyshot |
| prod | `jdbc:mysql://localhost:3306/joyshot_db` | root |
| test | `jdbc:p6spy:mysql://localhost:33066/joyshot_db` | root |

### MyBatis-Plus 設定

- 分頁插件：`PaginationInnerInterceptor(DbType.MYSQL)`
- 自動填充：`AppMetaObjectHandler`（insertFill: createdAt + modifiedAt, updateFill: modifiedAt）
- Log：`StdOutImpl`（SQL 輸出到 console）

### Migration（doc/ 目錄）

| 檔案 | 說明 |
|------|------|
| `alter-20240414.sql` | 新增多語系欄位（service_cat, faq, news, attraction_post, photographer_feature, banner, photographer, dict, area） |
| `alter-20240501.sql` | 移除 photographer 的 name_en/jp/kr |
| `alter-20240516.sql` | js_order 新增 service_cat_en/jp/kr |

---

## 十二、環境設定

### 各環境差異

| 設定 | dev | prod | test |
|------|-----|------|------|
| LINE callback | localhost:9555 | joyshot.app | staging |
| Google callback | localhost:9555 | admin.joyshot.app | staging |
| ECPay return-url | ngrok URL | joyshot.app | staging |
| email dev-mode | Y | N | Y |
| upload-location | /home/jrealm/joyshot-uploads/ | /var/www/joyshot-uploads/ | - |
| js-front | localhost:9666 | joyshot.app | staging |
| js-photographer | localhost:9777 | jsmaster.joyshot.app | staging |

### Logback 設定

- 日誌路徑：`/home/jrealm/joyshot-api/logs/`
- 三個 RollingFileAppender：INFO（500MB）、WARN（100MB）、ERROR（50MB）
- 保留 15 天

---

## 十三、設定類別（@Configuration）

| 類別 | 說明 |
|------|------|
| `InterceptorConfig` | 註冊 `MyJwtInterceptor`，攔截 `/**`，排除登入/檔案/回呼等路徑 |
| `CorsConfig` | 允許所有來源 `*`、所有方法、所有 Header，`allowCredentials(true)`，`maxAge(3600)` |
| `MybatisPlusConfig` | `@MapperScan`，配置分頁插件 |
| `SwaggerConfig` | `@EnableSwagger2`（⚠️ 套件名稱錯誤，掃描 `com.lhdecor.crm.controller`） |
| `AwsS3Config` | S3Client Bean（已註解，未啟用） |

---

## 十四、已知問題與觀察

1. **Swagger 套件名稱錯誤**：`SwaggerConfig` 掃描 `com.lhdecor.crm.controller`，但實際套件是 `com.joyshot.app.controller`，Swagger UI 無法顯示 API
2. **MyBatis-Plus 表前綴不一致**：設定 `table-prefix: lh_`，但實際表名為 `js_order`, `photographer`, `user` 等（Entity 使用 `@TableName` 明確指定）
3. **CronTask04 與 CronTask03 衝突**：兩者都是 `0 10 0/1 * * *`
4. **AppConstant 殘留舊專案程式碼**：包含「業務司機」「建材業務」「彩繪人員」等與攝影平台無關的角色常數
5. **敏感資訊外洩**：`application.yml` 含明文密碼且已提交 Git
6. **PayPalDTO 為空類別**：`PayPalDTO.java` 無任何欄位
7. **logback-spring.xml** 僅配置 dev profile，prod/test 無 file appender
8. **AWS S3 已註解**：pom.xml 引入 S3 依賴但 `AwsS3Config` 的 Bean 已被註解

---

## 十五、開發指令速查

```bash
# 建置
mvn clean package

# 開發模式啟動
mvn spring-boot:run -Dspring-boot.run.profiles=dev

# 正式環境啟動
java -jar target/joyshot-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod

# 測試環境
mvn spring-boot:run -Dspring-boot.run.profiles=test
```

---

*文件生成日期：2026-06-23*