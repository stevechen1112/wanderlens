# wanderlens-app 技術架構

> **文件狀態**：架構說明仍有效；功能現況以 [README.md](./README.md) 與 [WanderLens_09](../WanderLens_09_待補強與缺口清單.md) 為準。最後對照程式碼：**2026-06-27**。

---

## 1. 技術選型

| 項目 | 選擇 | 理由 |
|------|------|------|
| 框架 | React Native + Expo | 團隊全 JS/TS 統一生態；RN 影像/相簿生態成熟；Expo 加速開發、OTA 更新 |
| 導航 | React Navigation | RN 生態最主流導航庫 |
| 狀態 | Zustand | 輕量、簡潔、RN 效能佳 |
| HTTP | Axios | 與其他前端專案一致 |
| 圖片 | expo-image / FastImage | 高效能圖片載入與快取 |
| 推播 | Expo Notifications | FCM/APNS 統一介面 |

## 2. 頁面結構

```
/login                ← 登入
/register             ← 註冊
/albums               ← 我的相簿列表
/albums/:id           ← 相簿詳情
/albums/:id/photo/:pid ← 照片全螢幕
/conversations        ← 溝通室列表
/conversations/:id    ← 溝通室
/booking              ← 預約流程
/profile              ← 個人資料
/notifications        ← 通知
```

## 3. 與其他子專案的關係

```
wanderlens-app ──→ REST API ──→ wanderlens-api
```

- 與 web 互補：web 獲客，app 留存
- 不直接接觸 media（透過 api 中介）

## 4. 推播架構

```
api 發送推播 → FCM（Android）/ APNS（iOS）→ App 接收
```

推播場景：
- 訂單狀態變更
- 攝影師已聯繫
- 照片已交付
- 精修完成
- 拍攝週年召回
- 寶寶月份召回

---

*文件建立日期：2026-06-23*