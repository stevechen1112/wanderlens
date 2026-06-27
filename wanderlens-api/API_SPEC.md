# wanderlens-api API 規格

> 本文件定義 wanderlens-api 的 REST API 端點。所有前端專案依此規格開發。

---

## 1. 通用規範

### 1.1 Base URL

```
dev:  http://localhost:8080/api
prod: https://api.wanderlens.app/api
```

### 1.2 認證

所有需認證的 API 需帶 header：

```
Authorization: Bearer {JWT token}
```

### 1.3 統一回傳格式

```json
{
  "code": "200",
  "message": "ok",
  "data": {}
}
```

| code | 說明 |
|------|------|
| 200 | 成功 |
| 400 | 請求格式錯誤 |
| 401 | 未認證 |
| 403 | 無權限 |
| 404 | 找不到資源（通用；業務端點優先使用下方語意碼） |
| 409 | 資源衝突（`conflict`） |
| 500 | 伺服器內部錯誤 |
| field_validation_error | 欄位驗證失敗 |

**業務語意錯誤碼**（`ResultCode.java`，HTTP 狀態仍依 `@ResponseStatus` 或全域處理；`code` 欄為下列字串）：

| code | 說明 |
|------|------|
| order_not_found | 訂單不存在 |
| order_status_invalid | 訂單狀態不允許此操作 |
| provider_not_found | 供給方不存在 |
| provider_not_available | 該時段不可預約 |
| slot_not_found | 時段不存在 |
| slot_locked | 時段已被鎖定 |
| album_not_found | 相簿不存在 |
| conversation_not_found | 溝通室不存在 |
| conversation_readonly | 溝通室已轉為唯讀 |
| notification_not_found | 通知不存在 |
| user_not_found | 使用者不存在 |
| retouch_job_not_found | 精修工單不存在 |
| payment_failed | 付款失敗 |
| payment_callback_invalid | 付款回呼驗證失敗 |
| coupon_invalid | 折扣碼無效 |
| coupon_expired | 折扣碼已過期 |
| media_verify_failed | 媒體驗收失敗 |
| service_unauthorized | 服務驗證失敗 |
| token_invalid | Token 無效或已過期 |
| account_disabled | 帳號已停用 |

> Controller 不應再回傳硬編碼 `"404"` / `"403"` / `"400"`；找不到資源時回 `Result.error(ResultCode.XXX)`。E2E：`e2e/api-error-codes.spec.ts`。

### 1.4 多語系

帶 `Accept-Language` header：`zh` / `en` / `jp` / `ka`

---

## 2. 認證 API

| 方法 | 路徑 | 認證 | 說明 |
|------|------|------|------|
| POST | /auth/login | ❌ | 登入（empno + password → JWT） |
| POST | /auth/logout | ✅ | 登出 |
| POST | /auth/refresh | ✅ | 刷新 token |
| POST | /auth/change-password | ✅ | 變更密碼 |
| GET | /auth/me | ✅ | 取得當前使用者 |
| POST | /providers/apply | ❌ | 攝影師註冊申請 |

---

## 3. 攝影師/供給端 API

| 方法 | 路徑 | 認證 | 說明 |
|------|------|------|------|
| GET | /providers | ✅(ADMIN) | 供給方分頁列表 |
| GET | /providers/{id} | ✅ | 取得供給方資料 |
| POST | /providers | ✅(ADMIN) | 建立/更新供給方 |
| DELETE | /providers/{id} | ✅(ADMIN) | 刪除供給方 |
| POST | /providers/live | ✅(ADMIN) | 設定上架狀態 |
| GET | /providers/info/{uuid} | ❌ | 前台用-基本資料 |
| GET | /providers/info/{uuid}/works | ❌ | 前台用-作品集 |
| GET | /providers/{id}/schedule | ✅ | 取得行事曆 |
| POST | /providers/schedule | ✅ | 設定時段 |
| DELETE | /providers/schedule/{sid} | ✅ | 刪除時段 |
| GET/POST | /providers/service-area/{id} | ✅ | 服務地區 |
| GET/POST | /providers/bank | ✅ | 匯款資料 |
| GET/POST | /providers/feature | ✅ | 特色資料 |
| GET | /providers/works/{id} | ✅ | 作品集 |
| GET | /providers/rating/{id} | ✅ | 評價 |
| GET | /providers/ratings | ❌ | 最新評價（前台） |
| GET | /providers/groupby | ✅(ADMIN) | 依區域群組統計 |

