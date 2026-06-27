# wanderlens-media 技術架構

> **文件狀態**：架構說明仍有效；功能現況以 [README.md](./README.md) 與 [WanderLens_09](../WanderLens_09_待補強與缺口清單.md) 為準。最後對照程式碼：**2026-06-27**。

---

## 1. 技術選型

| 項目 | 選擇 | 理由 |
|------|------|------|
| 語言/框架 | Python 3.12 + FastAPI | AI/影像處理是 Python 絕對主場（Pillow/OpenCV/rawpy）；FastAPI 原生 async、自動 OpenAPI 文件 |
| 物件儲存 | AWS S3 或 Google Cloud Storage | 大檔案、高耐用、生命週期管理 |
| AI 調色 | Pillow + rawpy（基礎調色）+ 可擴展第三方 API | 階段一先用規則式調色，後續導入模型 |
| 任務佇列 | Celery + Redis | 批次處理、失敗重試、優先級管理 |
| 監控 | Prometheus + Grafana | SLA 監控 |

## 2. 管線架構

```
攝影師端（provider）
    │
    ├── JPEG 快路徑 ──→ media:接收JPEG ──→ AI調色 ──→ 預覽圖 ──→ 回報api ──→ 相簿上架
    │                                                        （快速交付）
    │
    └── RAW 上傳 ──→ media:分段上傳 ──→ 驗收 ──→ 儲存 ──→ 回報api
                                                    │
                                              （精修備用）
```

## 3. API 端點

| 方法 | 路徑 | 認證 | 說明 |
|------|------|------|------|
| POST | /upload/init | upload-token | 初始化分段上傳（回傳 uploadId） |
| POST | /upload/{uploadId}/part/{partNo} | upload-token | 上傳分段 |
| POST | /upload/{uploadId}/complete | upload-token | 完成上傳 |
| POST | /upload/{uploadId}/abort | upload-token | 取消上傳 |
| GET | /raw/{assetId} | api-token | 取得 RAW（精修用） |
| POST | /internal/verify | api-token | 回報驗收結果（media→api） |
| POST | /internal/ai-status | api-token | 回報 AI 狀態（media→api） |
| GET | /health | ❌ | 健康檢查 |

## 4. 與其他子專案的關係

```
wanderlens-provider ──→ 上傳端點 ──→ wanderlens-media
                                    ├──→ 回報 ──→ wanderlens-api
                                    └──→ RAW下載 ──→ wanderlens-retouch
wanderlens-admin ──→ 狀態查詢 ──→ wanderlens-api ──→ wanderlens-media
```

## 5. 獨立原因

1. **頻寬隔離**：大檔案上傳不影響核心 API
2. **運算隔離**：AI 調色是 CPU/GPU 密集，需獨立擴展
3. **儲存隔離**：物件儲存配置獨立於業務資料庫
4. **SLA 獨立監控**：48h 交付 SLA 是獨立運維關注點

---

*文件建立日期：2026-06-23*