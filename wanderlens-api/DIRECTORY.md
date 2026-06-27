# wanderlens-api 目錄結構

> **文件狀態**：目錄樹為概略；以實際 repo 為準。現況見 [README.md](./README.md)。最後對照：**2026-06-27**。

```
wanderlens-api/
├── README.md
├── DEVELOPMENT_PLAN.md
├── TASK_PLAN.md
├── ARCHITECTURE.md
├── API_SPEC.md
├── DATA_MODEL.md
├── DIRECTORY.md                  ← 本文件
├── pom.xml                       # Maven 配置
├── doc/
│   └── migration/                # SQL Migration 腳本
│       ├── V001__init_schema.sql
│       └── V002__seed_data.sql
└── src/
    ├── main/
    │   ├── java/com/wanderlens/api/
    │   │   ├── WanderLensApplication.java       # 主啟動類別
    │   │   ├── config/                          # Spring 配置
    │   │   │   ├── SecurityConfig.java
    │   │   │   ├── CorsConfig.java
    │   │   │   ├── MybatisPlusConfig.java
    │   │   │   ├── RedisConfig.java
    │   │   │   ├── OpenApiConfig.java
    │   │   │   └── AsyncConfig.java
    │   │   ├── common/                          # 通用類別
    │   │   │   ├── Result.java
    │   │   │   ├── ResultCode.java
    │   │   │   └── AppConstant.java
    │   │   ├── exception/                       # 例外處理
    │   │   │   ├── GlobalExceptionHandler.java
    │   │   │   ├── ServiceExceptionHandler.java
    │   │   │   └── ServiceException.java
    │   │   ├── interceptor/                     # 攔截器
    │   │   │   └── JwtInterceptor.java
    │   │   ├── controller/                      # REST Controller（按領域分）
    │   │   │   ├── auth/                        # 認證
    │   │   │   ├── provider/                    # 攝影師/造型師/攝影棚
    │   │   │   ├── booking/                     # 預約與媒合
    │   │   │   ├── order/                       # 訂單與狀態機
    │   │   │   ├── payment/                     # 金流
    │   │   │   ├── conversation/                # 站內溝通
    │   │   │   ├── album/                       # 相簿與內容
    │   │   │   ├── media/                       # 媒體管線介面
    │   │   │   ├── notify/                      # 通知
    │   │   │   ├── area/                        # 區域與內容管理
    │   │   │   └── admin/                       # 營運管理
    │   │   ├── service/                         # Service 介面
    │   │   │   └── impl/                        # Service 實作
    │   │   ├── mapper/                          # MyBatis-Plus Mapper
    │   │   ├── entity/                          # Entity + DTO + Enum
    │   │   │   ├── dto/                         # 請求/回應 DTO
    │   │   │   └── enum/                        # 列舉（角色、狀態、類型）
    │   │   ├── scheduler/                       # 排程任務
    │   │   │   └── CronTaskManager.java
    │   │   └── util/                            # 工具類
    │   │       ├── JwtUtil.java
    │   │       ├── PasswordUtil.java
    │   │       ├── MapUtil.java
    │   │       ├── SmsUtil.java
    │   │       ├── MailUtil.java
    │   │       └── LineNotifyUtil.java
    │   └── resources/
    │       ├── application.yml                  # 主設定
    │       ├── application-dev.yml              # 開發環境
    │       ├── application-prod.yml             # 正式環境
    │       ├── application-test.yml             # 測試環境
    │       ├── logback-spring.xml               # 日誌設定
    │       ├── mapper/                          # MyBatis XML
    │       ├── keys/                            # 外部服務金鑰
    │       └── templates/                       # Thymeleaf/Email 範本
    └── test/
        └── java/com/wanderlens/api/             # 測試
```