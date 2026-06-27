"""物件儲存服務（S3/MinIO）"""

from minio import Minio
from minio.error import S3Error
from io import BytesIO
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)


class StorageService:
    def __init__(self):
        self.client = Minio(
            settings.minio_endpoint.replace("http://", "").replace("https://", ""),
            access_key=settings.minio_access_key,
            secret_key=settings.minio_secret_key,
            secure=settings.minio_endpoint.startswith("https"),
        )
        self._ensure_buckets()

    def _ensure_buckets(self):
        """確保所有 Bucket 存在"""
        buckets = [
            settings.bucket_raw,
            settings.bucket_jpeg,
            settings.bucket_ai,
            settings.bucket_retouch,
            settings.bucket_files,
            settings.bucket_conversation,
        ]
        for bucket in buckets:
            try:
                if not self.client.bucket_exists(bucket):
                    self.client.make_bucket(bucket)
                    logger.info(f"建立 Bucket: {bucket}")
            except S3Error as e:
                logger.warning(f"Bucket {bucket} 建立失敗: {e}")

    def get_bucket(self, asset_type: str) -> str:
        """依資產類型取得對應 Bucket"""
        mapping = {
            "RAW": settings.bucket_raw,
            "JPEG": settings.bucket_jpeg,
            "AI_BASIC": settings.bucket_ai,
            "RETOUCH": settings.bucket_retouch,
        }
        return mapping.get(asset_type, settings.bucket_files)

    def upload_file(self, bucket: str, object_name: str, data: bytes, content_type: str = "application/octet-stream"):
        """上傳檔案"""
        self.client.put_object(
            bucket, object_name, BytesIO(data), length=len(data),
            content_type=content_type,
        )

    def upload_multipart(self, bucket: str, object_name: str, data: bytes, content_type: str = "application/octet-stream"):
        """分段上傳（大檔案用）"""
        # MinIO SDK 自動處理分段
        self.upload_file(bucket, object_name, data, content_type)

    def download_file(self, bucket: str, object_name: str) -> bytes:
        """下載檔案"""
        response = self.client.get_object(bucket, object_name)
        try:
            return response.read()
        finally:
            response.close()
            response.release_conn()

    def get_presigned_url(self, bucket: str, object_name: str, expires_hours: int = 1) -> str:
        """產生預簽 URL（精修下載用）"""
        from datetime import timedelta
        return self.client.presigned_get_object(
            bucket, object_name, expires=timedelta(hours=expires_hours)
        )

    def delete_file(self, bucket: str, object_name: str):
        """刪除檔案"""
        self.client.remove_object(bucket, object_name)

    def set_lifecycle(self, bucket: str, days: int):
        """設定生命週期（自動過期）"""
        from minio.lifecycleconfig import LifecycleConfig, Rule, Expiration
        config = LifecycleConfig([
            Rule(
                rule_id=f"expire-{days}d",
                status="Enabled",
                expiration=Expiration(days=days),
            ),
        ])
        self.client.set_bucket_lifecycle(bucket, config)


storage_service = StorageService()