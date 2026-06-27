# wanderlens-provider 開發計畫

> **文件狀態**：階段規劃仍有效；完成度以 [README.md](./README.md) 與 [WanderLens_09](../WanderLens_09_待補強與缺口清單.md) 為準。最後對照：**2026-06-27**。

---

## 1. 階段總覽

| 階段 | 核心目標 |
|------|---------|
| Phase 1 | 攝影師端基本功能 + RAW 上傳 + 拍攝節點 + 站內溝通 |
| Phase 2 | 造型師端 + 多配置支援 + 精修選片 |
| Phase 3 | 作品集公開授權 + 攝影師作品頁 |
| Phase 4 | 收益分析 + 場景數據 |
| Phase 5 | 跨境供給 + 多語 |

---

## 2. Phase 1：攝影師端基本功能

### 2.1 目標

讓攝影師能管理基本資料、設定檔期、接收訂單、履約拍攝、上傳 RAW、透過站內溝通聯繫消費者。

### 2.2 開發範圍

| 模組 | 內容 | JS 參考 |
|------|------|---------|
| 登入 | 帳號密碼登入（手機號碼 = 帳號） | joyshot-photographer Login.vue ⭐⭐⭐ |
| 基本資料 | 暱稱/介紹/大頭照/封面/地址經緯度/多語系 | joyshot-photographer basic_info.vue ⭐⭐⭐ |
| 接案時段 | 月曆式 UI（08:00~22:00） | joyshot-photographer schedule.vue ⭐⭐⭐ |
| 服務地區 | el-tree checkbox | joyshot-photographer service_area.vue ⭐⭐⭐ |
| 匯款資料 | 銀行帳號 | joyshot-photographer bank_info.vue ⭐⭐⭐ |
| 特色資料 | 多語系特色 | joyshot-photographer basic_info_features.vue ⭐⭐⭐ |
| 作品集 | 拖拽上傳，最多 50 張 | joyshot-photographer photo_works.vue ⭐⭐⭐ |
| 評價查看 | 客戶評價列表 | joyshot-photographer rating.vue ⭐⭐⭐ |
| 我的訂單 | 訂單列表、通報已聯繫 | joyshot-photographer my_order.vue ⭐⭐⭐ |
| 拍攝節點 | 起拍/加時/結束按鈕（時間戳記） | 無（新增） |
| RAW 上傳 | 分段上傳 + 斷點續傳 + JPEG 快路徑 | 無（新增，核心基礎設施） |
| 站內溝通室 | 訂單溝通室（文字/圖片） | 無（新增） |
| 收益查看 | 拍攝酬勞、撥款狀態 | joyshot-photographer my_order.vue ⭐⭐ |
| LINE Notify 綁定 | OAuth 綁定 | joyshot-photographer ⭐⭐⭐ |
| 個人訊息 | 頭像、密碼變更 | joyshot-photographer profile.vue ⭐⭐⭐ |

### 2.3 超越 JS 的部分

| 項目 | JS | WanderLens |
|------|-----|------------|
| RAW 上傳 | Google Drive 手動 | 平台雲端分段上傳 + 斷點續傳 |
| 拍攝節點 | 無 | 起拍/加時/結束按鈕（時間戳記） |
| 溝通 | LINE/WhatsApp | 站內溝通室 |
| 造型師 | 無 | 階段二支援造型師端 |
| 加時 | 無 | 站內發起加時申請 |

### 2.4 成功判準

| 指標 | 意義 |
|------|------|
| 攝影師可完成所有自助設定 | 供給管理可用 |
| RAW 上傳穩定 | 核心基礎設施成立 |
| 拍攝節點正確記錄 | 履約可控 |
| 站內溝通可用 | 聯繫消費者不依賴第三方 |

---

## 3. Phase 2：造型師端 + 多配置

| 模組 | 內容 |
|------|------|
| 造型師端 | 造型師基本資料、檔期、服務地區、作品集 |
| 造型師時序 | 前置妝髮緩衝顯示 |
| 雙攝影師訂單 | 雙機訂單顯示與角色 |
| 精修選片 | 消費者選片後攝影師可查看（不處理） |

## 4. Phase 3：作品集公開

| 模組 | 內容 |
|------|------|
| 作品集授權 | 申請將消費者照片加入作品集 |
| 攝影師作品頁 | 連結至前台作品頁 |

## 5. Phase 5：跨境

| 模組 | 內容 |
|------|------|
| 多語介面 | 英/日/韓 |
| 海外供給 | 依市場開通 |

---

*文件建立日期：2026-06-23*