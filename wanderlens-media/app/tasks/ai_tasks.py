"""AI 調色 Celery 任務"""

from app.core.celery_app import celery_app
from app.services.ai_color_service import ai_color_service
from app.services.api_client import api_client
from app.services.sla_service import sla_service
import logging

logger = logging.getLogger(__name__)


@celery_app.task(bind=True, max_retries=3, default_retry_delay=60)
def process_ai_color(self, order_id: int, object_name: str, asset_type: str):
    """AI 調色任務（含失敗重試）"""
    try:
        # 回報處理中
        import asyncio
        asyncio.run(api_client.report_ai_status(order_id, "PROCESSING", "AI 調色開始"))

        # 執行調色
        result = ai_color_service.process(order_id, object_name, asset_type)

        if result["success"]:
            # 回報完成
            asyncio.run(api_client.report_ai_status(order_id, "READY", "AI 調色完成"))
            asyncio.run(api_client.report_ai_complete(order_id, [result["ai_url"]]))

            # 清除 SLA 計時器
            sla_service.clear_timer(order_id)

            logger.info(f"AI 調色任務完成: order={order_id}")
        else:
            raise Exception(result.get("error", "AI 調色失敗"))

    except Exception as e:
        logger.error(f"AI 調色任務失敗: order={order_id}, error={e}")
        raise self.retry(exc=e, countdown=60)