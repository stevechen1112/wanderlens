# wanderlens-media 目錄結構

> **文件狀態**：目錄樹為概略；以實際 repo 為準。現況見 [README.md](./README.md)。最後對照：**2026-06-27**。

```
wanderlens-media/
├── README.md
├── DEVELOPMENT_PLAN.md
├── TASK_PLAN.md
├── ARCHITECTURE.md
├── DIRECTORY.md                  ← 本文件
├── requirements.txt              # Python 依賴
├── pyproject.toml                # 專案配置
├── .env.example
├── docker/
│   └── Dockerfile
└── app/
    ├── main.py                   # FastAPI 入口
    ├── api/                      # API 路由
    │   ├── upload.py             # 上傳端點（分段/斷點續傳）
    │   ├── raw.py                # RAW 下載（精修用）
    │   ├── health.py             # 健康檢查
    │   └── internal.py           # 內部介面（驗收/AI 狀態回報給 api）
    ├── core/                     # 核心配置
    │   ├── config.py             # 環境變數配置
    │   ├── security.py           # 上傳 token 驗證
    │   └── celery_app.py         # Celery 實例
    ├── services/                 # 業務邏輯
    │   ├── storage_service.py    # 物件儲存（S3/GCS）
    │   ├── upload_service.py     # 分段上傳邏輯
    │   ├── verify_service.py     # 批次驗收
    │   ├── ai_color_service.py   # AI 調光調色
    │   ├── preview_service.py    # 預覽圖/縮圖產生
    │   ├── sla_service.py        # 48h SLA 監控
    │   └── api_client.py         # 與 wanderlens-api 通訊
    ├── tasks/                    # Celery 非同步任務
    │   ├── ai_tasks.py           # AI 調色任務
    │   ├── verify_tasks.py       # 驗收任務
    │   └── sla_tasks.py          # SLA 監控任務
    ├── models/                   # 資料模型（Pydantic）
    │   ├── upload.py
    │   ├── media_asset.py
    │   └── sla.py
    └── utils/
        ├── image_utils.py        # 影像處理工具
        ├── raw_utils.py          # RAW 格式處理（rawpy）
        └── format_utils.py       # 檔案格式驗證
tests/
    ├── test_upload.py
    ├── test_verify.py
    └── test_ai_color.py
```