# wanderlens-retouch 技術架構

> **文件狀態**：架構說明仍有效；功能現況以 [README.md](./README.md) 與 [WanderLens_09](../WanderLens_09_待補強與缺口清單.md) 為準。最後對照程式碼：**2026-06-27**。

---

## 1. 技術選型

| 項目 | 選擇 | 理由 |
|------|------|------|
| 框架 | Vue 3 + Vite | 輕量協作平台 |
| UI | Element Plus | 與 admin/provider 一致 |

## 2. 頁面結構

```
/login           ← 登入
/jobs            ← 工單列表（分頁）
/jobs/:id        ← 工單詳情（照片/規範/下載/上傳）
/specs           ← 修圖規範文件（Phase 2）
```

## 3. 與其他子專案的關係

```
wanderlens-retouch ──→ 工單 API ──→ wanderlens-api
                  └──→ RAW 下載 ──→ wanderlens-media
```

## 4. 安全設計

- 外包公司僅能取得「指定精修照片」的 RAW，不開放整份訂單
- 下載連結有期限控管
- 上傳成品需格式驗證（檔名/張數/格式）

---

*文件建立日期：2026-06-23*