---

## 4. 預約與媒合 API

| 方法 | 路徑 | 認證 | 說明 |
|------|------|------|------|
| GET | /service-types | ❌ | 拍攝類型列表 |
| GET | /service-types/{id}/suggested-config | ❌ | 類型建議配置 |
| GET | /configurations | ❌ | 配置列表 |
| POST | /search/providers | ❌ | 依條件搜尋可用供給方 |
| POST | /booking/lock | ✅ | 鎖定時段（選到即確定） |
| POST | /booking/unlock | ✅ | 解鎖時段（取消預約） |

---

## 5. 訂單 API

| 方法 | 路徑 | 認證 | 說明 |
|------|------|------|------|
| POST | /orders | ✅ | 建立訂單 |
| GET | /orders/{id} | ✅ | 訂單詳情 |
| GET | /orders/my | ✅ | 我的訂單（消費者） |
| GET | /orders/provider | ✅ | 攝影師訂單 |
| GET | /orders/all | ✅(ADMIN) | 所有訂單分頁 |
| GET | /orders/status/{status} | ✅(ADMIN) | 依狀態查詢 |
| POST | /orders/manual | ✅(ADMIN) | 後台手動建立 |
| POST | /orders/cancel | ✅ | 取消訂單 |
| POST | /orders/contact/{orderId} | ✅ | 攝影師回報已聯繫 |
| POST | /orders/shoot/start | ✅ | 起拍（時間戳記） |
| POST | /orders/shoot/end | ✅ | 結束（時間戳記） |
| POST | /orders/shoot/extra-time | ✅ | 加時申請 |
| POST | /orders/shoot/extra-time/confirm | ✅ | 消費者確認加時 + 付款 |
| POST | /orders/rematch/{orderId} | ✅ | 重新媒合 |
| GET | /orders/{id}/history | ✅ | 訂單歷程 |
| GET | /orders/statistic/* | ✅(ADMIN) | 統計 |

---

## 6. 金流 API

| 方法 | 路徑 | 認證 | 說明 |
|------|------|------|------|
| GET | /payment/ecpay/checkout/{orderId} | ✅ | 取得綠界付款表單 |
| POST | /payment/ecpay/callback | ❌ | 綠界付款回呼 |
| GET | /payment/check/{orderNo} | ✅ | 檢查付款狀態 |
| POST | /payment/refund | ✅(ADMIN) | 退款 |
| POST | /payment/payout/{orderId} | ✅(ADMIN) | 撥款 |
| GET | /ledger/entries/{orderId} | ✅(ADMIN) | 清算記錄 |

---

## 7. 站內溝通 API

| 方法 | 路徑 | 認證 | 說明 |
|------|------|------|------|
| GET | /conversations | ✅ | 我的溝通室列表 |
| GET | /conversations/{id} | ✅ | 溝通室詳情 |
| GET | /conversations/{id}/messages | ✅ | 訊息列表（分頁） |
| POST | /conversations/{id}/messages | ✅ | 發送訊息 |
| POST | /conversations/{id}/messages/image | ✅ | 發送圖片 |
| POST | /conversations/{id}/read | ✅ | 標記已讀 |
| GET | /conversations/order/{orderId} | ✅ | 取得訂單溝通室 |
| GET | /conversations/{id}/access-log | ✅(ADMIN) | 調閱日誌 |
| POST | /conversations/{id}/report | ✅ | 檢舉訊息 |

---

## 8. 相簿與內容 API

| 方法 | 路徑 | 認證 | 說明 |
|------|------|------|------|
| GET | /albums | ✅ | 我的相簿列表 |
| GET | /albums/{id} | ✅ | 相簿詳情 |
| GET | /albums/{id}/photos | ✅ | 相簿照片列表 |
| POST | /albums/{id}/download | ✅ | 下載照片 |
| POST | /albums/{id}/share | ✅ | 產生分享連結 |
| PUT | /albums/{id}/consent | ✅ | 設定授權 |
| POST | /albums/{id}/consent/revoke | ✅ | 撤回授權 |
| GET | /albums/public | ❌ | 公開相簿（前台） |
| GET | /albums/location/{location} | ❌ | 地點靈感頁 |

---

## 9. 媒體管線介面 API

| 方法 | 路徑 | 認證 | 說明 |
|------|------|------|------|
| POST | /media/upload-token | ✅ | 核發上傳憑證（給 provider） |
| POST | /media/verify | ✅(MEDIA) | 回報驗收結果（media→api） |
| POST | /media/ai-status | ✅(MEDIA) | 回報 AI 狀態（media→api） |
| GET | /media/raw/{assetId} | ✅(MEDIA) | 取得 RAW（精修用） |
| GET | /media/status/{orderId} | ✅ | 媒體處理狀態（給 admin） |

---

## 10. 通知 API

| 方法 | 路徑 | 認證 | 說明 |
|------|------|------|------|
| GET | /notify/unread | ✅ | 未讀通知數 |
| GET | /notify/page | ✅ | 通知分頁 |
| POST | /notify/read/{id} | ✅ | 標記已讀 |
| POST | /line/callback | ❌ | LINE OAuth 回呼 |
| POST | /line/notify | ✅ | 發送 LINE Notify |
| POST | /sms/send | ✅(ADMIN) | 發送簡訊 |

---

## 11. 區域與內容管理 API

| 方法 | 路徑 | 認證 | 說明 |
|------|------|------|------|
| GET | /areas/tree | ❌ | 區域樹 |
| GET/POST/DELETE | /areas | ✅(ADMIN) | 區域 CRUD |
| GET | /banners/type/{type} | ❌ | Banner（前台） |
| GET/POST/DELETE | /banners | ✅(ADMIN) | Banner CRUD |
| GET | /news/on | ❌ | 公告（前台） |
| GET/POST/DELETE | /news | ✅(ADMIN) | 公告 CRUD |
| GET | /faqs | ❌ | FAQ（前台） |
| GET/POST/DELETE | /faqs | ✅(ADMIN) | FAQ CRUD |
| GET | /attractions | ❌ | 景點（前台） |
| GET/POST/DELETE | /attractions | ✅(ADMIN) | 景點 CRUD |
| GET/POST/DELETE | /instagram | ✅(ADMIN) | IG 貼文 CRUD |

---

## 12. 優惠券 API

| 方法 | 路徑 | 認證 | 說明 |
|------|------|------|------|
| POST | /coupons/apply | ✅ | 套用折扣碼 |
| GET/POST/DELETE | /coupons | ✅(ADMIN) | 折扣碼 CRUD |

---

## 13. 檔案上傳 API

| 方法 | 路徑 | 認證 | 說明 |
|------|------|------|------|
| POST | /files/upload/{usage} | ✅ | 通用檔案上傳 |
| GET | /files/{uuid} | ❌ | 檔案顯示 |

usage: `user_profile` / `provider_avatar` / `provider_banner` / `provider_works` / `conversation_image` / `banner` / `attraction`

---

## 14. Google 服務 API

| 方法 | 路徑 | 認證 | 說明 |
|------|------|------|------|
| GET | /places/search | ❌ | Google Places 地點搜尋（代理） |
| GET | /maps/directions | ✅ | 交通距離計算 |

---

*文件建立日期：2026-06-23*