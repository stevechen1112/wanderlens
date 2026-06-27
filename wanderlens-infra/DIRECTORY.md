# wanderlens-infra 目錄結構

> **文件狀態**：目錄樹為概略；以實際 repo 為準。現況見 [README.md](./README.md)。最後對照：**2026-06-27**。

```
wanderlens-infra/
├── README.md
├── DEVELOPMENT_PLAN.md
├── TASK_PLAN.md
├── ARCHITECTURE.md
├── docker-compose.yml              # 開發環境一鍵啟動
├── docker-compose.prod.yml         # 正式環境（Phase 2）
├── Makefile                        # 一鍵操作指令
├── docker/
│   ├── mysql/
│   │   ├── init.sql                # 資料庫初始化
│   │   └── my.cnf                  # MySQL 配置
│   ├── nginx/
│   │   ├── nginx.conf              # 主配置
│   │   └── conf.d/
│   │       └── wanderlens.conf     # 反向代理路由
│   └── minio/
│       └── init.sh                 # Bucket 初始化
├── env/
│   ├── .env.dev.example            # 開發環境變數模板
│   ├── .env.prod.example           # 正式環境變數模板
│   └── .env.test.example           # 測試環境變數模板
├── scripts/
│   ├── setup.sh                    # 環境初始化腳本
│   ├── start.sh                    # 啟動所有服務
│   ├── stop.sh                     # 停止所有服務
│   └── db-init.sh                  # 資料庫初始化
└── .github/
    └── workflows/
        ├── ci-api.yml              # api CI pipeline
        ├── ci-web.yml              # web CI pipeline
        ├── ci-provider.yml         # provider CI pipeline
        ├── ci-admin.yml            # admin CI pipeline
        ├── ci-media.yml            # media CI pipeline
        └── ci-infra.yml            # infra CI pipeline
```