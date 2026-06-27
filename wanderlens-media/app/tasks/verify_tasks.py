"""驗收 Celery 任務"""

from app.core.celery_app import celery_app
from app.services.verify_service import verify_service
from app.services.sla_service import sla_service
import asyncio
import logging

logger = logging.getLogger(__name__)


@celery_app.task
def verify_batch(order_id: int, expected_count: int, expected_size: int):
    """批次驗收任務"""
    try:
        success = asyncio.run(
            verify_service.verify_batch(order_id, expected_count, expected_size)
        )
        if success:
            # 驗收通過 → 啟動 SLA 計時
            sla_service.start_timer(order_id)
            logger.info(f"驗收通過，SLA 計時開始: order={order_id}")
    except Exception as e:
        logger.error(f"驗收任務失敗: order={order_id}, error={e}")