"""WanderLens Media 核心配置"""

from pydantic_settings import BaseSettings
from typing import Optional


class Settings(BaseSettings):
    # 服務
    media_port: int = 3004

    # 物件儲存
    minio_endpoint: str = "http://localhost:9000"
    minio_access_key: str = "wanderlens"
    # 安全：secret 必須由環境變數提供，不提供預設值
    minio_secret_key: str
    s3_region: str = "ap-northeast-1"

    # Bucket
    bucket_raw: str = "wanderlens-raw"
    bucket_jpeg: str = "wanderlens-jpeg"
    bucket_ai: str = "wanderlens-ai-output"
    bucket_retouch: str = "wanderlens-retouch"
    bucket_files: str = "wanderlens-files"
    bucket_conversation: str = "wanderlens-conversation"

    # Redis
    redis_host: str = "localhost"
    redis_port: int = 6379

    # API 通訊
    api_base_url: str = "http://localhost:8080/api"
    # 安全：JWT secret 與內部 API key 必須由環境變數提供，不提供預設值
    api_jwt_secret: str
    media_service_api_key: str

    # AI 調色
    ai_output_format: str = "jpeg"
    ai_output_quality: int = 95
    ai_max_width: int = 2048
    ai_max_concurrency: int = 3

    # SLA
    sla_hours: int = 48
    sla_alert_hours: int = 36

    # 儲存週期
    raw_retention_days: int = 30
    retouch_retention_days: int = 180

    class Config:
        env_file = ".env"


settings = Settings()