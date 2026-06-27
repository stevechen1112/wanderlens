# wanderlens-api 技術架構

> **文件狀態**：架構說明仍有效；功能現況以 [README.md](./README.md) 與 [WanderLens_09](../WanderLens_09_待補強與缺口清單.md) 為準。最後對照程式碼：**2026-06-27**。

---

## 1. 分層架構

```
┌─────────────────────────────────────────────┐
│              Controller Layer               │
│   REST API 端點、請求驗證、回傳格式化         │
├─────────────────────────────────────────────┤
│              Service Layer                  │
│   業務邏輯、狀態機、媒合引擎、清算計算         │
├─────────────────────────────────────────────┤
│              Mapper Layer                   │
│   MyBatis-Plus Mapper、資料存取              │
├─────────────────────────────────────────────┤
│              Database Layer                 │
│   MySQL（業務資料）+ Redis（鎖定/快取）       │
└─────────────────────────────────────────────┘
```

## 2. 模組劃分

```
com.wanderlens.api
├── config/              ← Spring Security、CORS、MyBatis、Redis、OpenAPI
├── common/              ← Result、Status、AppConstant、例外處理
├── controller/          ← REST Controller（按領域分）
│   ├── auth/            ← 認證
│   ├── provider/        ← 攝影師/造型師/攝影棚
│   ├── booking/         ← 預約與媒合
│   ├── order/           ← 訂單與狀態機
│   ├── payment/         ← 金流
│   ├── conversation/    ← 站內溝通
│   ├── album/           ← 相簿與內容
│   ├── media/           ← 媒體管線介面
│   ├── notify/          ← 通知
│   ├── area/            ← 區域與內容管理
│   └── admin/           ← 營運管理
├── service/             ← Service 介面 + impl
├── mapper/              ← MyBatis-Plus Mapper
├── entity/              ← Entity + DTO
├── interceptor/         ← JWT 攔截器
├── scheduler/           ← 排程任務
└── util/                ← 工具類（JWT、密碼、地圖、簡訊、郵件）
```

## 3. 與其他子專案的關係

```
wanderlens-web ──────┐
wanderlens-app ──────┤
wanderlens-provider ─┼──→ REST API ──→ wanderlens-api
wanderlens-admin ────┤                        ↕
wanderlens-retouch ──┘                   wanderlens-media
                                    （RAW上傳/AI調色）
```

### 與 wanderlens-media 的介面

| 方向 | API | 說明 |
|------|-----|------|
| api → media | POST /internal/upload-token | 核發上傳憑證 |
| media → api | POST /internal/media/verify | 回報驗收結果 |
| media → api | POST /internal/media/ai-status | 回報 AI 處理狀態 |
| api → media | GET /internal/media/raw/{assetId} | 取得 RAW（精修用） |

## 4. 認證架構

```
前端登入 → api 產生 JWT（獨立密鑰）
前端帶 token header → JWT 攔截器驗證 → 放行

角色：
- CONSUMER（消費者）
- PHOTOGRAPHER（攝影師）
- STYLIST（造型師）
- STUDIO_MANAGER（攝影棚管理者）
- ADMIN（平台營運）
- SUPPORT（客服）
- FINANCE（財務）
- RETOUCH_COMPANY（外包修圖）
```

## 5. 訂單狀態機

```
Draft → PendingPayment → Paid → WaitingProviderContact → Confirmed → ReadyToShoot
  → ShootingStarted → ShootingEnded → UploadingRaw → AiProcessing → Delivered
  → RetouchRequested → Retouching → RetouchDelivered → Closed
  → Rematching / Rescheduled / Disputed / Refunded / Cancelled
```

## 6. Redis 用途

| 用途 | Key Pattern | 說明 |
|------|------------|------|
| 時段鎖定 | `lock:availability:{providerId}:{date}:{slot}` | 預約時鎖定，防止併發衝突 |
| 訂單暫存 | `order:pending:{orderId}` | 未付款訂單暫存 |
| API 快取 | `cache:area:tree` | 區域樹快取 |
| 排程鎖 | `lock:scheduler:{taskName}` | 防止排程重複執行 |

---

*文件建立日期：2026-06-23*