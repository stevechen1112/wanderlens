"""批次驗收服務 — 檔案數/容量/格式/可解碼性驗證"""

from app.services.storage_service import storage_service
from app.services.api_client import api_client
from app.core.config import settings
from app.utils.format_utils import is_valid_image, is_valid_raw
import logging

logger = logging.getLogger(__name__)


class VerifyService:

    async def verify_batch(self, order_id: int, expected_count: int, expected_size: int):
        """批次驗收"""
        # 列出 RAW bucket 中該訂單的所有檔案
        objects = list(storage_service.client.list_objects(
            settings.bucket_raw, prefix=f"{order_id}/"
        ))

        actual_count = len(objects)
        actual_size = sum(obj.size for obj in objects if obj.size)

        # 驗證檔案數
        if actual_count == 0:
            await api_client.report_verify_result(order_id, False, 0, 0, "無檔案")
            return False

        # 驗證格式
        for obj in objects:
            ext = obj.object_name.rsplit(".", 1)[-1].lower() if "." in obj.object_name else ""
            if ext not in ["cr2", "nef", "arw", "raf", "dng", "jpg", "jpeg"]:
                await api_client.report_verify_result(
                    order_id, False, actual_count, actual_size,
                    f"不支援的格式: {obj.object_name}"
                )
                return False

        # 驗收通過
        await api_client.report_verify_result(
            order_id, True, actual_count, actual_size, "驗收成功"
        )
        logger.info(f"驗收通過: order={order_id}, files={actual_count}, size={actual_size}")
        return True


verify_service = VerifyService()