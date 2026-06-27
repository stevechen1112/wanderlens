# wanderlens-media

> WanderLens RAW/AI 媒體管線 — 獨立微服務，負責大檔案上傳、儲存、AI 調色、交付管線。

---

## 專案概覽

| 項目 | 內容 |
|------|------|
| **定位** | RAW 上傳、儲存、AI 調色、交付管線（獨立微服務） |
| **技術棧** | Python 3.12 + FastAPI + Celery + 物件儲存（S3/GCS）+ AI 調色服務 |
| **Port** | 3004（dev） |
| **JS 參考** | 無（JS 用 Google Drive，完全需重建） |
| **依賴** | wanderlens-api（驗收結果回報、AI 狀態回報） |
| **被依賴** | wanderlens-provider（RAW 上傳）、wanderlens-admin（狀態監控）、wanderlens-retouch（RAW 下載） |

## 啟動方式

```bash
# Python FastAPI
pip install -r requirements.txt
uvicorn main:app --reload --port 3004

# 或 Node.js
npm install
npm run dev   # → localhost:3004
```

## 現況快照（2026-06-27）

| 項目 | 內容 |
|------|------|
| **Docker** | `wanderlens-media` 容器 `:3004`，依賴 MinIO |
| **能力** | 分段上傳、RAW 驗收、AI 完成回報、預覽浮水印 |
| **E2E** | `e2e/fulfillment-flow.spec.ts`（需 api + media + seed） |
| **平台文件** | [Monorepo 總覽](../README.md) · [WanderLens_09](../WanderLens_09_待補強與缺口清單.md) · [WanderLens_06](../WanderLens_06_專案拆分總規劃.md) |

## 相關文件

- [DEVELOPMENT_PLAN.md](./DEVELOPMENT_PLAN.md)
- [TASK_PLAN.md](./TASK_PLAN.md)
- [ARCHITECTURE.md](./ARCHITECTURE.md)