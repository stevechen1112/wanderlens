"""與 wanderlens-api 通訊的 HTTP client"""

import httpx
from app.core.config import settings
import logging
import asyncio

logger = logging.getLogger(__name__)


class ApiClient:
    def __init__(self):
        self.base_url = settings.api_base_url
        self.service_api_key = getattr(settings, 'media_service_api_key', '')

    def _get_headers(self) -> dict:
        """取得服務間認證 header"""
        return {"X-Service-API-Key": self.service_api_key} if self.service_api_key else {}

    async def report_verify_result(self, order_id: int, success: bool, file_count: int, total_size: int, detail: str):
        """回報驗收結果給 api"""
        try:
            async with httpx.AsyncClient() as client:
                await client.post(
                    f"{self.base_url}/media/verify",
                    params={
                        "orderId": order_id,
                        "success": success,
                        "fileCount": file_count,
                        "totalSize": total_size,
                        "detail": detail,
                    },
                    headers=self._get_headers(),
                )
            logger.info(f"驗收結果回報: order={order_id}, success={success}")
        except Exception as e:
            logger.error(f"驗收結果回報失敗: {e}")

    async def report_ai_status(self, order_id: int, status: str, detail: str):
        """回報 AI 狀態給 api"""
        try:
            async with httpx.AsyncClient() as client:
                await client.post(
                    f"{self.base_url}/media/ai-status",
                    params={"orderId": order_id, "status": status, "detail": detail},
                    headers=self._get_headers(),
                )
            logger.info(f"AI 狀態回報: order={order_id}, status={status}")
        except Exception as e:
            logger.error(f"AI 狀態回報失敗: {e}")

    def report_ai_status_sync(self, order_id: int, status: str, detail: str):
        """同步版本的 AI 狀態回報（用於 Celery worker 等同步上下文）"""
        try:
            with httpx.Client() as client:
                client.post(
                    f"{self.base_url}/media/ai-status",
                    params={"orderId": order_id, "status": status, "detail": detail},
                    headers=self._get_headers(),
                )
            logger.info(f"AI 狀態回報(sync): order={order_id}, status={status}")
        except Exception as e:
            logger.error(f"AI 狀態回報失敗(sync): {e}")

    async def report_ai_complete(self, order_id: int, asset_urls: list):
        """AI 調色完成通知 api"""
        try:
            async with httpx.AsyncClient() as client:
                await client.post(
                    f"{self.base_url}/media/ai-complete",
                    json={"orderId": order_id, "assetUrls": asset_urls},
                    headers=self._get_headers(),
                )
            logger.info(f"AI 完成通知: order={order_id}, assets={len(asset_urls)}")
        except Exception as e:
            logger.error(f"AI 完成通知失敗: {e}")


api_client = ApiClient()