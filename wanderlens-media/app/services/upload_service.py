"""上傳服務 — 分段上傳 + 斷點續傳 + JPEG 快路徑

安全強化：
- 檔案大小限制
- Token asset_type 驗證（RAW token 不可上傳 JPEG，反之亦然）
- 檔案副檔名與 asset_type 一致性檢查
"""

from app.services.storage_service import storage_service
from app.core.config import settings
from app.core.security import verify_upload_token, consume_upload_token
from app.tasks.verify_tasks import verify_batch
from app.tasks.ai_tasks import process_ai_color
from fastapi import HTTPException, status
import logging
import uuid
import os

logger = logging.getLogger(__name__)

# 檔案大小限制
MAX_JPEG_SIZE = 50 * 1024 * 1024   # 50 MB
MAX_RAW_SIZE = 200 * 1024 * 1024   # 200 MB

# 允許的副檔名
JPEG_EXTENSIONS = {".jpg", ".jpeg"}
RAW_EXTENSIONS = {".cr2", ".nef", ".arw", ".raf", ".dng"}


class UploadService:

    def _validate_file(self, filename: str, file_data: bytes, expected_asset_type: str) -> tuple[bool, str]:
        """驗證檔案大小與副檔名"""
        ext = os.path.splitext(filename)[1].lower()

        if expected_asset_type == "JPEG":
            if ext not in JPEG_EXTENSIONS:
                return False, f"JPEG 上傳僅支援 {JPEG_EXTENSIONS}，收到 {ext}"
            if len(file_data) > MAX_JPEG_SIZE:
                return False, f"JPEG 檔案過大: {len(file_data)} > {MAX_JPEG_SIZE}"
        elif expected_asset_type == "RAW":
            if ext not in RAW_EXTENSIONS:
                return False, f"RAW 上傳僅支援 {RAW_EXTENSIONS}，收到 {ext}"
            if len(file_data) > MAX_RAW_SIZE:
                return False, f"RAW 檔案過大: {len(file_data)} > {MAX_RAW_SIZE}"
        else:
            return False, f"未知的 asset_type: {expected_asset_type}"

        return True, ""

    def upload_jpeg(self, token: str, file_data: bytes, filename: str) -> dict:
        """JPEG 快路徑：立即上傳 → 立即進入 AI 調色"""
        token_info = verify_upload_token(token)
        if not token_info:
            return {"success": False, "error": "Invalid token"}

        # 驗證 token 的 asset_type 與檔案一致
        token_asset_type = token_info.get("asset_type", "")
        if token_asset_type and token_asset_type != "JPEG":
            return {"success": False, "error": f"Token 不允許 JPEG 上傳 (token type={token_asset_type})"}

        # 驗證檔案
        ok, err = self._validate_file(filename, file_data, "JPEG")
        if not ok:
            return {"success": False, "error": err}

        order_id = token_info["order_id"]
        # 安全：去除檔名中的路徑元件，防止 path traversal
        safe_filename = os.path.basename(filename)
        object_name = f"{order_id}/{uuid.uuid4()}_{safe_filename}"

        # 上傳到 JPEG bucket
        storage_service.upload_file(
            settings.bucket_jpeg, object_name, file_data, "image/jpeg"
        )

        # 立即觸發 AI 調色任務
        process_ai_color.delay(order_id, object_name, "JPEG")

        logger.info(f"JPEG 快路徑上傳: order={order_id}, file={safe_filename}, size={len(file_data)}")
        return {
            "success": True,
            "object_name": object_name,
            "url": f"{settings.minio_endpoint}/{settings.bucket_jpeg}/{object_name}",
        }

    def upload_raw(self, token: str, file_data: bytes, filename: str) -> dict:
        """RAW 上傳：背景儲存，供精修使用"""
        token_info = verify_upload_token(token)
        if not token_info:
            return {"success": False, "error": "Invalid token"}

        # 驗證 token 的 asset_type 與檔案一致
        token_asset_type = token_info.get("asset_type", "")
        if token_asset_type and token_asset_type != "RAW":
            return {"success": False, "error": f"Token 不允許 RAW 上傳 (token type={token_asset_type})"}

        # 驗證檔案
        ok, err = self._validate_file(filename, file_data, "RAW")
        if not ok:
            return {"success": False, "error": err}

        order_id = token_info["order_id"]
        # 安全：去除檔名中的路徑元件，防止 path traversal
        safe_filename = os.path.basename(filename)
        object_name = f"{order_id}/{uuid.uuid4()}_{safe_filename}"

        # 分段上傳到 RAW bucket
        storage_service.upload_multipart(
            settings.bucket_raw, object_name, file_data,
            "application/octet-stream",
        )

        logger.info(f"RAW 上傳: order={order_id}, file={safe_filename}, size={len(file_data)}")
        return {
            "success": True,
            "object_name": object_name,
            "url": f"{settings.minio_endpoint}/{settings.bucket_raw}/{object_name}",
        }

    def complete_upload(self, token: str, order_id: int, file_count: int, total_size: int) -> dict:
        """批次上傳完成 → 觸發驗收"""
        # 先驗證 token 並確認 order_id 一致，防止跨訂單越權
        token_info = verify_upload_token(token)
        if not token_info:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired upload token",
            )
        token_order_id = token_info.get("order_id")
        if token_order_id != order_id:
            logger.warning(
                f"complete_upload order_id 不符: token={token_order_id}, request={order_id}"
            )
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Token order_id does not match request order_id",
            )

        # 消費 token
        consume_upload_token(token)

        # 觸發驗收任務
        verify_batch.delay(order_id, file_count, total_size)

        logger.info(f"批次上傳完成: order={order_id}, files={file_count}, size={total_size}")
        return {"success": True, "message": "驗收已啟動"}


upload_service = UploadService()